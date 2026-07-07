---
name: verify
description: Build, serve, and visually verify this static-export Next.js portfolio with headless Chrome screenshots
---

# Verifying this site

Static-export Next.js (GitHub Pages). No test infra — verification is build + rendered pixels.

## Build

`pnpm build` may fail offline (pnpm tries to self-fetch its pinned version). Use the local binary instead:

```powershell
node node_modules/next/dist/bin/next build
```

Output lands in `out/`.

## Serve

`npx serve` needs network. A dependency-free static server lives in the session scratchpad pattern — recreate as needed (node http server mapping urls to `out/`, adding `.html` fallback). Run it in the background on port 4173.

## Screenshot (the part that has gotchas)

- Headless Chrome CLI (`--headless=new --screenshot=...`) works for the top of the page ONLY. Always pass `--no-sandbox --user-data-dir=<fresh dir>` (profile lock otherwise silently produces no file). A fresh user-data-dir per invocation.
- Tall `--window-size` full-page captures are misleading: the hero uses vh units, so a 14000px viewport makes the hero fill the whole capture. Anchor-fragment URLs (`/#signals`) produce solid black frames — smooth scroll + whileInView don't settle under virtual time.
- The reliable method: launch Chrome with `--remote-debugging-port=9222` + `about:blank`, then drive CDP over Node 22's global WebSocket (no puppeteer installed): `Emulation.setDeviceMetricsOverride` → `Page.navigate` → sleep ~3.5s → `Runtime.evaluate` `scrollIntoView`/`scrollTo` → sleep ~2.8s (whileInView reveals) → `Page.captureScreenshot`. A working script pattern: session scratchpad `cdp-shots.js` / `cdp-probes.js` (recreate from this recipe).

## What to check

- Hero gilded word renders (`.ren-gradient-word`), nav active underline tracks sections (IntersectionObserver), CountUp stats land on final values, `.ren-shine` beam on hero panel + maxims, marquee before footer.
- Mobile: 390x844 via `Emulation.setDeviceMetricsOverride` + `mobile: true`.
- Reduced motion: `Emulation.setEmulatedMedia` with `prefers-reduced-motion: reduce`, reload, confirm content is visible (not stuck at opacity 0).
- Kill only Chrome processes whose CommandLine matches the scratch user-data-dir — never `Get-Process chrome | Stop-Process` (kills the user's real browser).
