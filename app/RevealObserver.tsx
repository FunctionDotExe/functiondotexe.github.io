"use client";

import { useEffect } from "react";

/**
 * Watches every [data-reveal] / [data-reveal-scale-y] element and adds
 * .is-revealed when it scrolls into view. CSS handles the transition.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(
      document.querySelectorAll("[data-reveal], [data-reveal-scale-y]")
    );
    const revealAll = () => els.forEach((el) => el.classList.add("is-revealed"));

    try {
      if (!("IntersectionObserver" in window)) {
        revealAll();
        return;
      }

      // Mark anything already in the viewport before hidden styles are enabled.
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.98 && rect.bottom > 0) {
          el.classList.add("is-revealed");
        }
      });
      root.classList.add("reveal-ready");

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              io.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -64px 0px", threshold: 0.04 }
      );

      els.forEach((el) => {
        if (!el.classList.contains("is-revealed")) io.observe(el);
      });

      // The design must never remain hidden if a browser suspends observers.
      const failOpenTimer = window.setTimeout(revealAll, 6000);
      return () => {
        window.clearTimeout(failOpenTimer);
        io.disconnect();
        root.classList.remove("reveal-ready");
      };
    } catch {
      revealAll();
      root.classList.remove("reveal-ready");
    }

    return undefined;
  }, []);

  return null;
}
