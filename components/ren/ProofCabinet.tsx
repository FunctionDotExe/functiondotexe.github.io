"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { CERTIFICATES, RESUME, SITE_ASSETS } from "@/lib/constants";
import { ChapterIntro, RenCta, fadeUp, stagger } from "./Primitives";

export function ProofCabinet() {
  return (
    <section id="proof" className="ren-section relative overflow-hidden">
      <Image src={SITE_ASSETS.proofBackdrop} alt="" fill sizes="100vw" className="object-cover opacity-[0.22]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,10,0.96),rgba(5,8,10,0.78),rgba(5,8,10,0.92))]" />
      <div className="ren-shell relative z-10">
        <ChapterIntro
          eyebrow="Chapter 05 / Proof cabinet"
          title="Documents, plates, and credentials."
          body="The resume, walkthrough, and certificates stay close to the work: evidence, not decoration."
        />

        <motion.div
          className="mt-14 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
        >
          <motion.article variants={fadeUp} className="ren-panel p-4 md:p-6">
            <div className="mb-5 flex flex-col gap-4 border-b border-paper/12 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="ren-eyebrow text-gold-light">Curriculum vitae</p>
                <h3 className="mt-3 font-display text-6xl font-semibold leading-none">Resume</h3>
              </div>
              <RenCta href={RESUME.pdf} external>
                Open PDF
              </RenCta>
            </div>
            <div className="h-[32rem] overflow-hidden border border-paper/12 bg-paper/[0.06] md:h-[44rem]">
              <iframe
                title="Ruben Maxwell resume PDF"
                src={`${RESUME.pdf}#toolbar=0&navpanes=0`}
                loading="lazy"
                className="h-full w-full"
              />
            </div>
          </motion.article>

          <div className="grid gap-5">
            <motion.article variants={fadeUp} className="ren-panel p-5">
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-paper/12 pb-5">
                <div>
                  <p className="ren-eyebrow text-gold-light">Moving plate</p>
                  <h3 className="mt-3 font-display text-5xl font-semibold leading-none">Project walkthrough</h3>
                </div>
                <a
                  href={RESUME.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open project walkthrough on YouTube"
                  className="text-gold-light transition-transform duration-500 ease-luxury hover:-translate-y-0.5 hover:text-paper"
                >
                  <ExternalLink size={22} />
                </a>
              </div>
              <div className="aspect-video overflow-hidden border border-paper/12 bg-charcoal">
                <iframe
                  title="Project video"
                  src={RESUME.youtubeEmbed}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </motion.article>

            <motion.div variants={stagger} className="grid gap-4">
              {CERTIFICATES.map((certificate) => (
                <motion.figure
                  key={certificate.title}
                  variants={fadeUp}
                  className="group grid grid-cols-[7rem_1fr] overflow-hidden border border-paper/12 bg-paper/[0.05] backdrop-blur-md transition-all duration-500 ease-luxury hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_1.5rem_3.5rem_rgba(0,0,0,0.5)]"
                >
                  <Image
                    src={certificate.image}
                    alt={`${certificate.title} certificate`}
                    width={220}
                    height={160}
                    className="h-full min-h-36 w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                  />
                  <figcaption className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-gold-light">
                      <Award size={16} aria-hidden="true" />
                      <span className="font-sans text-[0.62rem] font-black uppercase tracking-[0.2em]">Certificate</span>
                    </div>
                    <p className="font-display text-3xl font-semibold leading-none">{certificate.title}</p>
                    <p className="mt-2 text-sm text-paper/56">{certificate.issuer}</p>
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
