"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Route } from "lucide-react";
import { ExpeditionPacing, type ExpeditionStop } from "@/lib/expedition-pacing";

type View = { ready: boolean; guided: boolean; reduced: boolean; label: string; holding: boolean };
type Controls = { toggle: () => void; skip: () => void };

export function ExpeditionDirector() {
  const [view, setView] = useState<View>({ ready: false, guided: false, reduced: false, label: "The expedition", holding: false });
  const controls = useRef<Controls | null>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const markers = Array.from(document.querySelectorAll<HTMLElement>("[data-expedition-stop]"));
    if (!markers.length) return;
    const story = document.querySelector<HTMLElement>(".journey__story");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const originalMode = root.getAttribute("data-expedition-mode");
    let preferredGuided = true;
    try { preferredGuided = sessionStorage.getItem("expedition-mode") !== "free"; } catch { /* Storage is optional. */ }
    let guided = preferredGuided && !reduced.matches;
    let printing = false;
    let disposed = false;
    let frame = 0;
    let modeFrame = 0;
    let dirty = true;
    let lastWritten = scrollY;
    let model = new ExpeditionPacing([], scrollY, Math.max(0, root.scrollHeight - innerHeight));
    let displayed = "";
    let announced = "";
    let measuredWidth = innerWidth;
    let measuredStoryHeight = story?.clientHeight ?? 0;
    let touch: { id: number; x: number; y: number; lastY: number; time: number; velocity: number; axis: "pending" | "vertical" | "native"; target: EventTarget | null; handled: boolean } | null = null;
    const listeners: (() => void)[] = [];
    const listen = (node: EventTarget, name: string, callback: EventListener, options?: AddEventListenerOptions) => {
      node.addEventListener(name, callback, options);
      listeners.push(() => node.removeEventListener(name, callback, options));
    };
    const syncView = (time = performance.now()) => {
      const holding = model.hold?.startedAt != null;
      const label = model.currentStop()?.label ?? "The expedition";
      const key = `${guided}|${reduced.matches}|${holding}|${label}`;
      if (key !== displayed) { displayed = key; setView({ ready: true, guided, reduced: reduced.matches, label, holding }); }
      progress.current?.style.setProperty("--director-progress", String(holding ? model.holdProgress(time) : 0));
      const arrival = holding && model.hold ? `${model.hold.stop.id}:${model.hold.startedAt}` : "";
      if (arrival && arrival !== announced) {
        announced = arrival;
        window.dispatchEvent(new CustomEvent("expedition:stop", { detail: { id: model.hold!.stop.id, label } }));
      }
    };
    const cancelModeRestore = () => { cancelAnimationFrame(modeFrame); modeFrame = 0; };
    const release = () => {
      cancelModeRestore();
      cancelAnimationFrame(frame); frame = 0;
      model.reset(scrollY);
      lastWritten = scrollY;
      touch = null;
      syncView();
    };
    const captureModeAnchor = (nextGuided: boolean) => {
      const padding = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      let current = model.stops[0];
      model.stops.forEach((stop) => { if (stop.y <= scrollY + 1) current = stop; });
      const marker = markers.find((node) => node.dataset.expeditionStop === current?.id);
      if (!marker) return null;
      const project = marker.closest<HTMLElement>(".project-chapter");
      if (project) {
        const projectMarkers = Array.from(project.querySelectorAll<HTMLElement>("[data-expedition-stop]"));
        const shots = Array.from(project.querySelectorAll<HTMLElement>(".project-shot"));
        let index = Math.max(0, projectMarkers.indexOf(marker));
        if (!guided) {
          // Reading mode shows all three paragraphs. Anchor the one actually
          // being read rather than the proportional position of its runway.
          index = 0;
          // scrollTo rounds differently from fractional text/grid geometry.
          shots.forEach((shot, i) => { if (shot.getBoundingClientRect().top <= innerHeight * .4 + 2) index = i; });
        }
        const node = nextGuided ? projectMarkers[index] ?? marker : shots[index] ?? project;
        return { node, marker: nextGuided, offset: Math.max(padding, Math.min(innerHeight * .4, node.getBoundingClientRect().top)) };
      }
      const semantic = marker.closest<HTMLElement>("article[id], section[id]") ?? marker;
      const skill = semantic.classList.contains("mineral-chapter");
      return { node: semantic, marker: skill && nextGuided, offset: skill ? padding : semantic.getBoundingClientRect().top };
    };
    const restoreModeAnchor = (anchor: ReturnType<typeof captureModeAnchor>) => {
      if (!anchor) return;
      // Theatres update their data attributes in mode observers / a single RAF.
      // Wait through that commit, then preserve semantic content, not old pixels.
      modeFrame = requestAnimationFrame(() => {
        modeFrame = requestAnimationFrame(() => {
          modeFrame = 0;
          if (disposed || printing || document.hidden || anchor.node.isConnected === false) return;
          const padding = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
          const declared = Number(anchor.node.dataset.stopOffset);
          const offset = anchor.marker ? Number.isFinite(declared) ? declared : padding : anchor.offset;
          const y = anchor.node.getBoundingClientRect().top + scrollY - offset;
          lastWritten = Math.max(0, Math.min(root.scrollHeight - innerHeight, y));
          window.scrollTo({ top: lastWritten, behavior: "instant" });
          measure();
          syncView();
        });
      });
    };
    const setMode = (value: boolean, remember = true) => {
      const nextGuided = value && !reduced.matches;
      const anchor = nextGuided !== guided ? captureModeAnchor(nextGuided) : null;
      preferredGuided = value;
      guided = nextGuided;
      root.setAttribute("data-expedition-mode", guided ? "guided" : "free");
      dirty = true;
      if (remember) { try { sessionStorage.setItem("expedition-mode", value ? "guided" : "free"); } catch { /* Optional. */ } }
      release();
      window.dispatchEvent(new CustomEvent("expedition:modechange", { detail: { mode: guided ? "guided" : "free" } }));
      restoreModeAnchor(anchor);
    };
    const measure = () => {
      const padding = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      const stops: ExpeditionStop[] = markers.map((node, index) => ({
        id: node.dataset.expeditionStop || `stop-${index}`,
        label: node.dataset.stopLabel || "Explore this scene",
        scene: node.dataset.stopScene || node.dataset.expeditionStop || `stop-${index}`,
        y: node.getBoundingClientRect().top + scrollY - (Number.isFinite(Number(node.dataset.stopOffset)) ? Number(node.dataset.stopOffset) : padding),
        duration: Number(node.dataset.stopDuration ?? 2000),
      }));
      const previousHold = model.hold;
      model = new ExpeditionPacing(stops, scrollY, Math.max(0, root.scrollHeight - innerHeight));
      // A guided stop may open its own disclosure. Preserve that stop's dwell
      // when its expansion changes the geometry further down the page.
      const sameStop = previousHold && model.stops.find((stop) => stop.id === previousHold.stop.id);
      if (sameStop && previousHold) {
        model.target = sameStop.y;
        model.hold = { stop: sameStop, direction: previousHold.direction, startedAt: previousHold.startedAt };
      }
      measuredWidth = innerWidth;
      measuredStoryHeight = story?.clientHeight ?? 0;
      lastWritten = scrollY;
      dirty = false;
    };
    const blocked = () => printing || document.hidden || Boolean(document.querySelector("dialog[open]")) || document.body.style.overflow === "hidden";
    const render = (time: number) => {
      frame = 0;
      if (disposed || modeFrame) return;
      if (dirty) measure();
      if (!guided || blocked()) { release(); return; }
      const y = model.tick(time);
      if (Math.abs(scrollY - y) > .1) {
        lastWritten = y;
        window.scrollTo({ top: y, behavior: "instant" });
      }
      syncView(time);
      if (model.moving) frame = requestAnimationFrame(render);
    };
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(render); };
    const invalidate = () => { dirty = true; schedule(); };
    const viewportResized = () => {
      const limit = Math.max(0, root.scrollHeight - innerHeight);
      if (innerWidth === measuredWidth && (story?.clientHeight ?? 0) === measuredStoryHeight && limit >= model.target) {
        model.limit = limit;
      } else invalidate();
    };
    const nativeTarget = (target: EventTarget | null, delta: number) => {
      let node = target instanceof Element ? target : null;
      if (node?.closest("dialog, input, textarea, select, [contenteditable='true'], [data-expedition-native]")) return true;
      // A nested scroller keeps both its movement and overscroll ownership.
      while (node && node !== root && node !== document.body) {
        if (node instanceof HTMLElement && node.scrollHeight > node.clientHeight + 1) {
          const overflow = getComputedStyle(node).overflowY;
          if (overflow === "auto" || overflow === "scroll") return true;
        }
        node = node.parentElement;
      }
      return !Number.isFinite(delta);
    };
    const input = (delta: number) => {
      if (dirty) measure();
      model.input(Math.max(-innerHeight * 1.1, Math.min(innerHeight * 1.1, delta)), performance.now());
      schedule();
    };
    listen(window, "wheel", ((event: WheelEvent) => {
      if (modeFrame) { release(); return; }
      if (!guided) return;
      if (blocked() || event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || nativeTarget(event.target, event.deltaY)) { release(); return; }
      if (!event.deltaY) return;
      event.preventDefault();
      input(event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1));
    }) as EventListener, { passive: false });
    listen(window, "touchstart", ((event: TouchEvent) => {
      if (modeFrame) { release(); return; }
      if (!guided || blocked() || event.touches.length !== 1) { release(); return; }
      const finger = event.touches[0];
      touch = { id: finger.identifier, x: finger.clientX, y: finger.clientY, lastY: finger.clientY, time: performance.now(), velocity: 0, axis: "pending", target: event.target, handled: false };
    }) as EventListener, { passive: true });
    listen(window, "touchmove", ((event: TouchEvent) => {
      const gesture = touch;
      if (!guided || !gesture) return;
      if (blocked() || event.touches.length !== 1 || event.defaultPrevented) { release(); return; }
      const finger = event.touches[0];
      if (finger.identifier !== gesture.id) { touch = null; return; }
      const dx = Math.abs(finger.clientX - gesture.x), dy = Math.abs(finger.clientY - gesture.y);
      if (gesture.axis === "pending") {
        if (dx > 7 && dx > dy) gesture.axis = "native";
        else if (dy > 7 && dy > dx) gesture.axis = "vertical";
      }
      const delta = gesture.lastY - finger.clientY;
      const now = performance.now();
      if (gesture.axis === "vertical" && event.cancelable && !nativeTarget(gesture.target, delta)) {
        event.preventDefault();
        gesture.handled = true;
        gesture.velocity = delta / Math.max(8, now - gesture.time);
        input(delta);
      } else if (gesture.axis !== "pending") {
        // Leave no background inertia running underneath a nested scroller,
        // horizontal crystal gesture, or a gesture already owned by the UA.
        release();
        return;
      }
      gesture.lastY = finger.clientY; gesture.time = now;
    }) as EventListener, { passive: false });
    listen(window, "touchend", ((event: TouchEvent) => {
      const gesture = touch; touch = null;
      if (!guided || event.touches.length || !gesture?.handled || blocked() || model.hold || performance.now() - gesture.time > 80) return;
      if (Math.abs(gesture.velocity) > .15) input(Math.max(-innerHeight * .7, Math.min(innerHeight * .7, gesture.velocity * 140)));
    }) as EventListener, { passive: true });
    listen(window, "touchcancel", (() => { touch = null; release(); }) as EventListener, { passive: true });
    listen(document, "keydown", ((event: KeyboardEvent) => {
      if (event.key === "Escape") { setMode(false); return; }
      if (modeFrame) { release(); return; }
      if (!guided || blocked() || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      const element = event.target instanceof Element ? event.target : null;
      if (element?.closest("a, button, input, textarea, select, [contenteditable='true'], [role='slider'], .crystal-scene")) return;
      const delta = event.key === "ArrowDown" ? 48 : event.key === "ArrowUp" ? -48 : event.key === "PageDown" ? innerHeight * .85 : event.key === "PageUp" ? -innerHeight * .85 : event.key === " " ? innerHeight * (event.shiftKey ? -.85 : .85) : 0;
      if (delta && !nativeTarget(event.target, delta)) { event.preventDefault(); input(delta); }
      else if (event.key === "Home" || event.key === "End") release();
    }) as EventListener);
    listen(document, "click", ((event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a[href], button[aria-haspopup='dialog']")) release();
    }) as EventListener, { capture: true });
    listen(document, "focusin", ((event: FocusEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest(".expedition-director")) release();
    }) as EventListener);
    listen(document, "pointerdown", ((event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest(".expedition-director")) cancelModeRestore();
    }) as EventListener, { passive: true });
    listen(window, "hashchange", release);
    listen(window, "popstate", release);
    listen(window, "scroll", (() => {
      // Idle native navigation must include its final subpixel/short step. The
      // tolerance applies only while our camera owns a moving or held position.
      if (!model.moving || Math.abs(scrollY - lastWritten) > 3) { model.reset(scrollY); lastWritten = scrollY; cancelAnimationFrame(frame); frame = 0; syncView(); }
    }) as EventListener, { passive: true });
    listen(window, "resize", viewportResized);
    listen(window, "expedition:refresh", invalidate);
    listen(reduced, "change", (() => setMode(preferredGuided, false)) as EventListener);
    listen(document, "visibilitychange", release);
    listen(window, "beforeprint", (() => { printing = true; release(); }) as EventListener);
    listen(window, "afterprint", (() => { printing = false; invalidate(); }) as EventListener);
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
      if ((story?.clientHeight ?? 0) !== measuredStoryHeight || innerWidth !== measuredWidth) invalidate();
    });
    if (story) resize?.observe(story);
    controls.current = {
      toggle: () => setMode(!guided),
      skip: () => {
        if (dirty) measure();
        const y = model.skipTarget();
        release();
        window.scrollTo({ top: y, behavior: reduced.matches ? "instant" : "smooth" });
      },
    };
    root.setAttribute("data-expedition-mode", guided ? "guided" : "free");
    measure();
    syncView();
    window.dispatchEvent(new CustomEvent("expedition:modechange", { detail: { mode: guided ? "guided" : "free" } }));
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelModeRestore();
      resize?.disconnect();
      listeners.forEach((remove) => remove());
      controls.current = null;
      if (originalMode === null) root.removeAttribute("data-expedition-mode");
      else root.setAttribute("data-expedition-mode", originalMode);
      progress.current?.style.removeProperty("--director-progress");
    };
  }, []);

  if (!view.ready) return null;
  return <aside className="expedition-director" aria-label="Journey pacing" data-guided={view.guided}>
    <div className="expedition-director__status" aria-live="polite" aria-atomic="true"><span aria-hidden="true">{view.holding ? <Pause size={16} /> : <Route size={16} />}</span><div><span>{view.guided ? view.holding ? "A moment to explore" : "Guided journey" : "Free scrolling"}</span><strong>{view.label}</strong></div></div>
    <span className="expedition-director__progress" aria-hidden="true" ref={progress} />
    <div className="expedition-director__actions">
      <button type="button" onClick={() => controls.current?.toggle()} disabled={view.reduced} aria-describedby="expedition-pacing-help" title={view.reduced ? "Reduced motion keeps scrolling free" : undefined}>{view.guided ? "Free scroll" : "Guided journey"}</button>
      {view.guided && <button type="button" onClick={() => controls.current?.skip()}>Skip this scene <ArrowRight size={15} aria-hidden="true" /></button>}
    </div>
    <span className="expedition-director__hint" id="expedition-pacing-help">{view.reduced ? "Reduced motion · free scrolling" : view.guided ? "Brief scene pauses · Esc exits" : "Explore at your own pace"}</span>
  </aside>;
}
