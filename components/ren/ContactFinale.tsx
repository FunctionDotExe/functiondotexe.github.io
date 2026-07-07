"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { PERSONAL } from "@/lib/constants";
import { RenCta, fadeUp, stagger } from "./Primitives";

const contactLinks = [
  { label: "Email", href: `mailto:${PERSONAL.email}`, icon: Mail, external: false },
  { label: "LinkedIn", href: PERSONAL.linkedin, icon: Linkedin, external: true },
  { label: "GitHub", href: PERSONAL.github, icon: Github, external: true },
];

export function ContactFinale() {
  return (
    <section id="contact" className="ren-section bg-paper text-ink">
      <div className="ren-shell">
        <motion.div
          className="relative overflow-hidden border border-ink/14 bg-charcoal px-5 py-10 text-paper shadow-[0_2.5rem_7rem_rgba(0,0,0,0.24)] md:px-10 md:py-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_12%,rgba(214,189,131,0.18),transparent_26rem),linear-gradient(rgba(244,236,217,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(244,236,217,0.04)_1px,transparent_1px)] bg-[length:auto,4rem_4rem,4rem_4rem]" />
          <div className="relative z-10">
            <motion.p variants={fadeUp} className="ren-eyebrow text-gold-light">Final chamber / Correspondence</motion.p>
            <motion.h2 variants={fadeUp} className="ren-display mt-5 max-w-[11ch] text-[clamp(4rem,11vw,12rem)]">
              Send a note. Start the next system.
            </motion.h2>
            <motion.p variants={fadeUp} className="ren-body mt-8 max-w-2xl text-paper/72">
              Reach out for software work, prototypes, AI experiments, or a problem that deserves slower thinking and cleaner execution.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {contactLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="ren-cta ren-cta-dark"
                  >
                    <span>{link.label}</span>
                    <Icon size={17} aria-hidden="true" />
                  </a>
                );
              })}
            </motion.div>

            <motion.a
              variants={fadeUp}
              href={`mailto:${PERSONAL.email}`}
              className="mt-12 block break-words font-display text-[clamp(2.6rem,7vw,7.5rem)] leading-none text-gold-light"
            >
              {PERSONAL.email}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
