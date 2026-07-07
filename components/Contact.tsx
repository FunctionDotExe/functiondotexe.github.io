"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { PERSONAL } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactLinks = [
    { label: "Email", href: `mailto:${PERSONAL.email}`, icon: Mail },
    { label: "LinkedIn", href: PERSONAL.linkedin, icon: Linkedin },
    { label: "GitHub", href: PERSONAL.github, icon: Github },
  ];

  return (
    <section id="contact" ref={ref} className="estate-section relative overflow-hidden">
      <div className="estate-shell">
        <motion.div
          className="retro-frame bg-[var(--paper-warm)] p-6 md:p-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.staggerContainer}
        >
          <motion.p variants={ANIMATION_VARIANTS.fadeInUp} className="stamp mb-8">
            Correspondence
          </motion.p>
          <motion.h2 variants={ANIMATION_VARIANTS.fadeInUp} className="poster-type max-w-[11ch] text-[clamp(4rem,11vw,12rem)]">
            Send a note. Begin the next chapter.
          </motion.h2>
          <motion.p variants={ANIMATION_VARIANTS.fadeInUp} className="mt-8 max-w-2xl border-y-2 border-[var(--ink)] py-6 text-xl leading-9 text-[var(--ink-soft)]">
            Reach out for software work, prototypes, AI experiments, or a problem that deserves slower thinking and cleaner execution.
          </motion.p>

          <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" variants={ANIMATION_VARIANTS.staggerContainer}>
            {contactLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.label === "Email" ? undefined : "_blank"}
                  rel={link.label === "Email" ? undefined : "noopener noreferrer"}
                  variants={ANIMATION_VARIANTS.staggerItem}
                  className="ribbon-link"
                >
                  {link.label}
                  <Icon size={17} />
                </motion.a>
              );
            })}
          </motion.div>

          <motion.a
            href={`mailto:${PERSONAL.email}`}
            variants={ANIMATION_VARIANTS.fadeInUp}
            className="mt-12 block break-words font-sans text-[clamp(2.2rem,7.2vw,7.2rem)] font-black uppercase leading-none tracking-[-0.05em] text-[var(--oxblood)]"
          >
            {PERSONAL.email}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
