import { ChevronDown } from "lucide-react";
import { COMMUNITY, EDUCATION, HONORS, LANGUAGES } from "@/lib/constants";

export function BackgroundNotes() {
  return (
    <div className="background-notes">
      <section className="education-note" aria-labelledby="education-title">
        <p className="section-label">Education · {EDUCATION.dates}</p>
        <h3 id="education-title">{EDUCATION.school}</h3>
        <p>{EDUCATION.degree}<br /><strong>{EDUCATION.subject}</strong></p>
        <span>{EDUCATION.location}</span>
      </section>
      <div className="background-notes__details">
        <details className="disclosure background-note" data-hover-disclosure>
          <summary><span>Awards & competitions<small>Physics, hackathons, and robotics</small></span><ChevronDown size={19} aria-hidden="true" /></summary>
          <div className="disclosure__panel"><div className="disclosure__body"><ul className="background-list">{HONORS.map((honor) => <li key={honor.title}><strong>{honor.title}</strong><span>{honor.detail}</span></li>)}</ul></div></div>
        </details>
        <details className="disclosure background-note" data-hover-disclosure>
          <summary><span>Volunteering & languages<small>Science centres, the observatory, and my community</small></span><ChevronDown size={19} aria-hidden="true" /></summary>
          <div className="disclosure__panel"><div className="disclosure__body"><ul className="background-list">{COMMUNITY.map((item) => <li key={item.organization}><strong>{item.organization}</strong><span>{item.role} · {item.dates}</span></li>)}</ul><p className="section-label">Languages</p><ul className="tag-list">{LANGUAGES.map((language) => <li key={language}>{language}</li>)}</ul></div></div>
        </details>
      </div>
    </div>
  );
}
