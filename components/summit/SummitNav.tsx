"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Mountain, X } from "lucide-react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";

const navigation = [
  { label: "Projects", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function SummitNav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const { identity } = SUMMIT_CONTENT;

  useEffect(() => {
    let frame = 0;
    const sections = navigation.map(({ href }) => document.querySelector(href));
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      let current = "";
      sections.forEach((section, i) => {
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.4) current = navigation[i].href;
      });
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onResize = () => { if (window.innerWidth > 760) dialog.current?.close(); };
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const followLink = (href: string) => {
    dialog.current?.close();
    requestAnimationFrame(() => document.querySelector<HTMLElement>(href)?.focus({ preventScroll: true }));
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`journey-nav${scrolled ? " journey-nav--scrolled" : ""}`}>
        <a className="journey-nav__brand" href="#entry" aria-label="Ruben Maxwell, back to top"><Mountain size={24} strokeWidth={1.5} aria-hidden="true" /><span>Ruben Maxwell</span></a>
        <nav className="journey-nav__links" aria-label="Primary navigation">
          {navigation.map(({ label, href }) => <a key={href} href={href} aria-current={active === href ? "location" : undefined}>{label}</a>)}
        </nav>
        <a className="journey-nav__hello" href={`mailto:${identity.email}`}>Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a>
        <button className="journey-nav__menu-button icon-button" type="button" aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={open} aria-controls="journey-menu" onClick={() => { dialog.current?.showModal(); setOpen(true); }}><Menu size={22} aria-hidden="true" /></button>
      </header>
      <dialog ref={dialog} className="journey-menu" id="journey-menu" aria-labelledby="menu-title" onClose={() => setOpen(false)}>
        <div className="journey-menu__heading"><p id="menu-title">Take a look around.</p><button className="icon-button" type="button" aria-label="Close navigation" onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button></div>
        <nav aria-label="Mobile navigation">
          {navigation.map(({ label, href }) => <a key={href} href={href} aria-current={active === href ? "location" : undefined} onClick={() => followLink(href)}>{label}<ArrowUpRight size={24} aria-hidden="true" /></a>)}
        </nav>
        <a className="text-link journey-menu__email" href={`mailto:${identity.email}`}>{identity.email}<ArrowUpRight size={16} aria-hidden="true" /></a>
        <p className="journey-menu__location">{identity.location}</p>
      </dialog>
    </>
  );
}
