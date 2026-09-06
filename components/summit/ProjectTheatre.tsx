import type { CSSProperties } from "react";
import { ArrowRight, Play } from "lucide-react";
import type { Landmark } from "@/lib/summit-content";
import { PROJECT_STORIES } from "@/lib/project-story";
import { RESUME } from "@/lib/constants";
import { ProjectViewer, ProjectImageButton, ProjectInspectButton } from "./ProjectViewer";
import { ArtifactMotion } from "./ArtifactMotion";

/** Complete project stories in normal document flow. The browser owns scrolling. */
export function ProjectTheatre({ project, index }: { project: Landmark; index: number }) {
  const story = PROJECT_STORIES[project.visual];
  const id = `project-${project.visual}`;
  return (
    <article className={`waypoint project-chapter project-chapter--${project.visual}`} id={id} aria-labelledby={`title-${project.visual}`} style={{ "--chapter-color": story.accent } as CSSProperties}>
      <ProjectViewer landmark={project}>
        <div className="project-chapter__stage">
          <header className="project-chapter__heading">
            <div className="project-chapter__index"><span>{String(index + 1).padStart(2, "0")}</span><i /><span>{story.kind}</span></div>
            <h3 id={`title-${project.visual}`}>{project.title}</h3>
            <span className="project-chapter__altitude">{project.altitude}<span>{project.stage}</span></span>
          </header>
          <div className="project-chapter__object">
            <ArtifactMotion kind={project.visual}>
              <figure className={`project-media project-media--${project.visual}`}>
                <ProjectImageButton><span className="project-media__canvas">
                  {project.visual === "phones" ? <span className="phone-composition">
                    <img src={project.gallery![0].src} width={project.gallery![0].width} height={project.gallery![0].height} alt={project.gallery![0].alt} loading="lazy" decoding="async" />
                    <img src={project.image!.src} width={project.image!.width} height={project.image!.height} alt={project.image!.alt} loading="lazy" decoding="async" />
                    <img src={project.gallery![1].src} width={project.gallery![1].width} height={project.gallery![1].height} alt={project.gallery![1].alt} loading="lazy" decoding="async" />
                  </span> : <img src={project.image!.src} width={project.image!.width} height={project.image!.height} alt={project.image!.alt} loading="lazy" decoding="async" />}
                </span></ProjectImageButton>
                <figcaption>{project.kicker}</figcaption>
              </figure>
            </ArtifactMotion>
            <div className="project-chapter__pipeline" aria-label="How the project works">{story.route.map((node, i) => <span key={node}>{node}{i < 2 && <ArrowRight size={15} aria-hidden="true"/>}</span>)}</div>
          </div>
          <div className="project-chapter__narrative">{story.beats.map((beat, i) => <section className="project-shot" id={`${id}-beat-${i}`} key={beat.label}>
            <p className="project-shot__eyebrow">{beat.label}</p><h4>{beat.title}</h4><p className="project-shot__body">{beat.body}</p>
            {i === 2 && <div className="project-shot__evidence"><strong>{beat.value}</strong><span>{beat.caption}</span></div>}
          </section>)}</div>
          <footer className="project-chapter__footer">
            <div className="project-chapter__inspect"><ProjectInspectButton />{project.visual === "signal" && <a className="text-link" href={RESUME.youtubeUrl} target="_blank" rel="noreferrer"><Play size={16} aria-hidden="true"/>Watch demo<span className="sr-only"> on YouTube (opens in a new tab)</span></a>}</div>
            <ul className="project-chapter__tools" aria-label="Tools and disciplines">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          </footer>
        </div>
      </ProjectViewer>
    </article>
  );
}
