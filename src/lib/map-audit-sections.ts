import type {
  CaseStudyBodyBlock,
  CaseStudyImage,
  CaseStudySection,
} from "./case-study-v2-types";

type AuditBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "text"; tag: string; text: string }
  | { type: "listItem"; tag: string; text: string }
  | { type: "image"; src: string; alt: string };

export function localizeCdnUrl(src: string): string {
  if (!src.includes("cdn.prod.website-files.com")) return src;
  const filename = decodeURIComponent(src.split("/").pop() ?? "asset");
  return `/assets/case-studies/${filename}`;
}

function isDecorativeImage(src: string): boolean {
  return /back%20arrow|arrow-ios-back|Subtract/i.test(src);
}

type RawPart =
  | { kind: "text"; text: string; tag: string }
  | { kind: "image"; src: string; alt: string };

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapPartsToBlocks(title: string, parts: RawPart[]): CaseStudyBodyBlock[] {
  const texts = parts.filter((p): p is Extract<RawPart, { kind: "text" }> => p.kind === "text");
  const images = parts.filter((p): p is Extract<RawPart, { kind: "image" }> => p.kind === "image");

  const blocks: CaseStudyBodyBlock[] = [];
  const paragraphs = texts
    .filter((text) => text.tag !== "li")
    .map((text) => text.text);
  const listItems = texts
    .filter((text) => text.tag === "li")
    .map((text) => text.text);

  if (paragraphs.length) {
    blocks.push({ type: "copy", paragraphs });
  }

  if (listItems.length) {
    blocks.push({ type: "bullets", items: listItems });
  }

  if (images.length) {
    blocks.push({
      type: "gallery",
      columns: images.length >= 3 ? 3 : 2,
      images: images.map((img) => ({ src: img.src, alt: img.alt || title })),
    });
  }

  return blocks;
}

export function sectionsFromAuditBlocks(blocks: AuditBlock[]): CaseStudySection[] {
  const sections: { title: string; id: string; parts: RawPart[] }[] = [];
  let current: { title: string; id: string; parts: RawPart[] } | null = null;

  for (const block of blocks) {
    if (block.type === "heading" && block.level === 1) {
      if (current) sections.push(current);
      const title = block.text.trim();
      current = { title, id: slugify(title), parts: [] };
      continue;
    }

    if (!current) continue;

    if (block.type === "text" || block.type === "listItem") {
      const text = block.text.trim();
      if (text) current.parts.push({ kind: "text", text, tag: block.tag });
    }

    if (block.type === "image" && !isDecorativeImage(block.src)) {
      current.parts.push({
        kind: "image",
        src: localizeCdnUrl(block.src),
        alt: block.alt?.trim() ?? "",
      });
    }
  }

  if (current) sections.push(current);

  const seen = new Set<string>();
  const deduped = sections.filter((section) => {
    if (seen.has(section.id)) return false;
    seen.add(section.id);
    return true;
  });

  return deduped.map((section) => ({
    id: section.id,
    title: section.title,
    blocks: mapPartsToBlocks(section.title, section.parts),
  }));
}

export function heroImageFromAudit(blocks: AuditBlock[]): CaseStudyImage | undefined {
  for (const block of blocks) {
    if (block.type === "image" && !isDecorativeImage(block.src)) {
      return {
        src: localizeCdnUrl(block.src),
        alt: "Project cover",
      };
    }
  }
  return undefined;
}
