"use client";

import { useState } from "react";
import { ArrowUpRight, FileText, Play } from "lucide-react";
import { CERTIFICATES, RESUME } from "@/lib/constants";

function VideoFacade() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        title="Project walkthrough"
        src={`https://www.youtube-nocookie.com/embed/${RESUME.youtubeId}?autoplay=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button type="button" className="proof-video__facade" onClick={() => setPlaying(true)}>
      <img
        src={RESUME.videoThumb.src}
        width={RESUME.videoThumb.width}
        height={RESUME.videoThumb.height}
        loading="lazy"
        decoding="async"
        alt="Computer vision project walkthrough preview"
      />
      <span><Play size={20} fill="currentColor" aria-hidden="true" /> Play walkthrough</span>
    </button>
  );
}

export function Proof() {
  return (
    <section className="proof section" id="proof">
      <div className="proof-heading" data-reveal>
        <span className="section-label">Receipts / inspect the work</span>
        <h2>Don&apos;t take the<br />headline&apos;s word for it.</h2>
      </div>

      <div className="proof-feature-grid">
        <article className="resume-card" data-reveal>
          <div className="resume-card__top">
            <span>Curriculum vitae</span>
            <span>PDF / Current</span>
          </div>
          <div className="resume-card__sheet" aria-hidden="true">
            <span>RUBEN MAXWELL</span>
            <i />
            <i />
            <i />
            <b>EXPERIENCE · PROJECTS · EDUCATION</b>
          </div>
          <div className="resume-card__bottom">
            <div>
              <FileText size={22} aria-hidden="true" />
              <p>Experience, education, and a concise record of the work.</p>
            </div>
            <a href={RESUME.pdf} target="_blank" rel="noreferrer">
              Open resume <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </article>

        <article className="proof-video" data-reveal>
          <div className="proof-video__top">
            <span>Project film / 01</span>
            <a href={RESUME.youtubeUrl} target="_blank" rel="noreferrer" aria-label="Open project video on YouTube">
              YouTube <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <VideoFacade />
        </article>
      </div>

      <div className="certificate-grid">
        {CERTIFICATES.map((certificate, index) => (
          <figure key={certificate.title} data-reveal>
            <div>
              <img
                src={certificate.image.src}
                width={certificate.image.width}
                height={certificate.image.height}
                loading="lazy"
                decoding="async"
                alt={`${certificate.title} certificate`}
              />
            </div>
            <figcaption>
              <span>Certificate / 0{index + 1}</span>
              <strong>{certificate.title}</strong>
              <small>{certificate.issuer}</small>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
