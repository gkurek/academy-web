This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## CI and deploy

Every push to `main` runs `.github/workflows/staging.yml` (lint + build only). Deploy is done by the hosts' Git integrations:

- Vercel deploys `main` to the project's `*.vercel.app` URL — until the DNS switch in stage 11 (11f), then disconnected.
- Cloudflare Workers Builds (target host, K-09) builds `main` → production and every other branch → a Worker Preview (K-161). Plan: `docs/plans/11-wdrozenie.md`.

### Cloudflare Workers setup

Next.js runs on Cloudflare Workers through OpenNext (`@opennextjs/cloudflare`). Repo config: `wrangler.jsonc` (Worker `akademiaikony`, bindings `ASSETS`, `IMAGES`, `WORKER_SELF_REFERENCE`, Workers Logs, `previews` block) and `open-next.config.ts` (no incremental cache — content changes by commit, the date by a daily rebuild, K-159).

Scripts:

| Script | What it does |
| --- | --- |
| `npm run cf:build` | `next build` (with `prebuild` checks) + OpenNext bundle in `.open-next/` |
| `npm run cf:preview` | build + serve the Worker locally (Wrangler) |
| `npm run cf:deploy` | deploy the built Worker to production |
| `npm run cf:upload` | upload a version without promoting it (fallback for previews) |

Dashboard settings (Workers & Pages → `akademiaikony` → Settings), as of 2026-10-26:

- **Builds → Production:** Git repository `gkurek/academy-web`, production branch `main`; build command `npm run cf:build`; deploy command `npm run cf:deploy`; root directory empty; build variable `NODE_VERSION=22.20.0` (the build image defaults to Node 24); build cache on.
- **Builds → Previews Base:** builds for preview branches on; build command `npm run cf:build`; preview command `npx wrangler preview` (Worker Previews need the `previews` block in `wrangler.jsonc` — bindings are not inherited); build variable `NODE_VERSION=22.20.0`. Build variables are separate per tab.
- **Deploy hook** `manual-build` → branch `main`: rebuilds production without a commit; the daily rebuild cron (11d) calls it. The hook URL is a secret — keep it out of the repo (GitHub Actions secret).
- **Domains:** production `akademiaikony.<account>.workers.dev` — public until the DNS switch (11f), then disabled with `workers_dev: false`; preview URLs `<branch>-akademiaikony.<account>.workers.dev`.
- **Access:** Cloudflare Access with scope “Previews only”, policy “Cloudflare account” — preview URLs require login, production stays public.
- **Indexing:** `SITE_ENV` is read at build time (`src/lib/siteEnv.ts`); unset → `noindex` + `Disallow: /`. Set `SITE_ENV=production` only in the Production build variables, at the DNS switch (11f).
