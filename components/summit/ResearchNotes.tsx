import { ChevronDown } from "lucide-react";
import { RESEARCH_PROJECTS } from "@/lib/constants";

export function ResearchNotes() {
  return (
    <section className="research-notes" aria-labelledby="research-title">
      <header><p className="section-label">Research & robotics</p><h3 id="research-title">More than<br />a working demo.</h3><p>Testing how a model performs across patient groups, and getting a robot to respond to the world around it.</p></header>
      <div className="research-notes__list">
        {RESEARCH_PROJECTS.map((project, index) => (
          <details className="disclosure research-note" id={`project-${project.id}`} key={project.id} data-hover-disclosure open={index === 0}>
            <summary><span><small>{project.context}</small><strong>{project.title}</strong><small className="disclosure-cue-label" aria-hidden="true"><span className="disclosure-cue-label__closed">Open the study</span><span className="disclosure-cue-label__open">Close the study</span><span className="disclosure-cue-label__preview">Keep this open</span></small></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div className="disclosure__panel"><div className="disclosure__body">
              <p>{project.description}</p>
              <dl className="research-metrics">{project.metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>
              <p>{project.detail}</p>
              <ul className="tag-list" aria-label="Project technologies">{project.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
            </div></div>
          </details>
        ))}
      </div>
    </section>
  );
}
