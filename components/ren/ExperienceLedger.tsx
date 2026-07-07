"use client";

import { motion } from "framer-motion";
import { EXPERIENCE } from "@/lib/constants";
import { ChapterIntro, fadeUp, stagger } from "./Primitives";

export function ExperienceLedger() {
  return (
    <section id="timeline" className="ren-section bg-charcoal text-paper">
      <div className="ren-shell">
        <ChapterIntro
          dark
          eyebrow="Chapter 04 / Timeline"
          title="Appointments logged as field notes."
          body="A practical chronology of building, researching, teaching, and shipping across software, AI, quantum workflows, robotics, and education."
        />

        <motion.div
          className="mt-14 grid gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
        >
          {EXPERIENCE.map((item, index) => (
            <motion.article
              key={`${item.company}-${item.dates}`}
              variants={fadeUp}
              className="ren-ledger-row"
            >
              <div>
                <p className="ren-display text-6xl text-gold-light">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-sans text-[0.62rem] font-black uppercase tracking-[0.18em] text-paper/44">{item.dates}</p>
              </div>

              <div>
                <p className="ren-eyebrow text-gold-light">{item.type}</p>
                <h3 className="mt-4 font-display text-4xl leading-none">{item.company}</h3>
                <p className="mt-3 text-lg italic text-gold-light">{item.role}</p>
                <p className="mt-2 font-sans text-[0.62rem] font-black uppercase tracking-[0.18em] text-paper/46">{item.location}</p>
              </div>

              <ul className="grid gap-3">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="border-l border-gold/38 pl-4 text-base leading-8 text-paper/72">
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
