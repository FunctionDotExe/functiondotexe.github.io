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
    <section id="resume" ref={ref} className="py-32 px-4 bg-[#0E0D0B]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.fadeInUp}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-[#C9A84C] uppercase mb-8">
            Resume & Proof
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-[#F2EBD9] leading-tight max-w-none">
            Work you can inspect
          </h2>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10"
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.article
            variants={ANIMATION_VARIANTS.staggerItem}
            className="border border-[#2A2520] bg-[#161410] p-4 md:p-6"
          >
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs tracking-widest uppercase text-[#7A7060] mb-2">
                  Embedded PDF
                </p>
                <h3 className="font-display text-3xl text-[#F2EBD9]">Resume</h3>
              </div>
              <a
                href={RESUME.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#C9A84C] hover:text-[#F2EBD9]"
              >
                <FileText size={17} />
                Open PDF
              </a>
            </div>

            <div className="h-[32rem] overflow-hidden border border-[#2A2520] bg-[#0E0D0B] md:h-[44rem]">
              <iframe
                title="Ruben Maxwell resume PDF"
                src={`${RESUME.pdf}#toolbar=0&navpanes=0`}
                className="h-full w-full"
              />
            </div>
          </motion.article>

          <div className="space-y-10">
            <motion.article
              variants={ANIMATION_VARIANTS.staggerItem}
              className="border border-[#2A2520] bg-[#161410] p-4 md:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs tracking-widest uppercase text-[#7A7060] mb-2">
                    Video
                  </p>
                  <h3 className="font-display text-3xl text-[#F2EBD9]">
                    Project Walkthrough
                  </h3>
                </div>
                <a
                  href={RESUME.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9A84C] hover:text-[#F2EBD9]"
                  aria-label="Open video on YouTube"
                >
                  <ExternalLink size={20} />
                </a>
              </div>

              <div className="aspect-video overflow-hidden border border-[#2A2520] bg-[#0E0D0B]">
                <iframe
                  title="Project video"
                  src={RESUME.youtubeEmbed}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </motion.article>
          </div>
        </motion.div>

        <motion.div
          className="mt-10 grid md:grid-cols-3 gap-6"
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {CERTIFICATES.map((certificate) => (
            <motion.figure
              key={certificate.title}
              variants={ANIMATION_VARIANTS.staggerItem}
              className="group overflow-hidden border border-[#2A2520] bg-[#161410]"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#F2EBD9]">
                <img
                  src={certificate.image}
                  alt={`${certificate.title} certificate`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <figcaption className="p-5">
                <div className="mb-3 flex items-center gap-2 text-[#C9A84C]">
                  <Award size={16} />
                  <span className="text-xs uppercase tracking-widest">Certificate</span>
                </div>
                <p className="font-display text-2xl text-[#F2EBD9]">
                  {certificate.title}
                </p>
                <p className="mt-2 text-sm text-[#7A7060]">{certificate.issuer}</p>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
