"use client";

import { motion } from "framer-motion";
import { PERSONAL } from "@/lib/constants";
import { ANIMATION_VARIANTS, EASING } from "@/lib/animations";
import dynamic from "next/dynamic";

const ParticleBackground = dynamic(() => import("./ParticleBackground"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-b from-[#161410] to-[#0E0D0B]" />,
});

export function Hero() {
  const nameLetters = PERSONAL.firstName.split("");

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <ParticleBackground />
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      <motion.div
        className="relative z-10 text-center max-w-4xl px-4"
        initial="hidden"
        animate="visible"
        variants={ANIMATION_VARIANTS.staggerContainer}
      >
        <motion.p
          className="text-sm tracking-[0.3em] text-[#C9A84C] uppercase mb-12"
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          Est. {PERSONAL.year} / {PERSONAL.city}
        </motion.p>

        <div className="mb-6 overflow-hidden">
          <motion.h1
            className="font-display text-[5rem] md:text-[7rem] lg:text-[8rem] leading-tight text-[#F2EBD9] tracking-tight"
            variants={ANIMATION_VARIANTS.staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                variants={ANIMATION_VARIANTS.letterAnimation}
                custom={i}
                transition={{
                  delay: i * 0.08,
                  duration: 0.6,
                  ease: EASING.outExpo,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
          <motion.h1
            className="font-display text-[5rem] md:text-[7rem] lg:text-[8rem] leading-tight text-[#C9A84C] tracking-tight"
            variants={ANIMATION_VARIANTS.staggerContainer}
            initial="hidden"
            animate="visible"
            transition={{ delayChildren: PERSONAL.firstName.length * 0.08 }}
          >
            {PERSONAL.lastName.split("").map((letter, i) => (
              <motion.span
                key={i}
                variants={ANIMATION_VARIANTS.letterAnimation}
                transition={{
                  delay: (PERSONAL.firstName.length + i) * 0.08,
                  duration: 0.6,
                  ease: EASING.outExpo,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <motion.blockquote
          className="mb-12"
          variants={ANIMATION_VARIANTS.fadeInUp}
          transition={{ delay: (PERSONAL.firstName.length + PERSONAL.lastName.length) * 0.08 + 0.2 }}
        >
          <p className="text-lg md:text-xl text-[#F2EBD9]">{PERSONAL.role}</p>
          <footer className="mt-3 text-xs tracking-[0.24em] uppercase text-[#7A7060]">
            {PERSONAL.roleAttribution}
          </footer>
        </motion.blockquote>

        <motion.div
          className="flex flex-col items-center gap-3"
          variants={ANIMATION_VARIANTS.fadeInUp}
          transition={{ delay: (PERSONAL.firstName.length + PERSONAL.lastName.length) * 0.08 + 0.4 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[#C9A84C]"
          >
            &darr;
          </motion.div>
          <p className="text-sm text-[#7A7060]">Scroll to explore</p>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .bg-radial-gradient {
          background: radial-gradient(
            ellipse at center,
            rgba(14, 13, 11, 0) 0%,
            rgba(14, 13, 11, 0.4) 70%,
            rgba(14, 13, 11, 0.8) 100%
          );
        }
      `}</style>
    </section>
  );
}
