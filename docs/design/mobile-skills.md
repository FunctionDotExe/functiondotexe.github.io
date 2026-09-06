# Mobile scrolling and skill sequence

The six skills form a full-viewport mineral theatre in guided mode. A live gemstone travels between authored left, right, and central compositions while its geometry, rotation, and material change. Each field holds readable text and grouped tools before transitioning into the next composition. Six named stone links support direct keyboard/touch navigation; all skill content remains in the server HTML.

The outer ExpeditionDirector provides bounded wheel/touch pacing. A fast gesture cannot pass the next stop; each skill receives an 1800ms dwell after arrival. Reverse motion escapes immediately. Free scroll, Escape, direct links, galleries, nested scrollers, and reduced motion preserve control. See [motion language](motion-language.md) for the input contract.

The theatre is available at widths of at least 360px and heights of at least 740px. Shorter viewports, reduced motion, and free-scroll mode use a naturally sized, complete article layout. Guided visual copies are decorative; the six semantic articles remain accessible. Printing exposes the full articles and suspends motion. The navigation strip reserves space above the pacing dock.

Performance decisions:

- The guided controller owns scroll easing. Decorative scenery follows it directly, avoiding a second easing tail. Free touch scrolling also follows native movement directly.
- Page progress is scoped to its consumer rather than inherited through the document.
- Scenic plates use stable large viewport units to avoid rescaling when mobile toolbars retract.
- Crystal sizes and chapter positions are cached. Rotation changes uniforms without uploading geometry or updating React every frame.
- One finite light sweep introduces each mineral. Studio reflections, facet highlights, and rim lighting remain within the existing shader, with no new textures or dependencies.
- Offscreen/hidden rendering stops; settled crystals have no perpetual animation loop. Mobile pixel ratio remains capped.

Verification: deterministic geometry/lifecycle/input tests, TypeScript, production export checks, and actual headless Chrome desktop/mobile rendering. All six compositions were inspected; final 390×844 AI and Robotics frames have readable tool groups and clear controls. A 390×720 viewport uses the complete reading layout. Trusted mobile touch input, reverse escape, direct navigation, and reduced-motion fallback were exercised in Chrome. Physical-phone frame timing has not been measured.
