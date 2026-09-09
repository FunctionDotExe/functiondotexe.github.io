# Aurel editorial refinement

Implementation handoff · 9 September 2026. The active direction is recorded in [DESIGN.md](../../DESIGN.md).

## What changed

The previous scenic portfolio delayed useful evidence and made reading compete with moving artwork. The refinement uses paper and plum surfaces, Bodoni Moda headings, and DM Sans body text. A single 174,064-byte landscape preserves the visual identity in the hero. Actual screenshots and hardware photographs lead the project presentation.

Content now follows ordinary document flow. Repeated introductions, extended scenic transitions, sticky project stages, and the duplicate route instrument are absent from the active page. Native disclosures hold optional build notes and background information. Three capability groups connect tools to production work, research, and robotics. Project copy names the domain and contribution; public source or proof links appear only where verified artifacts are available.

The existing native project gallery is reused for image inspection, keyboard controls, touch gestures, focus restoration, and loading/error states. The opaque sticky navigation uses familiar section names. Mobile anchor navigation waits for menu dismissal before positioning and focusing the destination, preserving fragment URLs and browser history.

## Implementation map

| File | Responsibility |
| --- | --- |
| `components/portfolio/PortfolioPage.tsx` | Content order, project evidence, disclosures, headings, preserved section IDs |
| `components/portfolio/PortfolioNav.tsx` | Desktop links, mobile disclosure, Escape handling, anchor timing and focus |
| `app/portfolio.css` | Tokens, local fonts, responsive layout, focus treatment, reduced motion, gallery styling |
| `app/layout.tsx` | Stylesheet, font preloads, domain-aware metadata, viewport color |
| `components/summit/ProjectViewer.tsx` | Shared native gallery interaction |
| `lib/summit-content.ts`, `lib/constants.ts` | Reused project assets and personal evidence |

The CSS adapts from 320px phone layouts through 1440px desktop layouts. Headings and content remain native elements; fragment targets use a 92px offset. Reduced-motion preferences remove the hero image entrance and decorative motion and switch navigation to immediate scrolling.

## Evidence and verification limits

Browser-observed default document heights at matched viewport sizes:

| Viewport | Previous page | Refined page | Reduction |
| --- | ---: | ---: | ---: |
| 1280 × 720 | 15,223px | 6,305px | 58.6% |
| 390 × 844 | 19,385px | 8,313px | 57.1% |

These are browser layout observations, not Lighthouse scores, transfer benchmarks, or physical-device performance measurements. Disclosure state affects document height. The landscape byte count describes that file alone, not total page weight.

The current production build passed with `next build --webpack`. Independent visual review identified a clipped experiment-image focus ring and a Decyp3r sigil screenshot described as a word game; both are corrected in source. This record does not claim a complete WCAG audit or measured contrast compliance.

TypeScript, navigation interactions, gallery interactions, and the static export check passed. The export check verified 33 unique IDs, 9 linked fragment destinations, 56 named controls, valid accessibility references, all six projects, domain metadata, and local assets. The navigation suite covers layout timing, reduced motion, Escape, modified clicks, and cancellation. The gallery suite covers focus targets, scroll locking, keyboard/image controls, retry and stale-image events, touch gestures, and dismissal.

Browser checks covered desktop and mobile reading, section destinations, menu Escape and focus return, gallery image changes and dismissal, and layouts at 320, 390, 768, 1280, and 1440px. No horizontal overflow or broken displayed images were observed. Reduced-motion behavior is covered by source and interaction checks; physical-device testing remains separate from this browser review. Repeat these release checks when interaction code or content flow changes.

## Build and deployment

Build and check the export with `SITE_URL=https://aurel.rubenm.me` so canonical and social metadata use the Aurel domain. The app uses Next.js static export.

The actual Aurel deployment belongs to the private `FunctionDotExe/aurel-sensory-studio` repository. Its portfolio workflow checks out a pinned public source commit SHA and publishes that export. Deploy the reviewed source SHA through that workflow. The private repository’s `main` and the public source repository’s unrelated `main` site are not interchangeable deployment targets.

Earlier mountain-to-core and expedition documents remain historical records. Their test results describe those versions. Do not import their scenery or scroll pipeline to maintain this page, and do not treat their verification statements as coverage of this refinement.
