# Secure Install Notes

This project uses pnpm and disables dependency lifecycle scripts by default.

Recommended flow:

```powershell
corepack enable
corepack prepare pnpm@11.1.3 --activate
pnpm install --ignore-scripts
pnpm audit --prod
pnpm approve-builds
pnpm build
```

Do not run `npm install`, `npx`, `pnpm dlx`, or `npm audit fix --force` casually. Those commands can fetch and execute code or make broad dependency changes.

If a dependency needs a build script, approve it explicitly with `pnpm approve-builds` after checking why it needs to run.
