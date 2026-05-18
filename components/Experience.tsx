"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EXPERIENCE } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

export function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" ref={ref} className="py-32 px-4 bg-[#0E0D0B]">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-xs tracking-[0.3em] text-[#C9A84C] uppercase mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          Experience
        </motion.p>

        <motion.h2
          className="font-display text-5xl md:text-6xl text-[#F2EBD9] mb-16 leading-tight max-w-none"
          initial={{ opacity: 0 }}
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          Recent Experience
        </motion.h2>

        {/* Timeline */}
        <div className="relative border-l border-[#2A2520] pl-6 md:pl-10">
          {/* Vertical line */}
          <motion.div
            className="absolute left-0 top-0 w-px bg-gradient-to-b from-[#C9A84C] to-[#8A6E2F]"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              top: 0,
              bottom: 0,
              height: "100%",
              originY: 0,
            }}
          />

          {/* Entries */}
          <div className="space-y-12">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={i}
                className="relative grid md:grid-cols-[12rem_1fr] gap-4 md:gap-10"
                initial={{ opacity: 0 }}
                animate={isInView ? "visible" : "hidden"}
                variants={ANIMATION_VARIANTS.staggerItem}
              >
                {/* Dot */}
                <motion.div
                  className="absolute -left-[2.05rem] md:-left-[2.55rem] top-1"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="w-4 h-4 bg-[#C9A84C] rounded-full border-2 border-[#0E0D0B]" />
                </motion.div>

                {/* Meta */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <p className="text-sm text-[#7A7060] mb-2">{exp.dates}</p>
                    <p className="text-xs tracking-widest text-[#C9A84C] uppercase mb-4">
                      {exp.type}
                    </p>
                  </motion.div>
                </div>

                {/* Content */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h3 className="font-display text-2xl text-[#F2EBD9] mb-1">
                      {exp.company}
                    </h3>
                    <p className="text-lg text-[#C9A84C] mb-2">{exp.role}</p>
                    <p className="text-sm text-[#7A7060] mb-4">{exp.location}</p>
                    <ul className="space-y-2 list-disc pl-5">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="text-sm text-[#F2EBD9] opacity-80 leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
