import { PERSONAL } from "@/lib/constants";

export function About() {
  const details = [
    { label: "Now", value: "Software Engineer at Fourth Dimension (4D)" },
    { label: "Base", value: PERSONAL.city },
    { label: "Education", value: "University of Toronto, Computer Science" },
    { label: "Focus", value: "Web, AI, and quantum systems" },
  ];

  return (
    <section id="about" className="py-28 md:py-32 px-4 bg-[#0E0D0B] relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-32 h-32 border border-[#2A2520] rounded-full opacity-20" />

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-start">
          {/* Left content */}
          <div className="md:col-span-3" data-reveal>
            <p className="text-xs tracking-[0.3em] text-[#C9A84C] uppercase mb-8">
              About
            </p>

            <h2 className="font-display text-4xl md:text-6xl text-[#F2EBD9] leading-tight mb-8 max-w-3xl">
              {PERSONAL.bio}
            </h2>

            <p className="text-base md:text-lg text-[#F2EBD9] leading-relaxed opacity-85 max-w-2xl">
              {PERSONAL.bioShort}
            </p>
          </div>

          {/* Right stats */}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-8 border-t md:border-t-0 md:border-l border-[#2A2520] pt-8 md:pt-0 md:pl-8">
            {details.map((item, i) => (
              <div
                key={i}
                data-reveal
                style={{ "--reveal-delay": i + 1 } as React.CSSProperties}
              >
                <p className="text-xs tracking-widest text-[#7A7060] uppercase mb-2">
                  {item.label}
                </p>
                <p className="text-sm md:text-base text-[#F2EBD9] leading-snug">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
