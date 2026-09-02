import { SUMMIT_CONTENT } from "@/lib/summit-content";

export function HighAltitude() {
  const { about, finale, identity } = SUMMIT_CONTENT;

  return (
    <div className="high-altitude">
      <div className="high-altitude__scenes">
        <section className="about-scene" id="about" aria-labelledby="about-title">
          <div className="altitude-stage altitude-stage--about">
            <div className="about-scene__content" data-reveal>
              <p className="scene-kicker">
                <span>03</span>
                {about.label}
              </p>
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

        <section className="contact-scene" id="contact" aria-labelledby="contact-title">
          <div className="altitude-stage altitude-stage--contact">
            <div className="contact-scene__content" data-reveal>
              <p className="scene-kicker">
                <span>04</span>
                {finale.label}
              </p>
              <h2 id="contact-title">The next view.</h2>
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
              <a href="#entry">Back to base ↑</a>
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
}
