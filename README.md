# Ruben Maxwell — from the summit to the core

An illustrated portfolio built with Next.js and exported to static HTML for GitHub Pages. The landscape moves from an alpine summit to a crystal cavern; the technical skills include a small interactive WebGL mineral sculpture with a static SVG fallback.

```sh
pnpm dev
pnpm check
pnpm build
pnpm check:export
pnpm start
```

On Windows PowerShell, use `pnpm.cmd` if execution policy blocks the PowerShell shim. `pnpm start` serves the production export at http://localhost:3000.

The GitHub Pages workflow deploys `main`. Publishing a feature branch does not replace the live site.

The artwork, fonts, résumé and project media are hosted locally. Font licenses are in `public/fonts`. Content lives in `lib/constants.ts` and `lib/summit-content.ts`.

Design evidence and decisions: [award research](docs/design/award-research.md), [expedition design](docs/design/expedition-design.md). The automated checks cover TypeScript, opening/scroll behavior, disclosure navigation and printing, crystal geometry and rendering lifecycle, and static export references. They do not replace visual browser review.
