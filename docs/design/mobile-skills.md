# Native scrolling and skill content

The browser owns wheel, touch, keyboard, and momentum scrolling. There is no pacing controller, mode preference, artificial stop, or floating mode panel. Projects and all six skill fields are server-rendered in normal document flow; hydration does not change their height or hide content.

SkillCabinet renders six articles and 59 tools once, with stable skill-field-0 through skill-field-5 destinations. Desktop uses two columns; mobile uses one. The former travelling WebGL carousel is removed from the page. Three decorative TerrainGem SVGs sit near the cave entrance, research section, and contact section. Their neutral facets have no controls, pointer capture, canvas, animation loop, or accessibility-tree noise.

JourneyMotion reads native scroll position once per scheduled frame. It writes transform/translate/opacity directly to the specific scenery images and lighting layers. It does not write inherited animation variables across the world tree or run an easing tail after input stops. Geometry is cached, mobile scenery keeps stable large-viewport sizing, and hidden pages suspend updates. The original continuous mountain-to-cave path remains.

Disclosures open through explicit click/keyboard activation. Hovering and scrolling past a summary do not change page height. Galleries, menus, direct fragments, reduced motion, and print content remain available.

## Verification

Nine interaction suites, TypeScript, and the production export pass. An identical warmed 38-event native wheel workload in headless Chrome measured:

| Scene | Previous style work | Revised style work |
| --- | ---: | ---: |
| Desktop surface |419.35ms |16.87ms |
| Desktop underground |174.38ms |13.46ms |
| Mobile surface |84.80ms |11.87ms |
| Mobile underground |85.82ms |19.91ms |

The desktop background tail fell from 448–498ms to 0.1–0.3ms. These compare the combined revision on the same test environment; content/layout also changed. They do not establish a physical-device FPS guarantee. Cave opacity coverage remained complete through 98 sampled desktop/mobile positions; inspected entry, interior, and exit frames had no blank seams.
