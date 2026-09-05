"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, RotateCcw, ZoomIn, X } from "lucide-react";
import type { Landmark } from "@/lib/summit-content";
import { RESUME } from "@/lib/constants";

const ProjectGallery = createContext<{ open: (trigger: HTMLButtonElement) => void; title: string; id: string } | null>(null);

export function ProjectInspectButton() {
  const gallery = useContext(ProjectGallery);
  if (!gallery) return null;
  return <button type="button" className="project-open text-link" aria-haspopup="dialog" aria-controls={gallery.id} onClick={(event) => gallery.open(event.currentTarget)}>View project gallery <ZoomIn size={17} aria-hidden="true" /><span className="sr-only"> for {gallery.title}</span></button>;
}

export function ProjectImageButton({ children }: { children: ReactNode }) {
  const gallery = useContext(ProjectGallery);
  if (!gallery) return <>{children}</>;
  return <button type="button" className="project-image-button" aria-label={`Open ${gallery.title} project gallery`} aria-haspopup="dialog" aria-controls={gallery.id} onClick={(event) => gallery.open(event.currentTarget)}>{children}<span className="project-image-button__hint" aria-hidden="true"><ZoomIn size={17} />View gallery</span></button>;
}

export function ProjectViewer({ landmark, children }: { landmark: Landmark; children?: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const backdropPress = useRef(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<string[]>([]);
  const touch = useRef<{ id: number; x: number; y: number; axis: "pending" | "horizontal" | "vertical" } | null>(null);
  const images = [landmark.image, ...(landmark.gallery ?? [])].filter((image) => image !== undefined);
  const selected = images[index];

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; touch.current = null; };
  }, [open]);

  if (!selected) return children ?? null;
  const step = (direction: number) => {
    touch.current = null;
    setIndex((current) => (current + direction + images.length) % images.length);
  };
  const galleryId = `gallery-${landmark.visual}`;
  const openGallery = (opener: HTMLButtonElement) => {
    const modal = dialog.current;
    if (!modal || modal.open) return;
    trigger.current = opener;
    // Pointer clicks do not focus buttons in every browser. Give the native
    // dialog the correct return target before it records the previously focused element.
    opener.focus({ preventScroll: true });
    setIndex(0);
    setFailed([]);
    touch.current = null;
    backdropPress.current = false;
    modal.showModal();
    modal.scrollTop = 0;
    setOpen(true);
  };
  const outsideDialog = (x: number, y: number) => {
    const bounds = dialog.current?.getBoundingClientRect();
    return Boolean(bounds && (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom));
  };

  return (
    <ProjectGallery.Provider value={{ open: openGallery, title: landmark.title, id: galleryId }}>
      {children ?? <ProjectInspectButton />}
      <dialog ref={dialog} id={galleryId} className="project-dialog" aria-labelledby={`viewer-${landmark.visual}`} onClose={() => {
        touch.current = null;
        backdropPress.current = false;
        setOpen(false);
        if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
        trigger.current = null;
      }} onPointerDown={(event) => {
        backdropPress.current = event.target === event.currentTarget && outsideDialog(event.clientX, event.clientY);
      }} onPointerCancel={() => { backdropPress.current = false; }} onClick={(event) => {
        const startedOutside = backdropPress.current;
        backdropPress.current = false;
        if (startedOutside && event.target === event.currentTarget && outsideDialog(event.clientX, event.clientY)) dialog.current?.close();
      }} onKeyDown={(event) => {
        if (images.length < 2 || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || (event.target as Element)?.closest?.("input, textarea, select, [contenteditable='true']")) return;
        if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
      }}>
        <div className="project-dialog__surface">
          <header className="project-dialog__header">
            <div><p>{landmark.kicker}</p><h2 id={`viewer-${landmark.visual}`}>{landmark.title}</h2></div>
            <button className="icon-button" type="button" autoFocus aria-label="Close gallery" onClick={() => dialog.current?.close()}><X size={22} aria-hidden="true" /></button>
          </header>
          <div className="project-dialog__media" onTouchStart={(event) => {
            const first = event.touches[0];
            touch.current = event.touches.length === 1 && !(event.target as Element)?.closest?.("a, button, input, textarea, select") ? { id: first.identifier, x: first.clientX, y: first.clientY, axis: "pending" } : null;
          }} onTouchMove={(event) => {
            const start = touch.current;
            if (!start) return;
            const finger = event.touches[0];
            if (event.touches.length !== 1 || finger.identifier !== start.id) { touch.current = null; return; }
            const dx = Math.abs(finger.clientX - start.x);
            const dy = Math.abs(finger.clientY - start.y);
            if (start.axis === "pending") {
              if (dy > 12 && dy >= dx) start.axis = "vertical";
              else if (dx > 12 && dx > dy * 1.5) start.axis = "horizontal";
            }
          }} onTouchCancel={() => { touch.current = null; }} onTouchEnd={(event) => {
            const start = touch.current;
            touch.current = null;
            if (!start || start.axis === "vertical" || event.touches.length || images.length < 2) return;
            const finger = Array.from(event.changedTouches).find((item) => item.identifier === start.id);
            if (!finger) return;
            const dx = finger.clientX - start.x;
            const dy = finger.clientY - start.y;
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
          }}>
            {open && !failed.includes(selected.src) && !loaded.includes(selected.src) && <p className="media-loading" role="status">Loading preview…</p>}
            {open && (failed.includes(selected.src) ? <p className="media-error" role="status">This preview couldn’t load. <button type="button" className="text-link" onClick={() => setFailed((current) => current.filter((src) => src !== selected.src))}><RotateCcw size={16} aria-hidden="true" />Retry preview</button> <a className="text-link" href={selected.src} target="_blank" rel="noreferrer">Open the image directly <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></p> : <img key={selected.src} className={loaded.includes(selected.src) ? "gallery-image gallery-image--ready" : "gallery-image"} src={selected.src} width={selected.width} height={selected.height} alt={selected.alt} draggable={false} onLoad={() => setLoaded((current) => current.includes(selected.src) ? current : [...current, selected.src])} onError={() => { setFailed((current) => current.includes(selected.src) ? current : [...current, selected.src]); setLoaded((current) => current.filter((src) => src !== selected.src)); }} />)}
          </div>
          <div className="project-dialog__controls">
            <p aria-live="polite" aria-atomic="true">{index + 1} / {images.length}<span>{selected.alt}</span></p>
            {images.length > 1 && <div><button type="button" className="icon-button" aria-label="Previous image" onClick={() => step(-1)}><ArrowLeft size={19} aria-hidden="true" /></button><button type="button" className="icon-button" aria-label="Next image" onClick={() => step(1)}><ArrowRight size={19} aria-hidden="true" /></button></div>}
          </div>
          {open && images.length > 1 && <div className="project-thumbnails" role="group" aria-label="Choose a project image">{images.map((image, imageIndex) => <button key={image.src} type="button" aria-label={`Show image ${imageIndex + 1}: ${image.alt}`} aria-pressed={imageIndex === index} onClick={() => { touch.current = null; setIndex(imageIndex); }}><img src={image.src} width={image.width} height={image.height} alt="" loading="lazy" decoding="async" /></button>)}</div>}
          <div className="project-dialog__description"><p>{landmark.description}</p><p>{landmark.detail}</p><ul className="tag-list" aria-label="Project technologies">{landmark.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            {landmark.visual === "signal" && <a className="text-link" href={RESUME.youtubeUrl} target="_blank" rel="noreferrer"><Play size={17} aria-hidden="true" />Watch video walkthrough<span className="sr-only"> on YouTube (opens in a new tab)</span></a>}
          </div>
        </div>
      </dialog>
    </ProjectGallery.Provider>
  );
}
