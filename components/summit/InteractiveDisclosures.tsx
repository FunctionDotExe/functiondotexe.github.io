"use client";

import { useEffect } from "react";

/** Progressive enhancement: the underlying details/summary works without JS. */
export function InteractiveDisclosures() {
  useEffect(() => {
    const hover = matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const dismissers: (() => boolean)[] = [];
    const settle: (() => void)[] = [];
    const cleanups = Array.from(document.querySelectorAll<HTMLDetailsElement>("[data-hover-disclosure]")).map((details) => {
      const summary = details.querySelector("summary");
      const panel = details.querySelector<HTMLElement>(".disclosure__panel");
      if (!summary || !panel) return () => {};
      let pinned = details.open;
      let hovered = false;
      let suppressed = false;
      let target = details.open;
      let animation: Animation | null = null;
      let openTimer: ReturnType<typeof setTimeout> | undefined;
      let closeTimer: ReturnType<typeof setTimeout> | undefined;

      const clearTimers = () => { clearTimeout(openTimer); clearTimeout(closeTimer); };
      const finish = () => {
        animation?.cancel();
        animation = null;
        details.open = target;
        panel.style.removeProperty("height");
        details.dataset.expanded = String(target);
      };
      const expand = (next: boolean) => {
        if (target === next && details.open === next && !animation) return;
        const from = details.open ? panel.getBoundingClientRect().height : 0;
        const opacity = details.open ? getComputedStyle(panel).opacity : "0";
        animation?.cancel();
        animation = null;
        target = next;
        details.dataset.expanded = String(next);
        details.open = true;
        panel.style.height = "auto";
        const to = next ? panel.scrollHeight : 0;
        if (reduced.matches || typeof panel.animate !== "function") { finish(); return; }
        panel.style.height = `${from}px`;
        const current = panel.animate(
          [{ height: `${from}px`, opacity }, { height: `${to}px`, opacity: next ? "1" : "0" }],
          { duration: next ? 260 : 200, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" },
        );
        animation = current;
        current.onfinish = () => { if (animation === current) finish(); };
      };
      const closePreview = () => {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
          if (!pinned && !hovered && !details.contains(document.activeElement)) expand(false);
        }, 220);
      };
      const enter = (event: PointerEvent) => {
        if (!hover.matches || event.pointerType !== "mouse") return;
        hovered = true;
        clearTimers();
        if (!suppressed && !target) openTimer = setTimeout(() => expand(true), 120);
      };
      const leave = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        hovered = false;
        suppressed = false;
        clearTimeout(openTimer);
        closePreview();
      };
      const click = (event: MouseEvent) => {
        event.preventDefault();
        clearTimers();
        // The first click on a hover preview keeps it open for reading.
        // A second click closes it, even while the pointer remains over it.
        pinned = !pinned;
        suppressed = !pinned;
        expand(pinned);
      };
      const focus = () => { clearTimeout(closeTimer); };
      const blur = () => { if (!pinned) closePreview(); };
      const dismiss = () => {
        if (!target || (pinned && !details.contains(document.activeElement))) return false;
        clearTimers();
        pinned = false;
        suppressed = hovered;
        if (panel.contains(document.activeElement)) summary.focus({ preventScroll: true });
        expand(false);
        return true;
      };
      const capabilityChanged = () => {
        if (hover.matches) return;
        hovered = false;
        clearTimers();
        closePreview();
      };
      details.dataset.expanded = String(target);
      details.addEventListener("pointerenter", enter);
      details.addEventListener("pointerleave", leave);
      details.addEventListener("focusin", focus);
      details.addEventListener("focusout", blur);
      summary.addEventListener("click", click);
      hover.addEventListener("change", capabilityChanged);
      dismissers.push(dismiss);
      settle.push(finish);
      return () => {
        clearTimers();
        animation?.cancel();
        details.open = pinned;
        panel.style.removeProperty("height");
        delete details.dataset.expanded;
        details.removeEventListener("pointerenter", enter);
        details.removeEventListener("pointerleave", leave);
        details.removeEventListener("focusin", focus);
        details.removeEventListener("focusout", blur);
        summary.removeEventListener("click", click);
        hover.removeEventListener("change", capabilityChanged);
      };
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const dismissed = dismissers.map((dismiss) => dismiss()).some(Boolean);
      if (dismissed) event.preventDefault();
    };
    const onReducedMotion = () => { if (reduced.matches) settle.forEach((finish) => finish()); };
    document.addEventListener("keydown", onKeyDown);
    reduced.addEventListener("change", onReducedMotion);
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      document.removeEventListener("keydown", onKeyDown);
      reduced.removeEventListener("change", onReducedMotion);
    };
  }, []);
  return null;
}
