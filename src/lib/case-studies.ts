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
  "green-it",
  "starward",
  "moneywise",
  "cruz-roja",
  "research-ubi-gestures",
  "halfsies",
];

export function localizeCdnUrl(src: string): string {
  if (!src.includes("cdn.prod.website-files.com")) return src;
  const filename = decodeURIComponent(src.split("/").pop() ?? "asset");
  return `/assets/case-studies/${filename}`;
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  if (slug === "halfsies") {
    return {
      slug,
      title: "Halfsies",
      description:
        "A group meetup app that finds a fair place to meet so travel time is shared, not one-sided.",
      h1: "Overview",
      blocks: [
        {
          type: "image",
          src: "/assets/projects/halfsies-cover.png",
          alt: "Halfsies app screens: picking a meetup spot, comparing travel times, and sharing a group link",
        },
        {
          type: "text",
          tag: "p",
          text: "Halfsies plans group meetups around fairness: compare everyone's travel time, lock in a spot that isn't too far for anyone, and share one link with the group.",
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
