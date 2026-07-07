"use client";

import { motion } from "framer-motion";
import { PRINCIPLES, SKILLS, STATS } from "@/lib/constants";
import { ChapterIntro, OsPanel, fadeUp, stagger } from "./Primitives";

export function SignalGrid() {
  return (
    <section id="signals" className="ren-section bg-charcoal text-paper">
      <div className="ren-shell">
        <ChapterIntro
          dark
          eyebrow="Chapter 02 / Signal grid"
          title="Capabilities arranged like instruments."
          body="The practice spans interface engineering, data systems, applied AI, robotics, and quantum experiments. Each discipline is treated as a precise instrument, not a buzzword."
        />

        <motion.div
          className="mt-14 grid gap-px overflow-hidden border border-paper/14 bg-paper/14 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
        >
          {STATS.map((stat, index) => (
            <motion.div key={stat.label} variants={fadeUp} className="bg-charcoal p-6">
              <p className="ren-eyebrow text-gold-light">Signal {String(index + 1).padStart(2, "0")}</p>
              <p className="ren-display mt-10 text-7xl text-paper">{stat.value}+</p>
              <p className="mt-4 font-sans text-[0.68rem] font-black uppercase tracking-[0.22em] text-paper/54">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
        >
          {SKILLS.map((skill, index) => (
            <OsPanel key={skill.category} tone="dark" className="min-h-[20rem] p-6">
              <p className="ren-eyebrow text-gold-light">Instrument {String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-6 font-display text-4xl leading-none">{skill.category}</h3>
              <p className="mt-5 text-base leading-8 text-paper/64">{skill.description}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {skill.tools.map((tool) => (
                  <span key={tool} className="border border-paper/14 bg-paper/[0.06] px-2.5 py-1.5 font-sans text-[0.58rem] font-black uppercase tracking-[0.14em] text-paper/76">
                    {tool}
                  </span>
                ))}
              </div>
            </OsPanel>
          ))}
        </motion.div>

        <motion.div
          className="mt-4 grid gap-4 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
        >
          {PRINCIPLES.map((principle, index) => (
            <OsPanel key={principle.quote} tone="gold" className="p-7">
              <p className="ren-eyebrow text-gold-light">Desk maxim {String(index + 1).padStart(2, "0")}</p>
              <blockquote className="mt-8 font-display text-[clamp(2.8rem,6vw,6.6rem)] leading-[0.9]">
                "{principle.quote}"
              </blockquote>
              <p className="mt-6 font-sans text-[0.68rem] font-black uppercase tracking-[0.22em] text-paper/58">
                {principle.author}
              </p>
            </OsPanel>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
