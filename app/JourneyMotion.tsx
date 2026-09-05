"use client";

import { useEffect } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / Math.max(end - start, 1));
  return t * t * (3 - 2 * t);
};
const planes = ["back", "atmosphere", "mid", "near"] as const;

// Original cave-entry profile: ease only at the ends and keep the middle
// moving at a constant speed instead of accelerating through the whole plate.
function continuumPosition(y: number, start: number, end: number, height: number, travel: number) {
  const distance = Math.max(end - start, 1);
  const local = Math.min(distance, Math.max(0, y - start));
  const edge = Math.min(distance * .1, height * .32);
  const speed = travel / Math.max(distance - edge, 1);
  if (local <= edge) {
    const t = local / edge;
    return speed * edge * (t / 2 - Math.sin(Math.PI * t) / (2 * Math.PI));
  }
  if (local >= distance - edge) {
    const t = (local - (distance - edge)) / edge;
    return speed * (distance - edge * 1.5) + speed * edge * (t / 2 + Math.sin(Math.PI * t) / (2 * Math.PI));
  }
  return speed * (local - edge / 2);
}

/**
 * Move only decorative scenery. Content, focus, and scrolling remain native.
 * Measurements are cached and invalidated by viewport, media, or content size.
 */
export function JourneyMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const world = document.querySelector<HTMLElement>(".journey-world");
    const threshold = document.querySelector<HTMLElement>(".descent-threshold");
    const story = document.querySelector<HTMLElement>(".journey__story");
    if (!world || !threshold || !story) return;
    const surface = world.querySelector<HTMLElement>(".journey-world__realm--surface");
    const continuum = world.querySelector<HTMLElement>(".journey-world__realm--continuum");
    const plate = world.querySelector<HTMLImageElement>(".journey-world__continuum-plate");
    const depth = world.querySelector<HTMLElement>(".journey-world__realm--depth");
    const depthPlates = planes.map((plane) => world.querySelector<HTMLImageElement>(`.journey-world__depth-layer--${plane} img`));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const depthSections = ["crust", "experience", "about", "contact"].map((id) => document.getElementById(id));
    let frame = 0;
    let dirty = true;
    let height = 1;
    let range = 1;
    let start = 0;
    let end = 1;
    let plateStart = 0;
    let plateTravel = 0;
    let depthTravel = [0, 0, 0, 0];
    let compact = false;
    let depthStops: { at: number; progress: number; x: number }[] = [];
    let cameraY = scrollY;
    let lastFrameTime = performance.now();
    let lookX = 0;
    let lookY = 0;
    let targetX = 0;
    let targetY = 0;
    const written = new Map<HTMLElement, Map<string, string>>();

    const write = (element: HTMLElement | null, name: string, value: string) => {
      if (!element) return;
      let cache = written.get(element);
      if (!cache) { cache = new Map(); written.set(element, cache); }
      if (cache.get(name) !== value) {
        element.style.setProperty(name, value);
        cache.set(name, value);
      }
    };
    const opacity = (element: HTMLElement | null, name: string, value: number) => {
      write(element, name, value.toFixed(4));
      write(element, "visibility", value > .001 ? "visible" : "hidden");
    };

    const measure = () => {
      height = world.clientHeight || innerHeight;
      range = Math.max(root.scrollHeight - innerHeight, 1);
      compact = reduced.matches || (height <= 600 && innerWidth > height);
      const rect = threshold.getBoundingClientRect();
      const top = rect.top + scrollY;
      const thresholdRange = Math.max(rect.height - height, 1);
      const runway = compact ? 0 : Math.min(height * .58, thresholdRange * .34);
      start = top - runway;
      end = top + thresholdRange + runway;
      const ratio = innerWidth <= 600 && innerHeight > innerWidth ? 844 / 390 : innerWidth <= 820 && innerHeight > innerWidth ? 11 / 8 : 9 / 16;
      const anchorHeight = Math.max(height, (plate?.clientWidth ?? innerWidth) * ratio);
      plateStart = Math.max(anchorHeight - height, 0) * .24;
      plateTravel = Math.max((plate?.clientHeight ?? height) - anchorHeight - plateStart, 0);
      depthTravel = depthPlates.map((image) => Math.max((image?.clientHeight ?? height) - height, 0));
      const transitionEnd = end + Math.min(height * .14, (end - start) * .08);
      depthStops = [{ at: transitionEnd, progress: 0, x: 0 }, ...depthSections.map((section, index) => {
        const bounds = section?.getBoundingClientRect();
        const dwell = Math.max((bounds?.height ?? height) - height, height * .35);
        const anchor = (bounds?.top ?? 0) + scrollY + dwell * (index === 3 ? .72 : .5);
        return {
          at: Math.min(range, index === 0 ? Math.max(anchor, transitionEnd + height * .9) : anchor),
          progress: [.22, .48, .74, 1][index],
          x: [.058, -.064, .072, 0][index],
        };
      })];
      for (let index = 1; index < depthStops.length; index += 1) {
        depthStops[index].at = Math.max(depthStops[index].at, depthStops[index - 1].at + 1);
      }
      dirty = false;
    };

    const render = (time = performance.now()) => {
      frame = 0;
      if (dirty) measure();
      const cameraTarget = Math.min(range, Math.max(0, scrollY));
      const elapsed = Math.min(50, Math.max(1, time - lastFrameTime));
      lastFrameTime = time;
      // Restore the original time-based follow. Native scrolling stays instant;
      // only the painted camera eases and continues rendering until settled.
      cameraY = reduced.matches ? cameraTarget : cameraY + (cameraTarget - cameraY) * (1 - Math.exp(-elapsed / 72));
      if (Math.abs(cameraTarget - cameraY) <= .12) cameraY = cameraTarget;
      const y = cameraY;
      write(root, "--page-progress", clamp(cameraTarget / range).toFixed(4));
      const motion = reduced.matches ? 0 : (innerWidth <= 720 ? .52 : innerWidth <= 980 ? .74 : 1) * (height <= 650 ? .72 : 1);
      const progress = clamp(y / Math.max(start, 1));
      // Carry blue-hour lighting across the stitched cave entrance, then let
      // it fall away underground instead of flashing back to daylight.
      const dusk = smooth(start * .1, start * .8, y);
      write(surface, "--surface-dusk", (dusk * .76).toFixed(4));
      write(surface, "--surface-stars", (dusk * .85).toFixed(4));
      write(continuum, "--continuum-dusk", (dusk * .76 * (1 - smooth(start + (end - start) * .18, start + (end - start) * .7, y))).toFixed(4));
      const lookBlend = 1 - Math.exp(-elapsed / 188);
      lookX += (targetX - lookX) * lookBlend;
      lookY += (targetY - lookY) * lookBlend;
      const lookStrength = motion * (1 - smooth(start - height, start, y));
      write(world, "--look-x", `${(lookX * lookStrength).toFixed(2)}px`);
      write(world, "--look-y", `${(lookY * lookStrength).toFixed(2)}px`);
      const offsets = { sky: 14, clouds: 42, valley: 74, trail: 92, foreground: 120 };
      Object.entries(offsets).forEach(([layer, distance]) => {
        write(world, `--world-${layer}-y`, `${(-(progress - .5) * distance * motion).toFixed(2)}px`);
      });
      const seam = Math.min(height * .14, (end - start) * .08);
      if (compact) {
        const belowSurface = y >= start;
        opacity(surface, "--surface-realm-opacity", belowSurface ? 0 : 1);
        opacity(continuum, "--continuum-realm-opacity", 0);
        opacity(depth, "--depth-realm-opacity", belowSurface ? 1 : 0);
      } else {
        const entering = smooth(start - seam, start, y);
        const leaving = smooth(end, end + seam, y);
        // Keep an opaque scene under the fading plate. Fading both realms
        // together exposes the dark canvas and produces a visible seam flash.
        opacity(surface, "--surface-realm-opacity", y < start ? 1 : 0);
        opacity(continuum, "--continuum-realm-opacity", entering * (1 - leaving));
        opacity(depth, "--depth-realm-opacity", y >= Math.max(start, end - height * 1.2) ? 1 : 0);
        // Prewarm the oversized entrance plate before it becomes visible.
        if (y >= start - height * .65 && y < start - seam) {
          opacity(continuum, "--continuum-realm-opacity", .0011);
        }
        const travel = continuumPosition(y, start, end, height, plateTravel);
        write(continuum, "--continuum-y", `${(-plateStart - travel).toFixed(2)}px`);
      }
      let depthProgress = 0;
      let depthX = 0;
      for (let index = 1; index < depthStops.length; index += 1) {
        const previous = depthStops[index - 1];
        const next = depthStops[index];
        if (y >= previous.at) {
          const amount = smooth(previous.at, next.at, y);
          depthProgress = previous.progress + (next.progress - previous.progress) * amount;
          depthX = previous.x + (next.x - previous.x) * amount;
        }
      }
      if (reduced.matches) { depthProgress = .35; depthX = 0; }
      const depthPulse = Math.sin(depthProgress * Math.PI * 3.5) * Math.sin(depthProgress * Math.PI) ** 2 * height * .045 * motion;
      planes.forEach((plane, index) => {
        const factor = [.18, .34, .68, 1][index];
        write(depth, `--depth-${plane}-x`, `${(-depthX * innerWidth * factor * motion).toFixed(2)}px`);
        write(depth, `--depth-${plane}-y`, `${(-depthTravel[index] * depthProgress - depthPulse * factor).toFixed(2)}px`);
      });
      write(depth, "--core-heat", clamp((depthProgress - .5) * 2).toFixed(4));
      if (Math.abs(cameraTarget - cameraY) > .12 || Math.abs(targetX - lookX) > .03 || Math.abs(targetY - lookY) > .03) schedule();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const invalidate = () => { dirty = true; schedule(); };
    const onPointer = (event: PointerEvent) => {
      if (reduced.matches || !finePointer.matches || event.pointerType !== "mouse" || scrollY >= start) return;
      targetX = (event.clientX / innerWidth - .5) * -22;
      targetY = (event.clientY / innerHeight - .5) * -12;
      schedule();
    };
    const resetPointer = () => { targetX = 0; targetY = 0; schedule(); };
    const motionChanged = () => { resetPointer(); invalidate(); };
    const observer = new ResizeObserver(invalidate);
    observer.observe(story);
    observer.observe(world);
    // Disclosure expansion changes the scroll range and the camera end point.
    const images = Array.from(world.querySelectorAll("img"));
    images.forEach((image) => image.addEventListener("load", invalidate));
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", invalidate);
    addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", resetPointer);
    reduced.addEventListener("change", motionChanged);
    render();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      images.forEach((image) => image.removeEventListener("load", invalidate));
      removeEventListener("scroll", schedule);
      removeEventListener("resize", invalidate);
      removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", resetPointer);
      reduced.removeEventListener("change", motionChanged);
      written.forEach((properties, element) => properties.forEach((_value, name) => element.style.removeProperty(name)));
    };
  }, []);
  return null;
}
