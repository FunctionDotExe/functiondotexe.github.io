import { ArrowLeft, Mountain } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found shell">
      <Mountain size={40} strokeWidth={1.25} aria-hidden="true" />
      <p className="section-label">404 · Page not found</p>
      <h1>Nothing here just yet.</h1>
      <p>This link may be out of date. You can find my projects, experience, and contact details on the main page.</p>
      <a className="journey-button" href="/#work"><ArrowLeft size={18} aria-hidden="true" />See my projects</a>
    </main>
  );
}
