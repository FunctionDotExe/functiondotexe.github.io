"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Cpu, Sparkles } from "lucide-react";
import { useRef } from "react";
import { PERSONAL, SITE_ASSETS } from "@/lib/constants";
import { RenCta, StatusPill, fadeUp, stagger } from "./Primitives";

export function OpeningSystem() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -92]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 52]);

  return (
    <section ref={ref} className="ren-hero relative min-h-[132vh] overflow-hidden bg-charcoal text-paper">
      <motion.div className="absolute inset-0" style={{ y: artY }}>
        <Image
          src={SITE_ASSETS.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-72"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(214,189,131,0.18),transparent_28rem),linear-gradient(90deg,rgba(5,8,10,0.94)_0%,rgba(5,8,10,0.72)_42%,rgba(5,8,10,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,236,217,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(244,236,217,0.045)_1px,transparent_1px)] bg-[length:4.5rem_4.5rem]" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[92rem] items-center px-gutter pb-24 pt-28">
        <motion.div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end" initial="hidden" animate="visible" variants={stagger}>
          <motion.div style={{ y: titleY }}>
            <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-3">
              <StatusPill>RenAIssance OS</StatusPill>
              <StatusPill>{PERSONAL.city}</StatusPill>
              <StatusPill>Portfolio build 2026</StatusPill>
            </motion.div>

            <motion.p variants={fadeUp} className="ren-eyebrow text-gold-light">
              {PERSONAL.firstName} {PERSONAL.lastName} / Software systems and interface craft
            </motion.p>
            <motion.h1 variants={fadeUp} className="ren-display mt-5 max-w-[10ch] text-[clamp(5rem,13vw,15rem)]">
              Useful systems, illuminated.
            </motion.h1>
            <motion.p variants={fadeUp} className="ren-body mt-8 max-w-3xl text-paper/76">
              {PERSONAL.heroTagline}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <RenCta href="#work" dark>Enter the work</RenCta>
              <RenCta href="#manifesto" dark>Read the system</RenCta>
            </motion.div>
          </motion.div>

          <motion.aside className="ren-panel border-paper/14 bg-paper/[0.055] p-5 text-paper backdrop-blur-md" variants={fadeUp} style={{ y: panelY }}>
            <div className="flex items-center justify-between border-b border-paper/12 pb-4">
              <span className="font-sans text-[0.62rem] font-black uppercase tracking-[0.2em] text-gold-light">System signal</span>
              <Cpu size={18} />
            </div>
            <p className="mt-5 font-display text-3xl leading-none text-paper">
              {PERSONAL.role}
            </p>
            <p className="mt-2 font-sans text-[0.62rem] font-black uppercase tracking-[0.2em] text-paper/46">
              {PERSONAL.roleAttribution}
            </p>
            <p className="mt-8 text-base leading-8 text-paper/68">
              {PERSONAL.heroStatement}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="border border-paper/12 p-4">
                <Sparkles className="mb-4 text-gold-light" size={18} />
                <p className="font-sans text-[0.62rem] font-black uppercase tracking-[0.18em] text-paper/56">Focus</p>
                <p className="mt-2 font-display text-2xl leading-none">AI, interfaces, research</p>
              </div>
              <a href="#work" className="grid place-items-center border border-gold/44 p-4 text-center font-sans text-[0.62rem] font-black uppercase tracking-[0.18em] text-gold-light">
                Scroll<br />Down
                <ArrowDown className="mt-4" size={18} />
              </a>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}
