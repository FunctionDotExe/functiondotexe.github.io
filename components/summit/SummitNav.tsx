"use client";

import { useEffect, useRef, useState } from "react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";

export function SummitNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onLightScene, setOnLightScene] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { identity, navigation } = SUMMIT_CONTENT;

  const closeMenu = () => {
    setOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  useEffect(() => {
    const climb = document.querySelector<HTMLElement>(".climb");
    const highAltitude = document.querySelector<HTMLElement>(".high-altitude");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const updateNavigation = () => {
      const climbRect = climb?.getBoundingClientRect();
      const climbProgress = climbRect
        ? Math.min(
            1,
            Math.max(
              0,
              -climbRect.top / Math.max(climbRect.height - window.innerHeight, 1),
            ),
          )
        : 0;

      setScrolled(window.scrollY > 32);
      setOnLightScene(
        reducedMotion.matches ||
          climbProgress >= 0.855 ||
          Boolean(highAltitude && highAltitude.getBoundingClientRect().top <= window.innerHeight * 0.58),
      );
      animationFrame = 0;
    };

    const onScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateNavigation);
    };

    updateNavigation();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reducedMotion.addEventListener("change", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reducedMotion.removeEventListener("change", onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header
        className={`journey-nav${scrolled ? " journey-nav--scrolled" : ""}${
          onLightScene ? " journey-nav--on-light" : ""
        }${open ? " journey-nav--open" : ""}`}
      >
        <a className="journey-nav__brand" href="#entry" aria-label={`${identity.name}, back to top`}>
          <span>{identity.initials}</span>
          <small>{identity.name}</small>
        </a>

        <nav className="journey-nav__links" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="journey-nav__hello" href={`mailto:${identity.email}`}>
          Say hello
          <span aria-hidden="true">↗</span>
        </a>

        <button
          ref={menuButtonRef}
          className="journey-nav__menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="journey-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </header>

      <div className={`journey-menu${open ? " journey-menu--open" : ""}`} id="journey-menu" aria-hidden={!open}>
        <span className="journey-menu__sun" aria-hidden="true" />
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => (
            <a href={item.href} key={item.href} tabIndex={open ? 0 : -1} onClick={closeMenu}>
              <span>{item.number}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="journey-menu__email"
          href={`mailto:${identity.email}`}
          tabIndex={open ? 0 : -1}
          onClick={closeMenu}
        >
          {identity.email}
        </a>
      </div>
    </>
  );
}
