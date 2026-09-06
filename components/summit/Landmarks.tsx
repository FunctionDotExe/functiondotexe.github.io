import { SUMMIT_CONTENT } from "@/lib/summit-content";
import { ResearchNotes } from "./ResearchNotes";
import { ProjectTheatre } from "./ProjectTheatre";

export function Landmarks() {
  return (
    <section className="climb" id="work" tabIndex={-1} aria-labelledby="climb-title">
      <div className="shell">
        <header className="section-heading" data-narrative-scene data-expedition-stop="selected-work" data-stop-label="Four explorations" data-stop-duration="1600">
          <div><p className="section-label">Selected explorations</p><h2 id="climb-title">Ideas, out<br />in the world.</h2></div>
          <p>Four projects. Four different kinds of challenge.<br />Follow the spark, the system, and the proof.</p>
        </header>
        <div className="climb__waypoints">{SUMMIT_CONTENT.landmarks.map((project, index) => <ProjectTheatre project={project} index={index} key={project.title}/>)}</div>
        <ResearchNotes />
      </div>
    </section>
  );
}
