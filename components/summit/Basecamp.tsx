import { SUMMIT_CONTENT } from "@/lib/summit-content";

export function Basecamp() {
  const { basecamp } = SUMMIT_CONTENT;

  return (
    <section className="basecamp-scene" id="basecamp" aria-labelledby="basecamp-title">
      <div className="basecamp-scene__content">
        <p className="scene-kicker" data-reveal>
          <span>01</span>
          Basecamp
        </p>
        <h2 id="basecamp-title" data-reveal>
          {basecamp.statement}
        </h2>
        <div className="basecamp-scene__note" data-reveal>
          <p>{basecamp.body}</p>
          <a href="#work">
            Meet the landmarks
            <span aria-hidden="true">↘</span>
          </a>
        </div>
      </div>
    </section>
  );
}
