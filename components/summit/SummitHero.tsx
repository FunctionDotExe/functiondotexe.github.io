import { ArrowDown, Mountain } from "lucide-react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";
import { ReplayArrival } from "./ArrivalIntro";

export function SummitHero() {
  const { identity } = SUMMIT_CONTENT;
  return (
    <section className="journey-hero" id="entry" aria-labelledby="journey-title">
      <div className="journey-hero__stage shell">
        <div className="journey-hero__content">
          <p className="journey-hero__eyebrow"><Mountain size={18} aria-hidden="true" /> Software engineer · AI & robotics</p>
          <h1 id="journey-title"><span>Ruben</span><span>Maxwell</span></h1>
          <p className="journey-hero__intro">I build software, train models, and make robots move.<br />Mathematics & Computer Science at the University of Toronto.</p>
          <div className="hero-actions">
            <a className="journey-button" href="#work">See my projects <ArrowDown size={18} aria-hidden="true" /></a>
            <a className="text-link" href={identity.resume} target="_blank" rel="noreferrer">View résumé <span className="sr-only">(PDF, opens in a new tab)</span></a>
          </div>
        </div>
        <div className="journey-hero__footer">
          <span>{identity.location}</span>
          <a href="#basecamp">Take a look around <ArrowDown size={15} aria-hidden="true" /></a>
          <ReplayArrival />
        </div>
      </div>
    </section>
  );
}
