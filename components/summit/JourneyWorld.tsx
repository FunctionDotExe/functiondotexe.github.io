import { SUMMIT_CONTENT } from "@/lib/summit-content";

export function JourneyWorld() {
  const { world } = SUMMIT_CONTENT;

  return (
    <div className="journey-world" aria-hidden="true">
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
        <img src={world.foreground} width="1536" height="1024" alt="" decoding="async" />
      </div>
      <span className="journey-world__grade" />
      <span className="journey-world__grain" />
    </div>
  );
}
