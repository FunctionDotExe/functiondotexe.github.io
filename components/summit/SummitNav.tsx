"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowRight, Mail, Menu, Mountain, X } from "lucide-react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";

const navigation = [
  { label: "Projects", href: "#work" },
  { label: "Skills", href: "#crust" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function SummitNav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const navigationFrame = useRef(0);
  const previousOverflow = useRef<string | null>(null);
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
      cancelAnimationFrame(navigationFrame.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    previousOverflow.current ??= document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onResize = () => { if (window.innerWidth > 760) dialog.current?.close(); };
    window.addEventListener("resize", onResize);
    return () => {
      if (previousOverflow.current !== null) {
        document.body.style.overflow = previousOverflow.current;
        previousOverflow.current = null;
      }
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const followLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!document.querySelector(href)) return;
    event.preventDefault();
    dialog.current?.close();
    setOpen(false);
    // Release the modal lock before measuring. A native fragment jump while the
    // body is still locked can leave mobile browsers at the old layout position.
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
    cancelAnimationFrame(navigationFrame.current);
    navigationFrame.current = requestAnimationFrame(() => {
      navigationFrame.current = requestAnimationFrame(() => {
        navigationFrame.current = 0;
        const destination = document.querySelector<HTMLElement>(href);
        if (!destination) return;
        const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        const top = Math.max(0, destination.getBoundingClientRect().top + window.scrollY - padding);
        // pushState retains Back/Forward navigation without an earlier native
        // fragment scroll racing the dialog's focus restoration.
        if (location.hash !== href) history.pushState(history.state, "", href);
        destination.focus({ preventScroll: true });
        window.scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      });
    });
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`journey-nav${scrolled ? " journey-nav--scrolled" : ""}`}>
        <a className="journey-nav__brand" href="#entry" aria-label="Ruben Maxwell, back to top" onClick={(event) => followLink(event, "#entry")}><Mountain size={24} strokeWidth={1.5} aria-hidden="true" /><span>Ruben Maxwell</span></a>
        <nav className="journey-nav__links" aria-label="Primary navigation">
          {navigation.map(({ label, href }) => <a key={href} href={href} aria-current={active === href ? "location" : undefined} onClick={(event) => followLink(event, href)}>{label}</a>)}
        </nav>
        <a className="journey-nav__hello" href={`mailto:${identity.email}`}>Email me <Mail size={16} aria-hidden="true" /></a>
        <button className="journey-nav__menu-button icon-button" type="button" aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={open} aria-controls="journey-menu" onClick={() => { cancelAnimationFrame(navigationFrame.current); dialog.current?.showModal(); if (dialog.current) dialog.current.scrollTop = 0; setOpen(true); }}><Menu size={22} aria-hidden="true" /></button>
      </header>
      <dialog ref={dialog} className="journey-menu" id="journey-menu" aria-labelledby="menu-title" onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="journey-menu__heading"><p id="menu-title">Take a look around.</p><button className="icon-button" type="button" aria-label="Close navigation" onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button></div>
        <nav aria-label="Mobile navigation">
          {navigation.map(({ label, href }) => <a key={href} href={href} aria-current={active === href ? "location" : undefined} onClick={(event) => followLink(event, href)}>{label}<ArrowRight size={24} aria-hidden="true" /></a>)}
        </nav>
        <a className="text-link journey-menu__email" href={`mailto:${identity.email}`} aria-label={`Email Ruben at ${identity.email}`} onClick={(event) => { if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) dialog.current?.close(); }}>{identity.email}<Mail size={16} aria-hidden="true" /></a>
        <p className="journey-menu__location">{identity.location}</p>
      </dialog>
    </>
  );
}
