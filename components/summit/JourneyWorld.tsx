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
      </div>

      <div className="journey-world__realm journey-world__realm--depth">
        <div className="journey-world__depth-layer journey-world__depth-layer--back">
          <img
            className="journey-world__depth-plate"
            src={world.depth.back}
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
            width="1536"
            height="2304"
            alt=""
            decoding="async"
          />
        </div>
        <span className="journey-world__depth-shade" />
      </div>

      <div className="journey-world__realm journey-world__realm--bridge">
        <picture>
          <source
            media="(max-width: 820px) and (orientation: portrait)"
            srcSet={world.depth.mobileBridge}
            width="768"
            height="2304"
          />
          <img
            className="journey-world__bridge-plate"
            src={world.depth.bridge}
            width="1536"
            height="2304"
            alt=""
            decoding="async"
          />
        </picture>
      </div>

      <div className="journey-world__handoff-lip">
        <img
          src={world.foreground}
          width="1536"
          height="1024"
          alt=""
          decoding="async"
        />
      </div>

      <span className="journey-world__grade" />
      <span className="journey-world__grain" />
    </div>
  );
}
