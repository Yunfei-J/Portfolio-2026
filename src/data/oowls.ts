import type {
  CaseStudyImage,
  CaseStudyMeta,
  CaseStudySection,
} from "../lib/case-study-v2-types";

const ASSET_DIR = "/assets/case-studies";

const image = (filename: string, alt: string): CaseStudyImage => ({
  src: `${ASSET_DIR}/${filename}`,
  alt,
});

export const oowlsMeta: CaseStudyMeta = {
  title: "OOWLS",
  description:
    "A platform that matches families with verified gig caregivers for personalized, on-demand senior check-ins.",
  intro:
    "A platform that matches families with verified gig caregivers for personalized, on-demand senior check-ins.",
  heroImage: "/assets/projects/oowls-cover.png",
  heroImageAlt: "OOWLS mobile app mockups on two phones, showing caregiver matching and scheduling",
  heroImageScale: 0.8,
  heroFrameBg: "#C1E1E9",
  meta: [
    { label: "Timeline", value: "Apr 2023 – Oct 2023" },
    { label: "Location", value: "UC San Diego" },
    { label: "Achieved", value: "Catalyst Funding by the Sullivan Center" },
    { label: "Tools", value: "Webflow, Figma, Unbounce, Canva, Google Analytics" },
  ],
};

export const oowlsSections: CaseStudySection[] = [
  {
    id: "overview",
    eyebrow: "01 · Overview",
    title: "Problem",
    intro:
      "In the post-pandemic era, AARP reports that 3 in 4 adults aged 50 and older wish to age in place—to remain in their own homes as they grow older. However, the U.S. faces a growing shortage of senior caregivers, particularly those providing in-home care.",
    blocks: [
      {
        type: "statement",
        label: "The solution",
        statement:
          "We created OOWLS, a platform that connects families with verified gig-workers (Owls) for personalized, on-demand senior care — empowering loved ones to support the health, safety, and social well-being of aging family members.",
      },
      {
        type: "captionedGallery",
        heading: "Delivered design",
        images: [
          {
            ...image(
              "64a59bcf92841340fa4856ed_ezgif.com-video-to-gif.gif",
              "OOWLS marketing website walkthrough",
            ),
            caption: "Website",
            subcaption: "Landing page",
          },
        ],
      },
      {
        type: "captionedGallery",
        columns: 2,
        group: "attach",
        imageRadius: "xl",
        images: [
          {
            ...image(
              "657f72181eee1bef26d95b97_ezgif-3-oowl2_0.gif",
              "OOWLS mobile app for families seeking care",
            ),
            caption: "Mobile app",
            subcaption: "UI for service seekers",
          },
          {
            ...image(
              "657f7c6474351fdd7edc62cc_ezgif-2-oowl 2_1.gif",
              "OOWLS mobile app for gig caregivers",
            ),
            caption: "Mobile app",
            subcaption: "UI for service providers",
          },
        ],
      },
    ],
  },
  {
    id: "ideation",
    eyebrow: "02 · Ideation Journey",
    title: "Initial assumption",
    intro:
      "We initially believed loneliness was a major challenge affecting seniors' psychological and social well-being. Our idea was to build a gig-based service connecting seniors with younger people for companionship and everyday assistance.",
    blocks: [
      {
        type: "bullets",
        heading: "Where the twist began — 1st round research",
        intro: "But the survey we distributed across senior living communities, Discord servers, and Nextdoor told a different story:",
        items: [
          "None of the seniors surveyed expressed strong interest in forming new social connections.",
          "Most preferred sticking to their existing routines rather than welcoming unfamiliar people or activities.",
        ],
      },
      {
        type: "tabs",
        heading: "2nd round research — Interviews",
        tabs: [
          {
            label: "Structured interviews",
            images: [
              {
                ...image(
                  "66abcebd8799dfb15ee26f27_Screen Shot 2024-08-01 at 2.03.18 PM.png",
                  "Structured interview notes from a one-on-one senior interview",
                ),
                aspect: "704 / 1128",
              },
              {
                ...image(
                  "66abceca2b014d29a6733e84_Screen Shot 2024-08-01 at 2.03.41 PM.png",
                  "Structured interview notes showing the fixed question set",
                ),
                aspect: "716 / 988",
              },
            ],
          },
          {
            label: "Unstructured focus groups",
            images: [
              {
                ...image(
                  "66abea0cfca1c3a2cc129ee9_Screen Shot 2024-08-01 at 4.03.08 PM.png",
                  "Unstructured focus group interview notes",
                ),
                aspect: "896 / 1116",
              },
              {
                ...image(
                  "66abe9a13b9a609f88c04435_Screen Shot 2024-08-01 at 4.01.01 PM.png",
                  "Focus group interview notes from an assisted living community",
                ),
                aspect: "938 / 1138",
              },
            ],
          },
        ],
      },
      {
        type: "bullets",
        heading: "What we heard",
        intro:
          "We conducted interviews with 7 seniors (1 living with her adult child, 1 living alone, 5 living in an assisted living community).",
        items: [
          "There seems to be a need for more advocacy for seniors. Seniors often fail to communicate their needs to their loved ones timely due to: 1) long residential distance 2) limited tech literacy 3) concerns about burdening their family members.",
          "Help with chores, welfare checks, technology, transportation, and similar tasks are appealing to the seniors.",
        ],
      },
      {
        type: "copy",
        heading: "Pivot",
        paragraphs: [
          "We expanded our focus beyond seniors' mental health to include physical well-being, environmental safety, daily assistance, and abuse detection.",
          "We also repositioned OOWLs as a primary care platform that conducts preliminary assessments and facilitates referrals, rather than directly providing specialized treatment.",
        ],
      },
    ],
  },
  {
    id: "conceptualization",
    eyebrow: "03 · Design Process",
    blocks: [
      {
        type: "copyMediaRows",
        group: "attach",
        groups: [
          {
            mediaHeading: "User flow diagrams",
            heading: "Design Principles",
            rows: [
              {
                title: "Intuitive for limited tech literacy",
                description:
                  "All necessary steps, from landing to scheduling a check-in with a trusted person, are seamlessly integrated in one flow, eliminating the need to switch between tabs.",
                panel: {
                  layout: "media",
                  image: image(
                    "66637893233aaddcc804937e_User Flow -v2 (Seeker).png",
                    "OOWLS seeker user flow from landing to scheduling a check-in",
                  ),
                },
              },
              {
                title: "Trust through transparency and control",
                description:
                  "Senior families have access to the OWL's real-time location during check-ins. A built-in chat module facilitates communication. Ratings and reviews are applied and visible to both sides.",
                panel: {
                  layout: "media",
                  image: image(
                    "6663789364289b94e8a08ccc_User Flow -v2 (Provider).png",
                    "OOWLS provider user flow for accepting and completing a check-in",
                  ),
                },
              },
              {
                title: "A good experience for providers too",
                description:
                  "Pre-formulated checklist templates streamline check-ins across categories, reducing legal risk. Providers can decline a request if they provide a valid reason.",
                panel: {
                  layout: "media",
                  image: image(
                    "6663789364289b94e8a08ccc_User Flow -v2 (Provider).png",
                    "OOWLS provider user flow, with checklists and the option to decline a request",
                  ),
                },
              },
            ],
          },
        ],
      },
      {
        type: "captionedGallery",
        heading: "Personas",
        intro:
          "After interviewing 7 seniors and 3 senior takers, I created two family personas based off their background and needs. These are not typical individual personas but sets of personas that constitute family personas.",
        columns: 2,
        images: [
          image(
            "Family persona 1.png",
            "Family persona 1 for OOWLS",
          ),
          image(
            "Family persona 2.png",
            "Family persona 2 for OOWLS",
          ),
        ],
      },
    ],
  },
  {
    id: "prototype",
    eyebrow: "04 · Final Prototypes",
    blocks: [
      {
        type: "timeline",
        heading: "UI for Care Seekers",
        items: [
          {
            heading: "1. Onboarding",
            paragraphs: [
              "The straightforward onboarding process starts with a concise one-page guide outlining how OOWLS works, and then leads users to a set of simple questions to establish a basic, tentative preference profile.",
            ],
            images: [
              image(
                "6663701b7b0ab49d4381f47b_Frame 2335-p-1600.png",
                "OOWLS onboarding: who OOWLS are, language, living situation, and check-in interests",
              ),
            ],
          },
          {
            heading: "2. Explore",
            paragraphs: [
              "Next, users can see a list of nearby care provider profiles, with their skills, rating, price, and other information displayed to help users make informed selection.",
              "Flexible filters are right accessible on top of the list for personalized filtering.",
            ],
            images: [
              image(
                "660f1effe3629b63421f1dbb_Frame 2362-p-1600.png",
                "List of nearby OOWL care providers with skills, ratings, and price",
              ),
              {
                ...image(
                  "66636796d5d10924a248938d_oowl_filter.gif",
                  "Filtering nearby OOWLs by skills and availability",
                ),
                layout: "40-60",
              },
              {
                ...image(
                  "66636e603767110946bb56fa_Card 2.0.png",
                  "OOWL provider profile card with rating, skills, and price",
                ),
                layout: "40-60",
              },
            ],
          },
          {
            heading: "3. Schedule",
            paragraphs: [
              "Upon entering a detailed profile page, users can contact the care provider and schedule a check-in. Users can tailor their check-in requests based on the provider's specialty and wait for the provider to accept.",
            ],
            images: [
              image(
                "657fb57430cef4d166c5414e_Frame 2336-p-1600.png",
                "Scheduling a check-in from an OOWL profile page",
              ),
            ],
          },
        ],
      },
      {
        type: "image",
        heading: "UI for Care Providers",
        intro:
          "Care providers are expected to follow more trackable procedures to analyze the seniors' living conditions and needs and send a summary report to their families.",
        image: image(
          "657fb995b452e23ec92c4b7d_Frame 2337-p-1600.png",
          "Care provider checklist and summary report for a senior check-in",
        ),
      },
    ],
  },
  {
    id: "benefits",
    eyebrow: "05 · Benefits",
    title: "What the idea unlocks",
    blocks: [
      {
        type: "bullets",
        items: [
          "Empowering both families and the seniors -Helps families far away to check up on their seniors -Personalized assistance for seniors -Elderly abuse in institutions can be effectively detected",
          "Bigger candidate pool of gig workers (as we pivoted the product to less requiring specialized skills required).",
          "Multi-language support.",
          "Legal protection and security through a strict background check, plus location tracking of the gig worker while in session.",
        ],
      },
    ],
  },
  {
    id: "competitive",
    eyebrow: "06 · Competitive Analysis",
    title: "Where OOWLS sits",
    blocks: [
      {
        type: "image",
        image: image(
          "64a84103843c06fc437298bf_Screen Shot 2023-07-08 at 12.44.25 AM-p-1600.png",
          "Competitive analysis of senior care and gig-work platforms next to OOWLS",
        ),
      },
    ],
  },
];
