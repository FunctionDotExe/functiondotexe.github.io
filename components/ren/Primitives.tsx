"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

export const easeLuxury = [0.19, 1, 0.22, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeLuxury } },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

type SplitRevealProps = {
  text: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  highlightWords?: string[];
  delay?: number;
};

export function SplitReveal({ text, as = "h2", className = "", highlightWords = [], delay = 0 }: SplitRevealProps) {
  const Tag = as === "h1" ? motion.h1 : as === "p" ? motion.p : motion.h2;
  const words = text.split(" ");

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-90px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.055, delayChildren: delay } },
      }}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block will-change-transform ${
                highlightWords.includes(word.replace(/[.,]/g, "")) ? "ren-gradient-word" : ""
              }`}
              variants={{
                hidden: { y: "115%" },
                visible: { y: 0, transition: { duration: 0.9, ease: easeLuxury } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
};

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <motion.div ref={ref} onMouseMove={handleMove} variants={fadeUp} className={`ren-panel group ${className}`}>
      <div
        aria-hidden="true"
        className="ren-spotlight-overlay pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(28rem circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(217, 193, 132, 0.1), transparent 55%)",
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

type ShineBorderProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function ShineBorder({ children, className = "", contentClassName = "" }: ShineBorderProps) {
  return (
    <motion.div variants={fadeUp} className={`ren-shine ${className}`}>
      <div className={`relative h-full ${contentClassName}`}>{children}</div>
    </motion.div>
  );
}

type CountUpProps = {
  value: number;
  suffix?: string;
  className?: string;
};

export function CountUp({ value, suffix = "+", className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 1.8, ease: easeLuxury });
    return () => controls.stop();
  }, [inView, reduceMotion, count, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const track = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="ren-eyebrow flex items-center whitespace-nowrap">
          <span className="px-7">{item}</span>
          <span aria-hidden="true" className="text-gold/60">
            ◆
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-marquee">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}

type ChapterIntroProps = {
  eyebrow: string;
  title: string;
  body?: string;
  dark?: boolean; // kept for call-site compatibility; the stage is always dark now
};

export function ChapterIntro({ eyebrow, title, body }: ChapterIntroProps) {
  return (
    <motion.div
      className="ren-chapter"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      variants={stagger}
    >
      <motion.p variants={fadeUp} className="ren-eyebrow text-gold-light">
        {eyebrow}
      </motion.p>
      <SplitReveal text={title} className="ren-display mt-6 max-w-[13ch] text-[clamp(3.4rem,8.5vw,8.5rem)]" />
      {body && (
        <motion.p variants={fadeUp} className="ren-body mt-7 max-w-2xl text-paper/65">
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
  const toneClass = tone === "gold" ? "border-gold/35 bg-gold/[0.08] text-paper" : "text-paper";

  return (
    <motion.div className={`ren-panel ${toneClass} ${className}`} variants={fadeUp} {...props}>
      {children}
    </motion.div>
  );
}

type CtaProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  dark?: boolean; // kept for call-site compatibility; the CTA is always dark glass now
};

export function RenCta({ href, children, external = false }: CtaProps) {
  const x = useSpring(0, { stiffness: 260, damping: 22 });
  const y = useSpring(0, { stiffness: 260, damping: 22 });

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 10);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 8);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="ren-cta"
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span>{children}</span>
      <ArrowUpRight size={17} aria-hidden="true" />
    </motion.a>
  );
}

export function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-paper/25 bg-paper/[0.04] px-3 py-1 font-sans text-[0.62rem] font-black uppercase tracking-[0.18em] backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-gold-light" />
      {children}
    </span>
  );
}
