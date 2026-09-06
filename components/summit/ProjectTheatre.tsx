"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import type { Landmark } from "@/lib/summit-content";
import { PROJECT_STORIES, projectBeatAt } from "@/lib/project-story";
import { RESUME } from "@/lib/constants";
import { ProjectViewer, ProjectImageButton, ProjectInspectButton } from "./ProjectViewer";
import { ArtifactMotion } from "./ArtifactMotion";

/** One native sticky stage, three physical scroll stops, no render loop in React. */
export function ProjectTheatre({ project, index }: { project: Landmark; index: number }) {
  const chapter = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [cinematic, setCinematic] = useState(false);
  const story = PROJECT_STORIES[project.visual];
  const id = `project-${project.visual}`;

  useEffect(() => {
    const element = chapter.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const spacious = matchMedia("(min-width: 761px) and (min-height: 740px), (min-width: 360px) and (max-width: 760px) and (min-height: 800px)");
    const root = document.documentElement;
    const markers = Array.from(element.querySelectorAll<HTMLElement>(".project-chapter__stop"));
    const shots = Array.from(element.querySelectorAll<HTMLElement>(".project-shot"));
    const originalOffsets = markers.map((marker) => marker.dataset.stopOffset);
    let frame = 0, dirty = true, inside = true, current = -1, printing = false;
    let stops: number[] = [], enabled = false;
    let geometry = "", announcing = false;
    const measure = () => {
      const padding = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      element.style.setProperty("--project-scroll-padding", `${padding}px`);
      if (enabled) {
        markers.forEach((marker) => { marker.style.removeProperty("top"); marker.style.removeProperty("scroll-margin-top"); marker.dataset.stopOffset = "0"; });
        stops = markers.map((marker) => marker.getBoundingClientRect().top + scrollY);
      } else {
        // Reading cards have unequal heights. Native fragments and guided stops
        // both address the actual paragraph, below the fixed navigation.
        const chapterTop = element.getBoundingClientRect().top;
        const tops = shots.map((shot) => shot.getBoundingClientRect().top);
        markers.forEach((marker, i) => {
          marker.style.setProperty("top", `${((tops[i] ?? chapterTop) - chapterTop).toFixed(3)}px`);
          marker.style.setProperty("scroll-margin-top", "0px");
          marker.dataset.stopOffset = String(padding);
        });
        stops = tops.map((top) => top + scrollY - padding);
      }
      dirty = false;
      const nextGeometry = `${enabled}|${padding}|${stops.map((stop) => stop.toFixed(3)).join(",")}`;
      if (geometry !== nextGeometry) {
        geometry = nextGeometry; announcing = true;
        window.dispatchEvent(new Event("expedition:refresh"));
        announcing = false;
      }
    };
    const render = () => {
      frame = 0;
      if (printing || document.hidden) return;
      if (dirty) measure();
      if (!enabled || !inside) return;
      const next = projectBeatAt(scrollY, stops);
      if (next !== current) { current = next; setActive(next); }
      const start = stops[next] ?? 0;
      const span = Math.max(1, (stops[next + 1] ?? start + innerHeight * .72) - start);
      element.style.setProperty("--shot-travel", Math.min(1, Math.max(0, (scrollY - start) / span)).toFixed(4));
    };
    const schedule = () => { if (!frame && (dirty || enabled && inside) && !printing && !document.hidden) frame = requestAnimationFrame(render); };
    const invalidate = () => { dirty = true; schedule(); };
    const refresh = () => { if (!announcing) invalidate(); };
    const changeMode = () => {
      enabled = !reduced.matches && spacious.matches && root.dataset.expeditionMode === "guided";
      element.dataset.theatre = enabled ? "cinematic" : "reading";
      setCinematic(enabled); dirty = true; schedule();
    };
    const visible = new IntersectionObserver(([entry]) => { inside = entry.isIntersecting; if (inside) invalidate(); else if (!dirty) { cancelAnimationFrame(frame); frame = 0; } }, { rootMargin: "100% 0px" });
    visible.observe(element);
    const resize = new ResizeObserver(invalidate); resize.observe(element);
    const storyElement = document.querySelector(".journey__story");
    if (storyElement) resize.observe(storyElement);
    const mode = new MutationObserver(changeMode);
    mode.observe(root, { attributes: true, attributeFilter: ["data-expedition-mode"] });
    addEventListener("scroll", schedule, { passive: true }); addEventListener("resize", invalidate);
    addEventListener("expedition:refresh", refresh);
    const beforePrint = () => { printing = true; cancelAnimationFrame(frame); frame = 0; shots.forEach((shot) => shot.removeAttribute("aria-hidden")); };
    const afterPrint = () => { printing = false; shots.forEach((shot, i) => { if (enabled && i !== Math.max(0, current)) shot.setAttribute("aria-hidden", "true"); else shot.removeAttribute("aria-hidden"); }); invalidate(); };
    addEventListener("beforeprint", beforePrint); addEventListener("afterprint", afterPrint);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", changeMode); spacious.addEventListener("change", changeMode);
    changeMode();
    return () => {
      cancelAnimationFrame(frame); visible.disconnect(); resize.disconnect(); mode.disconnect();
      removeEventListener("scroll", schedule); removeEventListener("resize", invalidate);
      removeEventListener("expedition:refresh", refresh);
      removeEventListener("beforeprint", beforePrint); removeEventListener("afterprint", afterPrint);
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", changeMode); spacious.removeEventListener("change", changeMode);
      delete element.dataset.theatre; element.style.removeProperty("--shot-travel"); element.style.removeProperty("--project-scroll-padding");
      markers.forEach((marker, i) => {
        marker.style.removeProperty("top"); marker.style.removeProperty("scroll-margin-top");
        if (originalOffsets[i] === undefined) delete marker.dataset.stopOffset;
        else marker.dataset.stopOffset = originalOffsets[i];
      });
    };
  }, []);

  return (
    <article ref={chapter} className={`waypoint project-chapter project-chapter--${project.visual}`} id={id} aria-labelledby={`title-${project.visual}`} style={{ "--chapter-color": story.accent } as CSSProperties} data-shot={active}>
      <ProjectViewer landmark={project}>
        <div className="project-chapter__stage">
          <div className="project-chapter__contours" aria-hidden="true"><svg viewBox="0 0 1000 800" preserveAspectRatio="none"><path d="M-100 510C190 60 820 750 1100 120M-100 550C220 80 850 780 1100 160M-100 590C250 100 880 810 1100 200M-100 630C280 120 910 840 1100 240M-100 670C310 140 940 870 1100 280"/><ellipse cx="600" cy="430" rx="340" ry="250"/></svg></div>
          <header className="project-chapter__heading">
            <div className="project-chapter__index"><span>{String(index + 1).padStart(2, "0")}</span><i /><span>{story.kind}</span></div>
            <h3 id={`title-${project.visual}`}>{project.title}</h3>
            <span className="project-chapter__altitude">{project.altitude}<span>{project.stage}</span></span>
          </header>
          <div className="project-chapter__object">
            <span className="project-chapter__halo" aria-hidden="true" />
            <ArtifactMotion kind={project.visual}>
              <figure className={`project-media project-media--${project.visual}`}>
                <ProjectImageButton><span className="project-media__canvas">
                  {project.visual === "phones" ? <span className="phone-composition">
                    <img src={project.gallery![0].src} width={project.gallery![0].width} height={project.gallery![0].height} alt={project.gallery![0].alt} loading="lazy" decoding="async" />
                    <img src={project.image!.src} width={project.image!.width} height={project.image!.height} alt={project.image!.alt} loading="lazy" decoding="async" />
                    <img src={project.gallery![1].src} width={project.gallery![1].width} height={project.gallery![1].height} alt={project.gallery![1].alt} loading="lazy" decoding="async" />
                  </span> : <img src={project.image!.src} width={project.image!.width} height={project.image!.height} alt={project.image!.alt} loading="lazy" decoding="async" />}
                  {project.visual === "signal" && <span className="project-viewfinder" aria-hidden="true"><i/><i/><i/><i/><b/></span>}
                </span></ProjectImageButton>
                <figcaption>{project.kicker}</figcaption>
              </figure>
            </ArtifactMotion>
            <div className="project-chapter__pipeline" aria-hidden="true">{story.route.map((node, i) => <span key={node} style={{ "--node": i } as CSSProperties}><small>0{i + 1}</small>{node}{i < 2 && <ArrowRight size={15}/>}</span>)}</div>
          </div>
          <div className="project-chapter__narrative">{story.beats.map((beat, i) => <section className="project-shot" data-active={active === i} aria-hidden={cinematic && active !== i ? true : undefined} key={beat.label}>
            <p className="project-shot__eyebrow"><span>0{i + 1}</span>{beat.label}</p><h4>{beat.title}</h4><p className="project-shot__body">{beat.body}</p>
            <div className="project-shot__evidence"><strong>{beat.value}</strong><span>{beat.caption}</span></div>
          </section>)}</div>
          <footer className="project-chapter__footer">
            <nav className="project-chapter__beats" aria-label={`${project.title} story chapters`}>{story.beats.map((beat, i) => <a key={beat.label} href={`#${id}-beat-${i}`} aria-current={active === i ? "step" : undefined}><span>0{i + 1}</span><span>{beat.label.replace("The ", "")}</span><i/></a>)}</nav>
            <div className="project-chapter__inspect"><ProjectInspectButton />{project.visual === "signal" && <a className="text-link" href={RESUME.youtubeUrl} target="_blank" rel="noreferrer"><Play size={16} aria-hidden="true"/>Watch demo<span className="sr-only"> on YouTube (opens in a new tab)</span></a>}</div>
            <ul className="project-chapter__tools" aria-label="Tools and disciplines">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          </footer>
          <span className="project-chapter__continue" aria-hidden="true"><ArrowDown size={14}/>{active === 2 ? "Continue the expedition" : "Scroll to unfold the story"}</span>
        </div>
        <div className="project-chapter__runway" aria-hidden="true">{story.beats.map((beat, i) => <div className="project-chapter__stop" key={beat.label} id={`${id}-beat-${i}`} data-expedition-stop={`${id}-${i}`} data-stop-scene={id} data-stop-label={`${project.title} · ${beat.label.toLowerCase()}`} data-stop-duration={i === 1 ? "2200" : "1800"} data-stop-offset="0"/>)}</div>
      </ProjectViewer>
    </article>
  );
}
