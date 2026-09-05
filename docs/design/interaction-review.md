# Interaction review

Code and exported-markup review of the active mountain-to-core portfolio. This is an inventory of actions and declared behavior, not a claim of visual or browser validation.

| Controls | Purpose and destination | Icon and feedback expectation |
| --- | --- | --- |
| Skip to content; brand | Focus `#main-content`; return to `#entry` | Text; decorative mountain for the brand. Visible keyboard focus. |
| Primary and mobile navigation | Projects `#work`, Skills `#crust`, Experience `#experience`, About `#about`, Contact `#contact` | Desktop text with current-section marker; mobile right arrow means choose a destination. Native anchors retain modified-click behavior. |
| Mobile menu open/close | Open/close the native `journey-menu` dialog | Menu/X, explicit accessible labels, expanded/control references. Background scroll locks only while open. Backdrop, Escape, navigation, email activation, and desktop resizing dismiss it. |
| Route instrument and map | Show current chapter; choose one of six chapters from summit to contact | Compass, decorative progress ring, X to close. Chapter arrows denote navigation; neutral right movement is appropriate because destinations may be above or below. |
| Explore my work | Jump to `#work` | Down arrow; hover moves downward. |
| Start exploring; Scroll to discover | Jump to `#basecamp` | Decorative trail marker; downward scroll cue. Both remain real links. Basecamp accepts fragment focus. |
| Replay opening | Replay the opening animation | Rotate-left icon, explicit replay label. Hidden for reduced motion; input cancels the opening. |
| Basecamp experience link and six-project index | Jump to experience, four project articles, or two research disclosures | Down arrows; hover moves downward. Research deep links open, pin, and focus the targeted disclosure. |
| Project text and image buttons | Open the same project gallery | Zoom-in icon and visible “View gallery” affordance. Native buttons share one labelled dialog and its ID. Image and text activation must restore focus to their own opener. |
| Gallery close; previous/next; thumbnails | Close, step through images, or select an image directly | X; left/right arrows; image thumbnails with individual labels and pressed state. Arrow direction matches stepping. Native controls remain available alongside swipe. |
| Gallery image and video actions | Inspect the selected image; open the existing YouTube demo/walkthrough | Loading/error status and image alternative text. Play means video; the external destination and new tab are identified. New openings start at the first image and top of the dialog. |
| Six skill fields and stone navigation | Scroll to automatically open each skill alongside its gem; jump directly to a field or toggle its panel | Named stone links point to focusable articles, with current-step feedback. Headings expose expanded/control state. Previously revealed fields remain open, and manual closure lasts until re-entry. Native sticky positioning and the progress line track the sequence. |
| Crystal sculpture and reset | Scroll to rotate and change the specimen; drag or use left/right keys to explore; reset manual rotation | Rotation instructions and Rotate-left reset icon. Static fallback remains available. Vertical touch scrolling, reverse travel, reduced motion, and complete printed text are preserved. |
| Research, experience, and background disclosures | Reveal project evidence, role details, awards, or community information | Native summary/chevron controls with visible open/close hints and a brief arrival cue. Hover previews say “Keep this open”; pinned content offers closing. Escape dismisses and focus prevents premature closure. Dialog-local Escape does not affect background previews. |
| Three résumé links | Open the existing résumé PDF | FileText, “View résumé,” and screen-reader PDF/new-tab text. File icon stays still; this is not a download action. |
| Three certificate links | Open the corresponding certificate image | FileBadge and explicit view-certificate/new-tab text. Document icon stays still. |
| Header, mobile-menu, and contact email links | Open an email app for the existing contact address | Mail; header reads “Email me.” Mail icon stays still. No external-site arrow. |
| Copy email | Copy the displayed address without opening an email app | Copy becomes Check on success; polite status communicates success or fallback. Older asynchronous results cannot overwrite newer feedback or create timers after unmount. |
| GitHub and LinkedIn; Back to top | Open existing profiles in new tabs; return to `#entry` | External arrows move up-right; back-to-top arrow points upward. Profile links identify new-tab behavior. |
| 404 recovery link | Return to `/#work` | Left arrow indicates returning to the main portfolio; preserve the native link. |

## Declared touch targets and remaining visual checks

Icon controls are 44px; text links at least 44px; copy email 44px; contact email 48px; skill navigation uses six evenly spaced 44px-high links; disclosure summaries at least 72px; gallery thumbnails 64×60px or 56×52px on mobile. Actual rendered geometry remains unverified.

The CSS follow-ups are implemented: the mobile trail marker has a 44px minimum hit height, project-index down arrows move downward, and route/mobile-menu close headers stay visible while their dialogs scroll. Header spacing is tighter on smaller desktops; the duplicate email CTA is hidden at 761–900px while the Contact link remains available. The gallery image and caption use one shared labelled dialog. Live checks of header fit, controls near the route instrument, and short-viewport dialogs remain necessary.

Decorative scenery, stars, route drawings, altitude annotations, marker ornaments, and category stones are hidden from assistive technology. Screenshots and the portrait retain descriptive alternative text. Borders around technology labels do not create fake buttons.

## Verification

`pnpm check` passed after these changes: TypeScript plus arrival, disclosure, camera, crystal, instrument/navigation/contact, and skill-cabinet checks. Added regressions exercise mobile Skills focus/current state, backdrop dismissal, desktop resize cleanup, clipboard result races, unavailable clipboard feedback, and late completion after unmount. Existing checks cover modal Escape isolation, reduced motion, native disclosure behavior, print restoration, and animation cleanup. Icon substitutions do not have redundant implementation-mirroring tests.

The export checker also checks names and types of static controls, nested interactive content, dialog trigger targets, and canonical metadata against CNAME. The seven interaction suites include shared gallery triggers, focus return, image stepping and thumbnails, modified shortcuts, vertical-intent and multi-touch preservation, backdrop pointer intent, image retries and loading/error states. Browser hit testing, visual contrast, rendered clipping, screen-reader announcements, native focus trapping, and perceived animation fluidity still require browser/device inspection.

The supplied 800×800 profile photo is stored unchanged at `public/media/ruben-profile.png`, used by both profile components, and displayed as a square. GitHub Pages API confirmed `rubenm.me` as the configured domain; the live domain, GitHub profile, LinkedIn destination and the YouTube demo were checked read-only. YouTube metadata identifies the demo as Ruben Maxwell's object-detection video. No contact messages were sent and no production settings were changed.
