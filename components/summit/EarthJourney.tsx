import { ArrowDown, ArrowUp, ArrowUpRight, ChevronDown, FileBadge, FileText } from "lucide-react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";
import { CERTIFICATES, EXPERIENCE } from "@/lib/constants";
import { ContactActions } from "./ContactActions";
import { InteractiveDisclosures } from "./InteractiveDisclosures";
import { BackgroundNotes } from "./BackgroundNotes";
import { SkillCabinet } from "./SkillCabinet";
import { TerrainGem } from "./TerrainGem";

export function EarthJourney() {
  const { about, identity } = SUMMIT_CONTENT;
  return (
    <div className="earth-journey" data-journey-chapter="depth">
      <InteractiveDisclosures />
      <section className="descent-threshold" id="descent" aria-labelledby="descent-title">
        <TerrainGem className="terrain-gem--threshold" />
        <div className="threshold-stage">
          <div className="threshold-copy">
            <p className="section-label">Beneath the surface</p>
            <h2 id="descent-title">Good work<br />runs deep.</h2>
            <p>The tools I use, the teams I’ve worked with,<br />and a little about the person writing the code.</p>
            <a className="text-link" href="#crust">Explore my skills <ArrowDown size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="depth-section descent-crust" id="crust" tabIndex={-1} aria-labelledby="skills-title">
        <div className="shell depth-grid">
          <div className="depth-intro"><p className="section-label">Technical foundations</p><h2 id="skills-title">Many facets.<br />One mindset.</h2><p>The interesting problems rarely fit inside one discipline. These are the tools I bring together to solve them.</p><span className="terrain-note">Six fields, connected through the work.</span></div>
          <SkillCabinet />
        </div>
      </section>

      <section className="depth-section descent-mantle" id="experience" tabIndex={-1} aria-labelledby="experience-title">
        <div className="shell depth-grid">
          <div className="depth-intro"><p className="section-label">Experience</p><h2 id="experience-title">Where I’ve<br />worked.</h2><p>I’ve shipped backend services, tested quantum methods for medical imaging, and taught students to code. Here’s what I contributed in each role.</p><a className="text-link" href={identity.resume} target="_blank" rel="noreferrer">View résumé <FileText size={17} aria-hidden="true" /><span className="sr-only"> (PDF, opens in a new tab)</span></a><span className="terrain-note">Engineering · Research · Teaching</span></div>
          <div className="experience-list">
            {EXPERIENCE.map((item, index) => (
              <details className="disclosure experience-entry" key={item.company} open={index === 0} data-hover-disclosure>
                <summary><span><small>{item.dates}</small><strong>{item.company}</strong><span className="experience-role">{item.role}</span><small className="disclosure-cue-label" aria-hidden="true"><span className="disclosure-cue-label__closed">Open role details</span><span className="disclosure-cue-label__open">Close role details</span></small></span><ChevronDown size={19} aria-hidden="true" /></summary>
                <div className="disclosure__panel"><div className="disclosure__body"><p className="experience-meta">{item.type} · {item.location}</p><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="depth-section about-scene" id="about" tabIndex={-1} aria-labelledby="about-title">
        <div className="shell about-grid">
          <figure className="about-portrait"><img src={about.image.src} width={about.image.width} height={about.image.height} alt={about.image.alt} loading="lazy" decoding="async" /><figcaption><span>Ruben Maxwell</span><span>Toronto, Canada</span></figcaption></figure>
          <div className="about-scene__content"><p className="section-label">About me</p><h2 id="about-title">Hi, I’m<br />Ruben.</h2><p className="about-lead">{about.statement}</p><p>{about.body}</p><ul className="tag-list" aria-label="Areas I work in">{about.disciplines.map((discipline) => <li key={discipline}>{discipline}</li>)}</ul><div className="about-links"><a className="text-link" href={identity.resume} target="_blank" rel="noreferrer">View résumé <FileText size={17} aria-hidden="true" /><span className="sr-only"> (PDF, opens in a new tab)</span></a><a className="text-link" href={identity.social[0].href} target="_blank" rel="noreferrer">Find me on GitHub <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div></div>
          <BackgroundNotes />
          <div className="credentials"><p className="section-label">Certifications</p><div>{CERTIFICATES.map((certificate) => <a href={certificate.image.src} target="_blank" rel="noreferrer" key={certificate.title}><span><strong>{certificate.title}</strong><small>{certificate.issuer}</small><span className="certificate-action">View certificate</span></span><FileBadge size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>)}</div></div>
        </div>
      </section>

      <section className="contact-scene" id="contact" tabIndex={-1} aria-labelledby="contact-title">
        <TerrainGem variant="pair" className="terrain-gem--contact" />
        <div className="shell">
          <div className="contact-scene__content"><p className="section-label">Every ending is a trailhead</p><h2 id="contact-title">What’s our<br />next adventure?</h2><p>A team to join. An idea to build. A question worth following.<br />I’d love to hear what you’re thinking.</p><ContactActions /></div>
          <footer className="contact-scene__footer"><p>© {new Date().getFullYear()} Ruben Maxwell</p><div>{identity.social.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>)}</div><a href="#entry">Back to top <ArrowUp size={16} aria-hidden="true" /></a></footer>
        </div>
      </section>
    </div>
  );
}
