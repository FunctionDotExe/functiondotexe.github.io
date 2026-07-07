"use client";

import { SiteNav } from "@/components/ren/SiteNav";
import { OpeningSystem } from "@/components/ren/OpeningSystem";
import { Manifesto } from "@/components/ren/Manifesto";
import { SignalGrid } from "@/components/ren/SignalGrid";
import { ProjectSpotlights } from "@/components/ren/ProjectSpotlights";
import { ExperienceLedger } from "@/components/ren/ExperienceLedger";
import { ProofCabinet } from "@/components/ren/ProofCabinet";
import { ContactFinale } from "@/components/ren/ContactFinale";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <SiteNav />
      <OpeningSystem />
      <Manifesto />
      <SignalGrid />
      <ProjectSpotlights />
      <ExperienceLedger />
      <ProofCabinet />
      <ContactFinale />
      <Footer />
    </main>
  );
}
