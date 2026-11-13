import {
  BLOCK_ALIASES,
  type BlockType,
  type CanonicalBlock,
  type CaseStudyBodyBlock,
} from "./case-study-v2-types";

/** Blocks that begin their own subsection even without a heading (wider spacing above). */
export const BLOCK_STARTS_GROUP: Record<BlockType, boolean> = {
  countCards: false,
  statement: false,
  mediaCarousel: false,
  copyMediaRows: false,
  tabbedMedia: false,
  timeline: true,
  tileGrid: false,
  metricCards: false,
  metricList: false,
  metricPillars: true,
  statRow: true,
  captionedGallery: true,
  figure: false,
  arrowList: false,
  prose: true,
  callout: true,
};

export function normalizeBlock(block: CaseStudyBodyBlock): CanonicalBlock {
  if (block.type === "mission") {
    const { heading, ...rest } = block;
    return { ...rest, type: "statement", label: heading };
  }
  if (block.type in BLOCK_ALIASES) {
    return { ...block, type: BLOCK_ALIASES[block.type as keyof typeof BLOCK_ALIASES] } as CanonicalBlock;
  }
  return block as CanonicalBlock;
}

export type BlockGroup = {
  /** True for the group carrying the section's own title + intro. */
  isHead?: boolean;
  heading?: string;
  intro?: string | string[];
  blocks: CanonicalBlock[];
};

/**
 * Splits a section into subsections in data order. The first group carries the
 * section title + intro; each later group starts at a block with a heading or
 * intro, `group: "new"`, or a type that starts a group by default.
 */
export function groupBlocks(
  blocks: CaseStudyBodyBlock[],
  head: { heading?: string; intro?: string | string[] },
): BlockGroup[] {
  const groups: BlockGroup[] = [{ ...head, isHead: true, blocks: [] }];

  for (const raw of blocks) {
    const block = normalizeBlock(raw);
    const startsGroup =
      Boolean(block.heading || block.intro) ||
      block.group === "new" ||
      (block.group !== "attach" && BLOCK_STARTS_GROUP[block.type]);

    if (startsGroup) {
      groups.push({ heading: block.heading, intro: block.intro, blocks: [block] });
    } else {
      groups[groups.length - 1].blocks.push(block);
    }
  }

  const [first, ...rest] = groups;
  const hasHead = first.heading || first.intro || first.blocks.length;
  return hasHead ? groups : rest;
}
