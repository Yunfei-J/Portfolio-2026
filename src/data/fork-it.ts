export type ForkItSlide = {
  src: string;
  alt: string;
};

export type ForkItSection = {
  id: string;
  title: string;
  images: ForkItSlide[];
};

export type ForkItMetaLine = {
  label: string;
  value: string;
};

const SLIDE_DIR = "/assets/case-studies/forkit maker day 3";

const slide = (filename: string, alt: string): ForkItSlide => ({
  src: `${SLIDE_DIR}/${filename}`,
  alt,
});

export const forkItMeta = {
  title: "ForkIt AI",
  description:
    "Cross-platform app that transforms physical menus into interactive digital experiences using gen-AI and NLP.",
  intro:
    "If you ask me what's the project that I'm most proud of, this is it! I'm building ForkIt, a tool designed for food lovers, frequent travelers, and anyone looking for a seamless, stress-free dining experience.",
  heroImage: "/assets/fork-it-hero.png",
  meta: [
    { label: "Timeline", value: "Sep 2024 – Jun 2026" },
    { label: "Location", value: "Startup Studio project" },
    { label: "Achieved", value: "Cross-platform mobile app" },
    { label: "Tools", value: "Figma, Gen-AI, NLP, React Native" },
  ] satisfies ForkItMetaLine[],
};

export const forkItSections: ForkItSection[] = [
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
