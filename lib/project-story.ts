import type { Landmark } from "./summit-content";

export type ProjectBeat = { label: string; title: string; body: string; value: string; caption: string };
export type ProjectStory = { kind: string; accent: string; route: string[]; beats: [ProjectBeat, ProjectBeat, ProjectBeat] };

/** Authored shots grounded in the project record. Numbers retain their context. */
export const PROJECT_STORIES: Record<Landmark["visual"], ProjectStory> = {
  phones: {
    kind: "Mobile product", accent: "#e1b8ff", route: ["Daily challenge", "Atomic score", "Live ranking"],
    beats: [
      { label: "The spark", title: "A reason to return.", body: "Six games, fresh daily challenges, and a streak worth keeping. A small daily ritual, built for a phone.", value: "06", caption: "games in one daily ritual" },
      { label: "The system", title: "Every score earns its place.", body: "I connected challenges, streak tracking, and live Firestore rankings. Transactional score submissions prevent repeated entries from spamming the leaderboard.", value: "01", caption: "connected challenge-to-ranking flow" },
      { label: "The proof", title: "Playful. Dependable.", body: "The app achieved more than 95% crash-free sessions. Open the screens to inspect the game experience and the interface behind it.", value: "95%+", caption: "crash-free sessions" },
    ],
  },
  console: {
    kind: "Market intelligence", accent: "#a4e8ff", route: ["Live prices", "Recipe analysis", "Opportunity"],
    beats: [
      { label: "The spark", title: "Find the useful signal.", body: "ForgeFountain brings live market prices and recipe analysis together, turning scattered price checks into a clearer trading decision.", value: "Live", caption: "prices meet recipe analysis" },
      { label: "The system", title: "Built for imperfect APIs.", body: "Caching, fallbacks, and retries keep the analysis useful when upstream APIs slow down or enforce rate limits.", value: "03", caption: "layers of resilience" },
      { label: "The proof", title: "Less time deciding.", body: "Internal testing cut decision time by over 70%. Per-trade margins were up to 60% higher in favorable market windows.", value: ">70%", caption: "less decision time · internal testing" },
    ],
  },
  signal: {
    kind: "Computer vision", accent: "#b1ead5", route: ["Camera input", "CNN inference", "Visual detection"],
    beats: [
      { label: "The spark", title: "Teach a machine to see.", body: "Recognize objects as they move. A computer vision project connecting a trained model to real-time collection and visualization.", value: "Vision", caption: "from image to interpretation" },
      { label: "The system", title: "Observe. Train. Check.", body: "Our team of five built and tested a convolutional neural network, checking its detections against the data we collected.", value: "05", caption: "people building and testing together" },
      { label: "The proof", title: "Watch the model at work.", body: "The CNN reached 97% accuracy in the project evaluation. Inspect the frame, or open the demonstration to see the work in motion.", value: "97%", caption: "model accuracy · project evaluation" },
    ],
  },
  workshop: {
    kind: "Physical computing", accent: "#ffc49b", route: ["Printed mechanics", "Arduino control", "Dance routine"],
    beats: [
      { label: "The spark", title: "Code that leaves the screen.", body: "A robot designed, printed, wired, and taught to dance. Software becomes something you can watch moving across a table.", value: "Move", caption: "a sketch becomes a physical machine" },
      { label: "The system", title: "Make the parts agree.", body: "I brought the mechanics, electronics, and dance routines together, using Arduino and Fusion 360 to connect the design to its motion.", value: "03", caption: "disciplines, one moving robot" },
      { label: "The proof", title: "A first-place performance.", body: "The robot took first place among 50 competitors at the 2019 Exceed Robotics Competition. Open the photograph to examine the build.", value: "1st", caption: "of 50 · Exceed Robotics, 2019" },
    ],
  },
};

export function projectBeatAt(y: number, stops: number[]) {
  let active = 0;
  for (let i = 1; i < stops.length; i++) if (y >= stops[i] - 2) active = i;
  return Math.min(2, active);
}
