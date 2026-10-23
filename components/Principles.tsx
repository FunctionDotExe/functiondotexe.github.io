import { PRINCIPLES } from "@/lib/constants";

export function Principles() {
  return (
    <section className="px-4 py-20 bg-surface">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.3em] text-gold uppercase mb-8" data-reveal>
          Principles
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {PRINCIPLES.map((item, i) => (
            <blockquote
              key={item.quote}
              className="border border-rule bg-bg p-8"
              data-reveal
              style={{ "--reveal-delay": i + 1 } as React.CSSProperties}
            >
              <p className="font-display text-3xl md:text-4xl leading-tight text-cream">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-6 text-xs tracking-[0.24em] uppercase text-muted">
                {item.author}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
