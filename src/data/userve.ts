import type {
  CaseStudyImage,
  CaseStudyMeta,
  CaseStudySection,
} from "../lib/case-study-v2-types";

const ASSET_DIR = "/assets/case-studies";
const SOLUTION_DIR = "/assets/uServe-solution";

const image = (filename: string, alt: string): CaseStudyImage => ({
  src: `${ASSET_DIR}/${filename}`,
  alt,
});

const solutionImage = (filename: string, alt: string): CaseStudyImage => ({
  src: `${SOLUTION_DIR}/${filename}`,
  alt,
});

const PROTOTYPE_DIR = "/assets/uServe-final-prototypes";

const prototypeScreen = (path: string, alt: string, aspect = "16 / 10") => ({
  src: `${PROTOTYPE_DIR}/${path}`,
  alt,
  aspect,
});

export const userveMeta: CaseStudyMeta = {
  title: "USERVE POS",
  description:
    "End-to-end redesign of a cross-platform point-of-sale ecosystem serving more than 35,000 merchants nationwide.",
  intro:
    "End-to-end redesign of a point-of-sale system UIUX used by 35,000+ merchants nationwide.",
  heroImage: `${ASSET_DIR}/6a00bbd52b104a42072be037_f61a244bbbd615f77bb18b5fe746f2c7_Cover-p-1600.png`,
  heroImageAlt: "uServe point-of-sale interface shown across restaurant devices",
  meta: [
    { label: "Timeline", value: "Feb 2024 – Present"},
    { label: "My role", value: "Lead UI/UX Designer" },
    { label: "Company", value: "Universal Processing" },
  ],
};

export const userveSections: CaseStudySection[] = [
  {
    id: "ecosystem",
    eyebrow: "01 · Overview",
    title: "Context",
    intro:
      "uServe is a complex, multi-tenant POS software suite that runs across multiple devices and operating systems. It’s used by a wide range of businesses—from restaurants to coffee shops and salons.",
    blocks: [
      {
        type: "features",
        items: [
          {
            title: "hardware",
            count: "4+",
            points: [
              "/POS terminals",
              "/tableside tablets",
              "/self-service kiosks",
              "/kitchen display",
            ],
          },
          {
            title: "software",
            count: "4+",
            icon: "/assets/case-study-ui/software-icon.svg",
            points: [
              "/CRM",
              "/order management",
              "/back office & reports",
              "/reservation system",
            ],
          },
          {
            title: "OS",
            count: "3",
            icon: "/assets/case-study-ui/os-icon.svg",
            points: ["/IOS", "/Android", "/Windows"],
          },
          {
            title: "tenant",
            count: "4+",
            icon: "/assets/case-study-ui/tenant-icon.svg",
            points: [
              "/waitstaff",
              "/diners",
              "/admin & owners",
              "/kitchen crew",
            ],
          },
        ],
      },
      {
        type: "mission",
        heading: "The mission",
        statement:
          "Modernized a legacy POS through a full rebrand and usability overhaul, building the credibility needed to win higher-end merchants.",
      },
      {
        type: "gallery",
        heading: "Delivered design",
        columns: 3,
        surface: "paper",
        images: [
          {
            ...image(
              "userve-pos-galaxy-tab-mockup.png",
              "uServe point-of-sale system on a Galaxy Tab tablet with stylus",
            ),
            caption: "POS system front",
            subcaption: "Waitstaff-facing",
          },
          {
            ...image(
              "userve-overview-galaxy-tab-mockup.png",
              "uServe back-office Overview reports dashboard on a Galaxy Tab tablet with stylus",
            ),
            caption: "POS backoffice + CRM",
            subcaption: "Restaurant-owners-facing",
          },
          {
            ...image(
              "userve-ordering-galaxy-tab-mockup.png",
              "uServe customer ordering experience for UP Bakery on a Galaxy Tab tablet with stylus",
            ),
            caption: "Online ordering webapp",
            subcaption: "Customer-facing",
          },
        ],
      },
      {
        type: "impact",
        heading: "Impact",
        pillars: [
          {
            title: "Visual Credibility",
            metrics: [
              { label: "perceived product value", value: "+22%" },
              { label: "perceived product stability", value: "+25%" },
            ],
          },
          {
            title: "Learnability",
            metrics: [
              { label: "time to first task success", value: "-14%" },
              { label: "support dependency", value: "-25%" },
            ],
          },
          {
            title: "Efficiency",
            metrics: [
              { label: "task completion speed", value: "+12%" },
              { label: "feature adoption", value: "+25%" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "research",
    eyebrow: "02 · Research",
    title: "Research",
    blocks: [
      {
        type: "researchGrid",
        columns: [
          {
            caption:
              "Interviews with sales team, restaurant waiters, and restaurant owners",
            image: image(
              "697bacaeef7b740f74c9b518_Stakeholder quotes-p-1600.png",
              "Stakeholder research quotes about the existing point-of-sale experience",
            ),
          },
          {
            caption:
              "Tracking user traffic and behaviors through Google Analytics",
            image: image(
              "697bacaebf1ebecd2b6fa143_4d38980cec0ce912ccfa1d2ab353b25d_image 11.png",
              "Google Analytics behavior flow for back-office product usage",
            ),
          },
          {
            caption:
              "Field study, contextual inquiries & usability testings",
            image: image(
              "697baecf8e25076e79c8e3b3_Toast field study.jpg",
              "Field study and usability testing in restaurant environments",
            ),
            inset: true,
          },
        ],
      },
      {
        type: "image",
        heading: "Insights",
        intro:
          "In the competitive POS market, user frustration can undermine conversion and retention at every stage of the customer lifecycle—from initial exposure and onboarding to ongoing power use. Through user interviews, sales team shadowing, and usage data analysis, I identified three critical UX challenges across these stages.",
        image: {
          src: "/assets/Identified Problems.png",
          alt: "Identified problems synthesized from discovery research",
        },
      },
    ],
  },
  {
    id: "workflows",
    eyebrow: "03 · Insights to design",
    title: "From Insights to Design",
    intro:
      "My goal was to build users’ trust in both the product and their ability to learn it. The challenge wasn’t a lack of features, but how they were presented, organized, and revealed. I focused on making the experience more intuitive and transparent, so users feel guided, informed, and in control throughout their journey.",
    blocks: [
      {
        type: "solutionShowcase",
        groups: [
          {
            heading: "Visual credibility",
            rows: [
              {
                title: "Distinct brand identity",
                description:
                  "Competitive audit and a cohesive uServe palette so the product reads as intentional—not generic—next to Toast, Square, and legacy terminals.",
                panel: {
                  layout: "media",
                  image: solutionImage(
                    "Distinct brand identity.png",
                    "Competitive brand audit, uServe color palette, and POS branding compared to competitors",
                  ),
                },
              },
              {
                title: "Accessibility",
                description:
                  "Handedness, dark mode, and alternative palettes so staff can work comfortably through long shifts and varied lighting.",
                panel: {
                  layout: "media",
                  image: solutionImage(
                    "Accessibility.png",
                    "Right-handed and left-handed POS layouts, dark mode, and alternative color palettes",
                  ),
                },
              },
            ],
          },
          {
            heading: "Learnability",
            rows: [
              {
                title: "Intuitive and less cognitive load",
                description:
                  "Split-bill flows were redesigned so common paths need fewer taps and less finger travel during rush periods.",
                panel: {
                  layout: "media",
                  image: solutionImage(
                    "More intuitive.png",
                    "Usability metrics for split-bill tasks: time to first success, taps, and finger travel",
                  ),
                },
              },
              {
                title: "Tooltips and smart-diagnosis",
                description:
                  "Inline guidance and diagnose actions explain dense reporting formulas without pulling owners out of their workflow.",
                panel: {
                  layout: "media",
                  image: solutionImage(
                    "Tooltips and diagnosis.png",
                    "Report tooltip explaining grand total formula and smart diagnose action in back office",
                  ),
                },
              },
            ],
          },
          {
            heading: "Efficiency",
            rows: [
              {
                title: "Flexibility to customize",
                description:
                  "Owners can define custom metric groups and formulas so back-office reports match how each restaurant actually operates.",
                panel: {
                  layout: "media",
                  image: solutionImage(
                    "Flexibility to customize.png",
                    "Custom metrics group builder with formulas for back-office reporting",
                  ),
                },
              },
              {
                title: "Information architecture",
                description: "The rule of 7",
                panel: {
                  layout: "media",
                  image: solutionImage(
                    "Information architecture.png",
                    "Back-office information architecture diagram organized by the rule of seven",
                  ),
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "system",
    eyebrow: "04 · Design to dev",
    title: " Design System",
    intro:
      "The solution paired a more recognizable brand with a clearer information hierarchy. Color, spacing, and component behavior became shared rules instead of one-off screen decisions.",
    blocks: [
      {
        type: "tabs",
        tabs: [
          {
            label: "Components",
            images: [
              {
                ...image(
                  "design-system-components.png",
                  "uServe component library: segmented controls, buttons, station chips, inputs, status tags, dropdowns, and toggles",
                ),
                aspect: "643 / 581",
              },
            ],
          },
          {
            label: "Color Palette",
            images: [
              {
                ...image(
                  "design-system-color-palette.png",
                  "uServe color tokens for text and border, with light and dark mode values",
                ),
                aspect: "767 / 677",
                height: "96.85%",
              },
            ],
          },
          {
            label: "Layouts",
            rounded: true,
            images: [
              {
                ...image(
                  "design-system-layouts.png",
                  "uServe screen layout grid, first variant",
                ),
                aspect: "573 / 726",
                position: "3.13% 50%",
              },
              {
                ...image(
                  "design-system-layouts.png",
                  "uServe screen layout grid, second variant",
                ),
                aspect: "580 / 726",
                position: "96.7% 50%",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "prototype",
    eyebrow: "05 · Final prototype",
    blocks: [
      {
        type: "tabs",
        tabs: [
          {
            label: "To Go",
            images: [
              prototypeScreen("To Go/Order screen — empty cart.png", "To-go order screen with an empty cart"),
              prototypeScreen("To Go/Order screen — items added.png", "To-go order screen with items added to the cart"),
              prototypeScreen("To Go/Order screen — modifiers.png", "Selecting item modifiers on the order screen"),
              prototypeScreen("To Go/Custom Item.png", "Adding a custom item to a to-go order"),
              prototypeScreen("To Go/Number Pad Modal.png", "Number pad modal for entering quantities"),
              prototypeScreen("To Go/Partial send.png", "Sending part of an order to the kitchen"),
            ],
          },
          {
            label: "Dine In",
            images: [
              prototypeScreen("Dine In/Table Layout.png", "Restaurant table layout for dine-in orders", "2058 / 1282"),
              prototypeScreen("Dine In/View table orders.png", "Viewing the orders for a table"),
            ],
          },
          {
            label: "Payment",
            images: [
              prototypeScreen("Payment/Payment.png", "Payment screen"),
              prototypeScreen("Payment/Payment-Discount.png", "Applying a discount on the payment screen"),
            ],
          },
          {
            label: "Gift Card",
            images: [
              prototypeScreen("Gift Card/Gift Card.png", "Gift card sale screen"),
              prototypeScreen("Gift Card/Refill Gift Card.png", "Refilling a gift card"),
            ],
          },
          {
            label: "Cash In/Out",
            images: [
              prototypeScreen("Cash In:Out/1. Select Cash In or Out.png", "Choosing between cash in and cash out"),
              prototypeScreen("Cash In:Out/3. Cash Counter.png", "Cash counter for the drawer"),
            ],
          },
          {
            label: "Recall",
            images: [
              prototypeScreen("Recall/Recall 1.png", "Recalling a previous order"),
            ],
          },
          {
            label: "Close Batch",
            images: [
              prototypeScreen("Close Batch/Close batch.png", "Close batch summary"),
              prototypeScreen("Close Batch/Close batch 2.png", "Confirming the batch close"),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "reflection",
    eyebrow: "06 · Reflection",
    title: "What the complexity taught me",
    intro:
      "Designing a business-critical system sharpened both my systems thinking and my collaboration with engineering.",
    blocks: [
      {
        type: "bullets",
        items: [
          "Document responsive behavior across breakpoints instead of treating layouts as fixed screens.",
          "Bring technical feasibility into design conversations early and adjust decisions collaboratively.",
          "Identify edge cases before handoff so components survive real operational complexity.",
          "Represent layered data, parallel processes, and multi-state information without overwhelming the user.",
          "Prioritize features deliberately to keep dense interfaces clean and functional.",
        ],
      },
    ],
  },
];
