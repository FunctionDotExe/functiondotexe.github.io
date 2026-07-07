"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, ExternalLink, FileText } from "lucide-react";
import { CERTIFICATES, RESUME } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

export function Proof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="resume" ref={ref} className="estate-section">
      <div className="estate-shell">
        <motion.div
          className="ticker-rule mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          <span>Chapter V / Documents</span>
          <span>Proofs, papers, and sealed evidence.</span>
        </motion.div>

        <motion.div
          className="grid gap-6 lg:grid-cols-[1fr_0.9fr]"
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.article variants={ANIMATION_VARIANTS.staggerItem} className="retro-frame bg-[var(--paper-warm)] p-4 md:p-6">
            <div className="mb-5 flex flex-col gap-4 border-b-2 border-[var(--ink)] pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="stamp mb-4">Curriculum vitae</p>
                <h3 className="poster-type text-6xl">Resume</h3>
              </div>
              <a href={RESUME.pdf} target="_blank" rel="noopener noreferrer" className="ribbon-link">
                Open PDF <FileText size={17} />
              </a>
            </div>

            <div className="h-[32rem] overflow-hidden border-2 border-[var(--ink)] bg-[var(--paper-deep)] md:h-[44rem]">
              <iframe title="Ruben Maxwell resume PDF" src={`${RESUME.pdf}#toolbar=0&navpanes=0`} className="h-full w-full" />
            </div>
          </motion.article>

          <div className="grid gap-6">
            <motion.article variants={ANIMATION_VARIANTS.staggerItem} className="browser-window text-[var(--ink)]">
              <div className="p-5">
                <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-[var(--ink)] pb-5">
                  <div>
                    <p className="stamp mb-4">Moving plate</p>
                    <h3 className="poster-type text-5xl">Project walkthrough</h3>
                  </div>
                  <a href={RESUME.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Open video on YouTube">
                    <ExternalLink size={24} />
                  </a>
                </div>

                <div className="aspect-video overflow-hidden border-2 border-[var(--ink)] bg-[var(--charcoal)]">
                  <iframe
                    title="Project video"
                    src={RESUME.youtubeEmbed}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
            </motion.article>

            <motion.div variants={ANIMATION_VARIANTS.staggerContainer} className="grid gap-4">
              {CERTIFICATES.map((certificate) => (
                <motion.figure key={certificate.title} variants={ANIMATION_VARIANTS.staggerItem} className="grid grid-cols-[7rem_1fr] overflow-hidden border-2 border-[var(--ink)] bg-[var(--paper)]">
                  <img src={certificate.image} alt={`${certificate.title} certificate`} className="h-full min-h-36 w-full object-cover grayscale contrast-[1.08]" />
                  <figcaption className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-[var(--oxblood)]">
                      <Award size={16} />
                      <span className="font-sans text-[0.62rem] font-black uppercase tracking-[0.2em]">Certificate</span>
                    </div>
                    <p className="font-sans text-2xl font-black uppercase leading-7 tracking-[-0.03em]">{certificate.title}</p>
                    <p className="mt-2 text-sm text-[var(--ink-soft)]">{certificate.issuer}</p>
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
