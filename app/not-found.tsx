import { ArrowLeft, Mountain } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found shell">
      <Mountain size={40} strokeWidth={1.25} aria-hidden="true" />
      <p className="section-label">404 · Page not found</p>
      <h1>This trail ends here.</h1>
      <p>This page doesn’t exist, or the link is out of date. Head back to my projects to keep exploring.</p>
      <a className="journey-button" href="/#work"><ArrowLeft size={18} aria-hidden="true" />Back to my projects</a>
    </main>
  );
}
