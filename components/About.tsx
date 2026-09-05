import { PERSONAL, SKILLS, STATS } from "@/lib/constants";

export function About() {
  return (
    <section className="profile section" id="profile">
      <div className="profile-intro">
        <div className="profile-copy" data-reveal>
          <span className="section-label">Profile / the through-line</span>
          <h2>Curiosity is only useful when it becomes craft.</h2>
          <p className="profile-copy__lead">{PERSONAL.bioShort}</p>
          <p>
            I like the moment when a messy problem starts becoming legible: the model has a metric,
            the interface has a rhythm, the hardware finally moves, and the pieces begin to behave
            like one system.
          </p>
        </div>

        <figure className="profile-portrait" data-reveal>
          <div className="profile-portrait__frame">
            <img
              src="/media/ruben-profile.png"
              width="800"
              height="800"
              loading="lazy"
              decoding="async"
              alt="Portrait of Ruben Maxwell"
            />
            <span className="profile-portrait__corner profile-portrait__corner--top">RM / 2026</span>
            <span className="profile-portrait__corner profile-portrait__corner--bottom">Toronto · 43.65° N</span>
          </div>
          <figcaption>
            <span><i /> Currently building at Fourth Dimension</span>
            <span>University of Toronto / Computer Science</span>
          </figcaption>
        </figure>
      </div>

      <div className="stat-rail" data-reveal>
        {STATS.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}<sup>+</sup></strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="capability-index">
        <div className="capability-index__heading" data-reveal>
          <span className="section-label">Capability index</span>
          <p>Depth where it matters. Range when the problem asks for it.</p>
        </div>
        <div className="capability-list">
          {SKILLS.map((skill, index) => (
            <article key={skill.category} data-reveal>
              <span>0{index + 1}</span>
              <h3>{skill.category}</h3>
              <p>{skill.description}</p>
              <div>{skill.tools.map((tool) => <small key={tool}>{tool}</small>)}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
