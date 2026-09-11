"use client";

import { useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import type { ProjectImage } from "@/lib/constants";

export function ProjectGallery({ images, title, fit = "cover", portrait = false }: {
  images: ProjectImage[];
  title: string;
  fit?: "cover" | "contain";
  portrait?: boolean;
}) {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const labelId = useId();
  const image = images[active];
  const step = (offset: number) => setActive((index) => (index + offset + images.length) % images.length);

  return (
    <div className="project-gallery">
      <button type="button" className={`project-image-button${portrait ? " project-image-button--portrait" : ""}`}
        onClick={() => dialog.current?.showModal()} aria-label={`Enlarge ${image.alt || title}`} aria-haspopup="dialog">
        <img src={image.src} width={image.width} height={image.height} alt={image.alt || `${title} preview`}
          loading="lazy" decoding="async" className={`project-image project-image--${fit}`} />
        <span className="image-expand" aria-hidden="true"><Expand size={17} /></span>
      </button>
      {images.length > 1 && <div className="project-thumbnails" aria-label={`${title} images`}>
        {images.map((item, index) => <button key={item.src} type="button" onClick={() => setActive(index)}
          aria-label={`Show ${item.alt || `${title} image ${index + 1}`}`} aria-pressed={index === active}>
          <img src={item.src} width={item.width} height={item.height} alt="" loading="lazy" decoding="async" />
        </button>)}
      </div>}
      <dialog ref={dialog} className="project-lightbox" aria-labelledby={labelId}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
        }}>
        <div className="lightbox-content" data-lenis-prevent>
          <div className="lightbox-toolbar">
            <p id={labelId}>{title}</p>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close image" autoFocus><X size={22} /></button>
          </div>
          <img src={image.src} width={image.width} height={image.height} alt={image.alt || title} loading="lazy" decoding="async" />
          <div className="lightbox-footer">
            <p aria-live="polite">{image.alt || title}</p>
            {images.length > 1 && <div className="lightbox-navigation">
              <button type="button" onClick={() => step(-1)} aria-label="Previous image"><ArrowLeft size={20} /></button>
              <span>{active + 1} / {images.length}</span>
              <button type="button" onClick={() => step(1)} aria-label="Next image"><ArrowRight size={20} /></button>
            </div>}
          </div>
        </div>
      </dialog>
    </div>
  );
}
