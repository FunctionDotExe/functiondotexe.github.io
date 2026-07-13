import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Principles } from "@/components/Principles";
import { Expertise } from "@/components/Expertise";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Proof } from "@/components/Proof";
import { Stats } from "@/components/Stats";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#0E0D0B]">
      <Nav />
      <Hero />
      <About />
      <Principles />
      <Expertise />
      <Experience />
      <Projects />
      <Proof />
      <Stats />
      <Contact />
      <Footer />
    </main>
  );
}
