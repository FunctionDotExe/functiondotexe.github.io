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
    const themedScenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme]"),
    );
    let animationFrame = 0;

    const updateNavigation = () => {
      const viewportCenter = window.innerHeight * 0.5;
      let activeScene: HTMLElement | null = null;
      let activeDistance = Number.POSITIVE_INFINITY;

      for (const scene of themedScenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;
        const distance = Math.abs(rect.top + rect.height * 0.5 - viewportCenter);
        if (distance < activeDistance) {
          activeDistance = distance;
          activeScene = scene;
        }
      }

      setScrolled(window.scrollY > 32);
      setOnLightScene(activeScene?.dataset.navTheme === "light");
      animationFrame = 0;
    };

    const onScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateNavigation);
    };

    updateNavigation();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const onResize = () => {
      if (window.innerWidth > 720) setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
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
