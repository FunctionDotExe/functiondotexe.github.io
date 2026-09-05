import { EXPERIENCE } from "@/lib/constants";

export function Experience() {
  return (
    <section className="experience section" id="experience">
      <div className="experience-heading" data-reveal>
        <span className="section-label section-label--light">Experience / field log</span>
        <h2>Learning in public.<br />Building in practice.</h2>
        <p>
          A record of the teams, classrooms, and research spaces where the work became sharper.
        </p>
      </div>

      <div className="experience-ledger">
        {EXPERIENCE.map((item, index) => (
          <article key={`${item.company}-${item.role}`} data-reveal>
            <div className="experience-ledger__number">0{index + 1}</div>
            <div className="experience-ledger__date">
              <span>{item.dates}</span>
              <small>{item.type}</small>
            </div>
            <div className="experience-ledger__role">
              <h3>{item.role}</h3>
              <p>{item.company}</p>
              <small>{item.location}</small>
            </div>
            <ul>
              {item.bullets.slice(0, 2).map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
