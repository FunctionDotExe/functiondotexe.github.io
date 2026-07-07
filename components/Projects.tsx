"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [28, -32]);
  const stampY = useTransform(scrollYProgress, [0, 1], [-18, 24]);
  const media = project.image ?? "/media/lab-texture.jpg";

  return (
    <motion.article
      ref={ref}
      variants={ANIMATION_VARIANTS.staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className="grid gap-6 border-t-2 border-[var(--ink)] py-10 lg:grid-cols-[0.72fr_1fr] lg:items-center"
    >
      <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
        <motion.p className="stamp mb-7" style={{ y: stampY }}>
          Example {String(index + 1).padStart(2, "0")}
        </motion.p>
        <h3 className="poster-type max-w-[10ch] text-[clamp(3.25rem,7.5vw,8rem)]">
          {project.title}
        </h3>
        <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">{project.description}</p>

        {project.metric && (
          <p className="mt-7 max-w-lg border-l-4 border-[var(--ink)] pl-5 font-sans text-base font-black uppercase leading-7 tracking-[0.08em] text-[var(--oxblood)]">
            {project.metric}
          </p>
        )}

        <div className="mt-7 flex max-w-xl flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="border border-[var(--ink)] bg-[var(--paper-warm)] px-3 py-2 font-sans text-[0.62rem] font-black uppercase tracking-[0.16em]">
              {tech}
            </span>
          ))}
        </div>

        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="ribbon-link mt-8">
            View project <ArrowUpRight size={16} />
          </a>
        )}
      </div>

      <motion.div className={`${index % 2 === 1 ? "lg:order-1" : ""} relative`} style={{ y: imageY }}>
        <figure className="browser-window text-[var(--ink)]">
          <img
            src={media}
            alt={`${project.title} archival preview`}
            className={`aspect-[16/10] w-full grayscale-[0.15] contrast-[1.08] ${project.mediaFit === "contain" ? "object-contain bg-[var(--charcoal)] p-6" : "object-cover"}`}
          />
        </figure>

        {project.gallery && (
          <div className="mt-4 grid grid-cols-3 gap-3 md:absolute md:-bottom-8 md:right-4 md:mt-0 md:w-[54%]">
            {project.gallery.map((image, imageIndex) => (
              <figure
                key={image}
                className="border-2 border-[var(--ink)] bg-[var(--paper)] p-1 shadow-[0.45rem_0.45rem_0_rgba(23,23,23,0.14)]"
                style={{ rotate: `${imageIndex % 2 === 0 ? -2 : 2}deg` }}
              >
                <img
                  src={image}
                  alt={`${project.title} evidence ${imageIndex + 1}`}
                  className={`aspect-[4/3] w-full ${project.mediaFit === "contain" ? "object-contain bg-[var(--charcoal)] p-1" : "object-cover"}`}
                />
              </figure>
            ))}
          </div>
        )}
      </motion.div>
    </motion.article>
  );
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" ref={ref} className="estate-section">
      <div className="estate-shell">
        <motion.div
          className="ticker-rule mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          <span>Examples</span>
          <span>Selected works uncovered from the archive.</span>
        </motion.div>

        <motion.div
          className="mb-4 grid gap-8 lg:grid-cols-[1.1fr_0.7fr]"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.staggerContainer}
        >
          <motion.h2 variants={ANIMATION_VARIANTS.fadeInUp} className="poster-type text-[clamp(4.5rem,12vw,13rem)]">
            Selected works uncovered from the archive.
          </motion.h2>
          <motion.p variants={ANIMATION_VARIANTS.fadeInUp} className="self-end text-xl leading-9 text-[var(--ink-soft)]">
            Each project is framed like a document laid onto a long table: annotated, slightly imperfect, and meant to be inspected rather than skimmed.
          </motion.p>
        </motion.div>

        <div>
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
