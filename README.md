# Ruben Maxwell — from the summit to the core

An illustrated portfolio built with Next.js and exported to static HTML for GitHub Pages. Native scrolling carries the landscape from an alpine summit to a crystal cavern, with readable projects and skills and small quartz illustrations placed in the terrain.

```sh
pnpm dev
pnpm check
pnpm build
pnpm check:export
pnpm start
```

On Windows PowerShell, use `pnpm.cmd` if execution policy blocks the PowerShell shim. `pnpm start` serves the production export at http://localhost:3000.

The GitHub Pages workflow deploys `main`. Publishing a feature branch does not replace the live site.

Set `SITE_URL` during the build and export check to publish on another domain. The Aurel deployment uses `https://aurel.rubenm.me` and the separate `FunctionDotExe/aurel-sensory-studio` Pages repository. Its portfolio workflow checks out a pinned commit from this repository, so the two domains have independent deployments.

The artwork, fonts, résumé and project media are hosted locally. Font licenses are in `public/fonts`. Content lives in `lib/constants.ts`, `lib/summit-content.ts`, and the project storyboards in `lib/project-story.ts`.

Scrolling is native throughout. Projects and skills have a stable server-rendered layout, and disclosures expand only on activation. See [motion language](docs/design/motion-language.md) and [mobile skills](docs/design/mobile-skills.md) for rendering and performance evidence.

Design evidence and decisions: [award research](docs/design/award-research.md), [expedition design](docs/design/expedition-design.md). The automated checks cover TypeScript, opening/scroll behavior, disclosure navigation and printing, crystal geometry and rendering lifecycle, and static export references. They do not replace visual browser review.
