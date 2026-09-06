"use client";

import { useEffect } from "react";

/** Progressive enhancement: the underlying details/summary works without JS. */
export function InteractiveDisclosures() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const dismissers: (() => boolean)[] = [];
    const settle: (() => void)[] = [];
    const revealers = new Map<string, () => void>();
    const printHandlers: { before: () => void; after: () => void }[] = [];
    let focusFrame = 0;
    const cleanups = Array.from(document.querySelectorAll<HTMLDetailsElement>("[data-hover-disclosure]")).map((details) => {
      const summary = details.querySelector("summary");
      const panel = details.querySelector<HTMLElement>(".disclosure__panel");
      if (!summary || !panel) return () => {};
      let target = details.open;
      let printTarget: boolean | null = null;
      let animation: Animation | null = null;
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
      const click = (event: MouseEvent) => {
        if (event.defaultPrevented) return;
        event.preventDefault();
        // Native summary activation supplies clicks for pointer, Enter and Space.
        expand(!target);
      };
      const dismiss = () => {
        if (!target || !details.contains(document.activeElement)) return false;
        if (panel.contains(document.activeElement)) summary.focus({ preventScroll: true });
        expand(false);
        return true;
      };
      if (details.id) revealers.set(details.id, () => {
        target = true;
        finish();
        // Wait until native fragment navigation has finished assigning focus.
        cancelAnimationFrame(focusFrame);
        focusFrame = requestAnimationFrame(() => summary.focus({ preventScroll: true }));
      });
      printHandlers.push({
        before: () => {
          if (printTarget !== null) return;
          printTarget = target;
          target = true;
          finish();
        },
        after: () => {
          if (printTarget === null) return;
          target = printTarget;
          printTarget = null;
          finish();
        },
      });
      details.dataset.expanded = String(target);
      summary.addEventListener("click", click);
      dismissers.push(dismiss);
      settle.push(finish);
      return () => {
        animation?.cancel();
        details.open = printTarget ?? target;
        panel.style.removeProperty("height");
        delete details.dataset.expanded;
        summary.removeEventListener("click", click);
      };
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || (event.target as Element | null)?.closest?.("dialog[open]")) return;
      const dismissed = dismissers.map((dismiss) => dismiss()).some(Boolean);
      if (dismissed) event.preventDefault();
    };
    const onReducedMotion = () => { if (reduced.matches) settle.forEach((finish) => finish()); };
    const revealHash = (hash: string) => {
      if (!hash.startsWith("#")) return;
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); }
      catch { return; }
      revealers.get(id)?.();
    };
    const onHashChange = () => revealHash(window.location.hash);
    const onLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href^='#']");
      const hash = link?.getAttribute("href");
      if (hash) revealHash(hash);
    };
    const beforePrint = () => printHandlers.forEach((handler) => handler.before());
    const afterPrint = () => printHandlers.forEach((handler) => handler.after());
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onLink);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    reduced.addEventListener("change", onReducedMotion);
    onHashChange();
    return () => {
      cancelAnimationFrame(focusFrame);
      cleanups.forEach((cleanup) => cleanup());
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onLink);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      reduced.removeEventListener("change", onReducedMotion);
    };
  }, []);
  return null;
}
