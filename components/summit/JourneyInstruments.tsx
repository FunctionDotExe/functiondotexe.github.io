"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowRight, Compass, X } from "lucide-react";

const route = [
  { id: "entry", title: "The summit", note: "A first look", terrain: "Sunlit peaks" },
  { id: "work", title: "The work", note: "Projects & experiments", terrain: "Along the ridgeline" },
  { id: "crust", title: "The foundations", note: "Skills & tools", terrain: "Inside the crystal cavern" },
  { id: "experience", title: "The experience", note: "Engineering, research, teaching", terrain: "Through the deeper layers" },
  { id: "about", title: "The person", note: "A little about Ruben", terrain: "Beneath the surface" },
  { id: "contact", title: "The next adventure", note: "Get in touch", terrain: "At the core" },
];

export function JourneyInstruments() {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const navigationFrame = useRef(0);

  useEffect(() => {
    const sections = route.map(({ id }) => document.getElementById(id));
    let frame = 0;
    let positions: number[] = [];
    const measure = () => { positions = sections.map((section) => section ? section.getBoundingClientRect().top + scrollY : Infinity); };
    const update = () => {
      frame = 0;
      let next = 0;
      positions.forEach((top, i) => { if (top < scrollY + innerHeight * .45) next = i; });
      setCurrent(next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = () => { measure(); schedule(); };
    const observer = new ResizeObserver(resize);
    const story = document.querySelector(".journey__story");
    if (story) observer.observe(story);
    measure(); update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(navigationFrame.current); observer.disconnect(); removeEventListener("scroll", schedule); removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    dialog.current?.close();
    cancelAnimationFrame(navigationFrame.current);
    navigationFrame.current = requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }));
  };

  return (
    <>
      <button ref={trigger} className="route-instrument" type="button" aria-label={`Explore the route. Current chapter: ${route[current].title}`} aria-haspopup="dialog" aria-expanded={open} aria-controls="route-map" onClick={() => { dialog.current?.showModal(); if (dialog.current) dialog.current.scrollTop = 0; setOpen(true); }}>
        <span className="route-instrument__dial" aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" /><circle className="route-instrument__progress" cx="24" cy="24" r="22" pathLength="1" /></svg><Compass size={21} strokeWidth={1.2} /></span>
        <span><small>Explore the route</small><strong>{route[current].title}</strong></span>
      </button>
      <dialog ref={dialog} id="route-map" className="route-map" aria-labelledby="route-title" onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="route-map__surface">
          <header><span>Ruben Maxwell / Field guide</span><button className="icon-button" type="button" aria-label="Close route map" onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button></header>
          <div className="route-map__layout">
            <div className="route-map__art">
              <svg viewBox="0 0 400 600" fill="none" aria-hidden="true">
                <defs><linearGradient id="map-light" x2="0" y2="1"><stop stopColor="#ffe2a7"/><stop offset=".5" stopColor="#a4e8ff"/><stop offset="1" stopColor="#ffac89"/></linearGradient></defs>
                <g stroke="#fff4db" strokeOpacity=".16">{Array.from({length: 9}, (_, i) => <path key={i} d={`M${15+i*7} ${285-i*12} Q80 ${180-i*13} 132 ${222-i*12} L220 ${62+i*8} 290 ${201-i*4} Q345 ${185+i*5} ${390-i*6} ${294+i*6} L${335-i*5} ${400-i*4} Q220 ${500-i*8} ${56+i*7} ${388-i*5}Z`} />)}</g>
                <path d="M220 75 165 220 255 292 138 371 246 453 198 543" stroke="url(#map-light)" strokeWidth="1.5" strokeDasharray="3 6"/>
                {[[220,75],[165,220],[255,292],[138,371],[246,453],[198,543]].map(([x,y],i) => <g key={i}><circle cx={x} cy={y} r={i===current?10:5} fill={i===current?"#ffe2a7":"#252449"} stroke="#ffe2a7"/><circle cx={x} cy={y} r={i===current?18:11} stroke="#ffe2a7" strokeOpacity=".2"/></g>)}
              </svg>
              <p>{route[current].terrain}</p>
            </div>
            <div><h2 id="route-title">Choose your<br />own path.</h2><p className="route-map__intro">Follow the landscape, or go straight to what brought you here.</p>
              <nav aria-label="Expedition chapters">{route.map((item, i) => <a key={item.id} href={`#${item.id}`} aria-current={current===i?"location":undefined} onClick={(event) => navigate(event, item.id)}><span className="route-map__dot" aria-hidden="true"/><span><strong>{item.title}</strong><small>{item.note}</small></span><ArrowRight size={21} aria-hidden="true"/></a>)}</nav>
            </div>
          </div>
          <footer><span>From the summit to the core.</span><span>Made with curiosity in Toronto.</span></footer>
        </div>
      </dialog>
    </>
  );
}
