"use client";

import { motion } from "framer-motion";
import { PERSONAL } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--rule)] px-[var(--gutter)] py-10">
      <div className="estate-shell">
        <div className="ticker-rule mb-8">
          <span>finis</span>
          <span>signed and sealed</span>
        </div>
        <motion.div
          className="flex flex-col gap-5 font-sans text-[0.68rem] font-black uppercase tracking-[0.22em] text-[var(--ink-soft)] md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p>Copyright {currentYear} {PERSONAL.firstName} {PERSONAL.lastName}</p>
          <p className="text-[var(--oxblood)]">private folio</p>
        </motion.div>
      </div>
    </footer>
  );
}
