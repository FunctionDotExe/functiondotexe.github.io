"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ArchivalCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  rotate?: number;
  corner?: "tl" | "tr" | "bl" | "br";
}

export function ArchivalCard({
  children,
  className = "",
  delay = 0,
  rotate = 0,
  corner = "tr",
}: ArchivalCardProps) {
  const cornerClips = {
    tl: "polygon(0 1.5rem, 1.5rem 0, 100% 0, 100% 100%, 0 100%)",
    tr: "polygon(0 0, calc(100% - 1.5rem) 0, 100% 1.5rem, 100% 100%, 0 100%)",
    bl: "polygon(0 0, 100% 0, 100% 100%, 1.5rem 100%, 0 calc(100% - 1.5rem))",
    br: "polygon(0 0, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%)",
  };

  return (
    <motion.div
      className={`archive-panel relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
      viewport={{ once: true, margin: "-100px" }}
      style={{
        clipPath: cornerClips[corner],
        transform: `rotate(${rotate}deg)`,
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
      }}
    >
      {/* Aged paper effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/5 via-transparent to-orange-200/3" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Edge fold effect */}
      <div
        className="absolute top-0 right-0 w-0 h-0 border-l-[1.5rem] border-b-[1.5rem] border-l-transparent border-b-amber-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ pointerEvents: "none" }}
      />
    </motion.div>
  );
}
