# Aurel design direction

Aurel is Ruben Maxwell’s editorial portfolio: clear engineering evidence with a restrained trace of the mountain illustration that established its identity. This document describes the active implementation. See [the refinement handoff](docs/design/aurel-editorial-refinement.md) for measurements and release checks.

## Visual language

- Warm paper (`#f5f2ec`) supports reading; plum (`#352d40`) gives Experience a distinct, opaque surface. Lilac (`#e9e3ed`) groups the research study. Ink (`#302b37`) and secondary text (`#665d6b`) carry the hierarchy without scenery behind paragraphs.
- Locally hosted Bodoni Moda supplies expressive names and section headings. DM Sans supplies body text, controls, dates, and technical detail. Main reading copy is generally 16–17px; smaller type is reserved for supporting information.
- Wide margins, fine rules, varied image proportions, and a modest number of large headings create the editorial rhythm. Project images show the actual interface or hardware, with inspection available through the existing gallery.
- One decorative landscape, `public/media/summit-parallax-master-v2.webp`, is 174,064 bytes. It sits in the hero rather than becoming a background system. Portraits, project screenshots, and certificates remain separate evidence assets.

## Information and interaction

The sequence is introduction, selected work, experience, capabilities, About, and contact. ForgeFountain immediately identifies its Hypixel SkyBlock context. The skin-image study separates the source dataset from evaluation results. Older robotics work occupies space proportional to its role in the story.

Keep project descriptions concise: domain, contribution, then inspectable evidence. Native `details` retain build notes, earlier experience, awards, community information, and certifications without making every visitor read everything. The current role starts expanded. Three capability groups connect tools to relevant work rather than presenting an undifferentiated inventory.

Source, demo, and proof links must point to verified, shareable artifacts. ForgeFountain has direct repository and API implementation links. Do not invent public URLs, availability claims, or benchmark methodology for other projects. Galleries are visual evidence; unsupported headline metrics should not return.

Use ordinary document scrolling, semantic headings, native fragment links, and a visible skip link. The sticky navigation is opaque and stable. Its mobile menu closes before resolving an anchor and moves focus to the destination; Escape returns focus to its toggle. Preserve existing section IDs, including `#crust` for Skills, so deep links remain useful.

## Implementation boundaries

`app/page.tsx` selects `components/portfolio/PortfolioPage.tsx`; `app/layout.tsx` loads `app/portfolio.css`. Reuse `ProjectViewer` and `ContactActions` rather than duplicating their interaction state.

Reflow targets 320–1440px and beyond through fluid gutters, stacked project layouts, and an 800px navigation breakpoint. Keep focus indicators visible inside clipped media. Reduced-motion CSS disables the landscape entrance, smooth scrolling, and decorative link motion; the mobile anchor handler also respects the preference.

The mountain-to-core, expedition, award-research, and interaction-review documents in `docs/design/` describe earlier versions. Their scenic composition and motion instructions are historical, not requirements for this page. Do not import additional scenery layers, scroll controllers, arrival sequences, or route instruments into this implementation.
