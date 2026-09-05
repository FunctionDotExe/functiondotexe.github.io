"use client";

import { useState, type PointerEvent } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PERSONAL } from "@/lib/constants";

const domains = [
  {
    id: "web",
    label: "Web systems",
    code: "01",
    title: "Interfaces that hold up in the real world.",
    detail: "Responsive products, production-minded frontends, and the service layers behind them.",
    tools: "React / Next.js / TypeScript",
  },
  {
    id: "ai",
    label: "Applied AI",
    code: "02",
    title: "Models made useful, measurable, and visible.",
    detail: "Computer vision, data workflows, and AI experiments built around observable results.",
    tools: "Python / TensorFlow / PyTorch",
  },
  {
    id: "quantum",
    label: "Quantum",
    code: "03",
    title: "Research translated into working experiments.",
    detail: "Hybrid quantum-classical pipelines, circuit simulation, and algorithm exploration.",
    tools: "Qiskit / PennyLane / Cirq",
  },
  {
    id: "hardware",
    label: "Robotics",
    code: "04",
    title: "Code that leaves the screen and moves.",
    detail: "Embedded prototypes, physical systems, and hands-on robotics built from first principles.",
    tools: "Arduino / Fusion 360 / C++",
  },
] as const;

export function Hero() {
  const [activeId, setActiveId] = useState<(typeof domains)[number]["id"]>("web");
  const active = domains.find((domain) => domain.id === activeId) ?? domains[0];

  const trackPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
  };

  return (
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-meta hero-enter" style={{ "--delay": "0.05s" } as React.CSSProperties}>
        <span>Portfolio / 2026</span>
        <span>Toronto, Canada</span>
        <span className="availability"><i /> Available for ambitious work</span>
      </div>

      <div className="hero-title-wrap">
        <p className="hero-kicker hero-enter" style={{ "--delay": "0.12s" } as React.CSSProperties}>
          Software engineer · systems thinker · relentless maker
        </p>
        <h1 className="hero-title" aria-label={`${PERSONAL.firstName} ${PERSONAL.lastName}`}>
          <span className="hero-title__line hero-enter" style={{ "--delay": "0.18s" } as React.CSSProperties}>
            {PERSONAL.firstName}
          </span>
          <span className="hero-title__line hero-title__line--outline hero-enter" style={{ "--delay": "0.26s" } as React.CSSProperties}>
            {PERSONAL.lastName}<b>.</b>
          </span>
        </h1>
      </div>

      <div className="hero-lower">
        <div className="hero-intro hero-enter" style={{ "--delay": "0.34s" } as React.CSSProperties}>
          <p>I turn rough ideas into working systems—across pixels, models, circuits, and machines.</p>
          <div className="hero-actions">
            <a className="button button--solid" href="#work">
              Explore selected work <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a className="text-link" href={PERSONAL.github} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div
          className="build-map hero-enter"
          style={{ "--delay": "0.42s" } as React.CSSProperties}
          onPointerMove={trackPointer}
          onPointerLeave={(event) => {
            event.currentTarget.style.removeProperty("--pointer-x");
            event.currentTarget.style.removeProperty("--pointer-y");
          }}
        >
          <div className="build-map__glare" aria-hidden="true" />
          <div className="build-map__topline">
            <span>Live build map</span>
            <span>4 connected disciplines</span>
          </div>

          <svg className="build-map__wires" viewBox="0 0 640 330" preserveAspectRatio="none" aria-hidden="true">
            <path d="M80 62 C180 62 185 165 320 165 S455 62 560 62" />
            <path d="M80 268 C180 268 185 165 320 165 S455 268 560 268" />
            <circle className="signal signal--one" r="5" />
            <circle className="signal signal--two" r="5" />
          </svg>

          <div className="build-map__nodes">
            {domains.map((domain) => (
              <button
                key={domain.id}
                type="button"
                className={`map-node map-node--${domain.id} ${activeId === domain.id ? "is-active" : ""}`}
                onPointerEnter={() => setActiveId(domain.id)}
                onFocus={() => setActiveId(domain.id)}
                onClick={() => setActiveId(domain.id)}
                aria-pressed={activeId === domain.id}
              >
                <span>{domain.code}</span>
                {domain.label}
              </button>
            ))}
          </div>

          <div className="map-core" aria-live="polite">
            <span className="map-core__code">Signal {active.code}</span>
            <strong>{active.title}</strong>
            <p>{active.detail}</p>
            <small>{active.tools}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
