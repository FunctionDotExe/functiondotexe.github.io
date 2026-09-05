# Mobile scrolling and skill sequence

The skill specimen stays above six skill articles using native CSS sticky positioning. Each field starts a new material/geometry transition and one complete turn while its description unfolds and its technology labels appear. Previously explored fields stay open. Reversing scroll reverses the specimen sequence; re-entering a manually closed field opens it again, including the first and last fields. Six named fragment links support direct keyboard/touch navigation; the target articles accept focus. No wheel or touch scrolling is intercepted, and every description and technology remains in the server HTML and printed output.

Panels preserve their full layout footprint during reveals, so opening one cannot shift the next gemstone's scroll boundary. Each heading is a real toggle with expanded/control state; hidden panels are also excluded from keyboard and accessibility navigation. The unenhanced server HTML exposes all panels. Reduced motion exposes all on entry and honors subsequent manual choices. Printing synchronously exposes visual and accessibility state, then restores it exactly.

Compact portrait layouts keep a 165px specimen and the six navigation targets while omitting the extra caption rows. Viewports at most 500px tall and reduced-motion layouts use a static arrangement with naturally sized articles. The renderer reserves space for its manual controls even at compact heights. Native fragment offsets account for both the specimen and the document's scroll padding.

The reported choppiness could not be measured on a physical phone: the computer-use environment exposes no browser. Code and deterministic runtime checks did identify and remove unnecessary work:

- Touch scenery previously continued easing after native scrolling stopped. Touch now follows scroll directly while mouse-driven desktop easing remains.
- Page progress was written to the document root even though only the thin progress bar consumes it. Updates now stay on that bar.
- Mobile decorative plates used dynamic viewport heights, which change as browser toolbars retract. Those plates now use stable large viewport units, preserving every scenic layer. See the [browser viewport unit guidance](https://web.dev/blog/viewport-units).
- The crystal previously measured its layout every animation frame. Sizing is now cached and invalidated by resize/visibility changes. Scroll rotation updates uniforms without React state changes or geometry uploads; geometry changes only when selecting a different mineral.
- Skill chapter positions are cached. Passive scroll events coalesce into one animation frame, React state changes only at field boundaries, and offscreen/hidden work stops.

Verification covers six forward/reverse chapter boundaries, direct-link targets and focusability, scrolling without repeated geometry reads, compact crystal projection through full turns, manual input offsets, reduced motion, content resizing, toolbar/orientation changes, hidden/offscreen suspension, printing, cleanup, TypeScript and the production export. Real-device frame timing and rendered mobile visual inspection remain unverified.
