"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SKILLS } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

export function Expertise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="estate-section">
      <div className="estate-shell">
        <motion.div
          className="mb-12 grid gap-8 lg:grid-cols-[0.8fr_1fr]"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.staggerContainer}
        >
          <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
            <p className="stamp mb-7">Chapter II / Disciplines</p>
            <h2 className="poster-type text-[clamp(4rem,10vw,10rem)]">Cabinet of instruments.</h2>
          </motion.div>
          <motion.p variants={ANIMATION_VARIANTS.fadeInUp} className="self-end border-l-4 border-[var(--ink)] pl-6 text-xl leading-9 text-[var(--ink-soft)]">
            The craft moves across interface engineering, data systems, applied AI, robotics, and quantum experiments. Each discipline is treated like a tool with a history: useful, precise, and worth maintaining.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-px border-2 border-[var(--ink)] bg-[var(--ink)] md:grid-cols-2 xl:grid-cols-3"
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {SKILLS.map((skill, index) => (
            <motion.article key={skill.category} variants={ANIMATION_VARIANTS.staggerItem} className="min-h-[20rem] bg-[var(--paper)] p-6">
              <p className="font-sans text-[0.62rem] font-black uppercase tracking-[0.22em] text-[var(--oxblood)]">
                Instrument {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-5 font-sans text-3xl font-black uppercase leading-8 tracking-[-0.03em] text-[var(--ink)]">
                {skill.category}
              </h3>
              <p className="mt-5 text-base leading-8 text-[var(--ink-soft)]">{skill.description}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {skill.tools.map((tool) => (
                  <span key={tool} className="bg-[var(--ink)] px-2.5 py-1.5 font-sans text-[0.58rem] font-black uppercase tracking-[0.14em] text-[var(--paper)]">
                    {tool}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
