# Illuminated Dark Redesign — Design Spec

Date: 2026-07-07
Status: Approved (dark-luxe evolution direction chosen by owner)

## Goal

Evolve the existing "RenAIssance OS" portfolio from an alternating paper/charcoal
editorial layout — which reads flat — into a single continuous dark stage that
feels modern, premium, and highly interactive, while keeping the site's
distinctive identity: Cormorant Garamond serif display type, gold/oxblood
accents, and the renaissance "chapters / instruments / ledger" voice.

## Direction

**"Illuminated Dark"** — deep charcoal (#050809) with a faint forest-green
undertone as the only stage. Gold behaves as a light source (glows, shines,
underlines), not a fill color. All surfaces are glass: translucent panels
(`bg-white/[0.04]` + `backdrop-blur-xl`), hairline `white/10` borders with an
inner inset hairline (double frame), and layered soft shadows. Ivory `paper`
(#eee5d1) becomes the primary text color instead of a background.

Explicitly rejected alternatives: full slate-950/violet "generic dev portfolio"
reset; keeping the light paper theme and only polishing it.

## Foundation (app/globals.css, tailwind.config.ts)

- Body background: charcoal. A fixed, slowly drifting atmosphere layer behind
  all content: two radial glows (gold top-left, teal top-right), a fine
  ~4.5rem grid, and a vignette. Sections layer over it rather than painting
  their own opaque backgrounds, so the page feels continuous and deep.
- `.ren-panel` refined: outer `border-white/10`, inner hairline inset frame,
  translucent glass fill, backdrop blur, layered shadow. Tone variants for
  gold-tinted and plain glass.
- Noise overlay blend switches from `multiply` to `soft-light`/`overlay` so
  grain reads on dark instead of muddying it.
- Typography unchanged in spirit: huge clamped serif display, wide-tracked
  Inter eyebrows/labels. Stats use tabular figures.
- Keep `--ease-luxury` cubic-bezier(0.19, 1, 0.22, 1) as the motion signature.

## Motion primitives (components/ren/Primitives.tsx)

Hand-built with framer-motion (already installed) — no new dependencies.
ReactBits/Aceternity-style patterns:

- **SplitReveal** — display headlines reveal word-by-word from behind an
  overflow mask when scrolled into view.
- **SpotlightCard** — cursor-tracked radial gold glow inside glass panels.
  Pointer-events only on fine pointers; inert on touch and reduced-motion.
- **ShineBorder** — slow conic gold shimmer tracing the border of key panels
  (hero side panel, principle quotes, contact finale).
- **CountUp** — stat numbers animate from 0 on scroll-into-view.
- **RenCta (upgraded)** — magnetic hover (subtle translate toward cursor),
  existing gold sweep and focus-visible ring kept.
- **Marquee** — slow ticker strip for the availability line before the footer.

Existing `fadeUp` / `stagger` variants and `ChapterIntro` / `OsPanel` /
`StatusPill` primitives are kept and restyled for the dark stage.

## Sections (same files, same exports — app/page.tsx untouched)

1. **SiteNav** — scroll-aware: transparent at top, glass + hairline once
   scrolled. Gold underline marks the active section (IntersectionObserver).
   Mobile overlay kept, glassed.
2. **OpeningSystem (hero)** — drops the AI-generated painting for a pure
   CSS/SVG atmosphere (mesh glow, grid, slow gold aurora). Headline uses
   SplitReveal with "illuminated" in an animated gold gradient. Side panel
   becomes a SpotlightCard with ShineBorder. Scroll parallax kept.
3. **Manifesto** — goes dark. Statement panel with SplitReveal; portrait in a
   glass frame with gold edge-glow, grayscale → color on hover.
4. **SignalGrid** — stats as CountUp in a hairline grid; six skill cards as
   SpotlightCards; principles as giant serif quotes in ShineBorder panels.
5. **ProjectSpotlights** — each project is a dark glass "plate" with its
   accent glow (teal/gold/oxblood/ivory). Image scales and frame shines on
   hover; floating glass gallery thumbnails; alternating layout and scroll
   parallax kept.
6. **ExperienceLedger** — an animated gold line draws down beside the ledger
   as it scrolls into view; rows are glass and lift on hover.
7. **ProofCabinet** — resume iframe, video, certificates in glass framing;
   certificates un-grayscale and lift on hover. Backdrop image stays as a
   faint layer.
8. **ContactFinale** — full-bleed finale: radial gold bloom, giant serif email
   with animated underline, magnetic CTAs, Marquee ticker after.
9. **Footer** — minimal, hairline top border, dark; drops leftover light-theme
   variables.

## Constraints

- Static export (`output: "export"`, unoptimized images) — no server features.
- `prefers-reduced-motion` fully respected: no parallax, reveals collapse to
  fades or nothing, marquee stops.
- Touch devices get depth/borders but no cursor-tracked effects.
- No new npm packages.
- Old orphaned `components/*.tsx` (pre-ren Hero, About, etc.) are left as-is;
  they are not imported by the page.

## Success criteria

- `pnpm build` (static export) passes.
- Every interactive element has intentional hover and focus-visible states.
- The page reads as one continuous dark composition — no flat opaque slabs.
- Identity is preserved: serif display, gold accents, renaissance voice.
