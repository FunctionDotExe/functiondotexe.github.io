"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { STATS } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {isInView && (
        <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          {target}
        </motion.span>
      )}
    </motion.span>
  );
}

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-4 bg-[#0E0D0B]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {STATS.map((stat, i) => (
            <motion.div key={i} variants={ANIMATION_VARIANTS.staggerItem}>
              <motion.p
                className="font-display text-4xl md:text-5xl text-[#C9A84C] mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <Counter target={stat.value} />+
              </motion.p>
              <p className="text-sm md:text-base text-[#F2EBD9] uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
