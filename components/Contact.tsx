"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PERSONAL } from "@/lib/constants";
import { ANIMATION_VARIANTS } from "@/lib/animations";
import { Mail, Linkedin, Github } from "lucide-react";

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactLinks = [
    {
      label: "Email",
      href: `mailto:${PERSONAL.email}`,
      icon: Mail,
    },
    {
      label: "LinkedIn",
      href: PERSONAL.linkedin,
      icon: Linkedin,
    },
    {
      label: "GitHub",
      href: PERSONAL.github,
      icon: Github,
    },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="py-32 px-4 bg-[#161410] relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-64 h-64 border border-[#2A2520] rounded-full opacity-10" />
      <div className="absolute bottom-20 left-5 w-80 h-80 border border-[#2A2520] rounded-full opacity-5" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? "visible" : "hidden"}
          variants={ANIMATION_VARIANTS.fadeInUp}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] text-[#C9A84C] uppercase mb-8">
            Contact
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-[#F2EBD9] leading-tight max-w-none">
            Let's build <br className="hidden md:block" />
            <motion.span
              className="text-[#C9A84C]"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              something useful.
            </motion.span>
          </h2>
        </motion.div>

        {/* Contact Links */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-16"
          variants={ANIMATION_VARIANTS.staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {contactLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={ANIMATION_VARIANTS.staggerItem}
                className="group flex items-center gap-3 text-[#F2EBD9] hover:text-[#C9A84C] transition-colors"
                whileHover={{ x: 4 }}
              >
                <Icon size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="text-lg md:text-xl">{link.label}</span>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Email highlight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.5 }}
          className="pt-8 border-t border-[#2A2520]"
        >
          <p className="text-sm text-[#7A7060] mb-4">Email me directly at</p>
          <motion.a
            href={`mailto:${PERSONAL.email}`}
            className="font-display text-3xl md:text-4xl text-[#C9A84C] hover:underline"
            whileHover={{ scale: 1.05 }}
          >
            {PERSONAL.email}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
