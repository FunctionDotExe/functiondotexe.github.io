import type { Landmark } from "./summit-content";

export type ProjectStory = {
  kind: string;
  accent: string;
  route: string[];
  title: string;
  description: string;
  contribution: string;
  evidence?: { value: string; caption: string };
};

/** A short project story, grounded in what was built and the author's role. */
export const PROJECT_STORIES: Record<Landmark["visual"], ProjectStory> = {
  phones: {
    kind: "Mobile product", accent: "#e1b8ff", route: ["Daily challenge", "Atomic score", "Live ranking"],
    title: "A small daily ritual.",
    description: "Six mini-games, a fresh challenge every day, and a streak worth keeping. Built for iOS, Android, and web.",
    contribution: "I connected daily challenges, streak tracking, and live Firestore rankings. Transactional score submissions keep repeated entries from spamming the leaderboard.",
  },
  console: {
    kind: "Game economy", accent: "#a4e8ff", route: ["Bazaar prices", "Recipe costs", "Opportunity"],
    title: "Making a game economy easier to read.",
    description: "A market tool for Hypixel SkyBlock. Compare Bazaar prices with crafting and forging costs, then inspect profit, demand, and time requirements.",
    contribution: "I built the interface and API service to bring prices and recipes together. Cached recipe data, fallbacks, and retries help handle unreliable upstream requests.",
  },
  signal: {
    kind: "Computer vision", accent: "#b1ead5", route: ["Camera input", "CNN inference", "Visual detection"],
    title: "Recognizing objects as they move.",
    description: "A computer-vision project that detects cars, people, and other objects in real time, with a live view of what the model sees.",
    contribution: "I worked in a team of five to build and test the CNN model. We used real-time data collection and visualization to inspect its predictions.",
  },
  workshop: {
    kind: "Physical computing", accent: "#ffc49b", route: ["Printed mechanics", "Arduino control", "Dance routine"],
    title: "Code that leaves the screen.",
    description: "A small robot with its own dance routine. An idea becomes something you can watch moving across a table.",
    contribution: "I designed the 3D-printed body in Fusion 360, wired the electronics, and programmed the motors with Arduino.",
    evidence: { value: "1st", caption: "of 50 competitors · Exceed Robotics, 2019" },
  },
};
