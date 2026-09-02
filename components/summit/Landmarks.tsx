import type { Landmark } from "@/lib/summit-content";
import { SUMMIT_CONTENT } from "@/lib/summit-content";

function ProjectArtifact({ landmark }: { landmark: Landmark }) {
  if (landmark.visual === "phones" && landmark.image) {
    return (
      <figure className="waypoint-artifact waypoint-artifact--phones" data-reveal>
        {landmark.gallery?.[0] ? (
          <img
            className="waypoint-phone waypoint-phone--left"
            src={landmark.gallery[0].src}
            width={landmark.gallery[0].width}
            height={landmark.gallery[0].height}
            alt={landmark.gallery[0].alt}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <img
          className="waypoint-phone waypoint-phone--main"
          src={landmark.image.src}
          width={landmark.image.width}
          height={landmark.image.height}
          alt={landmark.image.alt}
          loading="lazy"
          decoding="async"
        />
        {landmark.gallery?.[1] ? (
          <img
            className="waypoint-phone waypoint-phone--right"
            src={landmark.gallery[1].src}
            width={landmark.gallery[1].width}
            height={landmark.gallery[1].height}
            alt={landmark.gallery[1].alt}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <figcaption>Mobile product / interface study</figcaption>
      </figure>
    );
  }

  if (landmark.image) {
    return (
      <figure className={`waypoint-artifact waypoint-artifact--${landmark.visual}`} data-reveal>
        <span className="waypoint-artifact__glow" aria-hidden="true" />
        <img
          src={landmark.image.src}
          width={landmark.image.width}
          height={landmark.image.height}
          alt={landmark.image.alt}
          loading="lazy"
          decoding="async"
        />
        <figcaption>{landmark.kicker}</figcaption>
      </figure>
    );
  }

  return null;
}

function Waypoint({ landmark, index }: { landmark: Landmark; index: number }) {
  const headingId = `waypoint-${index + 1}`;
  const side = index % 2 === 0 ? "left" : "right";
  const titleLines: Record<Landmark["visual"], string[]> = {
    phones: ["Decyp3r"],
    console: ["Forge", "Fountain"],
    signal: ["AI Object", "Detection"],
    workshop: ["Arduino", "Robot"],
  };

  return (
    <article
      className={`waypoint waypoint--${side} waypoint--${landmark.visual}`}
      aria-labelledby={headingId}
      data-journey-scene
      data-nav-theme="dark"
    >
      <div className="waypoint__stage" data-journey-stage>
        <div className="waypoint__inner">
          <div className="waypoint__copy" data-reveal>
            <p className="scene-kicker scene-kicker--light">
              <span>{String(index + 1).padStart(2, "0")}</span>
              {landmark.stage}
            </p>
            <h3 id={headingId} aria-label={landmark.title}>
              {titleLines[landmark.visual].map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h3>
            <p className="waypoint__description">{landmark.description}</p>
            <ul aria-label="Tools and disciplines">
              {landmark.tags.slice(0, 4).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <p className="waypoint__status">
              <i aria-hidden="true" />
              {landmark.status}
            </p>
          </div>
          <ProjectArtifact landmark={landmark} />
        </div>
      </div>
    </article>
  );
}

export function Landmarks() {
  const { landmarks } = SUMMIT_CONTENT;

  return (
    <section className="climb" id="work" aria-labelledby="climb-title">
      <div className="climb__hud" aria-hidden="true">
        <div className="climb__progress">
          <span>Base</span>
          <i><b /></i>
          <span>Peak</span>
        </div>
      </div>

      <div className="climb__waypoints">
        <header className="climb-intro" data-journey-scene data-nav-theme="dark">
          <div className="climb-intro__stage" data-journey-stage>
            <div className="climb-intro__content" data-reveal>
              <p className="scene-kicker scene-kicker--light">
                <span>02</span>
                Selected work
              </p>
              <h2 id="climb-title">
                Landmarks
                <span>along the climb.</span>
              </h2>
              <p>Four projects. Four different pieces of terrain.</p>
            </div>
          </div>
        </header>

        {landmarks.map((landmark, index) => (
          <Waypoint landmark={landmark} index={index} key={landmark.title} />
        ))}
      </div>
    </section>
  );
}
