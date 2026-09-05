import { ArrowDown, FileText } from "lucide-react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";
import { ReplayArrival } from "./ArrivalIntro";

export function SummitHero() {
  const { identity } = SUMMIT_CONTENT;
  return (
    <section className="journey-hero" id="entry" tabIndex={-1} aria-labelledby="journey-title">
      <div className="journey-hero__stage shell">
        <div className="journey-hero__content">
          <p className="journey-hero__eyebrow"><span className="hero-rule" aria-hidden="true" /> Software engineering, AI & robotics</p>
          <h1 id="journey-title"><span>Ruben</span><span>Maxwell</span></h1>
          <p className="journey-hero__intro">I build software, train models, and make robots move.<br />Mathematics & Computer Science at the University of Toronto.</p>
          <div className="hero-actions">
            <a className="journey-button" href="#work">Explore my work <ArrowDown size={18} aria-hidden="true" /></a>
            <a className="text-link" href={identity.resume} target="_blank" rel="noreferrer">View résumé <FileText size={17} aria-hidden="true" /><span className="sr-only"> (PDF, opens in a new tab)</span></a>
          </div>
        </div>
        <a className="summit-marker" href="#basecamp"><span className="summit-marker__point" aria-hidden="true"/><span>Start exploring<small>A little context, then the work.</small></span></a>
        <span className="hero-side-note" aria-hidden="true">A journey from curiosity to creation</span>
        <div className="journey-hero__footer">
          <span><i className="location-dot" aria-hidden="true" /> {identity.location}</span>
          <a href="#basecamp"><span className="scroll-cue" aria-hidden="true"><ArrowDown size={15} /></span>Scroll to discover</a>
          <ReplayArrival />
        </div>
      </div>
    </section>
  );
}
