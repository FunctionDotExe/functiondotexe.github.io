"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Pointer feedback stays local to the artifact and never drives the scroll camera. */
export function ArtifactMotion({ children, kind }: { children: ReactNode; kind: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let x = 0, y = 0;
    const draw = () => {
      frame = 0;
      element.style.setProperty("--artifact-x", `${x.toFixed(2)}deg`);
      element.style.setProperty("--artifact-y", `${y.toFixed(2)}deg`);
      element.style.setProperty("--artifact-light", `${(50+x*5).toFixed(1)}%`);
    };
    const move = (event: PointerEvent) => {
      if (preference.matches || !pointer.matches || event.pointerType !== "mouse") return;
      const bounds = element.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) { reset(); return; }
      x = (Math.min(1, Math.max(0, (event.clientX-bounds.left)/bounds.width))-.5)*9;
      y = -(Math.min(1, Math.max(0, (event.clientY-bounds.top)/bounds.height))-.5)*7;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const reset = () => { x=0; y=0; cancelAnimationFrame(frame); draw(); };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", reset);
    element.addEventListener("pointercancel", reset);
    preference.addEventListener("change", reset);
    pointer.addEventListener("change", reset);
    addEventListener("resize", reset);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove",move);
      element.removeEventListener("pointerleave",reset);
      element.removeEventListener("pointercancel",reset);
      preference.removeEventListener("change",reset);
      pointer.removeEventListener("change",reset);
      removeEventListener("resize",reset);
      ["--artifact-x", "--artifact-y", "--artifact-light"].forEach((name) => element.style.removeProperty(name));
    };
  }, []);
  return <div ref={ref} className={`artifact artifact--${kind}`}><div className="artifact__object">{children}</div></div>;
}
