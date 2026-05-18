"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SKILLS } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

export function Expertise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-4 bg-[#161410] relative">
      <div className="max-w-7xl mx-auto">
        <motion.p
          className="text-xs tracking-[0.3em] text-[#C9A84C] uppercase mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          Expertise
        </motion.p>

        <motion.h2
          className="font-display text-5xl md:text-6xl text-[#F2EBD9] mb-20 leading-tight max-w-none"
          initial={{ opacity: 0 }}
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          Core Skills
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-12"
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {SKILLS.map((skill, i) => (
            <motion.div
              key={i}
              variants={ANIMATION_VARIANTS.staggerItem}
              className="group p-8 border border-[#2A2520] bg-[#0E0D0B] hover:bg-[#1A1814] transition-all duration-300 relative overflow-hidden"
            >
              {/* Hover border effect */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-[#C9A84C]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0 }}
              />

              <h3 className="font-display text-2xl text-[#C9A84C] mb-4">
                {skill.category}
              </h3>

              <p className="text-sm text-[#7A7060] mb-6 leading-relaxed">
                {skill.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {skill.tools.map((tool, j) => (
                  <span
                    key={j}
                    className="text-xs px-3 py-1 bg-[#2A2520] text-[#F2EBD9] rounded-full"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
