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
          <p>Right now, I’m building backend services at Fourth Dimension. In my research, I look at how models work—and where they get things wrong.</p>
          <p className="basecamp-scene__links"><a className="text-link" href="#experience">My work at 4D <ArrowDown size={18} aria-hidden="true" /></a><a className="text-link" href="#project-skin-cancer">The skin-image study <ArrowDown size={18} aria-hidden="true" /></a></p>
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
