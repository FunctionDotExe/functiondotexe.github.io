"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/**
 * Smooth scrolling, loaded lazily on the first wheel/touch interaction so
 * it costs nothing during page load. Until then native scrolling
 * (html { scroll-behavior: smooth }) covers anchor links.
 */
export function LenisWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: Lenis | undefined;
    let rafId = 0;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      import("lenis").then(({ default: LenisCtor }) => {
        lenis = new LenisCtor({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          syncTouch: false,
          touchMultiplier: 2,
        });

        function raf(time: number) {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);
      });
    };

    window.addEventListener("wheel", start, { once: true, passive: true });
    window.addEventListener("touchstart", start, { once: true, passive: true });

    return () => {
      window.removeEventListener("wheel", start);
      window.removeEventListener("touchstart", start);
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
