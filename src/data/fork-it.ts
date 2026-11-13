import type {
  CaseStudyImage,
  CaseStudyMetaLine,
  CaseStudySection,
} from "../lib/case-study-v2-types";

const SLIDE_DIR = "/assets/case-studies/forkit maker day 3";

const slide = (filename: string, alt: string): CaseStudyImage => ({
  src: `${SLIDE_DIR}/${filename}`,
  alt,
});

export const forkItMeta = {
  title: "ForkIt AI",
  description:
    "Cross-platform app that transforms physical menus into interactive digital experiences using gen-AI and NLP.",
  intro:
    "Ordering at a restaurant abroad is often a guessing game. ForkIt is an AI-native mobile app I built to help diners understand foreign menus through the lens of their own food culture.",
  heroImage: `${SLIDE_DIR}/prototype.png`,
  meta: [
    { label: "Timeline", value: ["Sep 2024 – Jun 2026", "Startup Studio project"] },
    { label: "Achieved", value: "Cross-platform mobile app" },
    { label: "Tools", value: "Figma, Gen-AI, NLP, React Native" },
  ] satisfies CaseStudyMetaLine[],
};

export const forkItSections: CaseStudySection[] = [
  {
    id: "the-problem",
    title: "The Problem",
    images: [
      slide("ForkIt Maker Day3-images-1.jpg", "The Problem"),
      slide(
        "ForkIt Maker Day 1-images-3.jpg",
        "Current Customer Journey — Diners",
      ),
    ],
  },
  {
    id: "problem-validation",
    title: "Problem Validation",
    images: [
      slide("ForkIt Maker Day3-images-4.jpg", "Problem Validation"),
      slide("ForkIt Maker Day3-images-22.jpg", "Problem Validation Surveys"),
      slide("ForkIt Maker Day3-images-23.jpg", "User Research"),
    ],
  },
  {
    id: "solution",
    title: "Solution",
    images: [
      slide(
        "ForkIt Maker Day3-images-6.jpg",
        "Solution: Scan the Menu and Get All Information In One Place",
      ),
      slide("prototype.png", "Hi-fi Prototype"),
      slide("ForkIt Maker Day3-images-8.jpg", "AI Menu Consultant"),
      slide("ForkIt Maker Day3-images-7.jpg", "Preference Profile"),
    ],
  },
  {
    id: "competitive-landscape",
    title: "Competitive Landscape",
    images: [
      slide("ForkIt Maker Day3-images-10.jpg", "Competitive Landscape"),
      slide("ForkIt Maker Day 1-images-4.jpg", "Unlocking Menu Data"),
    ],
  },
  {
    id: "target-users",
    title: "Target Users",
    images: [slide("ForkIt Maker Day3-images-11.jpg", "Target Users")],
  },
  {
    id: "gtm",
    title: "GTM",
    images: [slide("ForkIt Maker Day3-images-13.jpg", "GTM")],
  },
  {
    id: "solution-validation",
    title: "Solution Validation",
    images: [
      slide("ForkIt Maker Day3-images-14.jpg", "WTP Evidence — B2C"),
      slide("ForkIt Maker Day3-images-15.jpg", "WTP Evidence — B2B"),
    ],
  },
];
