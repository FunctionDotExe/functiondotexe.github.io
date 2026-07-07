"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { PERSONAL } from "@/lib/constants";
import { Marquee, fadeUp, stagger } from "./Primitives";

const contactLinks = [
  { label: "Email", href: `mailto:${PERSONAL.email}`, icon: Mail, external: false },
  { label: "LinkedIn", href: PERSONAL.linkedin, icon: Linkedin, external: true },
  { label: "GitHub", href: PERSONAL.github, icon: Github, external: true },
];

export function ContactFinale() {
  return (
    <section id="contact" className="ren-section">
      <div className="ren-shell">
        <motion.div
          className="ren-panel px-5 py-10 md:px-10 md:py-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={stagger}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(217,193,132,0.14),transparent_30rem)]"
          />
          <div className="relative">
            <motion.p variants={fadeUp} className="ren-eyebrow text-gold-light">
              Final chamber / Correspondence
            </motion.p>
            <motion.h2 variants={fadeUp} className="ren-display mt-5 max-w-[11ch] text-[clamp(3.6rem,10vw,10.5rem)]">
              Send a note. Start the next system.
            </motion.h2>
            <motion.p variants={fadeUp} className="ren-body mt-8 max-w-2xl text-paper/68">
              Reach out for software work, prototypes, AI experiments, or a problem that deserves slower thinking and
              cleaner execution.
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
                    className="ren-cta"
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
              className="ren-underline-link mt-12 inline-block max-w-full break-words font-display text-[clamp(2.2rem,6.5vw,6.8rem)] leading-none text-gold-light transition-colors duration-500 hover:text-paper"
            >
              {PERSONAL.email}
            </motion.a>
          </div>
        </motion.div>

        <div className="mt-14 border-y border-paper/10 py-5 text-paper/50">
          <Marquee
            items={[
              PERSONAL.availabilityLine,
              PERSONAL.email,
              PERSONAL.city,
              "Open to software work, prototypes, and AI experiments",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
