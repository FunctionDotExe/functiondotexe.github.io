import { ArrowUpRight } from "lucide-react";
import { PROJECTS, RESUME } from "@/lib/constants";

const projectMeta = [
  { kind: "Mobile product", mark: "Interface / Game systems", tone: "cobalt" },
  { kind: "Market intelligence", mark: "Data / Decision engine", tone: "ink" },
  { kind: "Computer vision", mark: "Model / Live detection", tone: "signal" },
  { kind: "Physical computing", mark: "Hardware / Motion", tone: "paper" },
] as const;

function ProjectMedia({ index }: { index: number }) {
  const project = PROJECTS[index];

  if (index === 0 && project.image && project.gallery) {
    const phones = [project.gallery[0], project.image, project.gallery[2]];
    return (
      <div className="phone-stage" aria-label="Decyp3r mobile app screens">
        {phones.map((image, imageIndex) => (
          <img
            key={image.src}
            src={image.src}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            alt={`Decyp3r screen ${imageIndex + 1}`}
          />
        ))}
        <span className="phone-stage__note">Daily microgames / live rankings / streaks</span>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="vision-stage">
        <img
          src={RESUME.videoThumb.src}
          width={RESUME.videoThumb.width}
          height={RESUME.videoThumb.height}
          loading="lazy"
          decoding="async"
          alt="Object detection model identifying vehicles and traffic lights"
        />
        <div className="vision-stage__reticle" aria-hidden="true" />
        <span className="vision-stage__readout">LIVE INFERENCE · 97% ACCURACY</span>
      </div>
    );
  }

  if (!project.image) return null;

  return (
    <div className={`project-image project-image--${index}`}>
      <img
        src={project.image.src}
        width={project.image.width}
        height={project.image.height}
        loading="lazy"
        decoding="async"
        alt={`${project.title} project preview`}
      />
      {index === 1 && <span className="project-image__stamp">LIVE MARKET DATA</span>}
      {index === 3 && <span className="project-image__stamp">BUILT / WIRED / PROGRAMMED</span>}
    </div>
  );
}

export function Projects() {
  return (
    <section className="projects section" id="work">
      <div className="section-heading" data-reveal>
        <div>
          <span className="section-label">Selected work / 04 systems</span>
          <h2>Proof lives in<br />the build.</h2>
        </div>
        <p>
          A game, a market engine, a vision model, and a robot. Different surfaces—same instinct:
          understand the system, make it useful, then make it feel finished.
        </p>
      </div>

      <div className="project-list">
        {PROJECTS.map((project, index) => {
          const meta = projectMeta[index];
          return (
            <article
              className={`project-card project-card--${meta.tone}`}
              key={project.title}
              data-reveal
            >
              <div className="project-card__info">
                <div className="project-card__index">
                  <span>0{index + 1}</span>
                  <span>{meta.kind}</span>
                </div>
                <div>
                  <p className="project-card__mark">{meta.mark}</p>
                  <h3>{project.title}</h3>
                  <p className="project-card__description">{project.description}</p>
                  {project.metric && <p className="project-card__metric">{project.metric}</p>}
                </div>
                <div className="project-card__footer">
                  <div className="tag-list">
                    {project.stack.map((tech) => <span key={tech}>{tech}</span>)}
                  </div>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>
                      View build <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
              <div className="project-card__media">
                <ProjectMedia index={index} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
