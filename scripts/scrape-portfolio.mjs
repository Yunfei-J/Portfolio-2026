import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const DEFAULT_START_URL = "https://yunfeis-portfolio.webflow.io/";
const DEFAULT_LIMIT = 3;
const DEFAULT_OUTPUT_DIR = "portfolio-audit";

const args = parseArgs(process.argv.slice(2));
const startUrl = new URL(args.start ?? DEFAULT_START_URL);
const limit = Number(args.limit ?? DEFAULT_LIMIT);
const outputDir = path.resolve(args.out ?? DEFAULT_OUTPUT_DIR);

const origin = startUrl.origin;
const seen = new Set();
const queued = new Set([normalizeUrl(startUrl.href)]);
const queue = [normalizeUrl(startUrl.href)];
const pages = [];

await ensureOutputDirs(outputDir);

const browser = await launchBrowser();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
  deviceScaleFactor: 1,
});

try {
  while (queue.length > 0 && pages.length < limit) {
    const url = queue.shift();
    if (!url || seen.has(url)) continue;

    seen.add(url);
    console.log(`Scraping ${url}`);

    const pageData = await scrapePage(page, url);
    pages.push(pageData);

    for (const link of pageData.internalLinks) {
      if (!queued.has(link) && !seen.has(link) && pages.length + queue.length < limit) {
        queued.add(link);
        queue.push(link);
      }
    }

    await writePageOutputs(outputDir, pageData);
  }
} finally {
  await browser.close();
}

await writeSiteOutputs(outputDir, pages);

console.log(`Done. Scraped ${pages.length} page(s) into ${path.relative(process.cwd(), outputDir)}`);

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch (error) {
    console.warn("Could not launch system Chrome; falling back to Playwright Chromium.");
    console.warn(error.message);
    return chromium.launch();
  }
}

function parseArgs(rawArgs) {
  const parsed = {};

  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i];
    if (!arg.startsWith("--")) continue;

    const [key, inlineValue] = arg.slice(2).split("=");
    parsed[key] = inlineValue ?? rawArgs[i + 1];

    if (inlineValue === undefined) i += 1;
  }

  return parsed;
}

async function ensureOutputDirs(rootDir) {
  await fs.mkdir(path.join(rootDir, "pages"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "screenshots"), { recursive: true });
}

async function scrapePage(page, url) {
  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await autoScroll(page);
  await page.waitForTimeout(750);

  const extracted = await page.evaluate(() => {
    const absoluteUrl = (value) => {
      try {
        return new URL(value, window.location.href).href;
      } catch {
        return null;
      }
    };

    const isVisible = (element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) !== 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    const cleanText = (value) =>
      value
        .replace(/\s+/g, " ")
        .replace(/\u00a0/g, " ")
        .trim();

    const meta = (selector) => document.querySelector(selector)?.getAttribute("content")?.trim() ?? "";
    const title = document.title.trim();
    const description = meta('meta[name="description"]');
    const ogTitle = meta('meta[property="og:title"]');
    const ogDescription = meta('meta[property="og:description"]');
    const ogImage = meta('meta[property="og:image"]');
    const canonical = document.querySelector('link[rel="canonical"]')?.href ?? "";

    const blocks = [];
    const candidates = Array.from(
      document.body.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,img,video,iframe")
    );

    for (const element of candidates) {
      if (!isVisible(element)) continue;

      const tag = element.tagName.toLowerCase();

      if (/^h[1-6]$/.test(tag)) {
        const text = cleanText(element.innerText);
        if (text) {
          blocks.push({
            type: "heading",
            level: Number(tag.slice(1)),
            text,
          });
        }
        continue;
      }

      if (["p", "li", "blockquote", "figcaption"].includes(tag)) {
        const text = cleanText(element.innerText);
        if (text) {
          blocks.push({
            type: tag === "li" ? "listItem" : "text",
            tag,
            text,
          });
        }
        continue;
      }

      if (tag === "img") {
        const src = absoluteUrl(element.currentSrc || element.src || element.getAttribute("data-src") || "");
        if (src?.includes("webflow-badge")) continue;
        if (src) {
          blocks.push({
            type: "image",
            src,
            alt: element.getAttribute("alt")?.trim() ?? "",
          });
        }
        continue;
      }

      if (tag === "video") {
        const src = absoluteUrl(element.currentSrc || element.src || element.querySelector("source")?.src || "");
        if (src) {
          blocks.push({ type: "video", src });
        }
        continue;
      }

      if (tag === "iframe") {
        const src = absoluteUrl(element.src);
        if (src) {
          blocks.push({
            type: "embed",
            src,
            title: element.getAttribute("title")?.trim() ?? "",
          });
        }
      }
    }

    const links = Array.from(document.querySelectorAll("a[href]"))
      .map((link) => ({
        href: absoluteUrl(link.getAttribute("href")),
        text: cleanText(link.innerText),
      }))
      .filter((link) => link.href);

    return {
      url: window.location.href,
      title,
      description,
      canonical,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        image: ogImage,
      },
      h1: cleanText(document.querySelector("h1")?.innerText ?? ""),
      blocks,
      links,
    };
  });

  const normalizedUrl = normalizeUrl(extracted.url);
  const httpStatus = response?.status() ?? null;
  const pageType = classifyPage(normalizedUrl, extracted, httpStatus);
  const slug = slugForUrl(normalizedUrl);
  const screenshotPath = path.join(outputDir, "screenshots", `${slug}.png`);

  await page.screenshot({ path: screenshotPath, fullPage: true });

  const images = extracted.blocks.filter((block) => block.type === "image");
  const media = extracted.blocks.filter((block) => ["image", "video", "embed"].includes(block.type));
  const internalLinks = extracted.links
    .map((link) => normalizeUrl(link.href))
    .filter((link) => link?.startsWith(origin))
    .filter((link) => !isAssetUrl(link));

  return {
    ...extracted,
    url: normalizedUrl,
    slug,
    httpStatus,
    pageType,
    sections: buildSections(extracted.blocks),
    images,
    media,
    internalLinks: [...new Set(internalLinks)],
    externalLinks: extracted.links.filter((link) => !normalizeUrl(link.href)?.startsWith(origin)),
    screenshot: path.relative(outputDir, screenshotPath),
    scrapedAt: new Date().toISOString(),
  };
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
}

function buildSections(blocks) {
  const sections = [];
  let currentSection = {
    level: 0,
    heading: "Page Start",
    content: [],
    media: [],
  };

  for (const block of blocks) {
    if (block.type === "heading") {
      currentSection = {
        level: block.level,
        heading: block.text,
        content: [],
        media: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (["image", "video", "embed"].includes(block.type)) {
      currentSection.media.push(block);
    } else {
      currentSection.content.push(block.text);
    }
  }

  if (sections.length === 0 && (currentSection.content.length > 0 || currentSection.media.length > 0)) {
    sections.push(currentSection);
  }

  return sections;
}

function classifyPage(url, data, httpStatus) {
  const pathname = new URL(url).pathname.toLowerCase();
  const text = [data.title, data.h1, data.description].join(" ").toLowerCase();

  if (httpStatus === 404 || text.includes("page not found")) return "not-found";
  if (pathname === "/") return "home";
  if (pathname.includes("about")) return "about";
  if (pathname.includes("contact")) return "contact";
  if (pathname.includes("work") || pathname.includes("project") || pathname.includes("research")) return "case-study";
  if (text.includes("case study") || text.includes("project")) return "case-study";

  return "page";
}

function normalizeUrl(value) {
  if (!value) return null;

  const url = new URL(value);
  url.hash = "";

  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }

  return url.href;
}

function slugForUrl(value) {
  const url = new URL(value);
  const pathname = url.pathname === "/" ? "home" : url.pathname.replace(/^\/|\/$/g, "");

  return pathname
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isAssetUrl(value) {
  return /\.(avif|css|gif|ico|jpeg|jpg|js|json|pdf|png|svg|webp|zip)$/i.test(new URL(value).pathname);
}

async function writePageOutputs(rootDir, pageData) {
  const pageBasePath = path.join(rootDir, "pages", pageData.slug);
  await fs.writeFile(`${pageBasePath}.json`, `${JSON.stringify(pageData, null, 2)}\n`);
  await fs.writeFile(`${pageBasePath}.md`, pageToMarkdown(pageData));
}

async function writeSiteOutputs(rootDir, pages) {
  const siteMap = pages.map((page) => ({
    url: page.url,
    title: page.title,
    httpStatus: page.httpStatus,
    pageType: page.pageType,
    h1: page.h1,
    screenshot: page.screenshot,
    markdown: `pages/${page.slug}.md`,
    json: `pages/${page.slug}.json`,
  }));

  const assetsManifest = pages.flatMap((page) =>
    page.media.map((item) => ({
      pageUrl: page.url,
      pageTitle: page.title,
      type: item.type,
      src: item.src,
      alt: item.alt ?? "",
      title: item.title ?? "",
    }))
  );

  const redirectRows = ["old_url,new_url,status", ...pages.map((page) => `${page.url},TODO,needs-review`)];

  await fs.writeFile(path.join(rootDir, "site-map.json"), `${JSON.stringify(siteMap, null, 2)}\n`);
  await fs.writeFile(path.join(rootDir, "assets-manifest.json"), `${JSON.stringify(assetsManifest, null, 2)}\n`);
  await fs.writeFile(path.join(rootDir, "redirects.csv"), `${redirectRows.join("\n")}\n`);
}

function pageToMarkdown(pageData) {
  const frontmatter = [
    "---",
    `url: ${JSON.stringify(pageData.url)}`,
    `title: ${JSON.stringify(pageData.title)}`,
    `httpStatus: ${JSON.stringify(pageData.httpStatus)}`,
    `pageType: ${JSON.stringify(pageData.pageType)}`,
    `metaDescription: ${JSON.stringify(pageData.description)}`,
    `h1: ${JSON.stringify(pageData.h1)}`,
    `canonical: ${JSON.stringify(pageData.canonical)}`,
    `screenshot: ${JSON.stringify(pageData.screenshot)}`,
    "images:",
    ...pageData.images.map((image) => `  - src: ${JSON.stringify(image.src)}\n    alt: ${JSON.stringify(image.alt)}`),
    "sections:",
    ...pageData.sections.map((section) => `  - level: ${section.level}\n    heading: ${JSON.stringify(section.heading)}`),
    "---",
    "",
  ].join("\n");

  const body = pageData.blocks
    .map((block) => {
      if (block.type === "heading") {
        return `${"#".repeat(Math.min(block.level, 6))} ${block.text}`;
      }

      if (block.type === "listItem") {
        return `- ${block.text}`;
      }

      if (block.type === "image") {
        return `![${block.alt}](${block.src})`;
      }

      if (block.type === "video") {
        return `[Video](${block.src})`;
      }

      if (block.type === "embed") {
        return `[Embed${block.title ? `: ${block.title}` : ""}](${block.src})`;
      }

      return block.text;
    })
    .join("\n\n");

  return `${frontmatter}${body}\n`;
}
