"use client";

import { ReactNode, useRef, useState } from "react";
import { motion } from "framer-motion";

interface InkSpreadButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export function InkSpreadButton({ 
  children, 
  onClick, 
  className = "",
  variant = "primary"
}: InkSpreadButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const variants = {
    primary: "border-ink-soft/38 bg-paper/38 text-ink hover:border-oxblood/52 hover:text-oxblood",
    secondary: "border-gold/38 bg-transparent text-gold hover:border-gold-light/72 hover:text-gold-light"
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`estate-button group relative ${variants[variant]} ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Ink spread effect */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(127, 17, 21, 0.12) 0%, transparent 70%)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 2 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
        />
      )}

      {/* Inner ink diffusion */}
      <motion.div
        className="pointer-events-none absolute inset: 0 opacity-0"
        animate={isHovered ? { 
          boxShadow: [
            "inset 0 0 0 1px rgba(127, 17, 21, 0)",
            "inset 0 0 10px 2px rgba(127, 17, 21, 0.08)",
            "inset 0 0 20px 4px rgba(127, 17, 21, 0.04)"
          ]
        } : {}}
        transition={{ duration: 0.8 }}
      />

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
