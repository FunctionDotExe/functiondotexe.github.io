"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { SKILLS } from "@/lib/constants";
import { skillScrollProgress } from "@/lib/skill-scroll";
import { CrystalScene, type CrystalScrollController } from "./CrystalScene";

export function SkillCabinet() {
  const [active, setActive] = useState(0);
  const cabinetRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<CrystalScrollController | null>(null);
  const activeRef = useRef(0);

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
    let stops: number[] = [];
    let end = 0;

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
      if (activeRef.current !== index) {
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
    const beforePrint = () => { printing = true; cancelAnimationFrame(frame); frame = 0; motionRef.current?.setProgress(null); };
    const afterPrint = () => { printing = false; invalidate(); };
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
        <div className="specimen-caption specimen-caption--bottom"><span>Scroll through the facets <ArrowDown size={14} aria-hidden="true" /></span><a href="#experience">Skip to experience</a></div>
      </div>
      <div className="skill-cabinet__fields">
        {SKILLS.map((skill, index) => (
          <article className={`skill-field${active === index ? " skill-field--active" : ""}`} key={skill.category} id={`skill-field-${index}`} tabIndex={-1} aria-labelledby={`skill-title-${index}`}>
            <p className="skill-field__number">{String(index + 1).padStart(2, "0")} / 06</p>
            <h3 id={`skill-title-${index}`}>{skill.category}</h3>
            <div className="skill-field__body"><p>{skill.description}</p><ul className="tag-list">{skill.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul></div>
          </article>
        ))}
      </div>
    </div>
  );
}
