import { SKILLS } from "@/lib/constants";

export function Expertise() {
  return (
    <section className="py-32 px-4 bg-[#161410] relative">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.3em] text-[#C9A84C] uppercase mb-16" data-reveal>
          Expertise
        </p>

        <h2
          className="font-display text-5xl md:text-6xl text-[#F2EBD9] mb-20 leading-tight max-w-none"
          data-reveal
        >
          Core Skills
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          {SKILLS.map((skill, i) => (
            <div
              key={i}
              className="group p-8 border border-[#2A2520] bg-[#0E0D0B] hover:bg-[#1A1814] transition-all duration-300 relative overflow-hidden"
              data-reveal
              style={{ "--reveal-delay": i % 3 } as React.CSSProperties}
            >
              {/* Hover border effect */}
              <div className="card-topbar absolute top-0 left-0 right-0 h-1 bg-[#C9A84C]" />

              <h3 className="font-display text-2xl text-[#C9A84C] mb-4">
                {skill.category}
              </h3>

              <p className="text-sm text-[#7A7060] mb-6 leading-relaxed">
                {skill.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {skill.tools.map((tool, j) => (
                  <span
                    key={j}
                    className="text-xs px-3 py-1 bg-[#2A2520] text-[#F2EBD9] rounded-full"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
