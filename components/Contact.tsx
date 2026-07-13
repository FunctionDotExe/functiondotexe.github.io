import { PERSONAL } from "@/lib/constants";
import { Mail, Linkedin, Github } from "lucide-react";

export function Contact() {
  const contactLinks = [
    {
      label: "Email",
      href: `mailto:${PERSONAL.email}`,
      icon: Mail,
    },
    {
      label: "LinkedIn",
      href: PERSONAL.linkedin,
      icon: Linkedin,
    },
    {
      label: "GitHub",
      href: PERSONAL.github,
      icon: Github,
    },
  ];

  return (
    <section
      id="contact"
      className="py-32 px-4 bg-[#161410] relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-64 h-64 border border-[#2A2520] rounded-full opacity-10" />
      <div className="absolute bottom-20 left-5 w-80 h-80 border border-[#2A2520] rounded-full opacity-5" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Headline */}
        <div className="mb-16" data-reveal>
          <p className="text-xs tracking-[0.3em] text-[#C9A84C] uppercase mb-8">
            Contact
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-[#F2EBD9] leading-tight max-w-none">
            Let&apos;s build <br className="hidden md:block" />
            <span className="text-[#C9A84C]">something useful.</span>
          </h2>
        </div>

        {/* Contact Links */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-16">
          {contactLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-[#F2EBD9] hover:text-[#C9A84C] transition-colors"
                data-reveal
                style={{ "--reveal-delay": i + 1 } as React.CSSProperties}
              >
                <Icon size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="text-lg md:text-xl">{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Email highlight */}
        <div
          className="pt-8 border-t border-[#2A2520]"
          data-reveal
          style={{ "--reveal-delay": 4 } as React.CSSProperties}
        >
          <p className="text-sm text-[#7A7060] mb-4">Email me directly at</p>
          <a
            href={`mailto:${PERSONAL.email}`}
            className="font-display text-3xl md:text-4xl text-[#C9A84C] hover:underline"
          >
            {PERSONAL.email}
          </a>
        </div>
      </div>
    </section>
  );
}
