# THE DESCENT — hand-off for the next session

**Read this first.** Self-contained spec for turning the existing "Dusk" sunset mockup into a scroll-told *story* — a continuous descent from a mountain summit at dusk to the molten heart of the earth, with the portfolio content woven into the narrative. The user has approved this direction and set the bar explicitly: **the finished page must read as pure art — it should impress a professional UI/UX designer on first scroll.** Treat that as the acceptance criterion behind every decision.

---

## 1. What exists today

A standalone mockup (NOT part of the Next.js site yet): a pinned 260vh hero where scrolling plays a sunset — sun sinks, night crossfades in behind the landscape, mountains dim to silhouettes, stars brighten, moon rises. Then one project waypoint (Decyp3r) and a night finale. Verified with headless-Chrome screenshots, desktop + mobile.

**Files** (in `%LOCALAPPDATA%\Temp\claude\C--Users-rbm72-OneDrive-Documents-GitHub-functiondotexe-github-io\b0348eb7-9fda-4a37-a992-7c49379026ba\scratchpad\`; older copies under session `dbac4547-...`):

| File | Purpose |
|---|---|
| `dusk-mockup.template.html` | The source. Placeholders `__FONT_B64__`, `__IMG_B64__` |
| `font.b64` | Fraunces 600 woff2, base64 (display serif) |
| `img.b64` | Decyp3r phone screenshot, base64 |
| `cdp-shots.js` | Headless-Chrome CDP screenshot driver (1440×900 + 390×844) |
| `dusk-mockup.html` | Built output; a viewable untracked copy sits at this repo's root |

**Rebuild:** swap the two placeholders for the *trimmed* b64 file contents, write `dusk-mockup.html` beside `cdp-shots.js`, run `node cdp-shots.js`, inspect every shot. Temp scratchpads get wiped — **step zero: copy the five source files into this repo under `mockups/dusk/` with a tiny `build.js`.**

**Architecture worth keeping:** one rAF loop lerps mouse (`--mx`/`--my`) and scroll progress (`--p`), derives staggered sub-progress vars (`--pTitle --pSun --pSky --pCloud --pStars --pMoon`) via smoothstep; all motion is CSS transform/opacity/filter off those vars. Starfields are generated canvas; grass and fireflies are generated at load.

**Known gotcha (bit us once):** entrance animations with `fill: both` permanently override scroll-driven `opacity`/`transform` on the same element. Use `fill: backwards`; never mix positioning transforms with transform keyframes on one element.

---

## 2. BUG — mouse parallax "moves weirdly" (fix before anything else)

User-reported wobble; in narrow windows the mountain layer's edge becomes visible. Four stacking causes in the template:

1. **Layers are viewport-sized** (`.layer { inset: 0 }`) but cursor-translated up to ±26px → they slide off their own edges, exposing background.
2. **Mouse Y and scroll write to the same transform** → cursor fights the sunset choreography; scene bobs.
3. **Fixed-px amplitudes** → proportionally huge shifts in narrow windows.
4. **No pointer guard** → runs on touch/narrow screens.

Fix: oversize depth layers (`inset: -40px`), drop the vertical mouse component (scroll owns Y), halve amplitudes (d1 3px / d2 7px / d3 12px, scaled by `min(1, innerWidth/1440)`), gate behind `matchMedia("(pointer: fine)").matches && innerWidth > 880`. Verify with cursor at all four corners at scroll 0 / 0.5 / 1.0 — no layer edge may ever show.

---

## 3. THE STORY — narrative spec

This is the core change from the earlier plan: the descent is not themed decoration, it's a **told story**. Every chapter has a narrative beat, a line of copy, and a piece of the portfolio that *belongs* there. The scroll is the plot. Someone who never reads a word should still feel a beginning, a deepening, a climax, and an arrival.

**Narrative spine:** *A traveler watches the sun set from the summit, and instead of turning back, goes down — through the roots, through the caves, past the volcano's heart — and finds what they came for at the bottom.*

| # | Chapter | Story beat | Scene | Portfolio content |
|---|---|---|---|---|
| 0 | **Summit** | Arrival at golden hour | Existing hero: sunset plays as you scroll | Name, intro, CTA *(built)* |
| 1 | **Nightfall** | The light goes; the traveler doesn't leave | Full night, fireflies thin out; a narrative interstitial line fades in alone against the stars | Copy only, e.g. *"Most people stop here. This is where it gets interesting."* |
| 2 | **The threshold** | Going under | The ground line rises past the camera: grass silhouettes cross the viewport, then a soil cross-section — roots, pebbles, a sliver of night sky shrinking above. The riskiest, most impressive shot; prototype first | Section header — *"The work runs deep"* |
| 3 | **Rootworks** | First stratum: things that grew | Topsoil browns over the indigo base; root systems draw themselves (SVG stroke-dash) and connect the content cards | Projects, first batch |
| 4 | **The cavern** | A found world, glowing on its own | Open chamber; amber crystal clusters glow (gold palette as bioluminescence), glowworm "stars" on the ceiling (reuse starfield canvas, tinted), drifting dust motes | Remaining projects; skills as a crystal cluster, one facet per skill |
| 5 | **Strata** | Time made visible | Geological layers as horizontal bands, each labeled like sediment — **this is the experience/education timeline, depth = time** ("Fourth Dimension — present" as the top layer, UofT beneath, …). Signature idea; don't cut | Experience / About |
| 6 | **The volcano's heart** | The climax — heat, pressure, the reason for the journey | Passing alongside a magma chamber: warm light pulsing from a fissure, ember particles rising (inverted firefly system), rock edges rim-lit orange. The one place the palette runs hot. Short and intense — one viewport of awe, not a long section | A single bold statement about how the user works, e.g. *"Pressure is the point."* |
| 7 | **The chamber at the bottom** | Arrival | Past the heat: a vast, still, near-black geode chamber; one enormous crystal glows like the hero's sun did — the visual echo closes the loop. A gold glint falls like the shooting star from the surface | Contact finale — *"You've reached the bottom. Say hello."* |

**Connective tissue (what makes it feel like art, not sections):**

- **Depth meter rail** on the right edge: `0 m` at the summit ticking down to `−2,400 m` at the chamber; doubles as nav/progress. Chapter names appear beside it as you pass. Cheap to build, enormous narrative payoff.
- **Continuous light logic:** one light source per chapter (sun → moon → crystals → magma → the great geode), and everything — rim lights, shadows, glows — obeys it. Designers notice this instantly.
- **Interstitial copy lines** between chapters (like chapter 1's), set alone in the Fraunces serif, fading in/out with scroll. The story is told in ~6 short lines total. Write them once, well.
- **No hard section boundaries.** Every chapter hands off to the next inside a shared pinned transition or a long shared gradient. If a seam is visible, it's not done.

### Content inventory — DO THIS FIRST

The user has **more projects and content not yet in the mockup or the site**. Before building chapters 3–5, ask the user to dump everything: project names, one-liners, stacks, links, screenshots, plus work history entries. Then cast each item into the story (which stratum, which chamber). Do not invent placeholder projects; do not ship with only Decyp3r.

---

## 4. Tooling — decided (user delegated the choice)

**Mockup phase — stay vanilla.** The current single-file HTML + rAF/CSS-var system is fast to iterate, trivially screenshot-verifiable, and already proven. Do NOT introduce a framework to explore the remaining chapters; extend the template.

**Production port (after user approves the full mockup) — into the existing Next.js site with:**

- **GSAP ScrollTrigger** (free tier is enough) for the chapter choreography — pinning, scrubbed timelines, and chapter hand-offs are its exact job, and it's the de-facto standard behind most Awwwards scroll pieces. The mockup's smoothstep vars translate 1:1 into scrubbed timelines.
- **Lenis** for smooth scroll — makes scrubbed animation feel liquid instead of stepped. Tiny, pairs officially with ScrollTrigger.
- **Canvas stays hand-rolled** (starfields, glowworms, embers, motes) — no particle library needed; the existing generator pattern covers all of it.
- **React Bits / reactbits.dev:** treat as *reference and garnish only* (e.g. a text-scramble or count-up for the depth meter). The scene work is bespoke; importing prefab hero components would undercut the whole point.
- **No Figma step.** Design-in-code with the screenshot loop is already working and faster for this kind of atmospheric work. Use it only if the user asks to review static comps.
- **Fonts:** keep Fraunces (display) + system sans; self-host in production.

---

## 5. The craft bar — "impress a standing designer"

Checklist the final piece must pass; these are the details that separate art from a nice template:

- [ ] Every animation has intentional easing (the existing `cubic-bezier(.2,.7,.2,1)` family); nothing linear except ambient drift
- [ ] Consistent light source per chapter (see §3); glows have falloff, not flat opacity
- [ ] Film grain persists site-wide (exists); consider +1–2% in the underground for texture
- [ ] Typography: Fraunces at heroic sizes for chapter titles, tight leading, `text-wrap: balance`; label style (tracked-out caps) reserved for wayfinding only
- [ ] Micro-interactions on everything interactive: magnetic/lift on buttons, link underline animations (exist), device tilt-to-flat (exists)
- [ ] Scroll never fights the user: no scroll-jacking beyond pinning; chapters release cleanly
- [ ] `prefers-reduced-motion`: every pinned scene collapses to static art (pattern exists in hero)
- [ ] 60fps: transform/opacity/filter only; one rAF; no layout reads in scroll handlers; test with CPU throttling
- [ ] Mobile is a first-class cut: simpler layers, same story, verified in every screenshot pass
- [ ] A11y: the story is decoration — all content readable by screen reader in document order; `aria-hidden` on scenery (pattern exists); focus states styled (exist)
- [ ] Load moment: the summit reveal animation is the "curtain up" — first paint must be complete scenery, no pop-in (inline/base64 critical assets as now)

---

## 6. Definition of done & build order

**Done when:** parallax bug fixed and corner-verified · sources live in `mockups/dusk/` with `build.js` · all chapters render correctly in an extended `cdp-shots.js` (~10 scroll checkpoints, desktop + mobile) · every real project is placed (after the content dump) · craft checklist passes · user has scrolled it and reacted — **porting to Next.js is a separate follow-up, not this hand-off.**

**Order (risk-first):**
1. Copy sources into repo + `build.js` (protects everything)
2. Parallax fix + corner verification
3. **Content dump from the user** (blocks chapter casting)
4. Chapter 2 threshold prototype — hardest shot, prove it early
5. Chapters 3–5 (reuse waypoint markup; strata timeline)
6. Chapter 6 volcano beat + chapter 7 finale rework
7. Depth meter + interstitial copy
8. Full screenshot pass, mobile + reduced-motion + craft checklist
