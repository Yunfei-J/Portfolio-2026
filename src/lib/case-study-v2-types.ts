export type CaseStudyImage = {
  src: string;
  alt: string;
};

export type CaseStudyMetaLine = {
  label: string;
  value: string | string[];
};

export type CaseStudyMeta = {
  title: string;
  description: string;
  intro: string;
  heroImage: string;
  heroImageAlt?: string;
  /** Scale of the hero photo inside the frame (1 = fill). Frame size is unchanged. */
  heroImageScale?: number;
  /** Opaque frame fill so the blurred back-plate does not show through. */
  heroFrameBg?: string;
  /** Override default back-plate (hero image at reduced opacity); set false to hide. */
  heroCard?: string | false;
  meta: CaseStudyMetaLine[];
};

/**
 * Fields every block accepts. Blocks render in the order listed in a section.
 * A block with a `heading` or `intro` always starts its own subsection.
 * One without joins the subsection above it; `group` overrides the per-type
 * default in BLOCK_STARTS_GROUP (case-study-blocks.ts).
 */
export type BlockBase = {
  heading?: string;
  intro?: string;
  group?: "attach" | "new";
};

export type MetricCard = { title: string; value: string; delta: string };
export type MetricItem = { label: string; value: string };
export type LabeledTile = { label: string; image?: CaseStudyImage };

/** Icon + title + count cards, each with a slash list; optional expandable figure. */
export type CountCardsBlock = BlockBase & {
  type: "countCards";
  label?: string;
  items: Array<{ title: string; count?: string; icon?: string; points: string[] }>;
  summary?: string;
  figure?: { image: CaseStudyImage; caption?: string };
  /** Accessible name for the figure toggle. */
  expandLabel?: string;
};

/** Small pill label with grip icon over one large sentence. */
export type StatementBlock = BlockBase & {
  type: "statement";
  label: string;
  statement: string;
};

/** Titled columns of label/value metrics with a diamond divider. */
export type MetricPillarsBlock = BlockBase & {
  type: "metricPillars";
  pillars: Array<{ title: string; metrics: MetricItem[] }>;
};

/** Row of label/value metrics without pillar chrome. */
export type MetricListBlock = BlockBase & {
  type: "metricList";
  metrics: MetricItem[];
};

/** Big value + small label tiles. */
export type StatRowBlock = BlockBase & {
  type: "statRow";
  items: Array<{ value: string; label: string }>;
};

/** Captioned media columns scrolling sideways with arrow buttons. */
export type MediaCarouselBlock = BlockBase & {
  type: "mediaCarousel";
  /** Accessible name for the carousel region. */
  label?: string;
  columns: Array<{
    caption: string;
    image: CaseStudyImage;
    /** White padded frame (inset image). */
    inset?: boolean;
  }>;
};

/** 2- or 3-column grid of images with optional caption + subcaption. */
export type CaptionedGalleryBlock = BlockBase & {
  type: "captionedGallery";
  images: Array<CaseStudyImage & { caption?: string; subcaption?: string }>;
  columns?: 2 | 3;
  /** Paper fill behind images (uServe delivered design). */
  surface?: "paper";
  /** Corner radius token for images in this gallery only (`xs`–`xl`). */
  imageRadius?: "xs" | "sm" | "md" | "lg" | "xl";
};

/** One image with optional caption. */
export type FigureBlock = BlockBase & {
  type: "figure";
  image: CaseStudyImage;
  caption?: string;
};

export type MediaPanel =
  | { layout: "media"; image?: CaseStudyImage }
  | { layout: "quad"; tiles: LabeledTile[] }
  | { layout: "metrics"; note?: string; cards: MetricCard[] };

/** Grouped rows: title + description beside a media / tile / metric panel. */
export type CopyMediaRowsBlock = BlockBase & {
  type: "copyMediaRows";
  groups: Array<{
    heading: string;
    /** If set, `heading` and this label sit in the copy and media columns. */
    mediaHeading?: string;
    rows: Array<{ title: string; description: string; panel: MediaPanel }>;
  }>;
};

/** 2×2 grid of labelled image tiles. */
export type TileGridBlock = BlockBase & {
  type: "tileGrid";
  tiles: LabeledTile[];
};

/** Olive metric cards (title, value, delta) with an optional note above. */
export type MetricCardsBlock = BlockBase & {
  type: "metricCards";
  note?: string;
  cards: MetricCard[];
};

export type TabbedMediaTab = {
  label: string;
  /** Clip the panel to rounded corners. */
  rounded?: boolean;
  images: Array<
    CaseStudyImage & {
      /** CSS aspect-ratio of the frame, e.g. "643 / 581". */
      aspect: string;
      /** Frame height relative to the row, e.g. "96.85%". */
      height?: string;
      /** CSS object-position for cropping, e.g. "3% 50%". */
      position?: string;
    }
  >;
};

export type TabbedMediaView = {
  /** Audience or product label shown on the switch, e.g. "prototype for Care Seekers". */
  label: string;
  tabs: TabbedMediaTab[];
  /** Copy shown under this view's screens. */
  notes?: Array<{ heading?: string; paragraphs: string[] }>;
};

/** Tabs, each showing one or more framed images. Optional `views` add a switch above the tabs. */
export type TabbedMediaBlock = BlockBase & {
  type: "tabbedMedia";
  tabs?: TabbedMediaTab[];
  views?: TabbedMediaView[];
};

/** Numbered steps with a vertical rail: heading, copy, then stacked images. */
export type TimelineImage = CaseStudyImage & {
  /** Consecutive images with the same ratio sit in that grid; omit for full-width stack. */
  layout?: "40-60";
};

export type TimelineBlock = BlockBase & {
  type: "timeline";
  items: Array<{
    heading: string;
    paragraphs?: string[];
    images: TimelineImage[];
  }>;
};

/** Bullets with arrow icons. */
export type ArrowListBlock = BlockBase & {
  type: "arrowList";
  items: string[];
};

/** Paragraphs. */
export type ProseBlock = BlockBase & {
  type: "prose";
  paragraphs: string[];
};

export type CalloutBlock = BlockBase &
  (
    | { type: "callout"; variant?: "panel"; label?: string; text: string }
    | { type: "callout"; variant: "inline"; preamble: string; highlights: string[] }
  );

export type CanonicalBlock =
  | CountCardsBlock
  | StatementBlock
  | MetricPillarsBlock
  | MetricListBlock
  | StatRowBlock
  | MediaCarouselBlock
  | CaptionedGalleryBlock
  | FigureBlock
  | CopyMediaRowsBlock
  | TileGridBlock
  | MetricCardsBlock
  | TabbedMediaBlock
  | TimelineBlock
  | ArrowListBlock
  | ProseBlock
  | CalloutBlock;

export type BlockType = CanonicalBlock["type"];

/** Story-named types kept as aliases for existing case-study data. */
export const BLOCK_ALIASES = {
  features: "countCards",
  impact: "metricPillars",
  stats: "statRow",
  researchGrid: "mediaCarousel",
  gallery: "captionedGallery",
  image: "figure",
  solutionShowcase: "copyMediaRows",
  tabs: "tabbedMedia",
  bullets: "arrowList",
  copy: "prose",
} as const satisfies Record<string, BlockType>;

type Alias = keyof typeof BLOCK_ALIASES;

type AliasedBlock = {
  [K in Alias]: Omit<Extract<CanonicalBlock, { type: (typeof BLOCK_ALIASES)[K] }>, "type"> & {
    type: K;
  };
}[Alias];

/** Legacy `mission`: its `heading` is the statement's pill label. */
type MissionBlock = Omit<StatementBlock, "type" | "label" | "heading"> & {
  type: "mission";
  heading: string;
};

export type CaseStudyBodyBlock = CanonicalBlock | AliasedBlock | MissionBlock;

export type CaseStudySection = {
  id: string;
  /** Omitted when the section is labeled only by eyebrow (e.g. Final prototype). */
  title?: string;
  eyebrow?: string;
  intro?: string | string[];
  images?: CaseStudyImage[];
  blocks?: CaseStudyBodyBlock[];
};

export type CaseStudyV2 = {
  slug: string;
  meta: CaseStudyMeta;
  sections: CaseStudySection[];
};
