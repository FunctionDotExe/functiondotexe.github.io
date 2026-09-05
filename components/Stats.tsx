import { STATS } from "@/lib/constants";

export function Stats() {
  return (
    <section className="py-32 px-4 bg-[#0E0D0B]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, i) => (
            <div
              key={i}
              data-reveal
              style={{ "--reveal-delay": i } as React.CSSProperties}
            >
              <p className="font-display text-4xl md:text-5xl text-[#C9A84C] mb-4">
                {stat.value}+
              </p>
              <p className="text-sm md:text-base text-[#F2EBD9] uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
