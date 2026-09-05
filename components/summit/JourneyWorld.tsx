import { SUMMIT_CONTENT } from "@/lib/summit-content";

export function JourneyWorld() {
  const { world } = SUMMIT_CONTENT;

  return (
    <div className="journey-world" aria-hidden="true">
      <div className="journey-world__realm journey-world__realm--surface">
        <div className="journey-world__layer journey-world__layer--sky">
          <img src={world.sky} width="1536" height="1024" alt="" fetchPriority="high" />
        </div>
        <div className="journey-world__layer journey-world__layer--clouds">
          <img src={world.clouds} width="1536" height="1024" alt="" decoding="async" />
        </div>
        <div className="journey-world__layer journey-world__layer--valley">
          <img src={world.valley} width="1536" height="1024" alt="" decoding="async" />
        </div>
        <div className="journey-world__layer journey-world__layer--trail">
          <img src={world.trail} width="1536" height="1024" alt="" decoding="async" />
        </div>
        <div className="journey-world__layer journey-world__layer--foreground">
          <img
            src={world.foreground}
            width="1536"
            height="1024"
            alt=""
            decoding="async"
          />
        </div>
        <span className="journey-world__dusk" />
        <svg className="journey-world__stars" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 48 }, (_, index) => (
            <circle key={index} cx={(index * 173 + 59) % 1440} cy={(index * 67 + 23) % 350} r={index % 7 === 0 ? 1.5 : .75} opacity={.25 + (index % 5) * .13} />
          ))}
        </svg>
      </div>

      <div className="journey-world__realm journey-world__realm--depth">
        <div className="journey-world__depth-layer journey-world__depth-layer--back">
          <img
            className="journey-world__depth-plate"
            src={world.depth.back}
            fetchPriority="low"
            width="1536"
            height="2304"
            alt=""
            decoding="async"
          />
        </div>
        <div className="journey-world__depth-layer journey-world__depth-layer--atmosphere">
          <img
            className="journey-world__depth-plate"
            src={world.depth.atmosphere}
            fetchPriority="low"
            width="1536"
            height="2304"
            alt=""
            decoding="async"
          />
        </div>
        <div className="journey-world__depth-layer journey-world__depth-layer--mid">
          <img
            className="journey-world__depth-plate"
            src={world.depth.mid}
            fetchPriority="low"
            width="1536"
            height="2304"
            alt=""
            decoding="async"
          />
        </div>
        <div className="journey-world__depth-layer journey-world__depth-layer--near">
          <img
            className="journey-world__depth-plate"
            src={world.depth.near}
            fetchPriority="low"
            width="1536"
            height="2304"
            alt=""
            decoding="async"
          />
        </div>
        <span className="journey-world__depth-shade" />
        <span className="journey-world__core-light" />
      </div>

      <div className="journey-world__realm journey-world__realm--continuum">
        <picture>
          <source
            media="(max-width: 600px) and (orientation: portrait)"
            srcSet={world.depth.phoneContinuum}
            width="780"
            height="3998"
          />
          <source
            media="(max-width: 820px) and (orientation: portrait)"
            srcSet={world.depth.mobileContinuum}
            width="768"
            height="2784"
          />
          <img
            className="journey-world__continuum-plate"
            src={world.depth.continuum}
            fetchPriority="low"
            width="1536"
            height="2904"
            alt=""
            decoding="async"
          />
        </picture>
        <span className="journey-world__continuum-dusk" />
      </div>

      <span className="journey-world__grade" />
      <span className="journey-world__grain" />
    </div>
  );
}
