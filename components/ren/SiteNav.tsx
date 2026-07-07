"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { PERSONAL } from "@/lib/constants";

const links = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Signals", href: "#signals" },
  { label: "Work", href: "#work" },
  { label: "Timeline", href: "#timeline" },
  { label: "Proof", href: "#proof" },
  { label: "Contact", href: "#contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="fixed inset-x-0 top-0 z-50 hidden border-b border-paper/12 bg-charcoal/72 px-gutter py-3 text-paper backdrop-blur-xl md:block"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-6">
          <a href="#" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center border border-gold/60 bg-gold/10 font-sans text-xs font-black tracking-[0.18em] text-gold-light">
              RM
            </span>
            <span>
              <span className="block font-sans text-[0.72rem] font-black uppercase tracking-[0.22em]">
                {PERSONAL.firstName} {PERSONAL.lastName}
              </span>
              <span className="block font-sans text-[0.58rem] font-bold uppercase tracking-[0.22em] text-paper/46">
                RenAIssance OS
              </span>
            </span>
          </a>

          <div className="flex items-center gap-5">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="ren-nav-link">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      <button
        type="button"
        className="fixed right-4 top-4 z-50 grid h-12 w-12 place-items-center border border-ink/20 bg-paper/90 text-ink shadow-[0_1rem_2.5rem_rgba(0,0,0,0.18)] backdrop-blur-xl md:hidden"
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-charcoal/96 px-5 py-24 text-paper md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid gap-2">
              {links.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-paper/14 py-5 font-display text-5xl leading-none"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
