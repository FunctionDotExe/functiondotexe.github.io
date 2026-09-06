"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import { SKILLS } from "@/lib/constants";
import { skillScrollProgress } from "@/lib/skill-scroll";
import { CrystalScene, type CrystalScrollController } from "./CrystalScene";

const FIELDS = [
  { mineral: "Blue quartz", note: "From an idea to an interface", groups: [["Core languages", 9], ["Interfaces", 5]], x: 23, y: 0, mobileX: 8, mobileY: 0 },
  { mineral: "Amethyst", note: "The systems underneath", groups: [["Services & delivery", 7], ["Data stores", 4]], x: -23, y: 1, mobileX: -8, mobileY: 0 },
  { mineral: "Fluorite", note: "Learning from the evidence", groups: [["Training", 4], ["Evaluation & analysis", 6]], x: 22, y: -3, mobileX: 8, mobileY: -1 },
  { mineral: "Sunstone", note: "Connecting knowledge to action", groups: [["Applications", 5], ["Retrieval", 3], ["Workflow", 3]], x: 0, y: 4, mobileX: 0, mobileY: 1 },
  { mineral: "Celestite", note: "Testing a different kind of compute", groups: [["Frameworks", 3], ["Methods", 2]], x: -22, y: -2, mobileX: -8, mobileY: 0 },
  { mineral: "Lepidolite", note: "Code that moves in the real world", groups: [["In the machine", 6], ["Form & simulation", 2]], x: 23, y: 1, mobileX: 8, mobileY: 0 },
] as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

/** Hold a readable composition, then carry the specimen into the next field. */
export function mineralTheatreFrame(progress: number, compact: boolean) {
  const value = Number.isFinite(progress) ? Math.max(0, Math.min(FIELDS.length, progress)) : 0;
  const current = Math.min(FIELDS.length - 1, Math.floor(value));
  const next = Math.min(FIELDS.length - 1, current + 1);
  const transition = smooth((value - current - .76) / .24);
  const position = (index: number) => compact ? [FIELDS[index].mobileX, FIELDS[index].mobileY] : [FIELDS[index].x, FIELDS[index].y];
  const start = position(current);
  const end = position(next);
  return {
    active: Math.min(FIELDS.length - 1, Math.floor(value + .12)),
    x: start[0] + (end[0] - start[0]) * transition,
    y: start[1] + (end[1] - start[1]) * transition,
    scenes: FIELDS.map((_, index) => {
      const entering = index === 0 ? 1 : smooth((value - index + .24) / .24);
      const leaving = index === FIELDS.length - 1 ? 1 : smooth((index + 1 - value) / .24);
      const opacity = Math.min(entering, leaving);
      return { opacity, x: (leaving - entering) * (index % 2 ? -1 : 1) * (compact ? 22 : 64) };
    }),
  };
}

function ToolGroups({ index }: { index: number }) {
  let start = 0;
  return FIELDS[index].groups.map(([label, count]) => {
    const tools = SKILLS[index].tools.slice(start, start + count);
    start += count;
    return <div className="mineral-tools__group" key={label}><p>{label}</p><ul>{tools.map((tool) => <li key={tool}>{tool}</li>)}</ul></div>;
  });
}

export function SkillCabinet() {
  const [active, setActive] = useState(0);
  const cabinetRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<CrystalScrollController | null>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    const cabinet = cabinetRef.current;
    const fields = Array.from(cabinet?.querySelectorAll<HTMLElement>(".mineral-chapter") ?? []);
    const scenes = Array.from(cabinet?.querySelectorAll<HTMLElement>(".mineral-composition") ?? []);
    if (!cabinet || fields.length !== FIELDS.length || scenes.length !== FIELDS.length) return;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const roomy = window.matchMedia("(min-height: 740px) and (min-width: 360px)");
    const compact = window.matchMedia("(max-width: 760px)");
    let frame = 0;
    let dirty = true;
    let visible = true;
    let disposed = false;
    let printing = false;
    let guided = false;
    let stops: number[] = [];
    let end = 0;

    const select = (index: number) => {
      if (activeRef.current === index) return;
      activeRef.current = index;
      setActive(index);
    };
    const render = () => {
      frame = 0;
      if (disposed || printing || document.hidden) return;
      const nextGuided = root.dataset.expeditionMode === "guided" && roomy.matches && !reduced.matches;
      const modeChanged = cabinet.dataset.theatreMode !== (nextGuided ? "guided" : "free");
      if (modeChanged) {
        guided = nextGuided;
        cabinet.dataset.theatreMode = guided ? "guided" : "free";
        dirty = true;
      }
      if (dirty) {
        // These are stable native-scroll stops, not measurements in each frame.
        const padding = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
        cabinet.style.setProperty("--mineral-scroll-padding", `${padding}px`);
        fields.forEach((field) => { field.dataset.stopOffset = guided ? "0" : String(padding); });
        stops = fields.map((field) => field.getBoundingClientRect().top + window.scrollY - (guided ? 0 : padding));
        end = stops[stops.length - 1] + fields[fields.length - 1].offsetHeight;
        dirty = false;
        window.dispatchEvent(new Event("expedition:refresh"));
      }
      if (!visible) { motionRef.current?.setProgress(null); return; }
      const progress = skillScrollProgress(window.scrollY, stops, end);
      if (!guided) {
        motionRef.current?.setProgress(null);
        if (window.scrollY >= stops[0] && window.scrollY < end) select(Math.min(FIELDS.length - 1, Math.floor(progress)));
        return;
      }
      const view = mineralTheatreFrame(progress, compact.matches);
      select(view.active);
      cabinet.style.setProperty("--mineral-x", `${view.x}vw`);
      cabinet.style.setProperty("--mineral-y", `${view.y}svh`);
      cabinet.style.setProperty("--mineral-progress", String(progress / FIELDS.length));
      scenes.forEach((scene, index) => {
        scene.style.setProperty("--scene-opacity", String(view.scenes[index].opacity));
        scene.style.setProperty("--scene-shift", `${view.scenes[index].x}px`);
        scene.dataset.visible = view.scenes[index].opacity > .001 ? "true" : "false";
      });
      motionRef.current?.setProgress(progress);
    };
    const schedule = () => {
      if (!frame && !disposed && !printing && !document.hidden) frame = requestAnimationFrame(render);
    };
    const invalidate = () => { dirty = true; schedule(); };
    const scroll = () => { if (visible) schedule(); };
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; motionRef.current?.setProgress(null); }
      else invalidate();
    };
    const beforePrint = () => { printing = true; cancelAnimationFrame(frame); frame = 0; motionRef.current?.setProgress(null); };
    const afterPrint = () => { printing = false; invalidate(); };
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(invalidate);
    resize?.observe(cabinet);
    const story = cabinet.closest(".journey__story");
    if (story) resize?.observe(story);
    const intersection = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else { cancelAnimationFrame(frame); frame = 0; motionRef.current?.setProgress(null); }
    }, { rootMargin: "10% 0px" });
    intersection?.observe(cabinet);
    const mode = typeof MutationObserver === "undefined" ? null : new MutationObserver(invalidate);
    mode?.observe(root, { attributes: true, attributeFilter: ["data-expedition-mode"] });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", invalidate);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", invalidate);
    roomy.addEventListener("change", invalidate);
    compact.addEventListener("change", invalidate);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize?.disconnect(); intersection?.disconnect(); mode?.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", invalidate);
      roomy.removeEventListener("change", invalidate);
      compact.removeEventListener("change", invalidate);
      motionRef.current?.setProgress(null);
      delete cabinet.dataset.theatreMode;
      ["--mineral-x", "--mineral-y", "--mineral-progress", "--mineral-scroll-padding"].forEach((property) => cabinet.style.removeProperty(property));
      fields.forEach((field) => { field.dataset.stopOffset = "0"; });
      scenes.forEach((scene) => {
        scene.style.removeProperty("--scene-opacity"); scene.style.removeProperty("--scene-shift"); delete scene.dataset.visible;
      });
    };
  }, []);

  return (
    <div className="skill-cabinet skill-theatre" ref={cabinetRef}>
      <div className="mineral-theatre__stage">
        <div className="mineral-theatre__edition" aria-hidden="true"><span>A study in six disciplines</span><span>Specimen {String(active + 1).padStart(2, "0")} / 06</span></div>
        <div className="mineral-theatre__specimen"><CrystalScene active={active} motionRef={motionRef} /><p className="mineral-theatre__mineral" aria-hidden="true">{FIELDS[active].mineral}<span>Digital mineral study</span></p></div>
        <div className="mineral-theatre__compositions" aria-hidden="true">
          {SKILLS.map((skill, index) => (
            <div className={`mineral-composition mineral-composition--${index}`} key={skill.category} style={{ "--scene-opacity": index === 0 ? 1 : 0 } as CSSProperties}>
              <span className="mineral-composition__number">{String(index + 1).padStart(2, "0")}</span>
              <div className="mineral-composition__copy"><p className="mineral-composition__note">{FIELDS[index].note}</p><p className="mineral-composition__title">{skill.category}</p><p className="mineral-composition__description">{skill.description}</p></div>
              <div className="mineral-tools"><ToolGroups index={index} /></div>
            </div>
          ))}
        </div>
        <div className="mineral-theatre__navigation">
          <span className="mineral-theatre__scroll" aria-hidden="true">Scroll to explore <ArrowDown size={14} /></span>
          <nav aria-label="Explore skill fields">{SKILLS.map((skill, index) => <a key={skill.category} href={`#skill-field-${index}`} aria-label={skill.category} aria-current={active === index ? "step" : undefined} onClick={(event) => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { activeRef.current = index; setActive(index); } }}><span className={`skill-field__stone skill-field__stone--${index}`} aria-hidden="true" /><span className="mineral-theatre__nav-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></a>)}</nav>
          <a className="mineral-theatre__skip" href="#experience">Skip to experience</a>
          <span className="mineral-theatre__progress" aria-hidden="true"><span /></span>
        </div>
      </div>
      <div className="mineral-theatre__runway">
        {SKILLS.map((skill, index) => (
          <article className="mineral-chapter" id={`skill-field-${index}`} key={skill.category} tabIndex={-1} aria-labelledby={`skill-title-${index}`} data-expedition-stop={`skill-${index}`} data-stop-label={skill.category} data-stop-duration="1800" data-stop-offset="0" data-stop-scene={`skill-${index}`}>
            <div className="mineral-chapter__content"><p className="mineral-chapter__index"><span className={`skill-field__stone skill-field__stone--${index}`} aria-hidden="true" />{String(index + 1).padStart(2, "0")} / 06</p><h3 id={`skill-title-${index}`}>{skill.category}</h3><p className="mineral-chapter__description">{skill.description}</p><div className="mineral-tools"><ToolGroups index={index} /></div></div>
          </article>
        ))}
      </div>
    </div>
  );
}
