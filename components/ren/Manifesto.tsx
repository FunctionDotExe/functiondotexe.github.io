"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PERSONAL } from "@/lib/constants";
import { ChapterIntro, OsPanel, SplitReveal, fadeUp, stagger } from "./Primitives";

export function Manifesto() {
  return (
    <section id="manifesto" className="ren-section">
      <div className="ren-shell relative z-10">
        <ChapterIntro
          eyebrow="Chapter 01 / Manifesto"
          title="The work is a system before it is a screen."
          body={PERSONAL.manifesto}
        />

        <motion.div
          className="mt-14 grid gap-4 lg:grid-cols-[1fr_0.72fr_0.72fr]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
        >
          <OsPanel className="min-h-[24rem] p-7">
            <p className="ren-eyebrow text-gold-light">Operating belief</p>
            <SplitReveal
              as="p"
              text="Tools should feel composed, not merely assembled."
              className="mt-8 font-display text-[clamp(2.6rem,5vw,5.4rem)] font-semibold leading-[0.95]"
            />
          </OsPanel>

          <OsPanel className="p-7">
            <p className="ren-eyebrow text-gold-light">Current state</p>
            <p className="mt-8 text-lg leading-8 text-paper/68">{PERSONAL.availabilityLine}</p>
          </OsPanel>

          <motion.figure
            variants={fadeUp}
            className="ren-panel group overflow-hidden shadow-[0_0_3rem_rgba(185,150,84,0.12)]"
          >
            <Image
              src="/media/portrait.jpg"
              alt={`${PERSONAL.firstName} ${PERSONAL.lastName} portrait`}
              width={720}
              height={900}
              className="aspect-[4/5] h-full w-full object-cover object-[center_32%] grayscale contrast-[1.08] transition-all duration-700 ease-luxury group-hover:scale-[1.02] group-hover:grayscale-0"
            />
          </motion.figure>
        </motion.div>
      </div>
    </section>
  );
}
