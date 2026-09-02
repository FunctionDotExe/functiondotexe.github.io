import { SUMMIT_CONTENT } from "@/lib/summit-content";

export function EarthJourney() {
  const { about, descent, finale, identity } = SUMMIT_CONTENT;

  return (
    <div className="earth-journey" data-journey-chapter="depth">
      <section
        className="descent-scene descent-threshold"
        id="descent"
        aria-labelledby="descent-threshold-title"
        data-journey-scene
        data-world-realm="threshold"
        data-nav-theme="dark"
      >
        <div
          className="earth-stage earth-stage--threshold"
          data-journey-stage
        >
          <div className="descent-scene__content" data-reveal>
            <p className="scene-kicker scene-kicker--light">
              <span>{descent.threshold.number}</span>
              {descent.threshold.label}
            </p>
            <p className="descent-scene__depth">{descent.threshold.depth}</p>
            <h2 id="descent-threshold-title">{descent.threshold.title}</h2>
            <p className="descent-scene__body">{descent.threshold.body}</p>
            <a className="descent-scene__cue" href="#crust">
              {descent.threshold.cue}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="descent-scene descent-crust"
        id="crust"
        aria-labelledby="descent-crust-title"
        data-journey-scene
        data-world-realm="crust"
        data-nav-theme="dark"
      >
        <div className="earth-stage earth-stage--crust" data-journey-stage>
          <div className="descent-scene__content" data-reveal>
            <p className="scene-kicker scene-kicker--light">
              <span>{descent.crust.number}</span>
              {descent.crust.label}
            </p>
            <p className="descent-scene__depth">{descent.crust.depth}</p>
            <h2 id="descent-crust-title">{descent.crust.title}</h2>
            <p className="descent-scene__body">{descent.crust.body}</p>
            <dl className="descent-scene__notes" aria-label="Crust field notes">
              {descent.crust.notes.map((note) => (
                <div key={note.label}>
                  <dt>{note.label}</dt>
                  <dd>{note.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section
        className="descent-scene descent-mantle"
        id="mantle"
        aria-labelledby="descent-mantle-title"
        data-journey-scene
        data-world-realm="mantle"
        data-nav-theme="dark"
      >
        <div className="earth-stage earth-stage--mantle" data-journey-stage>
          <div className="descent-scene__content" data-reveal>
            <p className="scene-kicker scene-kicker--light">
              <span>{descent.mantle.number}</span>
              {descent.mantle.label}
            </p>
            <p className="descent-scene__depth">{descent.mantle.depth}</p>
            <h2 id="descent-mantle-title">{descent.mantle.title}</h2>
            <p className="descent-scene__body">{descent.mantle.body}</p>
            <dl className="descent-scene__notes" aria-label="Mantle field notes">
              {descent.mantle.notes.map((note) => (
                <div key={note.label}>
                  <dt>{note.label}</dt>
                  <dd>{note.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section
        className="about-scene descent-about"
        id="about"
        aria-labelledby="about-title"
        data-journey-scene
        data-world-realm="core"
        data-nav-theme="dark"
      >
        <div className="earth-stage earth-stage--about" data-journey-stage>
          <div className="about-scene__content" data-reveal>
            <p className="scene-kicker scene-kicker--light">
              <span>{descent.inner.number}</span>
              {descent.inner.label}
            </p>
            <p className="descent-scene__depth">{descent.inner.depth}</p>
            <h2 id="about-title">{about.statement}</h2>
            <p className="about-scene__body">{about.body}</p>
            <ul aria-label="Working disciplines">
              {about.disciplines.slice(0, 4).map((discipline) => (
                <li key={discipline}>{discipline}</li>
              ))}
            </ul>
            <a href={identity.resume} target="_blank" rel="noreferrer">
              View résumé
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="contact-scene descent-core"
        id="contact"
        aria-labelledby="contact-title"
        data-journey-scene
        data-world-realm="core"
        data-nav-theme="dark"
      >
        <div className="earth-stage earth-stage--core" data-journey-stage>
          <div className="contact-scene__content" data-reveal>
            <p className="scene-kicker scene-kicker--light">
              <span>{descent.core.number}</span>
              {descent.core.label}
            </p>
            <p className="descent-scene__depth">{descent.core.depth}</p>
            <h2 id="contact-title">{descent.core.title}</h2>
            <p>{finale.invitation}</p>
            <a className="contact-scene__email" href={`mailto:${identity.email}`}>
              Start a conversation
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <footer className="contact-scene__footer">
            <p>{identity.name}</p>
            <div>
              {identity.social.map((link) => (
                <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                  {link.label}
                </a>
              ))}
            </div>
            <a href="#entry">{descent.core.returnLabel} ↑</a>
          </footer>
        </div>
      </section>
    </div>
  );
}
