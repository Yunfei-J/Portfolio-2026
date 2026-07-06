export type ProjectCard = {
  title: string;
  href: string;
  tags: string[];
  description: string;
  timeframe: string;
  image: string;
};

export const projects: ProjectCard[] = [
  {
    title: "uServe POS",
    href: "/research/universal-processing",
    tags: ["UX Design", "Product", "Branding"],
    description: "End-to-end redesign of a cross-platform point-of-sale system for 35,000+ merchants nationwide.",
    timeframe: "Feb 2024 – Present · Universal Processing LLC",
    image: "/assets/projects/universal-processing.png",
  },
  {
    title: "ForkIt AI",
    href: "/research/fork-it",
    tags: ["Mobile", "AI", "Research"],
    description: "Cross-platform app that transforms physical menus into interactive digital experiences using gen-AI and NLP.",
    timeframe: "Sep 2024 – Jun 2026 · Startup Studio",
    image: "/assets/projects/fork-it.png",
  },
  {
    title: "OOWLS",
    href: "/research/oowls",
    tags: ["UX", "Mobile", "Healthcare", "Seniors"],
    description: "Matching families with verified on-demand gig caregivers for personalized senior check-ins.",
    timeframe: "Apr 2023 – Oct 2023 · UC San Diego",
    image: "/assets/projects/oowls-cover.png",
  },
];

export const carouselProjects: ProjectCard[] = [
  {
    title: "Green it!",
    href: "/research/green-it",
    tags: ["UX", "Sustainability", "Mobile", "Community"],
    description: "Connecting eco-conscious users with nearby sustainable businesses and green activity partners.",
    timeframe: "Feb 2022 · Catalyst Designathon",
    image: "/assets/projects/green-it.png",
  },
  {
    title: "Cyber Imposter",
    href: "/research/starward",
    tags: ["Game UX", "Mobile", "AI", "Multiplayer"],
    description: "Multiplayer mobile strategy game where players cover their AI teammate and identify the AI opponent.",
    timeframe: "Sep 2024 – Feb 2025 · Starward Game Studios",
    image: "/assets/projects/starward.png",
  },
  {
    title: "Google Maps AVP",
    href: "/research/google-maps",
    tags: ["UX", "Spatial", "Vision Pro", "Research"],
    description: "Reimagining Google Maps for spatial computing on Apple Vision Pro.",
    timeframe: "2024 · Spatial computing concept",
    image: "/assets/projects/google-maps.png",
  },
  {
    title: "Money wise",
    href: "/research/moneywise",
    tags: ["Product", "Finance", "AI", "Conversational UI"],
    description: "Personal finance tool for budgeting and investment beginners with conversational AI support.",
    timeframe: "Sep 2024 – Present · Personal project",
    image: "/assets/projects/moneywise.png",
  },
  {
    title: "Ubiquitous",
    href: "/research/research-ubi-gestures",
    tags: ["HCI", "VR", "Research", "Accessibility"],
    description: "Cross-modality gestural commands for VR — hands, feet, head, and gaze for accessible interaction.",
    timeframe: "Jun 2022 – Apr 2023 · UC San Diego",
    image: "/assets/projects/ubi-gestures-carousel.png",
  },
];
