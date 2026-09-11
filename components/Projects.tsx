import { PROJECTS } from "@/lib/constants";
import { NOTEBOOKS } from "@/lib/notebooks";
import { ArrowUpRight } from "lucide-react";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectVideo } from "./ProjectVideo";

export function Projects() {
  return (
    <section id="projects" className="portfolio-work">
      <div className="work-container">
        <div className="work-heading" data-reveal>
          <h2>Selected Work</h2>
          <p>Games, experiments, and things I&apos;ve built.</p>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <article key={project.title} className="project-card" data-reveal>
              {project.image && (project.youtubeId
                ? <ProjectVideo title={project.title} youtubeId={project.youtubeId} poster={project.image} />
                : <ProjectGallery title={project.title} images={[project.image, ...(project.gallery || [])]} fit={project.mediaFit} />)}
              <div className="project-copy">
                <div className="project-title-row">
                  <h3>{project.title}</h3>
                  {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer"
                    aria-label={`Open ${project.title}`} className="project-arrow"><ArrowUpRight size={24} /></a>}
                </div>
                <p className="project-category">{project.category}</p>
                <p className="project-description">{project.description}</p>
                {project.metric && <p className="project-metric">{project.metric}</p>}
                <ul className="project-stack" aria-label="Technologies and topics">
                  {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
                {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="work-link">
                  {project.linkLabel || "View project"}<ArrowUpRight size={16} aria-hidden="true" />
                </a>}
              </div>
            </article>
          ))}
        </div>

        <div className="work-subheading" data-reveal>
          <h3>Notebooks</h3>
          <p>Code and experiments, open in Colab.</p>
        </div>
        <div className="notebook-grid">
          {NOTEBOOKS.map((notebook) => (
            <article key={notebook.link} className="notebook" data-reveal>
              <ProjectGallery title={notebook.title} images={[notebook.image]} fit="contain" />
              <h4>{notebook.title}</h4>
              <p>{notebook.description}</p>
              <span className="notebook-tools">{notebook.tools}</span>
              <a href={notebook.link} target="_blank" rel="noopener noreferrer" className="work-link"
                aria-label={`Open ${notebook.title} in Colab`}>Open notebook<ArrowUpRight size={16} aria-hidden="true" /></a>
            </article>
          ))}
        </div>

        <div className="work-subheading" data-reveal>
          <h3>On the workbench</h3>
          <p>A VEX build and a couple of 3D prints.</p>
        </div>
        <article className="robot-build" data-reveal>
          <ProjectGallery title="VEX robot" images={[
            { src: "/media/work/vex-robot.webp", width: 1600, height: 1204, alt: "VEX robot on the workbench, showing the drive wheels, gears, and pneumatics" },
            { src: "/media/work/vex-detail.webp", width: 1014, height: 1347, alt: "Close-up of the VEX robot frame, air tank, and intake" },
          ]} />
          <div className="robot-details">
            <h4>VEX robot</h4>
            <p>The build on the bench, a closer look at the mechanism, and a short test clip.</p>
            <video controls playsInline preload="none" poster="/media/work/vex-video-poster.webp" aria-label="VEX robot test clip">
              <source src="/media/work/vex-demo.mp4" type="video/mp4" />
              <a href="/media/work/vex-demo.mp4">Watch the robot test clip</a>
            </video>
            <a className="work-link" href="/media/work/vex-demo.mp4" target="_blank" rel="noopener noreferrer">Open video<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </article>
        <figure className="prints-showcase" data-reveal>
          <div className="prints-grid">
          <div>
            <ProjectGallery title="3D print" portrait images={[
              { src: "/media/work/hollow-knight-print.webp", width: 1100, height: 1461, alt: "My white and grey 3D print of the Knight from Hollow Knight" },
            ]} />
          </div>
          <div>
            <ProjectGallery title="3D print" portrait images={[
              { src: "/media/work/warrior-print.webp", width: 1100, height: 1461, alt: "My bronze-coloured 3D print of an armoured warrior with a sword and shield" },
            ]} />
          </div>
          </div>
          <figcaption className="prints-caption">some things i like printing on my free time :)</figcaption>
        </figure>
      </div>
    </section>
  );
}
