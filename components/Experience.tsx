"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EXPERIENCE } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

export function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" ref={ref} className="estate-section estate-dark">
      <div className="estate-shell">
        <motion.div
          className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.staggerContainer}
        >
          <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
            <p className="stamp mb-7 text-[var(--paper)]">Chapter III / Journal</p>
            <h2 className="poster-type text-[clamp(4rem,10vw,10rem)] text-[var(--paper)]">Appointments and field notes.</h2>
          </motion.div>
          <motion.p variants={ANIMATION_VARIANTS.fadeInUp} className="self-end border-l-4 border-[var(--gold-light)] pl-6 text-xl leading-9 text-[rgba(244,236,217,0.76)]">
            A timeline written like an estate journal: dated, annotated, and concerned with useful work rather than spectacle.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-4"
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {EXPERIENCE.map((exp, index) => (
            <motion.article
              key={`${exp.company}-${exp.dates}`}
              variants={ANIMATION_VARIANTS.staggerItem}
              className="grid gap-5 border-2 border-[rgba(244,236,217,0.72)] bg-[rgba(244,236,217,0.045)] p-5 md:grid-cols-[7rem_0.72fr_1fr] md:p-6"
            >
              <div>
                <p className="poster-type text-6xl text-[var(--gold-light)]">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-sans text-[0.62rem] font-black uppercase tracking-[0.18em] text-[rgba(244,236,217,0.62)]">
                  {exp.dates}
                </p>
              </div>

              <div>
                <p className="font-sans text-[0.62rem] font-black uppercase tracking-[0.22em] text-[var(--gold-light)]">
                  {exp.type}
                </p>
                <h3 className="mt-4 font-sans text-3xl font-black uppercase leading-8 tracking-[-0.03em] text-[var(--paper)]">
                  {exp.company}
                </h3>
                <p className="mt-3 text-lg italic text-[var(--gold-light)]">{exp.role}</p>
                <p className="mt-2 font-sans text-[0.62rem] font-black uppercase tracking-[0.18em] text-[rgba(244,236,217,0.5)]">
                  {exp.location}
                </p>
              </div>

              <ul className="grid gap-3">
                {exp.bullets.map((bullet) => (
                  <li key={bullet} className="border-l-2 border-[rgba(214,189,131,0.48)] pl-4 text-base leading-8 text-[rgba(244,236,217,0.76)]">
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
