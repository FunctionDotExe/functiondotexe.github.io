import { ArrowDownRight } from "lucide-react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";
import { RESEARCH_PROJECTS } from "@/lib/constants";

export function Basecamp() {
  return (
    <section className="basecamp-scene" id="basecamp" aria-labelledby="basecamp-title">
      <div className="basecamp-scene__content shell">
        <div>
          <p className="section-label">What I do</p>
          <h2 id="basecamp-title">I learn<br />by building.</h2>
        </div>
        <div className="basecamp-scene__note">
          <p>My work ranges from backend services at 4D to MRI research, mobile games, and robots. I like getting into the details: why a request is slow, where a model gets things wrong, and what makes an app worth coming back to.</p>
          <a className="text-link" href="#experience">See my experience <ArrowDownRight size={18} aria-hidden="true" /></a>
        </div>
        <nav className="project-index" aria-label="Jump to a project">
          {SUMMIT_CONTENT.landmarks.map((project, i) => (
            <a key={project.title} href={`#project-${project.visual}`}>
              <span className="project-index__type">{["Mobile product", "Market intelligence", "Computer vision", "Physical computing"][i]}</span>
              <span>{project.title}<ArrowDownRight size={17} aria-hidden="true" /></span>
            </a>
          ))}
          {RESEARCH_PROJECTS.map((project) => (
            <a key={project.id} href={`#project-${project.id}`}>
              <span className="project-index__type">{project.context.split(" · ")[0]}</span>
              <span>{project.title}<ArrowDownRight size={17} aria-hidden="true" /></span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
