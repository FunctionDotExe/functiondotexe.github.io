import { PERSONAL } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 bg-bg border-t border-rule">
      <div className="max-w-7xl mx-auto">
        <div
          className="flex flex-col md:flex-row items-center justify-between text-sm text-muted"
          data-reveal
        >
          <p>
            &copy; {currentYear} {PERSONAL.firstName} {PERSONAL.lastName}. All rights reserved.
          </p>
          <p className="mt-4 md:mt-0">
            Designed &amp; built with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
