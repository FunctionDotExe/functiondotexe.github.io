import type { ReactNode } from "react";
import { ArrowDown, ArrowUpRight, ArrowUp, ChevronDown, FileText } from "lucide-react";
import { PortfolioNav } from "./PortfolioNav";
import { ProjectImageButton, ProjectInspectButton, ProjectViewer } from "../summit/ProjectViewer";
import { ContactActions } from "../summit/ContactActions";
import { SUMMIT_CONTENT, type Landmark } from "@/lib/summit-content";
import { CERTIFICATES, COMMUNITY, EDUCATION, EXPERIENCE, HONORS, LANGUAGES, PERSONAL, RESUME } from "@/lib/constants";

const external = { target: "_blank", rel: "noreferrer" } as const;
const decyp: Landmark = {
  ...SUMMIT_CONTENT.landmarks[0],
  kicker: "A small daily ritual, built for a phone.",
  description: "Six daily mini-games with streaks and live rankings, built for iOS, Android, and web.",
  detail: "I built the daily challenges, streak tracking, and Firestore rankings. Transactional score submissions keep repeated entries from spamming the leaderboard.",
};
const forge: Landmark = {
  ...SUMMIT_CONTENT.landmarks[1],
  kicker: "Making a game economy easier to read.",
  description: "A market tool for Hypixel SkyBlock players. Compare Bazaar prices with crafting and forging costs, then inspect profit, time, and recipe requirements.",
  detail: "The interface and API service bring live prices and recipes together. Cached recipe data and retries help the tool handle unreliable upstream requests.",
  tags: ["JavaScript", "Node.js", "Express", "APIs"],
};
const detection: Landmark = {
  ...SUMMIT_CONTENT.landmarks[2],
  detail: "I worked in a team of five on a CNN-based object-detection project, using live data collection and visualization to inspect its predictions.",
};
const robotics = SUMMIT_CONTENT.landmarks[3];

function Tools({ items }: { items: string[] }) {
  return <ul className="p-tools" aria-label="Project technologies">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

function BuildNotes({ children }: { children: ReactNode }) {
  return <details className="p-build-notes"><summary>Build notes <ChevronDown size={16} aria-hidden="true" /></summary><div>{children}</div></details>;
}

export default function PortfolioPage() {
  return <>
    <PortfolioNav />
    <main id="main-content" tabIndex={-1}>
      <section className="p-hero" id="entry" tabIndex={-1} aria-labelledby="journey-title">
        <div className="p-shell p-hero__intro">
          <h1 id="journey-title">Ruben <span>Maxwell.</span></h1>
          <div className="p-hero__note"><p>I build software, train models,<br className="p-desktop-break" /> and make robots move.</p><a className="p-link" href="#work">Explore the work <ArrowDown size={18} aria-hidden="true" /></a></div>
        </div>
        <figure className="p-landscape"><img src="/media/summit-parallax-master-v2.webp" width={1536} height={1024} fetchPriority="high" alt="An illustrated mountain trail winding toward a sunlit summit." /><figcaption><span>Always something to explore.</span><span>Toronto, Canada</span></figcaption></figure>
        <div className="p-shell p-current"><p>Mathematics &amp; Computer Science<br /><strong>University of Toronto</strong></p><a href="#experience"><span>Currently building at<br /><strong>Fourth Dimension (4D)</strong></span><ArrowUpRight size={22} aria-hidden="true" /></a></div>
      </section>

      <section className="p-work p-shell p-section" id="work" tabIndex={-1} aria-labelledby="work-title">
        <header className="p-section-head"><h2 id="work-title">Selected work.</h2><p>From a daily game to a research question.<br />A few things I’ve built and learned from.</p></header>
        <article className="p-project p-project--forge" id="project-console" tabIndex={-1} aria-labelledby="forge-title">
          <ProjectViewer landmark={forge}>
            <div className="p-project__visual p-forge-media"><ProjectImageButton><img src={forge.image!.src} width={forge.image!.width} height={forge.image!.height} loading="lazy" decoding="async" alt={forge.image!.alt} /></ProjectImageButton></div>
            <div className="p-project__copy"><h3 id="forge-title">ForgeFountain</h3><p className="p-project__subtitle">A clearer view of a game economy.</p><p>{forge.description}</p><Tools items={forge.tags} /><div className="p-project__actions"><a className="p-link" href="https://github.com/FunctionDotExe/ForgeFountain" {...external}>View source <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a><ProjectInspectButton /></div><BuildNotes><p>{forge.detail}</p><p>The analysis connects item prices, recipe costs, and time requirements so players can compare opportunities in one place.</p><a className="p-link" href="https://github.com/FunctionDotExe/ForgeFountain/blob/main/server.js" {...external}>Read the API implementation <ArrowUpRight size={16} aria-hidden="true" /></a></BuildNotes></div>
          </ProjectViewer>
        </article>
        <article className="p-project p-project--decyp" id="project-phones" tabIndex={-1} aria-labelledby="decyp-title">
          <ProjectViewer landmark={decyp}>
            <div className="p-project__visual p-phone-media"><ProjectImageButton><span className="p-phones"><img src={decyp.gallery![0].src} width={460} height={640} loading="lazy" decoding="async" alt={decyp.gallery![0].alt} /><img src={decyp.image!.src} width={348} height={730} loading="lazy" decoding="async" alt={decyp.image!.alt} /><img src={decyp.gallery![1].src} width={424} height={640} loading="lazy" decoding="async" alt={decyp.gallery![1].alt} /></span></ProjectImageButton></div>
            <div className="p-project__copy"><h3 id="decyp-title">Decyp3r</h3><p className="p-project__subtitle">A little challenge. Every day.</p><p>{decyp.description}</p><Tools items={decyp.tags} /><div className="p-project__actions"><ProjectInspectButton /></div><BuildNotes><p>{decyp.detail}</p><p>React Native and Expo connect the phone interface to Firebase. The same daily challenge, streak, and score records support the game across platforms.</p></BuildNotes></div>
          </ProjectViewer>
        </article>

        <article className="p-research" id="project-skin-cancer" tabIndex={-1} aria-labelledby="research-title">
          <div className="p-research__copy"><h3 id="research-title">Looking closer<br />at the model.</h3><p className="p-project__subtitle">Skin-image classification · URSA case competition</p><p>I trained a CNN to distinguish melanoma from nevi, then examined where its predictions fell short across patient groups.</p><Tools items={["Python", "TensorFlow / Keras", "Fairlearn"]} /></div>
          <div className="p-research__study"><dl><div><dt>Source dataset</dt><dd>HAM10000 <span>10,015 dermatoscopic images</span></dd></div><div><dt>Method</dt><dd>GPU-accelerated CNN <span>Melanoma-versus-nevus classification</span></dd></div><div><dt>Evaluation</dt><dd>Performance &amp; fairness <span>Validation results and errors across sex groups</span></dd></div></dl><BuildNotes><p>The project evaluation reported approximately 0.90 AUC and 89–91% validation accuracy. A Fairlearn audit identified a 4.45% accuracy gap and a difference in false-negative rates by sex.</p><p>The study looked beyond a single accuracy score to examine who the model performed worse for. HAM10000’s total size describes the source dataset, not the size of a held-out evaluation set.</p></BuildNotes></div>
        </article>

        <div className="p-experiments">
          <article id="project-signal" tabIndex={-1} aria-labelledby="detection-title"><ProjectViewer landmark={detection}><div className="p-experiment__media"><ProjectImageButton><img src={detection.image!.src} width={1168} height={657} alt={detection.image!.alt} loading="lazy" decoding="async" /></ProjectImageButton></div><h3 id="detection-title">Teaching a machine to see.</h3><p>{detection.detail}</p><ProjectInspectButton /></ProjectViewer></article>
          <article id="project-workshop" tabIndex={-1} aria-labelledby="robot-title"><ProjectViewer landmark={robotics}><div className="p-experiment__media"><ProjectImageButton><img src={robotics.image.src} width={1168} height={879} alt={robotics.image.alt} loading="lazy" decoding="async" /></ProjectImageButton></div><h3 id="robot-title">Code, off the screen.</h3><p>A robot I designed, printed, wired, and programmed to dance. First place among 50 competitors at Exceed Robotics, 2019.</p><ProjectInspectButton /></ProjectViewer></article>
        </div>
        <details className="p-robotics-note" id="project-embedded-robotics"><summary>More robotics &amp; embedded work <ChevronDown size={18} aria-hidden="true" /></summary><p>With VEX and Arduino, I connected sensor feedback to closed-loop motor control for autonomous and driver-controlled routines. Earlier VEX competition work qualified for provincials.</p><Tools items={["C++", "VEX Robotics", "Arduino", "Sensor integration"]} /></details>
      </section>

      <section className="p-experience p-section" id="experience" tabIndex={-1} aria-labelledby="experience-title"><div className="p-shell"><header className="p-section-head"><h2 id="experience-title">Experience.</h2><a className="p-link" href={RESUME.pdf} {...external}>View résumé <FileText size={18} aria-hidden="true" /><span className="sr-only"> (PDF, opens in a new tab)</span></a></header><div className="p-roles">{EXPERIENCE.map((item,index)=><details className="p-role" key={item.company} open={index===0}><summary><span className="p-role__dates">{item.dates}</span><span className="p-role__identity"><strong>{item.company}</strong><span>{item.role}</span></span><ChevronDown size={20} aria-hidden="true" /></summary><div className="p-role__body"><p>{item.type} · {item.location}</p><ul>{item.bullets.map(b=><li key={b}>{b}</li>)}</ul></div></details>)}</div></div></section>

      <section className="p-skills p-section p-shell" id="crust" tabIndex={-1} aria-labelledby="skills-title"><header className="p-section-head"><h2 id="skills-title">Tools, put to work.</h2><p>The useful part is knowing<br />when to bring them together.</p></header><div className="p-capabilities"><div><h3>Software &amp; systems</h3><p>TypeScript, JavaScript, React Native, Node.js, SQL, Docker, RabbitMQ, MongoDB, Firebase.</p><a className="p-link" href="#experience">In production at 4D <ArrowUpRight size={16} aria-hidden="true" /></a></div><div><h3>Models &amp; research</h3><p>Python, TensorFlow, PyTorch, scikit-learn, Fairlearn, Qiskit, PennyLane.</p><a className="p-link" href="#project-skin-cancer">In the skin-image study <ArrowUpRight size={16} aria-hidden="true" /></a></div><div><h3>Hardware &amp; motion</h3><p>C++, Arduino, VEX, Raspberry Pi, sensor integration, motor control, Fusion 360.</p><a className="p-link" href="#project-workshop">In the dancing robot <ArrowUpRight size={16} aria-hidden="true" /></a></div></div></section>

      <section className="p-about p-section" id="about" tabIndex={-1} aria-labelledby="about-title"><div className="p-shell"><div className="p-about__main"><div className="p-about__copy"><h2 id="about-title">Curious by nature.</h2><p className="p-about__lead">I like understanding how something works, then trying to build it myself.</p><p>I’m studying Mathematics &amp; Computer Science at the University of Toronto. Outside my own projects, I help other people find their way into code through teaching and volunteering.</p><div className="p-education"><strong>{EDUCATION.school}</strong><span>{EDUCATION.degree} · {EDUCATION.dates}</span><span>{EDUCATION.subject}</span></div><a className="p-link" href={PERSONAL.github} {...external}>More on GitHub <ArrowUpRight size={17} aria-hidden="true" /></a></div><figure className="p-portrait"><img src="/media/ruben-profile.png" width={800} height={800} alt="Ruben outdoors, with glasses and headphones around his neck." loading="lazy" decoding="async" /><figcaption>Ruben Maxwell · Toronto</figcaption></figure></div><div className="p-about__details"><details><summary>Awards &amp; competitions <ChevronDown size={18} aria-hidden="true" /></summary><ul>{HONORS.filter(h=>!h.title.includes("hackathon winner")).map(h=><li key={h.title}><strong>{h.title}</strong><span>{h.detail}</span></li>)}</ul></details><details><summary>Community &amp; languages <ChevronDown size={18} aria-hidden="true" /></summary><ul>{COMMUNITY.map(c=><li key={c.organization}><strong>{c.organization}</strong><span>{c.role} · {c.dates}</span></li>)}</ul><p>{LANGUAGES.join(" · ")}</p></details><details><summary>Certifications <ChevronDown size={18} aria-hidden="true" /></summary><ul>{CERTIFICATES.map(c=><li key={c.title}><a href={c.image.src} {...external}>{c.title} <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens certificate in a new tab)</span></a><span>{c.issuer}</span></li>)}</ul></details></div></div></section>

      <section className="p-contact p-section" id="contact" tabIndex={-1} aria-labelledby="contact-title"><div className="p-shell"><div className="p-contact__main"><h2 id="contact-title">Let’s build<br /><em>something useful.</em></h2><div><p>A team to join, an idea to build,<br />or a good question. I’d love to hear it.</p><ContactActions /></div></div><footer className="p-footer"><p>© {new Date().getFullYear()} Ruben Maxwell</p><div><a href={PERSONAL.github} {...external}>GitHub <ArrowUpRight size={15} aria-hidden="true" /></a><a href={PERSONAL.linkedin} {...external}>LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a></div><a href="#entry">Back to top <ArrowUp size={15} aria-hidden="true" /></a></footer></div></section>
    </main>
  </>;
}
