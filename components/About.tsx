"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PERSONAL } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const details = [
    { label: "Residence", value: PERSONAL.city },
    { label: "Appointment", value: "Software Engineer, Fourth Dimension (4D)" },
    { label: "Studies", value: "University of Toronto, Computer Science" },
    { label: "Pursuits", value: "Interfaces, AI systems, quantum research" },
  ];

  return (
    <section id="about" ref={ref} className="estate-section">
      <div className="estate-shell">
        <motion.div
          className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.staggerContainer}
        >
          <motion.div variants={ANIMATION_VARIANTS.fadeInUp} className="retro-frame bg-[var(--paper-warm)] p-6 md:p-8">
            <p className="stamp mb-8">Chapter I / The maker</p>
            <h2 className="poster-type text-[clamp(3.5rem,8vw,8rem)]">
              A quiet practice of turning rough ideas into lasting systems.
            </h2>
          </motion.div>

          <motion.div variants={ANIMATION_VARIANTS.staggerItem} className="grid gap-6">
            <p className="border-y-2 border-[var(--ink)] py-6 text-2xl leading-10 text-[var(--ink-soft)]">
              {PERSONAL.bioShort} The work is practical, but the standard is editorial: clear hierarchy, careful interaction, and the kind of polish that makes tools feel settled in the hand.
            </p>

            <div className="grid gap-px border-2 border-[var(--ink)] bg-[var(--ink)] sm:grid-cols-2">
              {details.map((item) => (
                <div key={item.label} className="bg-[var(--paper)] p-5">
                  <p className="font-sans text-[0.62rem] font-black uppercase tracking-[0.22em] text-[var(--oxblood)]">
                    {item.label}
                  </p>
                  <p className="mt-3 font-sans text-xl font-black uppercase leading-6 tracking-[-0.02em] text-[var(--ink)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
