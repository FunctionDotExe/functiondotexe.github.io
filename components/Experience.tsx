import { EXPERIENCE } from "@/lib/constants";

export function Experience() {
  return (
    <section id="experience" className="py-32 px-4 bg-bg">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.3em] text-gold uppercase mb-8" data-reveal>
          Experience
        </p>

        <h2
          className="font-display text-5xl md:text-6xl text-cream mb-16 leading-tight max-w-none"
          data-reveal
        >
          Recent Experience
        </h2>

        {/* Timeline */}
        <div className="relative border-l border-rule pl-6 md:pl-10">
          {/* Vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px h-full bg-linear-to-b from-[#C9A84C] to-[#8A6E2F]"
            data-reveal-scale-y
          />

          {/* Entries */}
          <div className="space-y-12">
            {EXPERIENCE.map((exp, i) => (
              <div
                key={i}
                className="relative grid md:grid-cols-[12rem_1fr] gap-4 md:gap-10"
                data-reveal
              >
                {/* Dot */}
                <div className="absolute left-[-2.05rem] md:left-[-2.55rem] top-1">
                  <div className="w-4 h-4 bg-gold rounded-full border-2 border-bg" />
                </div>

                {/* Meta */}
                <div>
                  <p className="text-sm text-muted mb-2">{exp.dates}</p>
                  <p className="text-xs tracking-widest text-gold uppercase mb-4">
                    {exp.type}
                  </p>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-display text-2xl text-cream mb-1">
                    {exp.company}
                  </h3>
                  <p className="text-lg text-gold mb-2">{exp.role}</p>
                  <p className="text-sm text-muted mb-4">{exp.location}</p>
                  <ul className="space-y-2 list-disc pl-5">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="text-sm text-cream opacity-80 leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
