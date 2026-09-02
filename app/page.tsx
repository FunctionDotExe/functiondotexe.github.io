import { Basecamp } from "@/components/summit/Basecamp";
import { HighAltitude } from "@/components/summit/HighAltitude";
import { JourneyWorld } from "@/components/summit/JourneyWorld";
import { Landmarks } from "@/components/summit/Landmarks";
import { SummitHero } from "@/components/summit/SummitHero";
import { SummitNav } from "@/components/summit/SummitNav";

export default function Home() {
  return (
    <>
      <SummitNav />
      <main className="journey" id="main-content">
        <JourneyWorld />
        <div className="journey__story">
          <SummitHero />
          <Basecamp />
          <Landmarks />
          <HighAltitude />
        </div>
      </main>
    </>
  );
}
