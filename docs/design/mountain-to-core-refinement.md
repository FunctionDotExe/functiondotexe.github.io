# Mountain to core: an interactive artwork

Branch: `design/mountain-to-core-refined`, based on `feature/mountain-to-core`.

## Direction

The user's defining requirement is that this website feel like an art piece. The illustrated world leads; the portfolio lives within it. This supersedes the initial conventional portfolio treatment.

The final composition is a continuous expedition: a title within the alpine painting, discoveries along the ascent, blue-hour light and stars, a cavern entrance, crystal formations, accumulated experience, and the glowing core.

## Audit

- **Keep:** original alpine/underground illustrations and their layered parallax, spacious scenes, the mountain-to-core narrative, all four projects, and existing résumé/social/contact destinations.
- **Improve:** tiny supporting type, weak text contrast over some scenery, unfinished project labels, uninspectable screenshots, indirect navigation, missing experience/credentials, and inconsistent interaction feedback.
- **Fix:** the previous fixed content stages could crop at short heights or zoom and used script-managed inert controls during scrolling. The original mobile menu did not provide modal focus containment.
- **Restore from existing content:** project galleries, the video walkthrough, skills, experience, portrait, and certificates.
- **Avoid:** opaque full-width section panels, repeated card grids, constant floating animations, invented achievements, and hiding useful functionality for aesthetic simplicity.

## Visual language

- Palette follows the existing painting: deep violet `#171139`, warm ivory `#fff4db`, sunlight `#ffe2a7`, and crystal blue `#a4e8ff`.
- Georgia carries the large scenic typography. Avenir Next / Segoe UI carries body copy and controls. No remote font request.
- The hero is “The Summit,” attributed to Ruben Maxwell. The mountain peak remains visible beside the title.
- Projects appear as suspended artifacts: a spread of mobile screens, a tilted luminous console, a framed vision preview, and a physical-workshop photograph.
- Skills are six interactive crystal specimens; experience follows a luminous vertical seam.
- The portrait reads as a photograph carried along the expedition. The contact finale sits over the core.
- Localized soft shadows protect copy while leaving the surrounding painting visible.

## Interaction and motion

- Desktop project scenes use native sticky stages rather than script-controlled fixed overlays. Mobile and short viewports use ordinary content flow.
- Surface lighting gradually becomes blue hour. Stars emerge with the changing light. Matching lighting carries through the stitched cave entrance before fading underground.
- A small, eased mouse response gives the foreground and distant planes different movement. Rendering stops once the pointer settles.
- Underground camera positions follow the actual chapter locations and remeasure when disclosures expand.
- Reduced motion removes pointer movement and pinned scenic travel.
- Five named native dialogs cover mobile navigation and project inspection, including Escape/focus handling, gallery arrows, keyboard image navigation, and image-loading/error feedback.
- Native disclosures preserve keyboard access. Email copying reports success or a useful fallback.
- Existing email, résumé, video, social, and certificate destinations are preserved. A matching 404 provides a route back to the work.

## Verification

- Production build and TypeScript passed after the artwork redesign.
- Export checks: four project scenes, six crystal disclosures, one primary heading, unique IDs, resolved label references, 20 valid fragment links, and 26 local asset URLs returning HTTP 200.
- All 27 content-referenced media files exist, including gallery-only images and the résumé.
- Branded 404 response and recovery link verified.
- Responsive rules reviewed for 320px phones, tablet/laptop widths, large screens, short landscape viewports, zoom-compatible content flow, reduced motion, and print.
- Live screenshot and browser interaction QA remain unverified: both in-app and Chrome tools reported unavailable. Text contrast over the paintings and the scenic handoff need visual inspection in a connected browser. Solid dialog/control color checks from the earlier pass do not establish contrast over artwork.

## Underground motion regression

The initial camera rewrite removed the original 72ms time-based follow, replaced the steady cave-entry profile with full-range acceleration, and omitted lateral depth movement. These mechanics are restored from `feature/mountain-to-core`, adapted to the current chapter positions. An opaque underlying realm and early layer preparation preserve the entrance/exit handoff.

`node scripts/check-journey-motion.mjs` exercises the actual motion effect using deterministic scroll inputs and animation frames. It reproduced the raw-scroll jump before the fix and now verifies eased/reverse travel, equivalent 60/120 Hz timing, steady cave speed, an opaque handoff, lateral depth, reduced motion, and cancellation of pending frames. Live visual confirmation remains necessary.

## Opening sequence

A traced mountain signature dissolves into the alpine painting. Image layers pull back at different depths, a soft sunlight wash crosses the peak, and the title, supporting copy, and navigation arrive in sequence. The sequence lasts about three seconds after a bounded image-decode wait. It animates image children rather than the parent layers owned by the scroll camera.

Scroll, touch, pointer, and keyboard intent immediately dismiss the opening. Reduced motion, deep links, and back navigation skip it. The pre-paint bootstrap fails open if hydration does not arrive. A small “Replay opening” control lives in the hero footer. The old generic hero fade is disabled to prevent a second animation when the opening completes.

`node scripts/check-arrival.mjs` verifies the actual controller's startup/replay, late or slow image decoding, cancellation, reduced-motion changes, deep links, back navigation, hydration fallback, and React development effect remounts. The existing underground motion regression suite remains green. Browser screenshot/interaction QA is still unavailable in this environment.

## Hover disclosures

Skills and experience progressively enhance native details/summary with a 120ms mouse-hover intent delay, 220ms departure grace, and interruptible height/opacity transitions. Clicking a preview pins it open; clicking again explicitly closes it until the pointer leaves and returns. Focused content remains open, and Escape dismisses previews while restoring focus when needed. Touch retains tap controls, reduced motion settles immediately, and all content remains usable without JavaScript.

`node scripts/check-disclosures.mjs` checks hover timing, preview pinning, explicit close, focus persistence, Escape, touch, reversing an active animation, reduced-motion changes, initially open entries, and timer cleanup. No changes were made to the restored scroll camera for this enhancement.
