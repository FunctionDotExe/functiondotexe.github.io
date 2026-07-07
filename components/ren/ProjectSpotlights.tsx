"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PROJECTS, type Project } from "@/lib/constants";
import { ChapterIntro, RenCta, StatusPill, fadeUp, stagger } from "./Primitives";

const fallbackImages: Record<string, string> = {
  "AI Object Detection": "/media/lab-texture.jpg",
};

function ProjectStage({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], [58, -58]);
  const copyY = useTransform(scrollYProgress, [0, 1], [22, -28]);
  const image = project.image ?? fallbackImages[project.title] ?? "/media/lab-texture.jpg";
  const reverse = project.layout === "left";

  return (
    <motion.article
      ref={ref}
      className="grid min-h-[92vh] gap-10 border-t border-ink/12 py-16 lg:grid-cols-[0.72fr_1fr] lg:items-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      variants={stagger}
    >
      <motion.div className={`${reverse ? "lg:order-2" : ""}`} style={{ y: copyY }} variants={fadeUp}>
        <p className="ren-eyebrow text-oxblood">{project.kicker}</p>
        <h3 className="ren-display mt-5 max-w-[9ch] text-[clamp(4rem,9vw,9.5rem)]">
          {project.shortTitle ?? project.title}
        </h3>
        <p className="ren-body mt-8 text-ink-soft">{project.narrative ?? project.description}</p>
        {project.impact && <p className="mt-7 border-l border-gold pl-5 text-lg italic leading-8 text-oxblood">{project.impact}</p>}
        <div className="mt-8 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="border border-ink/14 bg-paper-warm px-3 py-2 font-sans text-[0.62rem] font-black uppercase tracking-[0.16em]">
              {tech}
            </span>
          ))}
        </div>
        {project.link && <RenCta href={project.link} external>Open project</RenCta>}
      </motion.div>

      <motion.div className={`${reverse ? "lg:order-1" : ""} relative`} style={{ y: mediaY }} variants={fadeUp}>
        <div className={`ren-artifact ren-artifact-${project.accent ?? "gold"}`}>
          <div className="flex items-center justify-between border-b border-current/14 p-4">
            <StatusPill>{project.artifactLabel ?? "Project artifact"}</StatusPill>
            <span className="font-sans text-[0.62rem] font-black uppercase tracking-[0.18em] text-current/52">
              Index {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="p-4">
            <Image
              src={image}
              alt={`${project.title} preview`}
              width={1200}
              height={760}
              className={`aspect-[16/10] w-full ${project.mediaFit === "contain" ? "object-contain bg-charcoal p-6" : "object-cover"}`}
            />
          </div>
        </div>

        {project.gallery && (
          <div className="mt-3 grid grid-cols-3 gap-3 md:absolute md:-bottom-8 md:right-5 md:mt-0 md:w-[52%]">
            {project.gallery.map((imagePath, imageIndex) => (
              <figure key={imagePath} className="border border-ink/14 bg-paper p-2 shadow-[0_1rem_2.2rem_rgba(0,0,0,0.16)]">
                <Image
                  src={imagePath}
                  alt={`${project.title} supporting view ${imageIndex + 1}`}
                  width={360}
                  height={240}
                  className={`aspect-[4/3] w-full ${project.mediaFit === "contain" ? "object-contain bg-charcoal p-1" : "object-cover"}`}
                />
              </figure>
            ))}
          </div>
        )}
      </motion.div>
    </motion.article>
  );
}

export function ProjectSpotlights() {
  return (
    <section id="work" className="ren-section bg-paper text-ink">
      <div className="ren-shell">
        <ChapterIntro
          eyebrow="Chapter 03 / Cinematic work"
          title="Projects presented as working instruments."
          body="Screenshots, metrics, and implementation details become evidence. Each project gets a spotlight because the craft is in the system behind the surface."
        />
        <div className="mt-8">
          {PROJECTS.map((project, index) => (
            <ProjectStage key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
