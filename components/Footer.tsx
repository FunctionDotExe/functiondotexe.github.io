import { PERSONAL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {PERSONAL.firstName} {PERSONAL.lastName}</span>
      <span>Designed as a system. Built with intent.</span>
      <a href="#top">Back to top ↑</a>
    </footer>
  );
}
