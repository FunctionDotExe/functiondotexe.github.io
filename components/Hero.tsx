"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Camera, Monitor, Phone } from "lucide-react";
import { useRef } from "react";
import { PERSONAL } from "@/lib/constants";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const collageY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 96]);
  const portraitRotate = useTransform(scrollYProgress, [0, 1], [-3, 2]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={ref} className="relative min-h-[132vh] overflow-hidden px-[var(--gutter)] pb-20 pt-8 text-[var(--ink)]">
      <div className="estate-shell">
        <div className="ticker-rule">
          <span>Retro websites</span>
          <span>Portfolio examples</span>
        </div>

        <div className="relative min-h-[92vh] py-12 md:py-16">
          <motion.div className="relative z-20 max-w-5xl" style={{ y: titleY }}>
            <motion.p
              className="stamp mb-8"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              {PERSONAL.firstName} {PERSONAL.lastName}
            </motion.p>
            <motion.h1
              className="poster-type max-w-[9ch] text-[clamp(5rem,15.5vw,15.8rem)]"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, ease: [0.19, 1, 0.22, 1], delay: 0.08 }}
            >
              Digital things.
            </motion.h1>
            <motion.p
              className="mt-6 max-w-xl font-serif text-[clamp(1.25rem,2vw,1.8rem)] italic leading-9 text-[var(--ink-soft)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.18 }}
            >
              A cabinet of software objects, research notes, and crafted interfaces.
            </motion.p>
            <motion.a
              href="#projects"
              className="ribbon-link mt-9"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.28 }}
            >
              Examples <ArrowDown size={17} />
            </motion.a>
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="absolute right-[-2rem] top-[5rem] z-10 hidden w-[52vw] max-w-[46rem] md:block"
            style={{ y: collageY }}
          >
            <div className="browser-window rotate-[-1.5deg] text-[var(--ink)]">
              <motion.img
                src="/media/work/decyphergamehomepage.png"
                alt=""
                className="aspect-[16/10] w-full bg-[var(--charcoal)] object-contain p-7"
                style={{ scale: imageScale }}
              />
            </div>
            <motion.figure
              className="cutout absolute -right-4 -top-10 w-[38%] rotate-[8deg] border-2 border-[var(--ink)] bg-[var(--paper-warm)] p-2"
              style={{ rotate: portraitRotate }}
            >
              <img
                src="/media/portrait.jpg"
                alt=""
                className="aspect-[4/5] w-full object-cover object-[center_34%] grayscale contrast-[1.12]"
              />
            </motion.figure>
            <motion.div
              className="absolute -bottom-12 left-[10%] grid h-32 w-32 place-items-center border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] shadow-[0.7rem_0.7rem_0_rgba(23,23,23,0.16)]"
              style={{ y: phoneY }}
            >
              <Phone size={54} strokeWidth={1.5} />
            </motion.div>
            <div className="absolute -right-12 bottom-12 grid h-36 w-36 place-items-center rounded-full border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]">
              <Camera size={64} strokeWidth={1.4} />
            </div>
          </motion.div>

          <div className="relative z-20 mt-12 grid gap-4 border-y-2 border-[var(--ink)] py-5 font-sans text-[0.72rem] font-black uppercase tracking-[0.22em] md:absolute md:bottom-16 md:left-0 md:right-0 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <p>{PERSONAL.city}</p>
            <p className="hidden text-center md:block">
              <Monitor className="mx-auto mb-2" size={18} />
              {PERSONAL.role}
            </p>
            <p className="md:text-right">{PERSONAL.roleAttribution}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
