"use client";

import { useScroll, motion } from "framer-motion";
import { useRef } from "react";

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      className="fixed left-0 right-0 top-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
