import { PERSONAL } from "@/lib/constants";

function AnimatedName({ text, offset }: { text: string; offset: number }) {
  return (
    <>
      {text.split("").map((letter, i) => (
        <span
          key={i}
          className="hero-letter"
          style={{ "--i": offset + i } as React.CSSProperties}
        >
          {letter}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const fadeDelay = (PERSONAL.firstName.length + PERSONAL.lastName.length) * 0.06;

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="starfield" aria-hidden="true">
        <div className="starfield-layer starfield-layer--far" />
        <div className="starfield-layer starfield-layer--mid" />
        <div className="starfield-layer starfield-layer--near" />
      </div>
      <div className="absolute inset-0 hero-vignette pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl px-4">
        <p
          className="hero-fade text-sm tracking-[0.3em] text-[#C9A84C] uppercase mb-12"
          style={{ "--d": "0.1s" } as React.CSSProperties}
        >
          Est. {PERSONAL.year} / {PERSONAL.city}
        </p>

        <div className="mb-6 overflow-hidden">
          <h1 className="font-display text-[5rem] md:text-[7rem] lg:text-[8rem] leading-tight text-[#F2EBD9] tracking-tight">
            <AnimatedName text={PERSONAL.firstName} offset={0} />
          </h1>
          <h1 className="font-display text-[5rem] md:text-[7rem] lg:text-[8rem] leading-tight text-[#C9A84C] tracking-tight">
            <AnimatedName
              text={PERSONAL.lastName}
              offset={PERSONAL.firstName.length}
            />
          </h1>
        </div>

        {/* No entrance fade: this is the LCP element on mobile, and delaying
            its paint directly delays LCP */}
        <blockquote className="mb-12">
          <p className="text-lg md:text-xl text-[#F2EBD9]">{PERSONAL.role}</p>
          <footer className="mt-3 text-xs tracking-[0.24em] uppercase text-[#7A7060]">
            {PERSONAL.roleAttribution}
          </footer>
        </blockquote>

        <div
          className="hero-fade flex flex-col items-center gap-3"
          style={{ "--d": `${fadeDelay + 0.4}s` } as React.CSSProperties}
        >
          <div className="hero-scroll-hint text-[#C9A84C]">&darr;</div>
          <p className="text-sm text-[#7A7060]">Scroll to explore</p>
        </div>
      </div>
    </section>
  );
}
