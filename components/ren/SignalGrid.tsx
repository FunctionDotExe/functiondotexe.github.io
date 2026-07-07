"use client";

import { motion } from "framer-motion";
import { PRINCIPLES, SKILLS, STATS } from "@/lib/constants";
import { ChapterIntro, CountUp, ShineBorder, SpotlightCard, fadeUp, stagger } from "./Primitives";

export function SignalGrid() {
  return (
    <section id="signals" className="ren-section">
      <div className="ren-shell">
        <ChapterIntro
          eyebrow="Chapter 02 / Signal grid"
          title="Capabilities arranged like instruments."
          body="The practice spans interface engineering, data systems, applied AI, robotics, and quantum experiments. Each discipline is treated as a precise instrument, not a buzzword."
        />

        <motion.div
          className="mt-14 grid gap-px overflow-hidden border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
        >
          {STATS.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="bg-charcoal/85 p-6 backdrop-blur-sm">
              <CountUp value={stat.value} className="ren-display block text-7xl text-gold-light" />
              <p className="mt-4 font-sans text-[0.68rem] font-black uppercase tracking-[0.22em] text-paper/54">
                {stat.label}
              </p>
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
          {SKILLS.map((skill) => (
            <SpotlightCard key={skill.category} className="min-h-[19rem] p-6">
              <p className="ren-eyebrow text-gold-light">Instrument</p>
              <h3 className="mt-6 font-display text-4xl font-semibold leading-none">{skill.category}</h3>
              <p className="mt-5 text-base leading-8 text-paper/64">{skill.description}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {skill.tools.map((tool) => (
                  <span
                    key={tool}
                    className="border border-paper/12 bg-paper/[0.05] px-2.5 py-1.5 font-sans text-[0.58rem] font-black uppercase tracking-[0.14em] text-paper/75 transition-colors duration-500 hover:border-gold/40 hover:text-gold-light"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </motion.div>

        <motion.div
          className="mt-4 grid gap-4 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
        >
          {PRINCIPLES.map((principle) => (
            <ShineBorder key={principle.quote} contentClassName="bg-charcoal/70 p-7 backdrop-blur-xl md:p-9">
              <p className="ren-eyebrow text-gold-light">Desk maxim</p>
              <blockquote className="mt-8 font-display text-[clamp(2.4rem,4.6vw,4.8rem)] font-semibold leading-[0.95]">
                &ldquo;{principle.quote}&rdquo;
              </blockquote>
              <p className="mt-6 font-sans text-[0.68rem] font-black uppercase tracking-[0.22em] text-paper/58">
                {principle.author}
              </p>
            </ShineBorder>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
