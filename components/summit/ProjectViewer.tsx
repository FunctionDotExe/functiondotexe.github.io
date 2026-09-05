"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from "lucide-react";
import type { Landmark } from "@/lib/summit-content";
import { RESUME } from "@/lib/constants";

export function ProjectViewer({ landmark }: { landmark: Landmark }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<string[]>([]);
  const images = [landmark.image, ...(landmark.gallery ?? [])].filter((image) => image !== undefined);
  const selected = images[index];

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  if (!selected) return null;
  const step = (direction: number) => setIndex((current) => (current + direction + images.length) % images.length);

  return (
    <>
      <button type="button" className="project-open text-link" aria-haspopup="dialog" onClick={() => { setIndex(0); dialog.current?.showModal(); setOpen(true); }}>
        Take a closer look <Expand size={16} aria-hidden="true" /><span className="sr-only"> at {landmark.title}</span>
      </button>
      <dialog ref={dialog} className="project-dialog" aria-labelledby={`viewer-${landmark.visual}`} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={(event) => {
        if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
      }}>
        <div className="project-dialog__surface">
          <header className="project-dialog__header">
            <div><p>{landmark.kicker}</p><h2 id={`viewer-${landmark.visual}`}>{landmark.title}</h2></div>
            <button className="icon-button" type="button" aria-label="Close project" onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button>
          </header>
          <div className="project-dialog__media">
            {open && !failed.includes(selected.src) && !loaded.includes(selected.src) && <p className="media-loading" role="status">Loading preview…</p>}
            {open && (failed.includes(selected.src) ? <p className="media-error">This preview couldn’t load. <a className="text-link" href={selected.src} target="_blank" rel="noreferrer">Open the image directly <ArrowUpRight size={16} aria-hidden="true" /></a></p> : <img key={selected.src} src={selected.src} width={selected.width} height={selected.height} alt={selected.alt} onLoad={() => setLoaded((current) => current.includes(selected.src) ? current : [...current, selected.src])} onError={() => setFailed((current) => [...current, selected.src])} />)}
          </div>
          <div className="project-dialog__controls">
            <p aria-live="polite" aria-atomic="true">{index + 1} / {images.length}<span>{selected.alt}</span></p>
            {images.length > 1 && <div><button type="button" className="icon-button" aria-label="Previous image" onClick={() => step(-1)}><ArrowLeft size={19} aria-hidden="true" /></button><button type="button" className="icon-button" aria-label="Next image" onClick={() => step(1)}><ArrowRight size={19} aria-hidden="true" /></button></div>}
          </div>
          <div className="project-dialog__description"><p>{landmark.description}</p><p>{landmark.detail}</p><ul className="tag-list" aria-label="Project technologies">{landmark.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            {landmark.visual === "signal" && <a className="text-link" href={RESUME.youtubeUrl} target="_blank" rel="noreferrer">Watch project walkthrough <ArrowUpRight size={17} aria-hidden="true" /></a>}
          </div>
        </div>
      </dialog>
    </>
  );
}
