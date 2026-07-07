"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PRINCIPLES } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

export function Principles() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="estate-section estate-dark">
      <div className="estate-shell">
        <motion.div
          className="ticker-rule mb-12 text-[var(--paper)]"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          <span>House maxims</span>
          <span>Two lines kept near the desk.</span>
        </motion.div>

        <motion.div
          className="grid gap-5 md:grid-cols-2"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.staggerContainer}
        >
          {PRINCIPLES.map((item, index) => (
            <motion.blockquote
              key={item.quote}
              variants={ANIMATION_VARIANTS.staggerItem}
              className="retro-frame min-h-[24rem] bg-[#090b0c] p-7 text-[var(--paper)]"
            >
              <span className="font-sans text-[0.7rem] font-black uppercase tracking-[0.24em] text-[var(--gold-light)]">
                Maxim {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-12 font-display text-[clamp(3rem,6vw,6.4rem)] leading-[0.86]">"{item.quote}"</p>
              <footer className="mt-8 font-sans text-[0.7rem] font-black uppercase tracking-[0.24em] text-[rgba(244,236,217,0.68)]">
                {item.author}
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
