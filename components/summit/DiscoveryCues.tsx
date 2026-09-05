"use client";

import { useEffect } from "react";

type CueKind = "disclosure" | "timeline" | "contact" | "certificate" | "portrait";
type Cue = {
  node: HTMLElement;
  target: HTMLElement;
  kind: CueKind;
  state: "pending" | "running" | "done";
  details?: HTMLDetailsElement;
};

const ANIMATION: Record<CueKind, string> = {
  disclosure: "discovery-trace",
  timeline: "discovery-rail",
  contact: "discovery-underline",
  certificate: "discovery-underline",
  portrait: "discovery-portrait-settle",
};

/** Decorative invitations only. Native controls remain entirely in charge. */
export function DiscoveryCues() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = new Map<HTMLElement, Cue[]>();
    const visible = new Set<HTMLElement>();
    const running = new Set<Cue>();
    const original = new Map<HTMLElement, Map<string, string | undefined>>();
    const cleanups: (() => void)[] = [];
    let observer: IntersectionObserver | null = null;
    let printing = false;
    let disposed = false;

    const write = (node: HTMLElement, key: string, value: string | undefined) => {
      let attributes = original.get(node);
      if (!attributes) { attributes = new Map(); original.set(node, attributes); }
      if (!attributes.has(key)) attributes.set(key, node.dataset[key]);
      if (value === undefined) delete node.dataset[key];
      else node.dataset[key] = value;
    };
    const releaseTarget = (target: HTMLElement) => {
      if (targets.get(target)?.every((cue) => cue.state !== "pending")) {
        observer?.unobserve(target);
        visible.delete(target);
      }
    };
    const finish = (cue: Cue) => {
      if (disposed || cue.state === "done") return;
      cue.state = "done";
      running.delete(cue);
      write(cue.node, "discoveryCue", cue.kind);
      write(cue.node, "discoveryState", "done");
      write(cue.node, "discoveryPaused", undefined);
      releaseTarget(cue.target);
    };
    const start = (cue: Cue) => {
      if (cue.state !== "pending") return;
      if (reduced.matches || (cue.kind === "disclosure" && (cue.details?.open || cue.node.matches(":hover, :focus-within")))) {
        finish(cue);
        return;
      }
      cue.state = "running";
      running.add(cue);
      write(cue.node, "discoveryCue", cue.kind);
      write(cue.node, "discoveryState", "running");
      write(cue.node, "discoveryPaused", undefined);
      releaseTarget(cue.target);
    };
    const revealVisible = () => {
      if (disposed || document.hidden || printing) return;
      visible.forEach((target) => targets.get(target)?.forEach(start));
    };
    const listen = (node: EventTarget, name: string, listener: EventListener) => {
      node.addEventListener(name, listener);
      cleanups.push(() => node.removeEventListener(name, listener));
    };
    const add = (node: HTMLElement, target: HTMLElement, kind: CueKind, details?: HTMLDetailsElement) => {
      const cue: Cue = { node, target, kind, details, state: "pending" };
      const group = targets.get(target) ?? [];
      group.push(cue);
      targets.set(target, group);
      const animationFinished: EventListener = (event) => {
        if (event.target === node && (event as AnimationEvent).animationName === ANIMATION[kind]) finish(cue);
      };
      listen(node, "animationend", animationFinished);
      listen(node, "animationcancel", animationFinished);
      if (kind === "disclosure" || kind === "contact" || kind === "certificate") {
        const interacted = () => { if (!printing) finish(cue); };
        listen(node, "pointerdown", interacted);
        listen(node, "focus", interacted);
        // A visitor already using a control no longer needs an invitation.
        listen(node, "pointerenter", interacted);
      }
      if (details && kind === "disclosure") {
        listen(details, "toggle", () => { if (!printing && details.open) finish(cue); });
      }
    };

    document.querySelectorAll<HTMLDetailsElement>("[data-hover-disclosure]").forEach((details) => {
      const summary = details.querySelector<HTMLElement>("summary");
      if (!summary) return;
      add(summary, summary, "disclosure", details);
      if (details.classList.contains("experience-entry")) add(details, summary, "timeline");
    });
    document.querySelectorAll<HTMLElement>(".contact-actions .contact-email, .contact-actions .copy-email").forEach((node) => add(node, node, "contact"));
    document.querySelectorAll<HTMLElement>(".credentials a").forEach((node) => add(node, node, "certificate"));
    document.querySelectorAll<HTMLElement>(".about-portrait").forEach((node) => add(node, node, "portrait"));

    observer = new IntersectionObserver((entries) => {
      if (disposed) return;
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting && entry.intersectionRatio >= .4) visible.add(target);
        else visible.delete(target);
      });
      revealVisible();
    }, { threshold: .4, rootMargin: "0px 0px -12% 0px" });
    targets.forEach((_, target) => observer?.observe(target));

    const visibilityChanged = () => {
      if (disposed) return;
      running.forEach((cue) => write(cue.node, "discoveryPaused", document.hidden ? "true" : undefined));
      revealVisible();
    };
    const preferenceChanged = () => {
      if (reduced.matches) Array.from(running).forEach(finish);
      revealVisible();
    };
    const beforePrint = () => {
      printing = true;
      // Consume already-started decoration; printing must not replay it or alter
      // the native open/closed state managed by InteractiveDisclosures.
      Array.from(running).forEach(finish);
    };
    const afterPrint = () => { printing = false; revealVisible(); };
    listen(document, "visibilitychange", visibilityChanged);
    listen(reduced, "change", preferenceChanged);
    listen(window, "beforeprint", beforePrint);
    listen(window, "afterprint", afterPrint);

    return () => {
      disposed = true;
      observer?.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      original.forEach((attributes, node) => attributes.forEach((value, key) => {
        if (value === undefined) delete node.dataset[key];
        else node.dataset[key] = value;
      }));
      running.clear();
      visible.clear();
    };
  }, []);

  return null;
}
