import { forkItMeta, forkItSections } from "../data/fork-it";
import { oowlsMeta, oowlsSections } from "../data/oowls";
import { userveMeta, userveSections } from "../data/userve";
import type { CaseStudyV2 } from "./case-study-v2-types";

export type {
  CaseStudyBodyBlock,
  CaseStudyImage,
  CaseStudyMeta,
  CaseStudyMetaLine,
  CaseStudySection,
  CaseStudyV2,
} from "./case-study-v2-types";

const V2_BY_SLUG: Record<string, CaseStudyV2> = {
  "fork-it": {
    slug: "fork-it",
    meta: forkItMeta,
    sections: forkItSections,
  },
  "universal-processing": {
    slug: "universal-processing",
    meta: userveMeta,
    sections: userveSections,
  },
  oowls: {
    slug: "oowls",
    meta: oowlsMeta,
    sections: oowlsSections,
  },
};

export const CASE_STUDY_V2_SLUGS = Object.keys(V2_BY_SLUG);

export function getCaseStudyV2(slug: string): CaseStudyV2 | null {
  return V2_BY_SLUG[slug] ?? null;
}
