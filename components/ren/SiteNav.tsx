"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 32));

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed inset-x-0 top-0 z-50 hidden px-gutter py-3 text-paper transition-all duration-700 ease-luxury md:block ${
          scrolled
            ? "border-b border-paper/10 bg-charcoal/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-6">
          <a href="#" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center border border-gold/50 bg-gold/10 font-sans text-xs font-black tracking-[0.18em] text-gold-light shadow-[0_0_1.5rem_rgba(185,150,84,0.15)] transition-shadow duration-500 group-hover:shadow-[0_0_2.2rem_rgba(185,150,84,0.35)]">
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
              <a
                key={link.label}
                href={link.href}
                className={`ren-nav-link ${active === link.href ? "is-active" : ""}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      <button
        type="button"
        className="fixed right-4 top-4 z-50 grid h-12 w-12 place-items-center border border-paper/15 bg-charcoal/80 text-paper shadow-[0_1rem_2.5rem_rgba(0,0,0,0.5)] backdrop-blur-xl transition-colors duration-500 hover:border-gold/50 hover:text-gold-light md:hidden"
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-charcoal/92 px-5 py-24 text-paper backdrop-blur-2xl md:hidden"
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
                  className="group flex items-baseline justify-between border-b border-paper/12 py-5 font-display text-5xl leading-none transition-colors duration-500 hover:text-gold-light"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {link.label}
                  <span className="font-sans text-[0.58rem] font-black uppercase tracking-[0.2em] text-paper/35 transition-colors duration-500 group-hover:text-gold-light">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
