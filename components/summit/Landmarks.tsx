import { ArrowUpRight } from "lucide-react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";
import { RESUME } from "@/lib/constants";
import { ProjectViewer } from "./ProjectViewer";
import { ResearchNotes } from "./ResearchNotes";
import { ArtifactMotion } from "./ArtifactMotion";

export function Landmarks() {
  return (
    <section className="climb" id="work" tabIndex={-1} aria-labelledby="climb-title">
      <div className="shell">
        <header className="section-heading">
          <div><p className="section-label">Selected explorations</p><h2 id="climb-title">Ideas, out<br />in the world.</h2></div>
          <p>From a first experiment to something people can use.<br />Four projects. Four different kinds of challenge.</p>
        </header>
        <div className="climb__waypoints">
          {SUMMIT_CONTENT.landmarks.map((project, index) => (
            <article className={`waypoint waypoint--${project.visual}`} id={`project-${project.visual}`} aria-labelledby={`title-${project.visual}`} key={project.title}>
              <div className="waypoint__stage">
              <div className="waypoint__landmark" aria-hidden="true"><span>{project.altitude}</span><i /><span>{project.stage}</span></div>
              <div className="waypoint__copy">
                <p className="project-kind">{["Mobile product", "Market intelligence", "Computer vision", "Physical computing"][index]}</p>
                <h3 id={`title-${project.visual}`}>{project.title}</h3>
                <p className="waypoint__description">{project.description}</p>
                <p className="waypoint__detail">{project.detail}</p>
                <ul className="tag-list" aria-label="Tools and disciplines">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                <div className="project-actions"><ProjectViewer landmark={project} />{project.visual === "signal" && <a className="text-link" href={RESUME.youtubeUrl} target="_blank" rel="noreferrer">Watch demo <ArrowUpRight size={16} aria-hidden="true" /></a>}</div>
              </div>
              <ArtifactMotion kind={project.visual}>
              <figure className={`project-media project-media--${project.visual}`}>
                <div className="artifact__annotation" aria-hidden="true"><span>{["Made for the daily ritual", "Signal from the noise", "Teaching machines to see", "From a sketch to a step"][index]}</span><i /></div>
                <div className="project-media__canvas">
                  {project.visual === "phones" ? (
                    <div className="phone-composition">
                      <img src={project.gallery![0].src} width={project.gallery![0].width} height={project.gallery![0].height} alt={project.gallery![0].alt} loading="lazy" decoding="async" />
                      <img src={project.image.src} width={project.image.width} height={project.image.height} alt={project.image.alt} loading="lazy" decoding="async" />
                      <img src={project.gallery![1].src} width={project.gallery![1].width} height={project.gallery![1].height} alt={project.gallery![1].alt} loading="lazy" decoding="async" />
                    </div>
                  ) : <img src={project.image.src} width={project.image.width} height={project.image.height} alt={project.image.alt} loading="lazy" decoding="async" />}
                </div>
                <figcaption><span>{project.kicker}</span><strong>{project.status}</strong></figcaption>
              </figure>
              </ArtifactMotion>
              </div>
            </article>
          ))}
        </div>
        <ResearchNotes />
      </div>
    </section>
  );
}
