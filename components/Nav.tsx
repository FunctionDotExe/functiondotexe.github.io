"use client";

import { useState } from "react";
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

  const initials = `${PERSONAL.firstName[0]}${PERSONAL.lastName[0]}`;

  return (
    <>
      {/* Desktop Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-8 py-6 bg-[#161410]/80 backdrop-blur-md">
        <div
          className="hero-fade text-2xl font-display text-[#C9A84C] tracking-widest"
          style={{ "--d": "0.2s" } as React.CSSProperties}
        >
          {initials}
        </div>

        <div className="flex gap-8 items-center">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className="hero-fade text-sm tracking-wide text-[#F2EBD9] hover:text-[#C9A84C] transition-colors"
              style={{ "--d": `${0.3 + i * 0.1}s` } as React.CSSProperties}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile Nav Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="fixed top-6 right-6 z-50 md:hidden text-[#C9A84C] p-2"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu fixed inset-0 md:hidden bg-[#0E0D0B] z-40 flex flex-col items-center justify-center gap-8 pt-20">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-display text-[#F2EBD9]"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
