"use client";

import { useEffect } from "react";

/**
 * Watches every [data-reveal] / [data-reveal-scale-y] element and adds
 * .is-revealed when it scrolls into view. CSS handles the transition.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal], [data-reveal-scale-y]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.05 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
