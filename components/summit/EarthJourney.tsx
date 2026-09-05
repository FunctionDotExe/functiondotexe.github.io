import { ArrowDown, ArrowUp, ArrowUpRight, ChevronDown } from "lucide-react";
import { SUMMIT_CONTENT } from "@/lib/summit-content";
import { CERTIFICATES, EXPERIENCE, SKILLS } from "@/lib/constants";
import { ContactActions } from "./ContactActions";
import { InteractiveDisclosures } from "./InteractiveDisclosures";
import { BackgroundNotes } from "./BackgroundNotes";

export function EarthJourney() {
  const { about, identity } = SUMMIT_CONTENT;
  return (
    <div className="earth-journey" data-journey-chapter="depth">
      <InteractiveDisclosures />
      <section className="descent-threshold" id="descent" aria-labelledby="descent-title">
        <div className="threshold-stage">
          <div className="threshold-copy">
            <p className="section-label">Beneath the surface</p>
            <h2 id="descent-title">Behind<br />the projects.</h2>
            <p>The tools I use, the teams I’ve worked with,<br />and a little about the person writing the code.</p>
            <a className="text-link" href="#crust">Skills & experience <ArrowDown size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="depth-section descent-crust" id="crust" aria-labelledby="skills-title">
        <div className="shell depth-grid">
          <div className="depth-intro"><p className="section-label">Technical skills</p><h2 id="skills-title">What I<br />work with.</h2><p>From Python and C++ to databases and model training. Open a category to see the tools I use and where I’ve used them.</p><span className="terrain-note">Software · Machine learning · Robotics</span></div>
          <div className="capability-list">
            {SKILLS.map((skill, index) => (
              <details className={`disclosure mineral mineral--${index}`} key={skill.category} data-hover-disclosure>
                <summary><svg className="mineral__crystal" viewBox="0 0 80 120" aria-hidden="true"><path d="M40 3 69 29 76 85 40 117 5 88 12 30Z" /><path d="m40 3 15 34-3 50-12 30-14-32 1-47Z" /><path d="m12 30 15 8 28-1 14-8M5 88l21-3 26 2 24-2" /></svg><span>{skill.category}</span><ChevronDown size={19} aria-hidden="true" /></summary>
                <div className="disclosure__panel"><div className="disclosure__body"><p>{skill.description}</p><ul className="tag-list">{skill.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul></div></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="depth-section descent-mantle" id="experience" tabIndex={-1} aria-labelledby="experience-title">
        <div className="shell depth-grid">
          <div className="depth-intro"><p className="section-label">Experience</p><h2 id="experience-title">Where I’ve<br />worked.</h2><p>I’ve shipped backend services, tested quantum methods for medical imaging, and taught students to code. Here’s what I contributed in each role.</p><a className="text-link" href={identity.resume} target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={17} aria-hidden="true" /></a><span className="terrain-note">Engineering · Research · Teaching</span></div>
          <div className="experience-list">
            {EXPERIENCE.map((item, index) => (
              <details className="disclosure experience-entry" key={item.company} open={index === 0} data-hover-disclosure>
                <summary><span><small>{item.dates}</small><strong>{item.company}</strong><span className="experience-role">{item.role}</span></span><ChevronDown size={19} aria-hidden="true" /></summary>
                <div className="disclosure__panel"><div className="disclosure__body"><p className="experience-meta">{item.type} · {item.location}</p><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="depth-section about-scene" id="about" tabIndex={-1} aria-labelledby="about-title">
        <div className="shell about-grid">
          <figure className="about-portrait"><img src={about.image.src} width={about.image.width} height={about.image.height} alt={about.image.alt} loading="lazy" decoding="async" /><figcaption><span>Ruben Maxwell</span><span>Toronto, Canada</span></figcaption></figure>
          <div className="about-scene__content"><p className="section-label">About me</p><h2 id="about-title">Hi, I’m<br />Ruben.</h2><p className="about-lead">{about.statement}</p><p>{about.body}</p><ul className="tag-list" aria-label="Areas I work in">{about.disciplines.map((discipline) => <li key={discipline}>{discipline}</li>)}</ul><div className="about-links"><a className="text-link" href={identity.resume} target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={17} aria-hidden="true" /></a><a className="text-link" href={identity.social[0].href} target="_blank" rel="noreferrer">Find me on GitHub <ArrowUpRight size={17} aria-hidden="true" /></a></div></div>
          <BackgroundNotes />
          <div className="credentials"><p className="section-label">Certifications</p><div>{CERTIFICATES.map((certificate) => <a href={certificate.image.src} target="_blank" rel="noreferrer" key={certificate.title}><span><strong>{certificate.title}</strong><small>{certificate.issuer}</small></span><ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> — view certificate</span></a>)}</div></div>
        </div>
      </section>

      <section className="contact-scene" id="contact" tabIndex={-1} aria-labelledby="contact-title">
        <div className="shell">
          <div className="contact-scene__content"><p className="section-label">Get in touch</p><h2 id="contact-title">Let’s make<br />something.</h2><p>Hiring for your team, working on an idea, or curious about a project?<br />I’d love to hear from you.</p><ContactActions /></div>
          <footer className="contact-scene__footer"><p>© {new Date().getFullYear()} Ruben Maxwell</p><div>{identity.social.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div><a href="#entry">Back to top <ArrowUp size={16} aria-hidden="true" /></a></footer>
        </div>
      </section>
    </div>
  );
}
