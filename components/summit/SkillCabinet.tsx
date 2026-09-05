"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SKILLS } from "@/lib/constants";
import { CrystalScene } from "./CrystalScene";

export function SkillCabinet() {
  const [active, setActive] = useState(0);
  const cabinetRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const printRef = useRef<{ active: number; fields: { element: HTMLDetailsElement; open: boolean }[] } | null>(null);
  const select = (index: number) => {
    if (printRef.current) return;
    activeRef.current = index;
    setActive(index);
  };

  useEffect(() => {
    const cabinet = cabinetRef.current;
    if (!cabinet) return;
    const beforePrint = () => {
      if (printRef.current) return;
      const fields = Array.from(cabinet.querySelectorAll<HTMLDetailsElement>("details"), (element) => ({ element, open: element.open }));
      printRef.current = { active: activeRef.current, fields };
      fields.forEach(({ element }) => { element.open = true; });
    };
    const afterPrint = () => {
      const snapshot = printRef.current;
      if (!snapshot) return;
      // Restore the DOM before releasing selection suppression. A queued toggle
      // reads currentTarget.open, so a restored closed field cannot select itself.
      snapshot.fields.forEach(({ element, open }) => { element.open = open; });
      activeRef.current = snapshot.active;
      setActive(snapshot.active);
      printRef.current = null;
    };
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      printRef.current?.fields.forEach(({ element, open }) => { element.open = open; });
      printRef.current = null;
    };
  }, []);

  return (
    <div className="skill-cabinet" ref={cabinetRef}>
      <div className="skill-cabinet__specimen">
        <div className="specimen-caption"><span>Inside the foundations</span><span aria-hidden="true">◇</span></div>
        <CrystalScene active={active} />
        <div className="specimen-caption specimen-caption--bottom"><span>{SKILLS[active].category}</span><span>Explore a field below</span></div>
      </div>
      <div className="skill-cabinet__fields">
        {SKILLS.map((skill, index) => (
          <details className={`skill-field${active===index?" skill-field--active":""}`} key={skill.category} open={index===0?true:undefined} onToggle={(event) => { if (event.currentTarget.open) select(index); }}>
            <summary onClick={() => select(index)}><span className={`skill-field__stone skill-field__stone--${index}`} aria-hidden="true"/><span>{skill.category}</span><ChevronDown size={17} aria-hidden="true"/></summary>
            <div className="skill-field__body"><p>{skill.description}</p><ul className="tag-list">{skill.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul></div>
          </details>
        ))}
      </div>
    </div>
  );
}
