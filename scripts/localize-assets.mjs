#!/usr/bin/env node
/**
 * Download Webflow CDN images used on the homepage into public/assets/projects/.
 * Run: npm run localize:assets
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/assets/projects");
const CASE_STUDY_DIR = path.join(ROOT, "public/assets/case-studies");
const AUDIT_DIR = path.join(ROOT, "portfolio-audit/pages");

/** Homepage / search thumbnails — local filename → remote URL */
const PROJECT_ASSETS = {
  "universal-processing.png":
    "https://cdn.prod.website-files.com/63a0d533a7afeac89489815e/698cd85ef96b5435b28631b5_Group%20857.png",
  "fork-it.png":
    "https://cdn.prod.website-files.com/63a0d533a7afeac89489815e/67db57ac631bb73df822c6b3_ForkIt%20thumbnail-p-1600.png",
  "oowls-cover.png":
    "https://cdn.prod.website-files.com/63a0d533a7afeac89489815e/65d438eaa78b395bbf79685a_Mockup%20Cover-p-1600.png",
  "oowls.png":
    "https://cdn.prod.website-files.com/63a0d533a7afeac89489815e/657e4db9b5510e0d52866400_Oowl%20Portfolio%202.0%20(2).png",
  "green-it.png":
    "https://cdn.prod.website-files.com/63a0d533a7afeac89489815e/6590e1e2322c326ec8813622_green%20it_cover.png",
  "starward.png":
    "https://cdn.prod.website-files.com/63a0d533a7afeac89489815e/670abb1a67f337fb7b490f02_cyber%20imposter%20home.png",
  "google-maps.png":
    "https://cdn.prod.website-files.com/63a0d533a7afeac89489815e/66c2704828e6153e8e0f87ee_Google%20Maps%20Redesign-p-1600.png",
  "moneywise.png":
    "https://cdn.prod.website-files.com/63a0d533a7afeac89489815e/67c3b4c870acacede42e809a_Frame%202145.png",
  "ubi-gestures-carousel.png":
    "https://cdn.prod.website-files.com/63a0d533a7afeac89489815e/660751073e90ccf7c8c8fb04_Screen%20Shot%202024-03-29%20at%207.37.15%20PM.png",
  "ubi-gestures.webp":
    "https://cdn.prod.website-files.com/63a0d533a7afeac89489815e/63a11652bbe732df40527e97_Screen%20Shot%202022-12-19%20at%205.56.14%20PM.webp",
  "cruz-roja.png":
    "https://cdn.prod.website-files.com/63a0d533a7afeac89489815e/6506772c80671c09d5f5a09a_Screen%20Shot%202023-09-16%20at%2011.48.06%20PM.png",
};

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  console.log(`  ✓ ${path.basename(dest)}`);
}

async function collectCaseStudyUrls() {
  const files = await fs.readdir(AUDIT_DIR);
  const urls = new Set();

  for (const file of files) {
    if (!file.startsWith("research-") || !file.endsWith(".json")) continue;
    const raw = await fs.readFile(path.join(AUDIT_DIR, file), "utf8");
    const data = JSON.parse(raw);
    for (const block of data.blocks ?? []) {
      if (block.type === "image" && block.src?.includes("cdn.prod.website-files.com")) {
        urls.add(block.src);
      }
    }
  }

  return [...urls];
}

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(CASE_STUDY_DIR, { recursive: true });

console.log("Downloading homepage project assets…");
for (const [filename, url] of Object.entries(PROJECT_ASSETS)) {
  await download(url, path.join(OUT_DIR, filename));
}

console.log("\nDownloading case study images…");
const caseStudyUrls = await collectCaseStudyUrls();
for (const url of caseStudyUrls) {
  const filename = decodeURIComponent(url.split("/").pop());
  const dest = path.join(CASE_STUDY_DIR, filename);
  try {
    await fs.access(dest);
    continue;
  } catch {
    /* download */
  }
  try {
    await download(url, dest);
  } catch (err) {
    console.warn(`  ⚠ skipped ${filename}: ${err.message}`);
  }
}

console.log("\nDone.");
