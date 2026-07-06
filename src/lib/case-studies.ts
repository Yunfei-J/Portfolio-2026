import fs from "node:fs/promises";
import path from "node:path";

const AUDIT_DIR = path.join(process.cwd(), "portfolio-audit/pages");

export type CaseStudyBlock =
  | { type: "image"; src: string; alt: string }
  | { type: "text"; tag: string; text: string };

export type CaseStudy = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  blocks: CaseStudyBlock[];
};

/** URL slug → audit JSON filename (without extension) */
export const CASE_STUDY_FILES: Record<string, string> = {
  "universal-processing": "research-universal-processing",
  "fork-it": "research-fork-it",
  oowls: "research-oowls",
  "green-it": "research-green-it",
  starward: "research-starward",
  moneywise: "research-moneywise",
  "cruz-roja": "research-cruz-roja",
  "research-ubi-gestures": "research-research-ubi-gestures",
  "ubi-gestures": "research-research-ubi-gestures",
};

export const CASE_STUDY_SLUGS = [
  "universal-processing",
  "fork-it",
  "oowls",
  "green-it",
  "starward",
  "moneywise",
  "cruz-roja",
  "research-ubi-gestures",
  "google-maps",
];

export function localizeCdnUrl(src: string): string {
  if (!src.includes("cdn.prod.website-files.com")) return src;
  const filename = decodeURIComponent(src.split("/").pop() ?? "asset");
  return `/assets/case-studies/${filename}`;
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  if (slug === "google-maps") {
    return {
      slug,
      title: "Google Maps AVP",
      description: "Reimagining Google Maps for spatial computing on Apple Vision Pro.",
      h1: "Overview",
      blocks: [
        {
          type: "image",
          src: "/assets/projects/google-maps.png",
          alt: "Google Maps redesign for Apple Vision Pro",
        },
        {
          type: "text",
          tag: "p",
          text: "A spatial computing concept exploring how Google Maps could feel native on Apple Vision Pro — immersive navigation, layered map depth, and glanceable route guidance in mixed reality.",
        },
      ],
    };
  }

  const fileKey = CASE_STUDY_FILES[slug];
  if (!fileKey) return null;

  const jsonPath = path.join(AUDIT_DIR, `${fileKey}.json`);
  const raw = await fs.readFile(jsonPath, "utf8");
  const data = JSON.parse(raw) as {
    title: string;
    description?: string;
    h1?: string;
    blocks?: CaseStudyBlock[];
  };

  const blocks = (data.blocks ?? []).map((block) => {
    if (block.type === "image") {
      return { ...block, src: localizeCdnUrl(block.src) };
    }
    return block;
  });

  return {
    slug,
    title: data.title,
    description: data.description ?? "",
    h1: data.h1 ?? "Overview",
    blocks,
  };
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const studies = await Promise.all(
    CASE_STUDY_SLUGS.map((slug) => getCaseStudy(slug)),
  );
  return studies.filter((s): s is CaseStudy => s !== null);
}
