# Illuminated Dark Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the RenAIssance OS portfolio into a single continuous dark stage — glass panels, hairline borders, gold-glow motion — per the approved spec at `docs/superpowers/specs/2026-07-07-illuminated-dark-redesign-design.md`.

**Architecture:** All visual changes live in `app/globals.css`, `tailwind.config.ts`, and `components/ren/*` (same file names and exports, so `app/page.tsx` never changes). New motion primitives are added to `components/ren/Primitives.tsx` and consumed by section components. No new npm packages; framer-motion and Lenis are already installed.

**Tech Stack:** Next.js 16 (static export), React 19, Tailwind 3, framer-motion 12, Lenis.

## Global Constraints

- Static export: `output: "export"`, `images: { unoptimized: true }` — no server features, no next/font loaders beyond what exists.
- No new npm dependencies.
- `prefers-reduced-motion: reduce` must disable parallax, marquee, border spin, and collapse reveals to simple fades (the global CSS kill-switch in globals.css already zeroes transitions/animations — keep it).
- Cursor-tracked effects (spotlight, magnetic) must be inert on touch: gate visuals behind `@media (hover: hover) and (pointer: fine)`.
- Every interactive element keeps a `:focus-visible` outline (`2px solid var(--gold-light)`, offset 5px — already global).
- Verification per task: `pnpm build` passes (type-check + export). No test infra exists; do not add one for this visual work.
- Palette (verbatim): charcoal `#05080a`, forest-deep `#070b08`, paper `#eee5d1`, paper-warm `#f6eedb`, ink `#171511`, gold `#b99654`, gold-light `#d9c184`, oxblood `#8b2a22`, teal `#70a8a2`.
- Signature easing (verbatim): `cubic-bezier(0.19, 1, 0.22, 1)` (`--ease-luxury`).
- Type system: Cormorant Garamond display serif, EB Garamond body serif, Inter for eyebrows/labels/UI.

---

### Task 1: Foundation — dark stage tokens, atmosphere, tailwind keyframes

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `components/Noise.tsx` (blend mode only)

**Interfaces:**
- Produces CSS classes consumed by all later tasks: `.ren-shell`, `.ren-section` (now transparent, hairline side rules), `.ren-panel` (dark glass), `.ren-display`, `.ren-body`, `.ren-eyebrow`, `.ren-nav-link`, `.ren-cta` (dark glass default), `.ren-gradient-word`, `.ren-underline-link`, `.ticker-rule`.
- Produces Tailwind animations: `animate-aurora-a`, `animate-aurora-b`, `animate-shine`, `animate-border-spin`, `animate-marquee`.

- [ ] **Step 1: Rewrite globals.css for the dark stage**

Key blocks (complete values):

```css
body {
  background: var(--charcoal);
  color: var(--paper);
  font-family: var(--font-serif);
}

/* Fixed atmosphere: mesh glows + grid + vignette, static (aurora motion is hero-local) */
body::before {
  position: fixed; inset: 0; z-index: 0; pointer-events: none; content: "";
  background:
    radial-gradient(ellipse 60rem 42rem at 12% -6%, rgba(185, 150, 84, 0.10), transparent 62%),
    radial-gradient(ellipse 52rem 38rem at 88% 4%, rgba(112, 168, 162, 0.06), transparent 60%),
    radial-gradient(ellipse 70rem 50rem at 50% 110%, rgba(139, 42, 34, 0.05), transparent 65%),
    linear-gradient(rgba(238, 229, 209, 0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(238, 229, 209, 0.028) 1px, transparent 1px);
  background-size: auto, auto, auto, 4.5rem 4.5rem, 4.5rem 4.5rem;
}
body::after { /* vignette */
  position: fixed; inset: 0; z-index: 0; pointer-events: none; content: "";
  background: radial-gradient(ellipse at center, transparent 55%, rgba(2, 4, 5, 0.55) 100%);
}
main { position: relative; z-index: 1; background: transparent; }

.ren-panel {
  position: relative; overflow: hidden;
  border: 1px solid rgba(238, 229, 209, 0.12);
  background: rgba(238, 229, 209, 0.045);
  backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 1.5rem 3.75rem rgba(0, 0, 0, 0.45);
  transition: border-color 0.55s var(--ease-luxury), box-shadow 0.55s var(--ease-luxury), transform 0.55s var(--ease-luxury);
}
.ren-panel::before { position: absolute; inset: 0.85rem; pointer-events: none; content: ""; border: 1px solid rgba(238, 229, 209, 0.1); }
.ren-panel:hover { border-color: rgba(217, 193, 132, 0.28); box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 1.75rem 4.5rem rgba(0,0,0,0.55), 0 0 3.5rem rgba(185,150,84,0.08); }

.ren-gradient-word {
  background: linear-gradient(100deg, var(--gold) 20%, #f2e3b8 40%, var(--gold-light) 60%, var(--gold) 80%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: shine 5s linear infinite;
}

.ren-underline-link { /* giant contact email */
  position: relative; display: inline-block;
}
.ren-underline-link::after {
  position: absolute; left: 0; right: 0; bottom: 0.04em; height: 2px; content: "";
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  transform: scaleX(0); transform-origin: right;
  transition: transform 0.7s var(--ease-luxury);
}
.ren-underline-link:hover::after { transform: scaleX(1); transform-origin: left; }

@media (hover: none), (pointer: coarse) {
  .ren-spotlight-overlay { display: none; }
}
```

`.ren-cta` keeps its sweep/hover but defaults to the dark glass look (former `.ren-cta-dark` values become the base; keep `.ren-cta-dark` as an alias class so existing call sites compile). `.ren-section` loses opaque backgrounds (sections stop setting `bg-paper`/`bg-charcoal`). Keep scrollbar, selection, focus-visible, reduced-motion blocks. Delete unused `.ren-artifact*` light styles (replaced in Task 5) and `.estate-shell`.

- [ ] **Step 2: Rewrite tailwind.config.ts animations with real keyframes**

Replace the dead `animation` entries (their keyframes never existed) with:

```ts
keyframes: {
  "aurora-a": { "0%,100%": { transform: "translate3d(-6%, -4%, 0) scale(1)" }, "50%": { transform: "translate3d(7%, 6%, 0) scale(1.12)" } },
  "aurora-b": { "0%,100%": { transform: "translate3d(5%, 3%, 0) scale(1.08)" }, "50%": { transform: "translate3d(-6%, -5%, 0) scale(1)" } },
  shine: { to: { backgroundPosition: "-200% center" } },
  "border-spin": { to: { transform: "rotate(360deg)" } },
  marquee: { to: { transform: "translateX(-50%)" } },
},
animation: {
  "aurora-a": "aurora-a 16s ease-in-out infinite",
  "aurora-b": "aurora-b 19s ease-in-out infinite",
  shine: "shine 5s linear infinite",
  "border-spin": "border-spin 9s linear infinite",
  marquee: "marquee 32s linear infinite",
},
```

Keep colors/fonts/spacing/fontSize/easing/backdropBlur; drop the stale `boxShadow.paper*` light-theme shadows and `backgroundImage.paper-texture`.

- [ ] **Step 3: Noise blend for dark**

In `components/Noise.tsx` change the overlay div classes: `mix-blend-multiply` → `mix-blend-soft-light`, opacity `0.28` → `0.4`.

- [ ] **Step 4: Verify build**

Run: `pnpm build` — Expected: succeeds (sections still reference old classes that exist or Tailwind utilities; nothing removed is still referenced — grep for `estate-shell`, `ren-artifact`, `ren-cta-dark` usages first and fix in the same step if needed. `Footer.tsx` uses `estate-shell` and `ticker-rule`: keep `.ticker-rule`, and Footer is rewritten in Task 7 — so keep `.estate-shell` as an empty-safe alias until Task 7 or fix Footer now with `ren-shell`).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css tailwind.config.ts components/Noise.tsx
git commit -m "style: dark stage foundation — atmosphere, glass panels, motion keyframes"
```

---

### Task 2: Motion primitives in Primitives.tsx

**Files:**
- Modify: `components/ren/Primitives.tsx`

**Interfaces (produced, consumed by Tasks 3–7):**

```tsx
export function SplitReveal(props: {
  text: string;                      // split on spaces
  as?: "h1" | "h2" | "p";          // default "h2"
  className?: string;
  highlightWords?: string[];         // words rendered with .ren-gradient-word
  delay?: number;                    // seconds before stagger starts, default 0
}): JSX.Element;

export function SpotlightCard(props: {
  children: ReactNode;
  className?: string;               // applied to outer .ren-panel div
}): JSX.Element;

export function ShineBorder(props: {
  children: ReactNode;
  className?: string;               // outer wrapper
  contentClassName?: string;        // inner content surface
}): JSX.Element;

export function CountUp(props: {
  value: number;
  suffix?: string;                  // default "+"
  className?: string;
}): JSX.Element;

export function Marquee(props: { items: string[] }): JSX.Element;

// Existing exports kept: fadeUp, stagger, ChapterIntro, OsPanel, RenCta, StatusPill
// RenCta gains magnetic hover; signature unchanged.
// ChapterIntro: `dark` prop removed from call sites later; keep prop (ignored) OR
//   drop it and update all call sites in the same task that touches them — choose:
//   keep the prop, ignore it, to avoid cross-task breakage.
```

- [ ] **Step 1: Implement SplitReveal**

```tsx
export function SplitReveal({ text, as = "h2", className = "", highlightWords = [], delay = 0 }: SplitRevealProps) {
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-90px" }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block will-change-transform ${highlightWords.includes(word.replace(/[.,]/g, "")) ? "ren-gradient-word" : ""}`}
            variants={{ hidden: { y: "115%" }, visible: { y: 0, transition: { duration: 0.9, ease: easeLuxury } } }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
```

(Note: whitespace must live inside the masked span or lines collapse; `pb/-mb` prevents descender clipping on g/y/p.)

- [ ] **Step 2: Implement SpotlightCard** — outer div `.ren-panel` + `onMouseMove` writing `--spot-x/--spot-y` CSS vars from `getBoundingClientRect`, overlay div class `ren-spotlight-overlay pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100` with inline `background: radial-gradient(28rem circle at var(--spot-x) var(--spot-y), rgba(217,193,132,0.1), transparent 55%)`. Outer gets `group relative`.

- [ ] **Step 3: Implement ShineBorder** — outer `relative overflow-hidden p-px` wrapper; spin layer `absolute left-1/2 top-1/2 h-[300%] w-[300%] -translate-x-1/2 -translate-y-1/2 animate-border-spin` with `background: conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(217,193,132,0.65) 330deg, transparent 360deg)`; content div `relative z-10 h-full` + `contentClassName` (callers pass a near-opaque dark surface e.g. `bg-[#0a0d0c]/95 backdrop-blur-xl`).

- [ ] **Step 4: Implement CountUp** — `useMotionValue(0)` + `useInView(ref, { once: true })`; on inView run `animate(mv, value, { duration: 1.8, ease: easeLuxury })`; render `useTransform(mv, v => Math.round(v))` via `<motion.span>{rounded}</motion.span>` + suffix; add `tabular-nums`.

- [ ] **Step 5: Implement Marquee** — `overflow-hidden` strip with `flex w-max animate-marquee gap-0` inner track; render `items` joined with `◆` separators twice (`aria-hidden` on the duplicate) so `translateX(-50%)` loops seamlessly; eyebrow typography classes.

- [ ] **Step 6: Upgrade RenCta with magnetic hover** — convert `<a>` to `<motion.a>` with `x/y` `useSpring(useMotionValue(0), { stiffness: 260, damping: 22 })`; `onMouseMove` sets offsets clamped to ±5px toward cursor; `onMouseLeave` resets to 0. Keep classes/props identical.

- [ ] **Step 7: Restyle ChapterIntro/OsPanel/StatusPill for dark** — ChapterIntro: eyebrow `text-gold-light`, title switches to `<SplitReveal as="h2">`, body `text-paper/65`; keep `dark` prop accepted-but-ignored. OsPanel tones: `light` → glass (`border-paper/12 bg-paper/[0.045] text-paper`), `dark` → same glass, `gold` → `border-gold/35 bg-gold/[0.08] text-paper`.

- [ ] **Step 8: Verify + commit**

Run: `pnpm build` — Expected: PASS.

```bash
git add components/ren/Primitives.tsx
git commit -m "feat: motion primitives — SplitReveal, SpotlightCard, ShineBorder, CountUp, Marquee, magnetic CTA"
```

---

### Task 3: SiteNav + OpeningSystem (hero)

**Files:**
- Modify: `components/ren/SiteNav.tsx`
- Modify: `components/ren/OpeningSystem.tsx`

**Interfaces:**
- Consumes: `RenCta`, `StatusPill`, `SplitReveal`, `SpotlightCard`, `ShineBorder`, `fadeUp`, `stagger` from `./Primitives`; Tailwind `animate-aurora-a/b`.

- [ ] **Step 1: SiteNav scroll-aware glass + active section**

`useScroll()` + `useMotionValueEvent(scrollY, "change", v => setScrolled(v > 32))`. Bar classes swap: top → `border-transparent bg-transparent`, scrolled → `border-paper/10 bg-charcoal/70 backdrop-blur-xl`. Active section: one `IntersectionObserver` in a `useEffect` over `["manifesto","signals","work","timeline","proof","contact"]` with `rootMargin: "-45% 0px -50% 0px"`, storing `active`; the matching `.ren-nav-link` gets a persistent gold underline (`::after` scaleX 1 via an `is-active` class — add `.ren-nav-link.is-active::after { transform: scaleX(1); }` and `.ren-nav-link.is-active { color: var(--gold-light); }` to globals.css in this task). Mobile trigger button restyled dark glass (`border-paper/15 bg-charcoal/80 text-paper backdrop-blur-xl`); overlay gets `backdrop-blur-2xl bg-charcoal/92` + staggered serif links + gold hover.

- [ ] **Step 2: Hero — CSS atmosphere replaces the painting**

Remove the `next/image` hero painting + its gradient washes. Keep parallax refs. New backdrop inside the section (behind content):

```tsx
<div className="pointer-events-none absolute inset-0" aria-hidden="true">
  <div className="absolute -left-[10%] top-[-12%] h-[36rem] w-[52rem] rounded-full bg-gold/[0.13] blur-[110px] animate-aurora-a" />
  <div className="absolute right-[-8%] top-[8%] h-[30rem] w-[44rem] rounded-full bg-teal/[0.09] blur-[110px] animate-aurora-b" />
  <div className="absolute left-[22%] bottom-[-18%] h-[28rem] w-[40rem] rounded-full bg-oxblood/[0.10] blur-[120px] animate-aurora-a" />
</div>
```

Headline becomes `<SplitReveal as="h1" text="Useful systems, illuminated." highlightWords={["illuminated"]} className="ren-display mt-5 max-w-[10ch] text-[clamp(4.6rem,12vw,14rem)]" />`. Side panel: wrap in `ShineBorder` → `SpotlightCard` content (quote, statement, focus/scroll tiles kept, borders → `border-paper/10`). Section height `min-h-[118vh]`; bottom fade `::after` → `linear-gradient(180deg, transparent, var(--charcoal))` (update `.ren-hero::after` in globals.css). Keep `bg-transparent` (atmosphere shows through), status pills, CTAs (now magnetic automatically).

- [ ] **Step 3: Verify + commit**

Run: `pnpm build`; also `pnpm dev` spot-check hero + nav in browser.

```bash
git add components/ren/SiteNav.tsx components/ren/OpeningSystem.tsx app/globals.css
git commit -m "feat: scroll-aware glass nav, CSS-atmosphere hero with split reveal"
```

---

### Task 4: Manifesto + SignalGrid

**Files:**
- Modify: `components/ren/Manifesto.tsx`
- Modify: `components/ren/SignalGrid.tsx`

**Interfaces:**
- Consumes: `ChapterIntro`, `OsPanel`, `SpotlightCard`, `ShineBorder`, `CountUp`, `fadeUp`, `stagger`.

- [ ] **Step 1: Manifesto dark** — section drops `bg-paper text-ink` → transparent; remove texture `next/image`; statement panel keeps serif statement (wrap headline text in `SplitReveal as="p"`); availability OsPanel glass; portrait figure: `.ren-panel` frame + `shadow-[0_0_3rem_rgba(185,150,84,0.12)]`, image `grayscale contrast-[1.08] transition-all duration-700 hover:grayscale-0 hover:scale-[1.02]` inside `overflow-hidden`.
- [ ] **Step 2: SignalGrid** — section transparent. Stats grid: `border border-paper/10 bg-paper/10 gap-px` cells `bg-charcoal/80 backdrop-blur-sm`; numbers `<CountUp value={stat.value} className="ren-display mt-10 text-7xl text-gold-light" />`. Skill cards → `<SpotlightCard>` (replaces OsPanel) with same inner content, tool chips `border-paper/12 bg-paper/[0.05] text-paper/75 transition-colors hover:border-gold/40 hover:text-gold-light`. Principles → `ShineBorder` panels, `contentClassName="bg-[#0a0d0c]/95 p-7 md:p-9"`, quote serif clamp kept, author eyebrow.
- [ ] **Step 3: Verify + commit**

Run: `pnpm build` — Expected: PASS.

```bash
git add components/ren/Manifesto.tsx components/ren/SignalGrid.tsx
git commit -m "feat: dark manifesto and signal grid — count-up stats, spotlight skill cards"
```

---

### Task 5: ProjectSpotlights (glass plates)

**Files:**
- Modify: `components/ren/ProjectSpotlights.tsx`
- Modify: `app/globals.css` (rewrite `.ren-artifact*` for dark glass)

**Interfaces:**
- Consumes: `ChapterIntro`, `RenCta`, `StatusPill`; `PROJECTS` accents `"gold" | "red" | "teal" | "ivory"`.

- [ ] **Step 1: Dark `.ren-artifact`**

```css
.ren-artifact {
  position: relative; overflow: hidden;
  border: 1px solid rgba(238, 229, 209, 0.12);
  background: rgba(238, 229, 209, 0.04);
  backdrop-filter: blur(16px);
  color: var(--paper);
  box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.5);
  transition: border-color .6s var(--ease-luxury), box-shadow .6s var(--ease-luxury);
}
.ren-artifact::after {
  position: absolute; inset: 0; pointer-events: none; content: "";
  background: radial-gradient(circle at 18% 12%, var(--artifact-glow, rgba(185,150,84,0.16)), transparent 22rem);
}
.ren-artifact:hover { border-color: rgba(217,193,132,0.3); box-shadow: 0 2.5rem 6rem rgba(0,0,0,0.6), 0 0 4rem var(--artifact-glow, rgba(185,150,84,0.16)); }
.ren-artifact-gold  { --artifact-glow: rgba(185, 150, 84, 0.22); }
.ren-artifact-red   { --artifact-glow: rgba(139, 42, 34, 0.26); }
.ren-artifact-teal  { --artifact-glow: rgba(112, 168, 162, 0.2); }
.ren-artifact-ivory { --artifact-glow: rgba(238, 229, 209, 0.14); }
```

- [ ] **Step 2: Component polish** — section transparent (`text-ink` → default paper); article border `border-paper/10`; copy: kicker `text-gold-light`, narrative `text-paper/65`, impact rule `border-gold/50 text-gold-light`, stack chips dark glass like Task 4 chips. Plate: wrap image in `group overflow-hidden`, image `transition-transform duration-[900ms] ease-luxury group-hover:scale-[1.035]`; `mediaFit === "contain"` keeps `bg-charcoal p-6`; add a sweep overlay div `pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-paper/[0.06] to-transparent transition-transform duration-1000 group-hover:translate-x-full`. Gallery thumbs: `border-paper/12 bg-paper/[0.05] p-2 backdrop-blur-md shadow-[0_1rem_2.5rem_rgba(0,0,0,0.45)] transition-transform duration-500 hover:-translate-y-1.5`.
- [ ] **Step 3: Verify + commit**

Run: `pnpm build` — Expected: PASS.

```bash
git add components/ren/ProjectSpotlights.tsx app/globals.css
git commit -m "feat: project plates as dark glass with accent glows and hover shine"
```

---

### Task 6: ExperienceLedger (drawing timeline)

**Files:**
- Modify: `components/ren/ExperienceLedger.tsx`
- Modify: `app/globals.css` (`.ren-ledger-row` hover)

**Interfaces:**
- Consumes: `ChapterIntro`, `fadeUp`, `stagger`; framer `useScroll` + `scaleY`.

- [ ] **Step 1: Gold progress line** — wrap the rows grid in `relative pl-6 md:pl-10`; add:

```tsx
const ref = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.82", "end 0.55"] });
// rail
<div className="absolute left-0 top-0 h-full w-px bg-paper/12" aria-hidden="true">
  <motion.div className="h-full w-px origin-top bg-gradient-to-b from-gold-light via-gold to-transparent" style={{ scaleY: scrollYProgress }} />
</div>
```

- [ ] **Step 2: Glass rows** — `.ren-ledger-row` gets `transition` + hover: `transform: translateY(-3px); border-color: rgba(217,193,132,0.3); box-shadow: 0 1.75rem 4.5rem rgba(0,0,0,0.5), 0 0 2.5rem rgba(185,150,84,0.07);` and `backdrop-filter: blur(14px)`. Bullets keep gold left rules; number stays `text-gold-light`.
- [ ] **Step 3: Verify + commit**

Run: `pnpm build` — Expected: PASS.

```bash
git add components/ren/ExperienceLedger.tsx app/globals.css
git commit -m "feat: experience ledger with scroll-drawn gold rail and glass rows"
```

---

### Task 7: ProofCabinet + ContactFinale + Footer + ScrollProgress

**Files:**
- Modify: `components/ren/ProofCabinet.tsx`
- Modify: `components/ren/ContactFinale.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/ScrollProgress.tsx`

**Interfaces:**
- Consumes: `ChapterIntro`, `RenCta`, `Marquee`, `fadeUp`, `stagger`; `PERSONAL`, `RESUME`, `CERTIFICATES`.

- [ ] **Step 1: ProofCabinet** — keep backdrop image at `opacity-[0.22]` + existing dark gradient wash; panels already glass-ish: normalize to `.ren-panel` + `p-5/p-6`; certificates: `group` figure, image `grayscale transition-all duration-700 group-hover:grayscale-0`, figure `transition-transform duration-500 hover:-translate-y-1 hover:border-gold/30`.
- [ ] **Step 2: ContactFinale** — section transparent; the big box becomes full-bleed-feeling glass: `.ren-panel` + inner radial gold bloom div (`radial-gradient(circle at 78% 10%, rgba(217,193,132,0.14), transparent 30rem)`) + grid layer kept; email link gets `ren-underline-link text-gold-light` and `hover:text-paper transition-colors duration-500`; CTAs unchanged (magnetic now). After the panel, add `<div className="mt-16 border-y border-paper/10 py-5 text-paper/50"><Marquee items={[PERSONAL.availabilityLine, PERSONAL.email, PERSONAL.city, "Open to software work, prototypes, AI experiments"]} /></div>`.
- [ ] **Step 3: Footer** — replace `estate-shell` with `ren-shell`; wrapper `border-t border-paper/10 py-10 text-paper/45`; `ticker-rule` kept (`finis / signed and sealed`); accent word `text-gold-light` instead of oxblood-on-dark (contrast).
- [ ] **Step 4: ScrollProgress** — `h-px` → `h-[2px]`, keep gold gradient; ensure `z-[100]` above nav.
- [ ] **Step 5: Full verify + commit**

Run: `pnpm build` — Expected: PASS. Then `pnpm dev` and walk the whole page top to bottom (hero reveal, nav active states, count-ups, spotlights, plate hovers, rail draw, marquee, focus rings via keyboard tab).

```bash
git add components/ren/ProofCabinet.tsx components/ren/ContactFinale.tsx components/Footer.tsx components/ScrollProgress.tsx
git commit -m "feat: glass proof cabinet, contact finale with marquee, dark footer"
```

---

## Self-Review

- **Spec coverage:** foundation ✓ (Task 1), primitives ✓ (Task 2), all 9 section items ✓ (Tasks 3–7; ScrollProgress/Noise folded into Tasks 1 & 7), constraints ✓ (global section).
- **Placeholders:** none — every step names exact classes, values, or code.
- **Type consistency:** primitive signatures in Task 2 match usages in Tasks 3–7 (`SplitReveal` props, `ShineBorder contentClassName`, `CountUp value/className`, `Marquee items`). `ChapterIntro` keeps its `dark` prop (ignored) so untouched call sites compile at every task boundary.
