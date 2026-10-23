# Secure Install Notes

This project uses Node.js 24 LTS (24.22.1 or newer) and pnpm 12.15.0. Dependency lifecycle scripts remain disabled by default.

Recommended flow:

```powershell
npm install --global pnpm@12.15.0
pnpm install --ignore-scripts
pnpm audit
pnpm approve-builds
pnpm build
```

Do not run `npm install`, `npx`, `pnpm dlx`, or `npm audit fix --force` casually. Those commands can fetch and execute code or make broad dependency changes.

If a dependency needs a build script, approve it explicitly with `pnpm approve-builds` after checking why it needs to run.
