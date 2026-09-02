import { SUMMIT_CONTENT } from "@/lib/summit-content";

export function SummitHero() {
  const { hero, identity } = SUMMIT_CONTENT;

  return (
    <section className="journey-hero" id="entry" aria-labelledby="journey-title">
      <div className="journey-hero__stage">
        <div className="journey-hero__content">
          <p className="journey-hero__eyebrow">{hero.eyebrow}</p>
          <h1 id="journey-title" aria-label="The Summit">
            <span>{hero.title[0]}</span>
            <span>{hero.title[1]}</span>
          </h1>
          <p className="journey-hero__intro">{hero.introduction}</p>
          <a className="journey-button" href="#basecamp">
            Begin the ascent
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="journey-hero__footer">
          <span>{identity.location}</span>
          <p>
            <i aria-hidden="true" />
            Scroll to explore
          </p>
          <span>Portfolio / 2026</span>
        </div>
      </div>
    </section>
  );
}
