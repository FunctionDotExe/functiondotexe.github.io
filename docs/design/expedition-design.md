# Expedition design system

The portfolio is a passage from a sunlit mountain into a mineral cavern. The person and the work belong to that world: curiosity above ground, the technical foundations beneath it. This is an expressive illustrated portfolio, with direct routes through all its content.

## Design decisions

- Palette: ink violet `#171139`, shadow indigo `#252449`, glacier blue `#a4e8ff`, mineral lilac `#c9a9ff`, sunlight `#ffe2a7`, paper light `#fff4db`. Existing art provides the remaining color; avoid unrelated accent colors.
- Type: locally hosted Bodoni Moda for expansive, sculptural display titles; locally hosted DM Sans for readable copy and controls. Typographic hierarchy uses size, position and spacing rather than repeated all-caps labels.
- Composition: left-aligned personal title preserves the mountain on the right. An inset peak annotation and fine contour geometry relate the typography to the landscape. Project scenes alternate in size and alignment, framed as tangible artifacts with dedicated technical/result captions.
- Navigation: a compact expedition instrument provides chapter position and a full route map, using real section links. Direct access is available throughout the journey.
- Signature interaction: a lit, faceted 3D mineral specimen accompanies six technical skill categories. Rotating the specimen is optional; all categories and tools stay accessible in normal HTML. The static illustrated fallback remains visible without WebGL.
- Motion: responsive artifact tilt, finite atmospheric response and the existing continuous mountain-to-core camera. No forced scrolling or looping motion on the specimen. Respect reduced motion and pause rendering outside the viewport.
- Pacing: keep the scenic threshold, tighten the repeated intro stages, and give projects different silhouettes. The rich atmosphere should not require empty travel to reach content.

## Composition sketch

```
name / mountain mark        projects · experience · about     contact

Ruben                                  exposed mountain summit
Maxwell                         · The summit / begin exploring
software · models · machines                 illuminated path

Toronto                   scroll to explore              route instrument

       introduction + project field index
large project type          tangible product artifact
tangible artifact           project type + result
               cavern entrance
skill content               interactive mineral sculpture
experience timeline         portrait and background
               contact / illuminated core
```

## Critique before implementation

The existing landscape is already individual. Replacing it with a fashionable abstract object would weaken that identity. The design instead invests in a mineral object that belongs underground, makes navigation part of the expedition, improves the actual project evidence, and gives the personal name a more deliberate typographic voice. Fullscreen typography remains readable body copy's counterpart, not its replacement. Any source-only assessment is provisional until a connected browser can verify the rendered desktop and mobile journey.

## Implemented and checked

- Locally hosted Bodoni Moda and DM Sans, with both SIL Open Font Licenses included. The three font files total 141,404 bytes; no remote font request is required at runtime.
- Reframed hero, summit annotation, tighter opening/project pacing, distinct artifact finishes, pointer-responsive artifact depth, stronger project captions, thumbnail galleries, and an expanded contact finale.
- A native route-map dialog with chapter tracking, keyboard focus transfer, scroll locking and ordinary modified-link behavior. Mobile navigation keeps its direct links.
- Six mineral forms and palettes, seven custom spires per sculpture, flat normals updated while morphing, directional/specular lighting, optional edge shading, and a static SVG fallback. It has no new rendering dependency. Rendering stops when settled, hidden, or offscreen; DPR is capped. Touch keeps vertical scrolling.
- Crystal regression checks cover all six shapes, every pairwise morph, outward triangle winding, full-turn camera framing, input cancellation, keyboard rotation, GPU cleanup, shader fallback, context recovery and reduced motion. Static blue, amber and ice SVG previews were rendered with Sharp and visually inspected. This does not establish browser WebGL rendering quality.
- Direct research links now open and pin the relevant disclosure. Escape from native dialogs is no longer intercepted by background disclosure handling. Printing opens all skill and background fields and restores their previous states afterward. Pointer motion uses elapsed time across refresh rates.
- Replaced the unavailable `next lint` command with explicit TypeScript and interaction checks. Aligned the PostCSS manifest declaration with the existing lockfile/override/installed version; no dependency upgrade or install was required.
- Production build and `pnpm check` pass. The six interaction suites cover arrival, disclosures, journey motion, crystal behavior, route/artifact instruments and skill printing. `pnpm check:export` passes with 44 unique IDs, 14 valid fragment destinations, valid ARIA references, all six project targets, required metadata, 36 local exported assets and 30 statically referenced source assets.

## Remaining visual verification

Both the in-app browser and Chrome returned "Browser is not available" in the connected UI tools. There was no live browser inspection, screenshot comparison, physical-device test, measured Core Web Vitals, or native shader compilation test in this pass. Automated geometry and mocked lifecycle checks do not substitute for those observations.

Use the local production preview at `http://localhost:3000` to review the complete scroll journey at wide desktop, short laptop, 390px portrait and 320px portrait sizes. Check text against the moving paintings, the mountain/cave handoff, thumbnail navigation, route and mobile menu Escape/focus, crystal drag/keyboard controls, reduced motion and print preview. This implementation is an evidence-informed redesign; award readiness requires that final visual review and cannot be established by an automated pass alone.
