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
  year: string;
  role: string;
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
    email: "rubenbmaxwell@gmail.com",
    social: [
      { label: "GitHub", href: "https://github.com/functiondotexe" },
      { label: "LinkedIn", href: "https://linkedin.com/in/ruben-maxwell" },
    ],
    resume: "/media/RUBEN_RESUME_V.3.0.docx.pdf",
  },
  navigation: [
    { number: "01", label: "Work", href: "#work" },
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
  },
  hero: {
    eyebrow: "Ruben Maxwell / Selected work",
    title: ["The", "Summit"],
    introduction:
      "A digital climb through systems, experiments, and work in progress.",
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
      kicker: "A daily microgame system",
      description:
        "A React Native microgame with authentication, score submissions, daily attempts, streaks, and live rankings.",
      year: "Year / to add",
      role: "Role / to add",
      tags: ["React Native", "Expo", "TypeScript", "Firebase"],
      status: "Case study details to come",
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
          alt: "Decyp3r word game screen.",
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
      kicker: "Market signals, made legible",
      description:
        "A market-intelligence interface that ranks live game-economy opportunities by return, liquidity, and execution time.",
      year: "Year / to add",
      role: "Role / to add",
      tags: ["React", "APIs", "Data modeling", "Caching"],
      status: "Case study details to come",
      visual: "console",
      image: {
        src: "/media/work/marketopportunityanalyzer.webp",
        width: 1168,
        height: 1097,
        alt: "ForgeFountain market intelligence dashboard showing live opportunity analysis.",
      },
    },
    {
      number: "03.3",
      stage: "High alpine",
      altitude: "2,740 M",
      title: "AI Object Detection",
      kicker: "Signal inside the noise",
      description:
        "A CNN-based computer-vision project with real-time detection, data collection, and visualization.",
      year: "Year / to add",
      role: "Role / to add",
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
      kicker: "A physical system in motion",
      description:
        "A 3D-printed, motor-controlled robot designed in Fusion 360 and programmed with Arduino.",
      year: "Year / to add",
      role: "Role / to add",
      tags: ["Arduino", "Fusion 360", "Robotics", "Prototyping"],
      status: "Case study details to come",
      visual: "workshop",
      image: {
        src: "/media/work/arduinorrobot.webp",
        width: 1168,
        height: 879,
        alt: "A small custom-built black robot beside its exposed electronics and controls.",
      },
    },
  ] satisfies Landmark[],
  about: {
    label: "About the climber",
    statement: "I like turning rough ideas into useful, polished systems.",
    body:
      "I am a University of Toronto computer science student focused on web development, AI systems, and quantum computing. My work moves between hands-on prototypes, production-minded interfaces, and research-driven experiments.",
    image: {
      src: "/media/portrait.jpg",
      width: 1338,
      height: 1514,
      alt: "Portrait of Ruben Maxwell.",
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
    label: "The Summit",
    title: ["The summit", "isn't the end."],
    closing: "It is the next view.",
    invitation:
      "Have a project, problem, or strange idea worth climbing toward?",
    image: {
      src: "/media/summit-parallax-master-v2.webp",
      width: 1536,
      height: 1024,
      alt: "An illustrated high-alpine shelf opening onto distant peaks above a sea of clouds.",
    },
  },
} as const;
