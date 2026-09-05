"use client";

import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";

const REPLAY_EVENT = "journey:replay-arrival";

export function ArrivalIntro() {
  const initialArrival = useRef<boolean | null>(null);
  useEffect(() => {
    const root = document.documentElement;
    initialArrival.current ??= root.dataset.arrival === "boot";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let generation = 0;
    let waitTimer: ReturnType<typeof setTimeout> | undefined;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;
    let startFrame = 0;
    let disposed = false;

    const finish = () => {
      generation += 1;
      clearTimeout(waitTimer);
      clearTimeout(finishTimer);
      cancelAnimationFrame(startFrame);
      delete root.dataset.arrival;
    };

    const start = (replay = false) => {
      if (disposed || reduced.matches) { finish(); return; }
      if (!replay && (scrollY > 48 || (location.hash && location.hash !== "#entry"))) { finish(); return; }
      finish();
      const run = generation;
      root.dataset.arrival = "waiting";
      const images = Array.from(document.querySelectorAll<HTMLImageElement>(".journey-world__realm--surface img"));
      const ready = Promise.allSettled(images.map((image) => typeof image.decode === "function" ? image.decode() : Promise.resolve()));
      let queued = false;
      const begin = () => {
        if (disposed || queued || generation !== run || root.dataset.arrival !== "waiting") return;
        queued = true;
        clearTimeout(waitTimer);
        // One frame preserves the initial state when replaying the sequence.
        startFrame = requestAnimationFrame(() => {
          if (disposed || generation !== run || root.dataset.arrival !== "waiting") return;
          root.dataset.arrival = "playing";
          finishTimer = setTimeout(finish, 3100);
        });
      };
      waitTimer = setTimeout(begin, 900);
      ready.then(begin);
    };

    const onScroll = () => { if (scrollY > 48 && root.dataset.arrival) finish(); };
    const onIntent = () => { if (root.dataset.arrival) finish(); };
    const onMotionChange = () => { if (reduced.matches) finish(); };
    const onVisibility = () => { if (document.hidden) finish(); };
    const replay = () => {
      if (reduced.matches) return;
      window.scrollTo({ top: 0, behavior: "instant" });
      start(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onIntent, { passive: true });
    window.addEventListener("touchstart", onIntent, { passive: true });
    window.addEventListener("keydown", onIntent);
    window.addEventListener("pointerdown", onIntent);
    window.addEventListener(REPLAY_EVENT, replay);
    window.addEventListener("pagehide", finish);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotionChange);
    if (initialArrival.current) start();
    return () => {
      disposed = true;
      finish();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("touchstart", onIntent);
      window.removeEventListener("keydown", onIntent);
      window.removeEventListener("pointerdown", onIntent);
      window.removeEventListener(REPLAY_EVENT, replay);
      window.removeEventListener("pagehide", finish);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div className="arrival" aria-hidden="true">
      <div className="arrival__veil">
        <div className="arrival__signature">
          <svg viewBox="0 0 240 110" fill="none">
            <path className="arrival__ridge" pathLength="1" d="M12 96 64 39 86 65 129 10 190 80 209 57 232 96" />
            <path className="arrival__ridge arrival__ridge--detail" pathLength="1" d="m100 47 29-37-8 54 22-13 47 29M49 56l15-17 4 32 18-6" />
          </svg>
          <span>Ruben Maxwell · Portfolio</span>
        </div>
      </div>
      <div className="arrival__light" />
    </div>
  );
}

export function ReplayArrival() {
  return (
    <button className="arrival-replay" type="button" onClick={() => window.dispatchEvent(new Event(REPLAY_EVENT))}>
      <RotateCcw size={13} aria-hidden="true" /> Replay opening
    </button>
  );
}
