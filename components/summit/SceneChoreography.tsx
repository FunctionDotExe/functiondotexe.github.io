"use client";

import { useEffect } from "react";

/** A shared reveal language for the quieter chapters between the large stages. */
export function SceneChoreography() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-narrative-scene]"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const timers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
    const seen = new Set<HTMLElement>();
    const settle = (node: HTMLElement) => { clearTimeout(timers.get(node)); timers.delete(node); delete node.dataset.sceneArrival; };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const node = entry.target as HTMLElement;
        if (!entry.isIntersecting || seen.has(node)) return;
        seen.add(node); observer.unobserve(node);
        if (reduced.matches || document.hidden || node.matches(":focus-within")) return;
        node.dataset.sceneArrival = "arriving";
        timers.set(node, setTimeout(() => settle(node), 1800));
      });
    }, { rootMargin: "0px 0px -15% 0px", threshold: 0 });
    nodes.forEach((node) => observer.observe(node));
    const settleAll = () => Array.from(timers.keys()).forEach(settle);
    const preference = () => { if (reduced.matches) settleAll(); };
    const visibility = () => { if (document.hidden) settleAll(); };
    reduced.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    addEventListener("beforeprint", settleAll);
    return () => {
      observer.disconnect(); settleAll();
      reduced.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
      removeEventListener("beforeprint", settleAll);
    };
  }, []);
  return null;
}
