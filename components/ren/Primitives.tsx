"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

const easeLuxury = [0.19, 1, 0.22, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeLuxury } },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

type ChapterIntroProps = {
  eyebrow: string;
  title: string;
  body?: string;
  dark?: boolean;
};

export function ChapterIntro({ eyebrow, title, body, dark = false }: ChapterIntroProps) {
  return (
    <motion.div
      className="ren-chapter"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      variants={stagger}
    >
      <motion.p variants={fadeUp} className={`ren-eyebrow ${dark ? "text-gold-light" : "text-oxblood"}`}>
        {eyebrow}
      </motion.p>
      <motion.h2 variants={fadeUp} className="ren-display max-w-[12ch] text-[clamp(4rem,10vw,10.5rem)]">
        {title}
      </motion.h2>
      {body && (
        <motion.p variants={fadeUp} className={`ren-body mt-7 max-w-2xl ${dark ? "text-paper/70" : "text-ink-soft"}`}>
          {body}
        </motion.p>
      )}
    </motion.div>
  );
}

type OsPanelProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  tone?: "light" | "dark" | "gold";
};

export function OsPanel({ children, tone = "light", className = "", ...props }: OsPanelProps) {
  const toneClass =
    tone === "dark"
      ? "border-paper/18 bg-paper/[0.055] text-paper"
      : tone === "gold"
        ? "border-gold/40 bg-gold/10 text-paper"
        : "border-ink/14 bg-paper-warm/78 text-ink";

  return (
    <motion.div
      className={`ren-panel ${toneClass} ${className}`}
      variants={fadeUp}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type CtaProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  dark?: boolean;
};

export function RenCta({ href, children, external = false, dark = false }: CtaProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`ren-cta ${dark ? "ren-cta-dark" : ""}`}
    >
      <span>{children}</span>
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}

export function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-current px-3 py-1 font-sans text-[0.62rem] font-black uppercase tracking-[0.18em]">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
