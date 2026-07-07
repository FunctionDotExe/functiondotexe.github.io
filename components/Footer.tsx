"use client";

import { motion } from "framer-motion";
import { PERSONAL } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-paper/10 px-gutter py-10 text-paper/45">
      <div className="ren-shell">
        <div className="ticker-rule mb-8">
          <span>finis</span>
          <span>signed and sealed</span>
        </div>
        <motion.div
          className="flex flex-col gap-5 font-sans text-[0.68rem] font-black uppercase tracking-[0.22em] md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p>
            Copyright {currentYear} {PERSONAL.firstName} {PERSONAL.lastName}
          </p>
          <p className="text-gold-light">private folio</p>
        </motion.div>
      </div>
    </footer>
  );
}
