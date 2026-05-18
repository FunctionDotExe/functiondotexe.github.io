"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PROJECTS } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";
import { ArrowUpRight } from "lucide-react";

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" ref={ref} className="py-32 px-4 bg-[#161410]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          <p className="text-xs tracking-[0.3em] text-[#C9A84C] uppercase mb-8">Projects</p>
          <h2 className="font-display text-5xl md:text-6xl text-[#F2EBD9] mb-20 leading-tight max-w-none">
            Selected Work
          </h2>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-12"
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {PROJECTS.map((project, i) => (
            <motion.div
              key={i}
              variants={ANIMATION_VARIANTS.staggerItem}
              className="group relative bg-[#0E0D0B] border border-[#2A2520] p-8 hover:border-[#C9A84C] transition-all duration-500 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />

              <div className="relative z-10">
                {(project.image || project.video) && (
                  <div className="mb-7 overflow-hidden border border-[#2A2520] bg-[#161410] aspect-[16/10]">
                    {project.video ? (
                      <video
                        src={project.video}
                        className="h-full w-full object-cover opacity-85 transition duration-700 group-hover:opacity-100"
                        muted
                        playsInline
                        controls
                      />
                    ) : (
                      <img
                        src={project.image}
                        alt={`${project.title} preview`}
                        className={`h-full w-full opacity-85 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100 ${
                          project.mediaFit === "contain" ? "object-contain p-3" : "object-cover"
                        }`}
                      />
                    )}
                  </div>
                )}

                {project.gallery && (
                  <div className="mb-7 grid grid-cols-3 gap-2">
                    {project.gallery.map((image, imageIndex) => (
                      <div
                        key={image}
                        className="aspect-[4/3] overflow-hidden border border-[#2A2520] bg-[#161410]"
                      >
                        <img
                          src={image}
                          alt={`${project.title} screenshot ${imageIndex + 1}`}
                          className={`h-full w-full opacity-75 transition duration-700 group-hover:opacity-100 ${
                            project.mediaFit === "contain" ? "object-contain p-2" : "object-cover"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-xs text-[#7A7060] tracking-widest uppercase mb-3">
                      {project.visual === "voronoi"
                        ? "Generative"
                        : project.visual === "wireframe"
                          ? "3D Visualization"
                          : "Interactive"}
                    </p>
                    <h3 className="font-display text-3xl text-[#F2EBD9] group-hover:text-[#C9A84C] transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  {project.link && (
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 45 }}
                      className="text-[#C9A84C]"
                    >
                      <ArrowUpRight size={24} />
                    </motion.a>
                  )}
                </div>

                {/* Description */}
                <p className="text-base text-[#F2EBD9] mb-6 opacity-90 leading-relaxed">
                  {project.description}
                </p>

                {project.metric && (
                  <p className="mb-6 border-l border-[#C9A84C] pl-4 text-sm font-semibold text-[#C9A84C]">
                    {project.metric}
                  </p>
                )}

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech, j) => (
                    <span
                      key={j}
                      className="text-xs px-3 py-1 bg-[#2A2520] text-[#C9A84C] rounded-full border border-[#8A6E2F]/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* View Project Button */}
                {project.link && (
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block text-sm text-[#C9A84C] underline hover:no-underline"
                    whileHover={{ x: 4 }}
                  >
                    View project
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
