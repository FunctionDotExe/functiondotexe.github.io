"use client";

import { useState } from "react";
import { Award, ExternalLink, FileText, Play } from "lucide-react";
import { CERTIFICATES, RESUME } from "@/lib/constants";

/**
 * Click-to-load YouTube embed: shows a local thumbnail until the visitor
 * asks for the video, so no YouTube JS or cookies load with the page.
 */
function VideoFacade() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        title="Project video"
        src={`https://www.youtube-nocookie.com/embed/${RESUME.youtubeId}?autoplay=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label="Play project walkthrough video"
      className="group/video relative h-full w-full cursor-pointer"
    >
      <img
        src={RESUME.videoThumb.src}
        width={RESUME.videoThumb.width}
        height={RESUME.videoThumb.height}
        loading="lazy"
        decoding="async"
        alt="Project walkthrough video thumbnail"
        className="h-full w-full object-cover opacity-85 transition duration-500 group-hover/video:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold bg-bg/80 text-gold transition duration-300 group-hover/video:scale-110 group-hover/video:bg-bg">
          <Play size={24} fill="currentColor" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}

export function Proof() {
  return (
    <section id="resume" className="py-32 px-4 bg-bg">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16" data-reveal>
          <p className="text-xs tracking-[0.3em] text-gold uppercase mb-8">
            Resume &amp; Proof
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-cream leading-tight max-w-none">
            Work you can inspect
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
          <article
            className="border border-rule bg-surface p-4 md:p-6"
            data-reveal
          >
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs tracking-widest uppercase text-muted mb-2">
                  Embedded PDF
                </p>
                <h3 className="font-display text-3xl text-cream">Resume</h3>
              </div>
              <a
                href={RESUME.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gold hover:text-cream"
              >
                <FileText size={17} />
                Open PDF
              </a>
            </div>

            <div className="h-128 overflow-hidden border border-rule bg-bg md:h-176">
              <iframe
                title="Ruben Maxwell resume PDF"
                src={`${RESUME.pdf}#toolbar=0&navpanes=0`}
                loading="lazy"
                className="h-full w-full"
              />
            </div>
          </article>

          <div className="space-y-10">
            <article
              className="border border-rule bg-surface p-4 md:p-6"
              data-reveal
              style={{ "--reveal-delay": 1 } as React.CSSProperties}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted mb-2">
                    Video
                  </p>
                  <h3 className="font-display text-3xl text-cream">
                    Project Walkthrough
                  </h3>
                </div>
                <a
                  href={RESUME.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-cream"
                  aria-label="Open video on YouTube"
                >
                  <ExternalLink size={20} />
                </a>
              </div>

              <div className="aspect-video overflow-hidden border border-rule bg-bg">
                <VideoFacade />
              </div>
            </article>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {CERTIFICATES.map((certificate, i) => (
            <figure
              key={certificate.title}
              className="group overflow-hidden border border-rule bg-surface"
              data-reveal
              style={{ "--reveal-delay": i } as React.CSSProperties}
            >
              <div className="aspect-16/10 overflow-hidden bg-cream">
                <img
                  src={certificate.image.src}
                  width={certificate.image.width}
                  height={certificate.image.height}
                  loading="lazy"
                  decoding="async"
                  alt={`${certificate.title} certificate`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <figcaption className="p-5">
                <div className="mb-3 flex items-center gap-2 text-gold">
                  <Award size={16} />
                  <span className="text-xs uppercase tracking-widest">Certificate</span>
                </div>
                <p className="font-display text-2xl text-cream">
                  {certificate.title}
                </p>
                <p className="mt-2 text-sm text-muted">{certificate.issuer}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
