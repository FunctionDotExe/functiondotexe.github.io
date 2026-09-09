import { PERSONAL, PROJECTS, RESUME } from "./constants";

export type SummitImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type Landmark = {
  number: string;
  stage: string;
  altitude: string;
  title: string;
  kicker: string;
  description: string;
  detail: string;
  tags: string[];
  status: string;
  visual: "phones" | "console" | "signal" | "workshop";
  image?: SummitImage;
  gallery?: SummitImage[];
};

/**
 * The Summit keeps content separate from composition on purpose.
 * Replace values in this file during the final content pass; the page
 * components should not need to change when biography or case-study copy does.
 */
export const SUMMIT_CONTENT = {
  identity: {
    name: "Ruben Maxwell",
    initials: "RM",
    location: "Toronto, Canada",
    coordinates: "43.6532 N / 79.3832 W",
    email: PERSONAL.email,
    social: [
      { label: "GitHub", href: PERSONAL.github },
      { label: "LinkedIn", href: PERSONAL.linkedin },
    ],
    resume: RESUME.pdf,
  },
  navigation: [
    { number: "01", label: "Projects", href: "#work" },
    { number: "02", label: "About", href: "#about" },
    { number: "03", label: "Contact", href: "#contact" },
  ],
  world: {
    master: "/media/summit-parallax-master-v2.webp",
    sky: "/media/summit-parallax-sky-v2.webp",
    clouds: "/media/summit-parallax-clouds-v2.webp",
    valley: "/media/summit-parallax-valley-v2.webp",
    trail: "/media/summit-parallax-trail-v2.webp",
    foreground: "/media/summit-parallax-foreground-v2.webp",
    depth: {
      continuum: "/media/surface-to-depth-continuum-v6.webp",
      mobileContinuum: "/media/surface-to-depth-continuum-mobile-v6.webp",
      phoneContinuum: "/media/surface-to-depth-continuum-phone-v6.webp",
      back: "/media/earth-depth-back-v3.webp",
      atmosphere: "/media/earth-depth-atmosphere-v3.webp",
      mid: "/media/earth-depth-mid-v3.webp",
      near: "/media/earth-depth-near-v3.webp",
    },
  },
  hero: {
    eyebrow: "Software engineer · AI & robotics",
    title: ["Ruben", "Maxwell"],
    introduction:
      "I build software, train models, and make robots move.",
    image: {
      src: "/media/summit-parallax-master-v2.webp",
      width: 1536,
      height: 1024,
      alt: "An illustrated alpine path winding through a violet forest valley toward a sunlit summit.",
    },
  },
  basecamp: {
    label: "Basecamp",
    altitude: "Altitude / 000 M",
    statement: "Rough ideas. Useful systems. A better view with every build.",
    body:
      "Start with an uncertain idea. Build until it becomes useful. Refine what the prototype reveals, then carry the lesson into the next climb.",
    route: [
      { number: "01", label: "Foundation", note: "Observe the terrain" },
      { number: "02", label: "Ascent", note: "Build through uncertainty" },
      { number: "03", label: "Outlook", note: "Refine the view" },
    ],
  },
  landmarks: [
    {
      number: "03.1",
      stage: "Basecamp",
      altitude: "620 M",
      title: "Decyp3r",
      kicker: "Six games. A fresh challenge every day.",
      description:
        PROJECTS[0].description,
      detail: "I built the daily challenges, streak tracking, and live Firestore rankings, with transactional score submissions to prevent spam. The app achieved 95%+ crash-free sessions.",
      tags: ["React Native", "Expo", "TypeScript", "Firebase"],
      status: "95%+ crash-free sessions",
      visual: "phones",
      image: {
        src: "/media/work/decyphergamehomepage.webp",
        width: 348,
        height: 730,
        alt: "Decyp3r mobile game home screen.",
      },
      gallery: [
        {
          src: "/media/work/decyphergame1.webp",
          width: 460,
          height: 640,
          alt: "Decyp3r sigil game screen.",
        },
        {
          src: "/media/work/decyphergame2.webp",
          width: 424,
          height: 640,
          alt: "Decyp3r puzzle screen.",
        },
      ],
    },
    {
      number: "03.2",
      stage: "Ridgeline",
      altitude: "1,680 M",
      title: "ForgeFountain",
      kicker: "Less price-checking. Better-informed trades.",
      description:
        PROJECTS[1].description,
      detail: "I added caching, fallbacks, and retries to handle API rate limits. Internal testing cut decision time by over 70%, with up to 60% higher per-trade margins in favorable market windows.",
      tags: ["React", "APIs", "Data modeling", "Caching"],
      status: "Live prices & recipe analysis",
      visual: "console",
      image: {
        src: "/media/work/marketopportunityanalyzer.webp",
        width: 1168,
        height: 1097,
        alt: "ForgeFountain market intelligence dashboard showing live opportunity analysis.",
      },
      gallery: [
        { src: "/media/work/marketopportunityanalyzer2.webp", width: 560, height: 482, alt: "ForgeFountain opportunity analysis detail." },
        { src: "/media/work/marketopportunityanalyzer3.webp", width: 560, height: 534, alt: "ForgeFountain market comparison detail." },
      ],
    },
    {
      number: "03.3",
      stage: "High alpine",
      altitude: "2,740 M",
      title: "AI Object Detection",
      kicker: "Recognizing objects as they move",
      description:
        PROJECTS[2].description,
      detail: "I worked in a team of five to build and test the CNN model, which reached 97% accuracy. We used real-time data collection and visualization to check its detections.",
      tags: ["Python", "TensorFlow", "Computer vision", "CNNs"],
      status: "97% model accuracy",
      visual: "signal",
      image: {
        src: "/media/work/video-thumb.webp",
        width: 1168,
        height: 657,
        alt: "Video frame from the AI object-detection project.",
      },
    },
    {
      number: "03.4",
      stage: "Above the clouds",
      altitude: "3,420 M",
      title: "Arduino Dancing Robot",
      kicker: "Designed, printed, and taught to dance",
      description:
        PROJECTS[3].description,
      detail: "I put together the mechanics, electronics, and dance routines. It took first place among 50 competitors at the 2019 Exceed Robotics Competition.",
      tags: ["Arduino", "Fusion 360", "Robotics", "Prototyping"],
      status: "1st place · Exceed Robotics 2019",
      visual: "workshop",
      image: {
        src: "/media/work/arduinorrobot.webp",
        width: 1168,
        height: 879,
        alt: "A small custom-built black robot beside its exposed electronics and controls.",
      },
    },
  ] satisfies Landmark[],
  descent: {
    threshold: {
      number: "04",
      label: "The threshold",
      depth: "Surface / 0 M",
      title: "The path turns inward.",
      body:
        "At the tree line, the route slips beneath the mountain. Daylight narrows, stone closes in, and the same journey continues below the surface.",
      cue: "Continue into the crust",
    },
    crust: {
      number: "05",
      label: "Crystalline crust",
      depth: "Depth / 3 KM",
      title: "Every build leaves a trace.",
      body:
        "Crystal seams and stacked strata hold the evidence of a project taking shape: tests, revisions, wrong turns, and the patterns worth keeping.",
      notes: [
        { label: "Strata", value: "Accumulated iterations" },
        { label: "Crystal seam", value: "Useful patterns" },
        { label: "Fault line", value: "Lessons carried forward" },
      ],
    },
    mantle: {
      number: "06",
      label: "The mantle",
      depth: "Depth / 660 KM",
      title: "Pressure changes the work.",
      body:
        "Deeper down, the landscape moves slowly. This chapter holds space for the systems, experiments, and difficult questions that need sustained pressure before they find a form.",
      notes: [
        { label: "Heat", value: "Sustained curiosity" },
        { label: "Pressure", value: "Useful constraints" },
        { label: "Flow", value: "Systems in motion" },
      ],
    },
    inner: {
      number: "07",
      label: "Inner structure",
      depth: "Depth / 2,900 KM",
    },
    core: {
      number: "08",
      label: "The core",
      depth: "Depth / 6,371 KM",
      title: "The next view.",
      returnLabel: "Back to the surface",
    },
  },
  about: {
    label: "About me",
    statement: PERSONAL.bio,
    body:
      PERSONAL.bioShort,
    image: {
      src: "/media/ruben-profile.png",
      width: 800,
      height: 800,
      alt: "Ruben Maxwell outdoors, with glasses and headphones around his neck.",
    },
    disciplines: [
      "Web engineering",
      "AI systems",
      "Quantum computing",
      "Robotics",
      "Interface design",
    ],
  },
  finale: {
    label: "Get in touch",
    title: ["Let’s make", "something."],
    closing: "I’d love to hear from you.",
    invitation:
      "Hiring for your team, working on an idea, or curious about a project?",
    image: {
      src: "/media/summit-parallax-master-v2.webp",
      width: 1536,
      height: 1024,
      alt: "An illustrated high-alpine shelf opening onto distant peaks above a sea of clouds.",
    },
  },
} as const;
