"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { PERSONAL } from "@/lib/constants";

const links = [
  { label: "Work", href: "#work" },
  { label: "Profile", href: "#profile" },
  { label: "Experience", href: "#experience" },
  { label: "Proof", href: "#proof" },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isOpen);
    return () => document.body.classList.remove("menu-open");
  }, [isOpen]);

  return (
    <header className={`site-nav ${scrolled ? "site-nav--scrolled" : ""}`}>
      <a className="site-mark" href="#top" aria-label="Ruben Maxwell, back to top">
        <span>RM</span>
        <small>Systems builder</small>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <a className="nav-cta" href={`mailto:${PERSONAL.email}`}>
        Start a conversation <ArrowUpRight size={15} aria-hidden="true" />
      </a>

      <button
        className="menu-trigger"
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div className={`mobile-nav ${isOpen ? "mobile-nav--open" : ""}`} aria-hidden={!isOpen}>
        <p>Index / 2026</p>
        {links.map((link, index) => (
          <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
            <span>0{index + 1}</span>
            {link.label}
          </a>
        ))}
        <a className="mobile-nav__email" href={`mailto:${PERSONAL.email}`} onClick={() => setIsOpen(false)}>
          {PERSONAL.email}
        </a>
      </div>
    </header>
  );
}
