"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#crust" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function PortfolioNav() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pendingAnchor = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      pendingAnchor.current = null;
      setIsOpen(false);
      toggleRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen || !pendingAnchor.current) return;

    let secondFrame = 0;
    // Resolve the position only after React has removed the open menu and the
    // browser has completed layout. Native hash navigation retains back/forward.
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        const href = pendingAnchor.current;
        pendingAnchor.current = null;
        if (!href) return;

        const target = document.getElementById(href.slice(1));
        if (!target) return;

        if (window.location.hash !== href) window.location.hash = href;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({
          top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 92),
          behavior: reducedMotion ? "instant" : "smooth",
        });
        if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
        target.focus({ preventScroll: true });
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [isOpen]);

  const followMobileAnchor = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isOpen || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    pendingAnchor.current = event.currentTarget.hash;
    setIsOpen(false);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="p-nav">
        <div className="p-nav__inner">
          <a className="p-nav__brand" href="#entry" onClick={followMobileAnchor} aria-label="Ruben Maxwell, back to top">
            <svg width="25" height="22" viewBox="0 0 25 22" fill="none" aria-hidden="true">
              <path d="M2 18.5 9.5 4l5 9 3.5-5 5 10.5H2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="m6.8 9.2 2.7 1.5 2.5-1.3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span>Ruben Maxwell</span>
          </a>

          <nav className="p-nav__links" aria-label="Primary navigation">
            {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
          </nav>

          <a className="p-nav__resume" href="/media/ruben-resume.pdf" target="_blank" rel="noreferrer">
            Résumé <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>

          <button
            ref={toggleRef}
            className="p-nav__toggle"
            type="button"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
            aria-controls={isOpen ? panelId : undefined}
            onClick={() => {
              pendingAnchor.current = null;
              setIsOpen((value) => !value);
            }}
          >
            {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>

        {isOpen && (
          <nav className="p-nav__mobile" id={panelId} aria-label="Mobile navigation">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={followMobileAnchor}>{link.label}</a>
            ))}
            <a href="/media/ruben-resume.pdf" target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)}>
              Résumé <ArrowUpRight size={15} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </nav>
        )}
      </header>
    </>
  );
}
