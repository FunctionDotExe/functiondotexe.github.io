import { SKILLS } from "@/lib/constants";

const evidence = [
  { href: "#project-phones", label: "Explore the mobile game" },
  { href: "#experience", label: "See my work at 4D" },
  { href: "#project-skin-cancer", label: "Read the skin-image study" },
  null,
  { href: "#experience-role-1", label: "See the QMorphix research" },
  { href: "#project-workshop", label: "Meet the dancing robot" },
];

/** Complete server-rendered content: each field has one heading and one tool list. */
export function SkillCabinet() {
  return (
    <div className="skill-cabinet skill-cabinet--static">
      {SKILLS.map((skill, index) => (
        <article className="skill-entry" id={`skill-field-${index}`} key={skill.category} tabIndex={-1} aria-labelledby={`skill-title-${index}`}>
          <div className="skill-entry__heading"><span className="skill-entry__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3 id={`skill-title-${index}`}>{skill.category}</h3></div>
          <p className="skill-entry__description">{skill.description}</p>
          <ul className="skill-entry__tools" aria-label={`${skill.category} tools`}>{skill.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
          {evidence[index] && <a className="text-link skill-entry__evidence" href={evidence[index]!.href}>{evidence[index]!.label}</a>}
        </article>
      ))}
    </div>
  );
}
