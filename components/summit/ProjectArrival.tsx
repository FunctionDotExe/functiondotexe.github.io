"use client";

import { useEffect } from "react";

/** Introduce each project and its gallery once, without changing content state. */
export function ProjectArrival() {
  useEffect(() => {
    const artifacts = Array.from(document.querySelectorAll<HTMLElement>(".waypoint .artifact"));
    if (!artifacts.length || typeof IntersectionObserver === "undefined") return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new Set<HTMLElement>();
    const running = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
    let disposed = false;
    let printing = false;
    let observer: IntersectionObserver;

    const settle = (artifact: HTMLElement) => {
      seen.add(artifact);
      observer.unobserve(artifact);
      clearTimeout(running.get(artifact));
      running.delete(artifact);
      artifact.removeAttribute("data-project-arrival");
    };
    const settleRunning = () => Array.from(running.keys()).forEach(settle);
    const preferenceChanged = () => { if (reduced.matches) settleRunning(); };
    const visibilityChanged = () => { if (document.hidden) settleRunning(); };
    const beforePrint = () => { printing = true; settleRunning(); };
    const afterPrint = () => { printing = false; };
    observer = new IntersectionObserver((entries) => {
      if (disposed || printing || document.hidden) return;
      entries.forEach((entry) => {
        const artifact = entry.target as HTMLElement;
        if (!entry.isIntersecting || entry.intersectionRatio < .18 || seen.has(artifact)) return;
        if (reduced.matches || artifact.matches(":focus-within")) { settle(artifact); return; }
        seen.add(artifact);
        observer.unobserve(artifact);
        artifact.setAttribute("data-project-arrival", "arriving");
        // CSS owns the finite animation. Remove the transient state even if an
        // animationend event is skipped by a viewport/preference change.
        running.set(artifact, setTimeout(() => settle(artifact), 1700));
      });
    }, { threshold: .18 });

    const interactions = artifacts.map((artifact) => {
      const interact = () => settle(artifact);
      artifact.addEventListener("focusin", interact);
      artifact.addEventListener("click", interact);
      observer.observe(artifact);
      return { artifact, interact };
    });
    reduced.addEventListener("change", preferenceChanged);
    document.addEventListener("visibilitychange", visibilityChanged);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      disposed = true;
      observer.disconnect();
      running.forEach((timer) => clearTimeout(timer));
      interactions.forEach(({ artifact, interact }) => {
        artifact.removeEventListener("focusin", interact);
        artifact.removeEventListener("click", interact);
        artifact.removeAttribute("data-project-arrival");
      });
      reduced.removeEventListener("change", preferenceChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);
  return null;
}
