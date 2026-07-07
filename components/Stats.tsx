"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { STATS } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span ref={ref} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : { opacity: 0 }}>
      {isInView && <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{target}</motion.span>}
    </motion.span>
  );
}

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="estate-section estate-dark py-16">
      <div className="estate-shell">
        <motion.div
          className="grid gap-px border-2 border-[var(--paper)] bg-[var(--paper)] sm:grid-cols-2 lg:grid-cols-4"
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {STATS.map((stat, index) => (
            <motion.div key={stat.label} variants={ANIMATION_VARIANTS.staggerItem} className="min-h-48 bg-[#080a0b] p-6">
              <p className="font-sans text-[0.62rem] font-black uppercase tracking-[0.22em] text-[var(--gold-light)]">
                Ledger {String(index + 1).padStart(2, "0")}
              </p>
              <p className="poster-type mt-8 text-8xl text-[var(--paper)]">
                <Counter target={stat.value} />+
              </p>
              <p className="mt-4 font-sans text-[0.7rem] font-black uppercase tracking-[0.22em] text-[rgba(244,236,217,0.68)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
