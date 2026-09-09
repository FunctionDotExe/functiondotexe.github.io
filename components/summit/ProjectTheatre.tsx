import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
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
          <div className="project-chapter__narrative"><div className="project-shot">
            <h4>{story.title}</h4><p className="project-shot__body">{story.description}</p><p className="project-shot__body">{story.contribution}</p>
            {story.evidence && <div className="project-shot__evidence"><strong>{story.evidence.value}</strong><span>{story.evidence.caption}</span></div>}
          </div></div>
          <footer className="project-chapter__footer">
            <div className="project-chapter__inspect"><ProjectInspectButton />{project.visual === "console" && <><a className="text-link" href="https://github.com/FunctionDotExe/ForgeFountain" target="_blank" rel="noreferrer">View source <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> on GitHub (opens in a new tab)</span></a><a className="text-link" href="https://github.com/FunctionDotExe/ForgeFountain/blob/main/server.js" target="_blank" rel="noreferrer">API implementation <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> on GitHub (opens in a new tab)</span></a></>}{project.visual === "signal" && <a className="text-link" href={RESUME.youtubeUrl} target="_blank" rel="noreferrer"><Play size={16} aria-hidden="true"/>Watch demo<span className="sr-only"> on YouTube (opens in a new tab)</span></a>}</div>
            <ul className="project-chapter__tools" aria-label="Tools and disciplines">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          </footer>
        </div>
      </ProjectViewer>
    </article>
  );
}
