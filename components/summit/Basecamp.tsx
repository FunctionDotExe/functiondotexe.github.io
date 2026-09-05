import { ArrowDown } from "lucide-react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";
import { RESEARCH_PROJECTS } from "@/lib/constants";

export function Basecamp() {
  return (
    <section className="basecamp-scene" id="basecamp" tabIndex={-1} aria-labelledby="basecamp-title">
      <div className="basecamp-scene__content shell">
        <div>
          <p className="section-label">A little context</p>
          <h2 id="basecamp-title">Follow the<br />curiosity.</h2>
        </div>
        <div className="basecamp-scene__note">
          <p className="basecamp-lead">I study Mathematics & Computer Science at the University of Toronto. Most of my learning starts with a question I can’t leave alone.</p>
          <p>Why is this request slow? Where does a model get things wrong? What makes a game worth coming back to? From backend services at 4D to MRI research and dancing robots, I build my way toward an answer.</p>
          <a className="text-link" href="#experience">See my experience <ArrowDown size={18} aria-hidden="true" /></a>
        </div>
        <nav className="project-index" aria-label="Jump to a project">
          {SUMMIT_CONTENT.landmarks.map((project, i) => (
            <a key={project.title} href={`#project-${project.visual}`}>
              <span className="project-index__type">{["Mobile product", "Market intelligence", "Computer vision", "Physical computing"][i]}</span>
              <span>{project.title}<ArrowDown size={17} aria-hidden="true" /></span>
            </a>
          ))}
          {RESEARCH_PROJECTS.map((project) => (
            <a key={project.id} href={`#project-${project.id}`}>
              <span className="project-index__type">{project.context.split(" · ")[0]}</span>
              <span>{project.title}<ArrowDown size={17} aria-hidden="true" /></span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
