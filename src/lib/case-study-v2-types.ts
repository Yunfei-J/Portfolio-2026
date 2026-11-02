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
  /** Override default back-plate (hero image at reduced opacity); set false to hide. */
  heroCard?: string | false;
  meta: CaseStudyMetaLine[];
};

export type CaseStudyBodyBlock =
  | {
      type: "features";
      label?: string;
      heading?: string;
      items: Array<{ title: string; count?: string; icon?: string; points: string[] }>;
      summary?: string;
      figure?: { image: CaseStudyImage; caption?: string };
    }
  | {
      type: "copy";
      heading?: string;
      paragraphs: string[];
    }
  | {
      type: "callout";
      variant?: "panel";
      label?: string;
      text: string;
    }
  | {
      type: "callout";
      variant: "inline";
      heading: string;
      preamble: string;
      highlights: string[];
    }
  | {
      type: "mission";
      heading: string;
      statement: string;
    }
  | {
      type: "impact";
      heading?: string;
      pillars: Array<{
        title: string;
        metrics: Array<{ label: string; value: string }>;
      }>;
    }
  | {
      type: "stats";
      items: Array<{ value: string; label: string }>;
    }
  | {
      type: "bullets";
      heading?: string;
      items: string[];
    }
  | {
      type: "image";
      heading?: string;
      intro?: string;
      image: CaseStudyImage;
      caption?: string;
    }
  | {
      type: "gallery";
      heading?: string;
      images: Array<CaseStudyImage & { caption?: string; subcaption?: string }>;
      columns?: 2 | 3;
    }
  | {
      type: "tabs";
      tabs: Array<{
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
      }>;
    }
  | {
      type: "researchGrid";
      columns: Array<{
        caption: string;
        image: CaseStudyImage;
        /** White padded frame (inset image). */
        inset?: boolean;
      }>;
    }
  | {
      type: "solutionShowcase";
      groups: Array<{
        heading: string;
        rows: Array<{
          title: string;
          description: string;
          panel: SolutionShowcasePanel;
        }>;
      }>;
    };

export type SolutionShowcasePanel =
  | {
      layout: "media";
      image?: CaseStudyImage;
    }
  | {
      layout: "quad";
      tiles: Array<{ label: string; image?: CaseStudyImage }>;
    }
  | {
      layout: "metrics";
      note: string;
      cards: Array<{ title: string; value: string; delta: string }>;
    };

export type CaseStudySection = {
  id: string;
  /** Omitted when the section is labeled only by eyebrow (e.g. Final prototype). */
  title?: string;
  eyebrow?: string;
  intro?: string;
  images?: CaseStudyImage[];
  blocks?: CaseStudyBodyBlock[];
};

export type CaseStudyV2 = {
  slug: string;
  meta: CaseStudyMeta;
  sections: CaseStudySection[];
};
