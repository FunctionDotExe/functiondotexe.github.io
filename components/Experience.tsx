import { EXPERIENCE } from "@/lib/constants";

export function Experience() {
  return (
    <section id="experience" className="py-32 px-4 bg-[#0E0D0B]">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[0.3em] text-[#C9A84C] uppercase mb-8" data-reveal>
          Experience
        </p>

        <h2
          className="font-display text-5xl md:text-6xl text-[#F2EBD9] mb-16 leading-tight max-w-none"
          data-reveal
        >
          Recent Experience
        </h2>

        {/* Timeline */}
        <div className="relative border-l border-[#2A2520] pl-6 md:pl-10">
          {/* Vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px h-full bg-gradient-to-b from-[#C9A84C] to-[#8A6E2F]"
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
                <div className="absolute -left-[2.05rem] md:-left-[2.55rem] top-1">
                  <div className="w-4 h-4 bg-[#C9A84C] rounded-full border-2 border-[#0E0D0B]" />
                </div>

                {/* Meta */}
                <div>
                  <p className="text-sm text-[#7A7060] mb-2">{exp.dates}</p>
                  <p className="text-xs tracking-widest text-[#C9A84C] uppercase mb-4">
                    {exp.type}
                  </p>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-display text-2xl text-[#F2EBD9] mb-1">
                    {exp.company}
                  </h3>
                  <p className="text-lg text-[#C9A84C] mb-2">{exp.role}</p>
                  <p className="text-sm text-[#7A7060] mb-4">{exp.location}</p>
                  <ul className="space-y-2 list-disc pl-5">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="text-sm text-[#F2EBD9] opacity-80 leading-relaxed">
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
