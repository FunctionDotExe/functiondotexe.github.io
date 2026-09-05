export const PERSONAL = {
  firstName: "Ruben",
  lastName: "Maxwell",
  role: "\"If you're going through hell, keep going.\"",
  roleAttribution: "Winston Churchill",
  city: "Toronto, ON",
  year: "2025",
  email: "rubenbmaxwell@gmail.com",
  linkedin: "https://linkedin.com/in/ruben-maxwell",
  github: "https://github.com/functiondotexe",
  bio: "I like turning rough ideas into useful, polished systems.",
  bioShort:
    "I'm a University of Toronto Computer Science student focused on web development, AI systems, and quantum computing. My work moves between hands-on prototypes, production-minded interfaces, and research-driven experiments.",
};

export const PRINCIPLES = [
  {
    quote: "Energy and persistence conquer all things.",
    author: "Benjamin Franklin",
  },
  {
    quote: "Well done is better than well said.",
    author: "Benjamin Franklin",
  },
];

export const STATS = [
  { value: 12, label: "Projects Shipped" },
  { value: 4, label: "Years of Experience" },
  { value: 8, label: "Technologies" },
  { value: 2, label: "Research Areas" },
];

export const SKILLS = [
  {
    category: "Frontend Engineering",
    tools: ["React.js", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
    description: "Responsive, polished interfaces built with modern React tooling.",
  },
  {
    category: "Backend & APIs",
    tools: ["Node.js", "Python", "Firebase", "PostgreSQL", "REST APIs"],
    description: "APIs, data flows, and service layers for practical products.",
  },
  {
    category: "AI & Machine Learning",
    tools: ["Python", "TensorFlow", "PyTorch", "scikit-learn", "LLMs"],
    description: "Model building, evaluation, and applied AI experiments.",
  },
  {
    category: "Quantum Computing",
    tools: ["Qiskit", "PennyLane", "Cirq", "VQE", "Quantum Neural Networks"],
    description: "Hybrid quantum-classical workflows and algorithm research.",
  },
  {
    category: "Robotics & IoT",
    tools: ["Arduino", "LEGO Mindstorms", "Python", "C#", "Java"],
    description: "Hands-on robotics, embedded systems, and automation projects.",
  },
  {
    category: "Data Science",
    tools: ["NumPy", "Pandas", "Matplotlib", "Jupyter", "Computer Vision"],
    description: "Analysis, visualization, and computer vision workflows.",
  },
];

export const EXPERIENCE = [
  {
    company: "Fourth Dimension (4D)",
    role: "Software Engineer",
    type: "Internship",
    dates: "May 2026 - Present",
    location: "Toronto, Ontario, Canada",
    bullets: [
      "Building and maintaining production software features",
      "Collaborating across product, design, and engineering workflows",
    ],
  },
  {
    company: "QMorphix LLC",
    role: "Software Developer + Project Manager",
    type: "Internship",
    dates: "Jul 2025 - Sep 2025",
    location: "Toronto, Ontario, Canada",
    bullets: [
      "Researched quantum machine learning methods including VQE, QNNs, and quantum kernels",
      "Built and simulated quantum circuits with Qiskit, PennyLane, and Cirq",
      "Explored hybrid quantum-classical pipelines for classification and regression",
    ],
  },
  {
    company: "My Code Club",
    role: "Frontend Developer",
    type: "Contract",
    dates: "Jul 2025 - Aug 2025",
    location: "Remote",
    bullets: [
      "Developed a responsive website with dynamic front-end components",
      "Integrated Firebase hosting, APIs, and newsletter subscriptions",
      "Built workflows for workshop content and user data management",
    ],
  },
  {
    company: "Inspirit AI",
    role: "Ambassador",
    type: "Volunteer",
    dates: "Sep 2023 - Jul 2025",
    location: "Remote",
    bullets: [
      "Selected for an AI Ambassador program led by Stanford and MIT graduates",
      "Created a CNN object detection project that reached 97% accuracy",
      "Built real-time data collection and visualization tools for model testing",
    ],
  },
  {
    company: "The STEAM Project",
    role: "Camp Counselor",
    type: "Contract",
    dates: "Mar 2024",
    location: "Remote",
    bullets: [
      "Taught robotics and programming to 70+ students aged 9-14",
      "Created lessons for Arduino, LEGO Mindstorms, and block-based coding",
      "Led collaborative classroom projects with students and peers",
    ],
  },
  {
    company: "HIVE5",
    role: "Robotics Instructor",
    type: "Contract",
    dates: "Jul 2023 - Aug 2023",
    location: "Remote",
    bullets: [
      "Instructed students in Python, Java, and C# through hands-on projects",
      "Guided group activities, debugging, and iterative development",
    ],
  },
];

export type ProjectVisual = "wireframe" | "voronoi" | "gradient";

export type ProjectImage = {
  src: string;
  width: number;
  height: number;
};

export type Project = {
  title: string;
  description: string;
  stack: string[];
  image?: ProjectImage;
  video?: string;
  gallery?: ProjectImage[];
  mediaFit?: "cover" | "contain";
  metric?: string;
  link: string;
  visual: ProjectVisual;
};

export const PROJECTS: Project[] = [
  {
    title: "Decyp3r: Microgame App",
    description:
      "React Native microgame with Firebase auth, score submissions, daily limits, streaks, and live rankings.",
    stack: ["React Native", "Expo", "TypeScript", "Firebase"],
    image: { src: "/media/work/decyphergamehomepage.webp", width: 348, height: 730 },
    gallery: [
      { src: "/media/work/decyphergame1.webp", width: 460, height: 640 },
      { src: "/media/work/decyphergame2.webp", width: 424, height: 640 },
      { src: "/media/work/decyphergame3.webp", width: 325, height: 640 },
    ],
    mediaFit: "contain",
    metric: "Live rankings + daily attempts",
    link: "",
    visual: "gradient",
  },
  {
    title: "ForgeFountain",
    description:
      "Market intelligence app that ranks live game-economy opportunities by return, liquidity, and execution time.",
    stack: ["React", "APIs", "Data Modeling", "Caching"],
    image: { src: "/media/work/marketopportunityanalyzer.webp", width: 1168, height: 1097 },
    gallery: [
      { src: "/media/work/marketopportunityanalyzer2.webp", width: 560, height: 482 },
      { src: "/media/work/marketopportunityanalyzer3.webp", width: 560, height: 534 },
    ],
    mediaFit: "contain",
    metric: "70% faster decisions, up to 60% better margins",
    link: "",
    visual: "wireframe",
  },
  {
    title: "AI Object Detection",
    description:
      "CNN-based computer vision project with real-time detection, data collection, and visualization.",
    stack: ["Python", "TensorFlow", "Computer Vision", "CNNs"],
    metric: "97% model accuracy",
    link: "",
    visual: "voronoi",
  },
  {
    title: "Arduino Dancing Robot",
    description:
      "3D-printed motor-controlled robot designed in Fusion 360 and programmed with Arduino.",
    stack: ["Arduino", "Fusion 360", "Robotics", "Prototyping"],
    image: { src: "/media/work/arduinorrobot.webp", width: 1168, height: 879 },
    link: "",
    visual: "voronoi",
  },
];

export const RESUME = {
  pdf: "/media/RUBEN_RESUME_V.3.0.docx.pdf",
  youtubeUrl: "https://youtu.be/Y57MlI380UM",
  youtubeId: "Y57MlI380UM",
  videoThumb: { src: "/media/work/video-thumb.webp", width: 1168, height: 657 },
};

export const CERTIFICATES = [
  {
    title: "Machine Learning with Python",
    issuer: "IBM / Coursera",
    image: { src: "/media/work/certificate-machine-learning-python.webp", width: 810, height: 424 },
  },
  {
    title: "AI For Everyone",
    issuer: "DeepLearning.AI / Coursera",
    image: { src: "/media/work/certificate-ai-for-everyone.webp", width: 810, height: 424 },
  },
  {
    title: "Version Control",
    issuer: "Meta / Coursera",
    image: { src: "/media/work/certificate-version-control.webp", width: 810, height: 424 },
  },
];
