"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { PERSONAL } from "@/lib/constants";

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Resume", href: "#resume" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        className="fixed left-0 right-0 top-0 z-50 hidden items-center justify-between border-b-2 border-[var(--ink)] bg-[rgba(238,230,213,0.9)] px-[var(--gutter)] py-3 text-[var(--ink)] backdrop-blur-md md:flex"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
      >
        <a href="#" className="group flex items-center gap-4">
          <span className="grid h-10 w-10 place-items-center border-2 border-[var(--ink)] bg-[var(--ink)] font-sans text-sm font-black text-[var(--paper)]">
            RM
          </span>
          <span>
            <span className="block font-sans text-sm font-black uppercase leading-none tracking-[0.14em]">{PERSONAL.firstName} {PERSONAL.lastName}</span>
            <span className="block font-sans text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--ink-soft)]">
              Private folio
            </span>
          </span>
        </a>

        <div className="h-px min-w-[28rem] bg-[var(--ink)] px-6">
          <span className="sr-only">folio</span>
        </div>

        <div className="flex items-center gap-6">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="font-sans text-[0.64rem] font-black uppercase tracking-[0.2em] text-[var(--ink)] transition hover:text-[var(--oxblood)]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.7 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </motion.nav>

      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-4 z-50 grid h-12 w-12 place-items-center border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] shadow-[0.4rem_0.4rem_0_rgba(23,23,23,0.18)] backdrop-blur-md md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={21} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <Menu size={21} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="fixed inset-0 z-40 grid place-items-center bg-[rgba(238,230,213,0.97)] px-6 backdrop-blur-md md:hidden"
          >
            <div className="retro-frame w-full bg-[var(--paper)] p-7">
              <p className="rubric">Navigation</p>
              <div className="mt-4 grid gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="border-t border-[var(--rule)] py-5 font-display text-4xl leading-none text-[var(--ink)]"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
