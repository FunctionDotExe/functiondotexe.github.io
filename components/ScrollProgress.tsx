"use client";

import { useScroll, motion } from "framer-motion";
import { useRef } from "react";

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A84C] via-[#C9A84C] to-transparent origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
