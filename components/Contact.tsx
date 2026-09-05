import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { PERSONAL } from "@/lib/constants";

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="contact-inner" data-reveal>
        <div className="contact-topline">
          <span>Next build / yours?</span>
          <span className="availability availability--light"><i /> Open to new conversations</span>
        </div>
        <h2>Have a problem<br />worth obsessing over?</h2>
        <p>Let&apos;s turn it into something useful, rigorous, and difficult to ignore.</p>
        <a className="contact-email" href={`mailto:${PERSONAL.email}`}>
          {PERSONAL.email} <ArrowUpRight aria-hidden="true" />
        </a>
        <div className="contact-links">
          <a href={`mailto:${PERSONAL.email}`}><Mail size={17} aria-hidden="true" /> Email</a>
          <a href={PERSONAL.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} aria-hidden="true" /> LinkedIn</a>
          <a href={PERSONAL.github} target="_blank" rel="noreferrer"><Github size={17} aria-hidden="true" /> GitHub</a>
        </div>
      </div>
    </section>
  );
}
