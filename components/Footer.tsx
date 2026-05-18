"use client";

import { motion } from "framer-motion";
import { PERSONAL } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 bg-[#0E0D0B] border-t border-[#2A2520]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between text-sm text-[#7A7060]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p>
            © {currentYear} {PERSONAL.firstName} {PERSONAL.lastName}. All rights reserved.
          </p>
          <p className="mt-4 md:mt-0">
            Designed & built with intention.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
