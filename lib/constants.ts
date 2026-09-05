export const PERSONAL = {
  firstName: "Ruben",
  lastName: "Maxwell",
  role: "\"If you're going through hell, keep going.\"",
  roleAttribution: "Winston Churchill",
  city: "Toronto, ON",
  year: "2026",
  email: "rubenbmaxwell@gmail.com",
  linkedin: "https://linkedin.com/in/ruben-maxwell",
  github: "https://github.com/functiondotexe",
  bio: "I like understanding how something works, then trying to build it myself.",
  bioShort:
    "I'm studying Mathematics & Computer Science at the University of Toronto. My projects have taken me from a dancing robot to mobile games and medical-image research. I also enjoy helping other people get started with code, through teaching and volunteering.",
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
    category: "Languages & Interfaces",
    tools: ["Python", "C++", "C#", "C", "Java", "JavaScript", "TypeScript", "SQL", "Bash", "React Native", "Expo", "HTML", "CSS", "Tailwind CSS"],
    description: "I use these to build websites, mobile games, and the code that runs on a robot.",
  },
  {
    category: "Backend & Systems",
    tools: ["Docker", "RabbitMQ", "REST APIs", "Linux", "AWS", "Git / GitHub", "CI/CD", "PostgreSQL", "MongoDB", "MySQL", "Firebase"],
    description: "At 4D, I work on APIs, Docker services, RabbitMQ messaging, and database queries that keep requests moving.",
  },
  {
    category: "AI & Machine Learning",
    tools: ["PyTorch", "TensorFlow", "Keras", "CUDA / GPU", "NumPy", "Pandas", "Matplotlib", "scikit-learn", "Fairlearn", "Computer vision"],
    description: "I train and evaluate models, then look closely at their mistakes. My work includes object detection, skin-image classification, and fairness testing.",
  },
  {
    category: "AI Agents & Retrieval",
    tools: ["LLMs", "LangGraph", "LlamaIndex", "CrewAI", "RAG pipelines", "Qdrant", "Chroma", "Weaviate", "Claude Code", "Aider", "Codex CLI"],
    description: "Tools I use for LLM applications, document retrieval, and AI-assisted development.",
  },
  {
    category: "Quantum Computing",
    tools: ["Qiskit", "PennyLane", "Cirq", "VQE", "Quantum Neural Networks"],
    description: "At QMorphix, I compared quantum and classical methods for reconstructing MRI images and reducing noise.",
  },
  {
    category: "Robotics & Embedded",
    tools: ["VEX Robotics", "Arduino", "Raspberry Pi", "Embedded C++", "Sensor integration", "Motor control", "Fusion 360", "Unity / C#"],
    description: "I build and program robots, connecting sensor readings to motor control so they can respond on their own or to a driver.",
  },
];

export const EXPERIENCE = [
  {
    company: "Fourth Dimension (4D)",
    role: "Software Engineer · Innovation Lab",
    type: "Internship",
    dates: "May 2026 - Present",
    location: "Toronto, Ontario, Canada",
    bullets: [
      "Built and deployed Docker microservices so backend services ran in consistent environments and were easier to release.",
      "Built real-time workflows with RabbitMQ and tuned MongoDB queries and indexes to serve requests faster.",
      "Developed REST APIs and helped ship 4+ production releases. Used Claude Code and Aider for implementation and refactoring.",
    ],
  },
  {
    company: "QMorphix LLC",
    role: "Software Developer + Project Manager",
    type: "Internship",
    dates: "Jul 2025 - Sep 2025",
    location: "Toronto, Ontario, Canada",
    bullets: [
      "Compared VQE, quantum neural networks, and quantum-kernel methods for reconstructing MRI images and removing noise.",
      "Built Python simulation pipelines with Qiskit, PennyLane, and Cirq, testing their accuracy and training time.",
      "Ran controlled experiments across 100+ datasets and coordinated the project’s deliverables, improving image reconstruction and noise reduction.",
    ],
  },
  {
    company: "My Code Club",
    role: "Frontend Developer",
    type: "Contract",
    dates: "Jul 2025 - Aug 2025",
    location: "Mississauga, Ontario, Canada",
    bullets: [
      "Redesigned the company website with HTML, CSS, JavaScript, and Tailwind CSS to work better across phones, tablets, and desktops.",
      "Reorganized the site to make content updates faster and deployed it with Firebase.",
    ],
  },
  {
    company: "Inspirit AI",
    role: "AI Ambassador",
    type: "Volunteer",
    dates: "Sep 2023 - Jul 2025",
    location: "Remote",
    bullets: [
      "Served as a student ambassador for an AI program mentored by Stanford and MIT graduates.",
      "Helped peers learn Python and get started with machine learning.",
    ],
  },
  {
    company: "The STEAM Project",
    role: "Camp Counselor",
    type: "Contract",
    dates: "Mar 2024",
    location: "Remote",
    bullets: [
      "Taught robotics and programming to 70+ students aged 9–14.",
      "Created lessons using Arduino, LEGO Mindstorms, and block-based coding.",
      "Helped students build projects together and work through problems as a team.",
    ],
  },
  {
    company: "HIVE5",
    role: "Robotics Instructor",
    type: "Contract",
    dates: "Jul 2023 - Aug 2023",
    location: "Remote",
    bullets: [
      "Taught Python, Java, and C# through hands-on projects.",
      "Helped students debug their code, test changes, and build together.",
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
      "A daily game app with six mini-games, streaks, and live leaderboards. Built for iOS, Android, and web with React Native and Firebase.",
    stack: ["React Native", "Expo", "TypeScript", "Firebase"],
    image: { src: "/media/work/decyphergamehomepage.webp", width: 348, height: 730 },
    gallery: [
      { src: "/media/work/decyphergame1.webp", width: 460, height: 640 },
      { src: "/media/work/decyphergame2.webp", width: 424, height: 640 },
      { src: "/media/work/decyphergame3.webp", width: 325, height: 640 },
    ],
    mediaFit: "contain",
    metric: "95%+ crash-free sessions",
    link: "",
    visual: "gradient",
  },
  {
    title: "ForgeFountain",
    description:
      "A tool that helps players find worthwhile trades in a live game economy. It compares prices and crafting recipes, then ranks opportunities by profit, demand, and time to complete.",
    stack: ["React", "APIs", "Data Modeling", "Caching"],
    image: { src: "/media/work/marketopportunityanalyzer.webp", width: 1168, height: 1097 },
    gallery: [
      { src: "/media/work/marketopportunityanalyzer2.webp", width: 560, height: 482 },
      { src: "/media/work/marketopportunityanalyzer3.webp", width: 560, height: 534 },
    ],
    mediaFit: "contain",
    metric: "Internal testing: over 70% less decision time; up to 60% higher margins in favorable market windows",
    link: "",
    visual: "wireframe",
  },
  {
    title: "AI Object Detection",
    description:
      "A computer-vision project that detects cars, people, and other objects in real time, with a live view of what the model sees.",
    stack: ["Python", "TensorFlow", "Computer Vision", "CNNs"],
    metric: "97% model accuracy",
    link: "",
    visual: "voronoi",
  },
  {
    title: "Arduino Dancing Robot",
    description:
      "A small robot with its own dance routine. I designed the 3D-printed body in Fusion 360 and programmed its motors with Arduino.",
    stack: ["Arduino", "Fusion 360", "Robotics", "Prototyping"],
    image: { src: "/media/work/arduinorrobot.webp", width: 1168, height: 879 },
    link: "",
    visual: "voronoi",
  },
];

export const RESUME = {
  pdf: "/media/ruben-resume.pdf",
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

export const EDUCATION = {
  school: "University of Toronto",
  degree: "Honours Bachelor of Science",
  subject: "Mathematics & Computer Science",
  dates: "2025–2029",
  location: "Toronto, ON",
};

export const RESEARCH_PROJECTS = [
  {
    id: "skin-cancer",
    title: "Skin Cancer Detection",
    context: "URSA Case Competition · Computer vision",
    description: "Built a GPU-accelerated CNN pipeline for melanoma-versus-nevus classification using the HAM10000 dataset of 10,015 images.",
    detail: "The model reached approximately 0.90 AUC and 89–91% validation accuracy. I also checked who it performed worse for: a Fairlearn audit found a 4.45% accuracy gap and a difference in false-negative rates by sex.",
    tools: ["Python", "TensorFlow / Keras", "GPU acceleration", "Fairlearn"],
    metrics: [{ value: "10,015", label: "Dataset images" }, { value: "~0.90", label: "AUC" }, { value: "89–91%", label: "Validation accuracy" }],
  },
  {
    id: "embedded-robotics",
    title: "Robotics & Embedded Systems",
    context: "VEX & Arduino · Physical hardware",
    description: "Designed, built, and programmed VEX robots and Arduino microcontrollers in C++, connecting code to motion on physical hardware.",
    detail: "I used sensor feedback and closed-loop motor control to make the robots respond in real time, with both autonomous and driver-controlled routines. Earlier VEX competition work qualified for provincials.",
    tools: ["C++", "VEX Robotics", "Arduino", "Embedded systems"],
    metrics: [{ value: "Sense", label: "Real-time feedback" }, { value: "Control", label: "Closed-loop motors" }, { value: "Move", label: "Autonomous routines" }],
  },
];

export const HONORS = [
  { title: "3× hackathon winner", detail: "Across hackathon competitions" },
  { title: "Top 500 worldwide", detail: "Sir Isaac Newton Physics Exam · 3,808 participants · Waterloo, 2025" },
  { title: "Top 5 · NASA SpaceHacks", detail: "2019" },
  { title: "Global nominee · NASA SpaceHacks", detail: "2022 · Unity game inspired by the James Webb Space Telescope" },
  { title: "1st place · Exceed Robotics", detail: "2019 · Dancing robot · 50 competitors" },
];

export const COMMUNITY = [
  { role: "Recreational program volunteer", organization: "Ontario Science Centre", dates: "Since July 2023" },
  { role: "Observatory volunteer", organization: "David Dunlap Observatory", dates: "Since May 2023" },
  { role: "Technology specialist", organization: "L’Arche Daybreak", dates: "May 2025" },
  { role: "School event technology support", organization: "York Catholic District School Board", dates: "September 2024–June 2025" },
];

export const LANGUAGES = ["English · Native", "French · Working", "Tamil · Professional"];
