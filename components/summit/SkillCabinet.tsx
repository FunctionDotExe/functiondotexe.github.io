"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ChevronDown } from "lucide-react";
import { SKILLS } from "@/lib/constants";
import { skillScrollProgress } from "@/lib/skill-scroll";
import { CrystalScene, type CrystalScrollController } from "./CrystalScene";

export function SkillCabinet() {
  const [active, setActive] = useState(0);
  // Server HTML stays complete. Scroll enhancement reveals each panel on arrival.
  const allFields = (1 << SKILLS.length) - 1;
  const [opened, setOpened] = useState(allFields);
  const cabinetRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<CrystalScrollController | null>(null);
  const activeRef = useRef(0);
  const openedRef = useRef(allFields);
  const toggleRef = useRef<((index: number) => void) | null>(null);

  useEffect(() => {
    const cabinet = cabinetRef.current;
    const specimen = cabinet?.querySelector<HTMLElement>(".skill-cabinet__specimen");
    const fields = Array.from(cabinet?.querySelectorAll<HTMLElement>(".skill-field") ?? []);
    if (!cabinet || !specimen || !fields.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const progress = cabinet.querySelector<HTMLElement>(".skill-cabinet__progress");
    let frame = 0;
    let dirty = true;
    let visible = true;
    let disposed = false;
    let printing = false;
    let initialized = false;
    let visited = 0;
    let phase = -1;
    let wasReduced = reduced.matches;
    let printFields: { panel: HTMLElement; toggle: HTMLElement; hidden: string | null; inert: boolean; open: string | undefined; expanded: string | null }[] | null = null;
    let stops: number[] = [];
    let end = 0;

    const openFields = (mask: number) => {
      if (openedRef.current === mask) return;
      openedRef.current = mask;
      setOpened(mask);
    };
    toggleRef.current = (index) => {
      if (printing) return;
      openFields(openedRef.current ^ (1 << index));
      activeRef.current = index;
      setActive(index);
    };

    const render = () => {
      frame = 0;
      if (disposed || printing || document.hidden) return;
      if (dirty) {
        // Scroll frames read cached stops; CSS keeps the specimen sticky.
        const specimenHeight = specimen.offsetHeight;
        const style = getComputedStyle(specimen);
        const top = Number.parseFloat(style.top) || 0;
        const readingLine = style.position === "sticky" ? top + specimenHeight + 24 : 100;
        cabinet.style.setProperty("--specimen-height", `${specimenHeight}px`);
        cabinet.style.setProperty("--skill-scroll-padding", getComputedStyle(document.documentElement).scrollPaddingTop);
        stops = fields.map((field) => field.getBoundingClientRect().top + window.scrollY - readingLine);
        end = stops[stops.length - 1] + fields[fields.length - 1].offsetHeight;
        dirty = false;
      }
      const value = skillScrollProgress(window.scrollY, stops, end);
      const index = Math.min(SKILLS.length - 1, Math.floor(value));
      const changed = activeRef.current !== index;
      const nextPhase = window.scrollY < stops[0] ? -1 : window.scrollY >= end ? SKILLS.length : index;
      const entering = phase !== nextPhase && nextPhase >= 0 && nextPhase < SKILLS.length;
      const reached = window.scrollY >= stops[0] ? (1 << (index + 1)) - 1 : 0;
      if (!initialized) {
        openFields(reduced.matches ? allFields : reached);
        initialized = true;
      } else if (reduced.matches && !wasReduced) {
        openFields(allFields);
      } else if (!reduced.matches) {
        // Keep previously visited fields open. A manual close lasts until the
        // reader leaves and returns; ordinary scroll frames never override it.
        openFields(openedRef.current | (reached & ~visited) | (entering ? 1 << index : 0));
      }
      visited |= reached;
      phase = nextPhase;
      wasReduced = reduced.matches;
      if (changed) {
        activeRef.current = index;
        setActive(index);
      }
      progress?.style.setProperty("--skill-progress", String(value / SKILLS.length));
      motionRef.current?.setProgress(visible && !reduced.matches ? value : null);
    };
    const schedule = () => {
      if (!frame && !disposed && !printing && !document.hidden) frame = requestAnimationFrame(render);
    };
    const onScroll = () => { if (visible) schedule(); };
    const invalidate = () => { dirty = true; schedule(); };
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else invalidate();
    };
    const restorePrintFields = () => {
      printFields?.forEach(({ panel, toggle, hidden, inert, open, expanded }) => {
        if (hidden === null) panel.removeAttribute("aria-hidden"); else panel.setAttribute("aria-hidden", hidden);
        panel.inert = inert;
        if (open === undefined) delete panel.dataset.open; else panel.dataset.open = open;
        if (expanded === null) toggle.removeAttribute("aria-expanded"); else toggle.setAttribute("aria-expanded", expanded);
      });
      printFields = null;
    };
    const beforePrint = () => {
      if (printing) return;
      printing = true;
      cancelAnimationFrame(frame);
      frame = 0;
      motionRef.current?.setProgress(null);
      // Print events need synchronous DOM exposure, including accessible PDFs.
      // React's mask stays intact while scroll/toggle work is suspended.
      printFields = fields.flatMap((field) => {
        const panel = field.querySelector<HTMLElement>(".skill-field__panel");
        const toggle = field.querySelector<HTMLElement>(".skill-field__toggle");
        if (!panel || !toggle) return [];
        const snapshot = { panel, toggle, hidden: panel.getAttribute("aria-hidden"), inert: panel.inert, open: panel.dataset.open, expanded: toggle.getAttribute("aria-expanded") };
        panel.setAttribute("aria-hidden", "false");
        panel.inert = false;
        panel.dataset.open = "true";
        toggle.setAttribute("aria-expanded", "true");
        return [snapshot];
      });
    };
    const afterPrint = () => { restorePrintFields(); printing = false; invalidate(); };
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(invalidate);
    resize?.observe(specimen);
    resize?.observe(cabinet);
    const story = cabinet.closest(".journey__story");
    if (story) resize?.observe(story);
    const intersection = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    }, { rootMargin: "15% 0px" });
    intersection?.observe(cabinet);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", invalidate);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", invalidate);
    schedule();
    return () => {
      disposed = true;
      restorePrintFields();
      cancelAnimationFrame(frame);
      resize?.disconnect();
      intersection?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", invalidate);
      motionRef.current?.setProgress(null);
      toggleRef.current = null;
      cabinet.style.removeProperty("--specimen-height");
      cabinet.style.removeProperty("--skill-scroll-padding");
      progress?.style.removeProperty("--skill-progress");
    };
  }, []);

  return (
    <div className="skill-cabinet" ref={cabinetRef}>
      <div className="skill-cabinet__specimen">
        <div className="specimen-caption"><span>Inside the foundations</span><span>{String(active + 1).padStart(2, "0")} / 06</span></div>
        <CrystalScene active={active} motionRef={motionRef} />
        <div className="skill-cabinet__navigation">
          <nav aria-label="Explore skill fields">
            {SKILLS.map((skill, index) => (
              <a key={skill.category} href={`#skill-field-${index}`} aria-label={skill.category} aria-current={active === index ? "step" : undefined}>
                <span className={`skill-field__stone skill-field__stone--${index}`} aria-hidden="true" />
              </a>
            ))}
          </nav>
          <div className="skill-cabinet__progress" aria-hidden="true"><span /></div>
        </div>
        <div className="specimen-caption specimen-caption--bottom"><span>Scroll to unfold each field <ArrowDown size={14} aria-hidden="true" /></span><a href="#experience">Skip to experience</a></div>
      </div>
      <div className="skill-cabinet__fields">
        {SKILLS.map((skill, index) => (
          <article className={`skill-field${active === index ? " skill-field--active" : ""}`} key={skill.category} id={`skill-field-${index}`} tabIndex={-1} aria-labelledby={`skill-title-${index}`}>
            <p className="skill-field__number">{String(index + 1).padStart(2, "0")} / 06</p>
            <h3 id={`skill-title-${index}`}><button type="button" className="skill-field__toggle" aria-expanded={Boolean(opened & (1 << index))} aria-controls={`skill-body-${index}`} onClick={() => toggleRef.current?.(index)}><span>{skill.category}</span><ChevronDown size={21} aria-hidden="true" /></button></h3>
            <div id={`skill-body-${index}`} className="skill-field__panel" data-open={Boolean(opened & (1 << index))} aria-hidden={!(opened & (1 << index))} inert={!(opened & (1 << index))}>
              <div className="skill-field__body"><p>{skill.description}</p><ul className="tag-list">{skill.tools.map((tool, toolIndex) => <li key={tool} style={{ "--skill-tool-index": Math.min(toolIndex, 8) } as CSSProperties}>{tool}</li>)}</ul></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
