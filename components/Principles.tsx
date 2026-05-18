"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PRINCIPLES } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

export function Principles() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="px-4 py-20 bg-[#161410]">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-xs tracking-[0.3em] text-[#C9A84C] uppercase mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          Principles
        </motion.p>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {PRINCIPLES.map((item) => (
            <motion.blockquote
              key={item.quote}
              variants={ANIMATION_VARIANTS.staggerItem}
              className="border border-[#2A2520] bg-[#0E0D0B] p-8"
            >
              <p className="font-display text-3xl md:text-4xl leading-tight text-[#F2EBD9]">
                "{item.quote}"
              </p>
              <footer className="mt-6 text-xs tracking-[0.24em] uppercase text-[#7A7060]">
                {item.author}
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
