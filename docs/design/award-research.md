# Award reference research

Research date: 5 September 2026. This is an evidence-based design brief, not a claim that the portfolio has won an award or matches an award winner. Award pages and creator case studies were read. Live reference-site interaction, exact font identification, load timing, and GPU performance were not independently measured in this research pass. Historic versions are labeled; a live URL may now show a redesign.

## What the benchmark actually rewards

Awwwards publishes four main scoring categories: design (40%), usability (30%), creativity (20%), and content (10%). Its developer evaluation also includes accessibility, responsive design, and web performance. These are useful independent dimensions; adding more motion alone cannot establish quality. [Awwwards: Lusion v3 scores](https://www.awwwards.com/sites/lusion-v3)

Award winners also have weaknesses. Igloo's published developer scores include animation 9.60 and accessibility 6.60. Bruno's 2019 portfolio earned creativity 8.95 but usability 7.55. These scores are jury judgments, not objective lab results, and argue for learning from specific strengths instead of copying every decision. [Igloo award record](https://www.awwwards.com/sites/igloo-inc), [Bruno award record](https://www.awwwards.com/sites/bruno-simon-portfolio)

## Six relevant references

### 1. David Whyte Experience — artwork as the interface

**Verified:** Site of the Day, 31 December 2024. The award page highlights watercolor interaction, a long-press landscape reveal, scrolling through landscapes, and full-screen poems. [Award record](https://www.awwwards.com/sites/david-whyte-experience)

**Creator evidence:** Immersive Garden collaborated with a watercolor artist, arranged camera movement in Blender, rebuilt the environment in Three.js, and added a fluid effect over paintings. They limited simulation work to visible art and baked reveal noise in advance. [Creator case study](https://www.awwwards.com/case-study-david-whyte-experience-by-immersive-garden.html)

**Application to our site:** The alpine-to-core artwork is already the strongest identity. Make light, mist, and foreground depth respond coherently to the visitor. Project inspection should feel like examining an artifact found in that world. Avoid turning every chapter into a translucent generic panel; preserve the painting's composition and clear text areas.

### 2. Lando Norris / OFF+BRAND — motion expresses the person

**Verified from creator:** OFF+BRAND reports Awwwards Site of the Year, SOTM, and SOTD. Their description combines bold type, vibrant accents, racing-inspired transitions, and 3D/WebGL. They explicitly describe lazy loading, optimized asset delivery, mobile layouts, direct navigation, and immersive galleries. No independent performance measurements were provided. [Creator case study](https://www.itsoffbrand.com/our-work/lando-norris)

**Application:** Build a recognizable Ruben-specific system: alpine exploration plus engineering instruments and tangible project artifacts. Large expressive titles can coexist with precise technical labels and useful copy. Give the project galleries the same craft as the hero. Scene transitions need a shared pace and visual logic.

### 3. Lusion v3 — authored interaction and a disciplined identity

**Verified:** Site of the Day, 2 October 2023, score 8.25. The award page identifies project, home, and about page details, a reactive cursor, and scroll animation, with a blue and pale neutral palette. [Award record](https://www.awwwards.com/sites/lusion-v3)

**Separate historical technical reference:** Lusion's 2019 studio-site case study describes preparing custom simulation data and combining it with real-time interaction. It reports different geometry budgets for desktop and mobile, and a hybrid of offline imagery and live lighting. This is evidence about the 2019 version, not an assertion about v3 internals. [2019 creator case study](https://www.awwwards.com/case-study-for-lusion-by-lusion-winner-of-site-of-the-month-may.html)

**Application:** A signature effect should have custom geometry, art, or behavior related to the mountain. Keep most visual complexity in the existing paintings, and spend live rendering on a small number of responsive accents. An interactive crystal, terrain specimen, or light field can carry more identity than a generic floating sphere.

### 4. Igloo Inc / abeto + Bureaux — strong atmosphere, inspect the tradeoffs

**Verified:** Site of the Day, 23 July 2024; Awwwards' collection also labels it Site of the Year 2024. The award record identifies animation, 3D, transitions, infinite scroll, and a cool gray palette. Its developer scores favor animation and responsive design more than accessibility and semantics. [Award record](https://www.awwwards.com/sites/igloo-inc), [Awwwards collection showing the 2024 annual award](https://www.awwwards.com/websites/%2307998E/?page=5)

**Application:** Carry a coherent atmospheric palette across chapter boundaries. The underground scene should feel like a destination reached through the same world. Inspect the actual experience for legibility, navigation, and essential content access; do not adopt infinite travel as a prerequisite for reaching a project or contacting Ruben.

### 5. Bruno Simon, 2019 portfolio — memorable behavior with small purposeful details

**Verified:** Site of the Day, 11 November 2019, and Site of the Month November. The creator describes a bird's-eye car experience, onboarding, signposted crossroads, projects, information, and a playground. Blender assets use simplified invisible physics shapes; compressed models totaled under 2 MB as reported at the time. The antenna, brake lights, and tab title respond to driving. Mobile received specific controls and portrait adjustments. [Award record](https://www.awwwards.com/sites/bruno-simon-portfolio), [Creator case study](https://www.awwwards.com/bruno-simon-portfolio-wins-site-of-the-month-november.html)

**Application:** One memorable action plus many consistent small responses is stronger than unrelated animation everywhere. Use scroll position to update the expedition instrument, give artifacts tactile feedback, and make the cave transition reward travel. Provide touch and keyboard equivalents. The portfolio's engineering interests can be demonstrated through a small interactive object without rebuilding the whole site as a game.

### 6. Immersive Garden, 2025 studio site — navigation belongs to the art direction

**Verified:** Site of the Day, 7 January 2025. Awwwards highlights project listing, bas-relief interaction, contact, menu transition, and a rapid-scroll feature. The palette recorded is black and gray. [Award record](https://www.awwwards.com/sites/immersive-garden-website)

**Application:** Treat route navigation, project selection, menu opening, and contact as designed scenes. A route index can communicate both location and destination while retaining direct links. Its current chapter indicator should remain understandable without motion or relying only on color.

## Comparison against this branch before the redesign

This comparison uses `docs/design/mountain-to-core-refinement.md` and `components/summit` source. It does not substitute for rendered desktop and mobile inspection.

| Dimension | Existing foundation | Main opportunity | Acceptance evidence |
| --- | --- | --- | --- |
| Identity | Original layered alpine-to-cavern art; engineering, AI, and robotics content | Make interface details unmistakably part of the expedition | Hero, projects, menu, and finale share motifs, palette, and type hierarchy |
| First impression | Oversized personal name and a bounded, skippable arrival sequence | A richer foreground focal point and more controlled composition around the peak | First screen is striking at wide desktop and narrow portrait sizes |
| 3D and depth | Parallax illustration, lateral underground movement, tilted project media | Add a purposeful interactive artifact with coherent lighting and depth | Motion feels physically related to the artwork; static fallback remains complete |
| Story and pacing | Surface, ascent, blue hour, cave, skills, experience, portrait, core | Establish distinct scene silhouettes and transitions; eliminate accidental empty travel | Scroll recording shows intentional rhythm with no blank handoffs |
| Typography | Large Georgia titles, system sans body, supporting labels | More intentional display/body/instrument contrast; consistent readable minimum sizes | Text stays readable against every scene at mobile, short heights, and zoom |
| Project presentation | Four different media compositions and native gallery dialogs | Artifact lighting, frame treatment, project-specific detail, strong inspection states | Images, controls, captions, thumbnails, close behavior, and keyboard navigation all work |
| Navigation | Direct section links and native mobile dialog | Express route progression and preview destinations with a coherent visual instrument | Direct jumps, deep links, focus restoration, Escape, and current location all work |
| Microinteraction | Hover disclosures, copy-email feedback, replay intro | Shared timing and tactile hover/focus/pressed states for the whole interface | No hover-only information; motion does not keep running unnecessarily |
| Mobile | Normal content flow for mobile/short screens; touch disclosures | Compose the artwork and project artifacts specifically for portrait | No clipped titles, tiny controls, horizontal overflow, or unreadable imagery |
| Accessibility and performance | Reduced motion, native dialogs/disclosures, lazy media, motion regression scripts | Preserve these strengths while adding visual complexity | Keyboard QA, reduced-motion QA, production build, relevant regression checks, browser inspection |

## Priorities for this implementation

1. Preserve the alpine-to-core identity and all genuine project information. Strengthen the first screen's composition and craft a signature terrain/crystal interaction tied to that identity.
2. Design a complete type and interface system: editorial display scale, practical body copy, precise expedition labels, generous hit areas, clear focus states, and consistent borders/light treatment.
3. Make the four projects feel like distinct, inspectable objects. Improve framing, layering, captions, inspection affordances, gallery transitions, and dialog layout together.
4. Add depth where it is most noticeable: foreground motion, lighting that agrees across layers, meaningful atmospheric transitions, and an arrival/finale with a deliberate visual payoff.
5. Make route position, chapter changes, and direct navigation part of the visual experience. Maintain direct access to projects, experience, resume, and contact.
6. Verify complete desktop and mobile journeys. A build passing proves compilation, while screenshots, keyboard operation, and observed scroll behavior establish whether the actual experience is finished.

No research source establishes that any specific number of effects, particular framework, or amount of 3D is sufficient to win an award. The resulting site should be judged on its original identity, visual execution, functionality, and observed usability.

## Follow-up: cinematic pacing (superseded)

The subsequent scene redesign uses arrival, inspection, and departure rather than an uninterrupted stack of content. Igloo's creators describe prototyping the camera journey before detailed art and rejecting repeated ice-block silhouettes; those observations informed distinct phone, dashboard, vision, and workshop compositions. Its content-related particle transformations also support making our scans, process lines, and facet changes explain the selected content. [Igloo creator case study](https://www.awwwards.com/igloo-inc-case-study.html)

Immersive Garden's detailed section numerals and backstage material informed persistent numbered scene navigation and a second layer of inspectable project evidence. David Whyte's material-specific watercolor reveals informed the shared directional reveal vocabulary. These are design interpretations, not copied implementations. [Immersive Garden creator case study](https://www.awwwards.com/case-study-immersive-gardens-new-website.html), [David Whyte creator case study](https://www.awwwards.com/case-study-david-whyte-experience-by-immersive-garden.html)

The approximately two-second holds are our authored timing choice, not a duration established by these references. Final review used real Chrome screenshots and input tests, including mobile emulation. That establishes the inspected layouts and behavior; it does not establish an award score or physical-device frame rate.

The user subsequently rejected the pacing panel and choppy motion. The current revision removes the timed holds and gemstone carousel, restores native scrolling, and keeps smaller decorative gems in the terrain. Current behavior and measured performance evidence are documented in [motion language](motion-language.md) and [mobile skills](mobile-skills.md).
