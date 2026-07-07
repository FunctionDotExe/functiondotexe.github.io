"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Cpu, Sparkles } from "lucide-react";
import { useRef } from "react";
import { PERSONAL } from "@/lib/constants";
import { RenCta, ShineBorder, SplitReveal, StatusPill, fadeUp, stagger } from "./Primitives";

export function OpeningSystem() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const panelY = useTransform(scrollYProgress, [0, 1], [0, -92]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 52]);

  return (
    <section ref={ref} className="ren-hero relative min-h-[118vh] overflow-hidden text-paper">
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: auroraY }} aria-hidden="true">
        <div className="absolute -left-[10%] top-[-12%] h-[36rem] w-[52rem] rounded-full bg-gold/[0.13] blur-[110px] animate-aurora-a" />
        <div className="absolute right-[-8%] top-[8%] h-[30rem] w-[44rem] rounded-full bg-teal/[0.09] blur-[110px] animate-aurora-b" />
        <div className="absolute bottom-[-18%] left-[22%] h-[28rem] w-[40rem] rounded-full bg-oxblood/[0.1] blur-[120px] animate-aurora-a" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[92rem] items-center px-gutter pb-24 pt-28">
        <motion.div
          className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div style={{ y: titleY }}>
            <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-3">
              <StatusPill>RenAIssance OS</StatusPill>
              <StatusPill>{PERSONAL.city}</StatusPill>
              <StatusPill>Portfolio build 2026</StatusPill>
            </motion.div>

            <motion.p variants={fadeUp} className="ren-eyebrow text-gold-light">
              {PERSONAL.firstName} {PERSONAL.lastName} / Software systems and interface craft
            </motion.p>
            <SplitReveal
              as="h1"
              text="Useful systems, illuminated."
              highlightWords={["illuminated"]}
              delay={0.2}
              className="ren-display mt-5 max-w-[10ch] text-[clamp(4.6rem,12vw,14rem)]"
            />
            <motion.p variants={fadeUp} className="ren-body mt-8 max-w-3xl text-paper/70">
              {PERSONAL.heroTagline}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <RenCta href="#work">Enter the work</RenCta>
              <RenCta href="#manifesto">Read the system</RenCta>
            </motion.div>
          </motion.div>

          <motion.aside style={{ y: panelY }} variants={fadeUp}>
            <ShineBorder contentClassName="bg-charcoal/60 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-paper/12 pb-4">
                <span className="font-sans text-[0.62rem] font-black uppercase tracking-[0.2em] text-gold-light">
                  System signal
                </span>
                <Cpu size={18} aria-hidden="true" />
              </div>
              <p className="mt-5 font-display text-3xl leading-none text-paper">{PERSONAL.role}</p>
              <p className="mt-2 font-sans text-[0.62rem] font-black uppercase tracking-[0.2em] text-paper/46">
                {PERSONAL.roleAttribution}
              </p>
              <p className="mt-8 text-base leading-8 text-paper/68">{PERSONAL.heroStatement}</p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="border border-paper/12 p-4 transition-colors duration-500 hover:border-gold/40">
                  <Sparkles className="mb-4 text-gold-light" size={18} aria-hidden="true" />
                  <p className="font-sans text-[0.62rem] font-black uppercase tracking-[0.18em] text-paper/56">Focus</p>
                  <p className="mt-2 font-display text-2xl leading-none">AI, interfaces, research</p>
                </div>
                <a
                  href="#work"
                  className="grid place-items-center border border-gold/44 p-4 text-center font-sans text-[0.62rem] font-black uppercase tracking-[0.18em] text-gold-light transition-all duration-500 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_2rem_rgba(185,150,84,0.2)]"
                >
                  Scroll
                  <br />
                  Down
                  <ArrowDown className="mt-4 animate-bounce" size={18} aria-hidden="true" />
                </a>
              </div>
            </ShineBorder>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}
