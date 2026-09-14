# Best Deployment Option for lealene-portfolio (Static Vite + React SPA)

**Date:** 2026-09-15
**Research question:** What is the best way to deploy this project? (static SPA, Vite 8 + React 19, hash routing, no backend)
**Branch:** `main` | **Remote:** `https://github.com/Lealene/PORTFOLIO.git`

---

## Methodology — primary sources only

Every factual claim below is cited to the first-party doc that owns it. The following primary sources were fetched with `WebFetch` and verified locally against the repo:

| # | Primary source fetched | URL |
|---|---|---|
| 1 | Vite — Deploying a Static Site | https://vite.dev/guide/static-deploy |
| 2 | Vite — Building for Production (public base path) | https://vite.dev/guide/build |
| 3 | Vite — Shared Options (`base` config) | https://vite.dev/config/shared-options#base |
| 4 | GitHub Pages — index | https://docs.github.com/en/pages |
| 5 | GitHub Pages — What is GitHub Pages (types/URLs) | https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages |
| 6 | GitHub Pages — Limits | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits |
| 7 | GitHub Pages — Configuring a publishing source | https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site |
| 8 | GitHub Pages — About custom domains | https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages |
| 9 | GitHub Pages — Securing with HTTPS | https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https |
| 10 | Vercel — Docs index | https://vercel.com/docs |
| 11 | Vercel — Vite on Vercel | https://vercel.com/docs/frameworks/frontend/vite |
| 12 | Vercel — Pricing | https://vercel.com/pricing |
| 13 | Vercel — Domains overview | https://vercel.com/docs/domains |
| 14 | Netlify — Docs index | https://docs.netlify.com/ |
| 15 | Netlify — Build configuration overview | https://docs.netlify.com/build/configure-builds/overview/ |
| 16 | Netlify — Frameworks overview (Vite typical settings) | https://docs.netlify.com/build/frameworks/overview/ |
| 17 | Netlify — JavaScript SPAs | https://docs.netlify.com/build/configure-builds/javascript-spas/ |
| 18 | Netlify — Redirects and rewrites | https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/ |
| 19 | Netlify — Redirects overview | https://docs.netlify.com/routing/redirects/ |
| 20 | Netlify — Pricing | https://www.netlify.com/pricing/ |
| 21 | Cloudflare Pages — Overview | https://developers.cloudflare.com/pages/ |
| 22 | Cloudflare Pages — Build configuration | https://developers.cloudflare.com/pages/configuration/build-configuration/ |
| 23 | Cloudflare Pages — Git integration | https://developers.cloudflare.com/pages/get-started/git-integration/ |
| 24 | Cloudflare Pages — Limits | https://developers.cloudflare.com/pages/platform/limits/ |
| 25 | Cloudflare Pages — Redirects | https://developers.cloudflare.com/pages/configuration/redirects/ |
| 26 | Cloudflare Pages — Custom domains | https://developers.cloudflare.com/pages/configuration/custom-domains/ |
| 27 | Cloudflare — Free plan overview | https://www.cloudflare.com/plans/free/ |

Secondary blogs, YouTube, Medium, etc. were intentionally **not** used.

Local verification was done against `package.json`, `vite.config.js`, `src/App.jsx`, `index.html`, `public/`, `dist/`, and `git remote -v` (see Project profile).

---

## Project profile — verified locally

| Property | Value (verified) |
|---|---|
| Stack | Vite `^8.2.0` + React `^19.2.8` + `@vitejs/plugin-react ^6.0.4` — see `package.json:6-22` |
| Scripts | `dev: vite`, `build: vite build`, `preview: vite preview` — `package.json:6-11` |
| Vite config | `vite.config.js:1-7` is `defineConfig({ plugins: [react()] })` — **no `base` set**, defaults to `/` per Vite docs |
| Output | `npm run build` outputs static files to `dist/` by default — `vite.config.js:5-7` + Vite: *"By default, the build output will be placed at `dist`. You may deploy this `dist` folder to any of your preferred platforms."* — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) |
| Routing | Client-side **hash routing only**: `ADMIN_ROUTE = "#secret-admin"` — `src/App.jsx:421-423` + `window.location.hash` listeners `src/App.jsx:644-652`. No `react-router`, no SSR, no server required (`index.html:5-11` single `div#root`) |
| Storage | `localStorage` + `IndexedDB` only (`STORAGE_KEY = "lealene_projects"`, `IDB_NAME = "lealene_portfolio_db"`) — `src/App.jsx:133-280`. `TODO: swap usePersistentProjects -> Supabase fetch` at `src/App.jsx:127-131` is not yet implemented — no backend today |
| Git remote | `https://github.com/Lealene/PORTFOLIO.git` branch `main` — `git remote -v` |
| Public assets with absolute paths | `index.html:5` has `<link href="/favicon.svg">`, `index.html:11` has `<script src="/src/main.jsx">`, `src/App.jsx:109` has `<img src="/sticker.jpg">`, `src/App.jsx:114` has `href="/resume.pdf"`, `src/App.jsx:715` has `src="/profile.jpg"`, plus `src/App.jsx:135-139` placeholder map (`/pos-inventory.svg`, `/real-estate.svg`, `/login-system.svg`). All start with `/` (root-absolute). `public/` contains `favicon.svg`, `profile.jpg`, `sticker.jpg`, `resume.pdf`, `*.svg/jpg` etc. |
| `base` implication | Because absolute URLs are used, deploying to a subpath (e.g. `https://lealene.github.io/PORTFOLIO/`) **without** configuring Vite `base` will break assets. Vite docs: *"If you are deploying to `https://<USERNAME>.github.io/<REPO>/` then set `base` to `'/<REPO>/'`."* — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) and *"Base public path when served in development or production. Default `/`"* — [vite.dev/config/shared-options#base](https://vite.dev/config/shared-options#base) |

**Key inference for this portfolio:** it is a **pure static SPA** that *today* needs only a static host. Hash routing (`#secret-admin`, `#about`, `#projects`) means no server-side SPA fallback is required. Absolute asset paths mean **root hosts (Vercel/Netlify/Cloudflare at `*.vercel.app`/`*.netlify.app`/`*.pages.dev`) work zero-config**, while **GitHub Pages project-site subpath needs `base: '/PORTFOLIO/'`** or a custom apex domain.

---

## Comparison table (this project, not generic)

| Dimension | GitHub Pages | Vercel | Netlify | Cloudflare Pages |
|---|---|---|---|---|
| **Exact build command** | `npm ci` → `npm run build` — sample workflow in Vite docs — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) | Auto-detected: `npm run build` (install `npm ci` implicitly). Vercel detects Vite and enables correct settings — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite) | `npm run build` — typical for Vite is `vite build` — [docs.netlify.com/build/frameworks/overview](https://docs.netlify.com/build/frameworks/overview/) + [docs.netlify.com/build/configure-builds/javascript-spas](https://docs.netlify.com/build/configure-builds/javascript-spas/) | `npm run build` — framework preset "React (Vite)" lists Build command `npm run build` — [developers.cloudflare.com/pages/configuration/build-configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) |
| **Output directory (publish)** | `./dist` — Vite guide: *"path: './dist'"* — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) | `dist` (Vite default). Vercel does not require manual setting when auto-detected | `dist` — Netlify docs: *"Publish directory for Vite is `dist`"* — [docs.netlify.com/build/frameworks/overview](https://docs.netlify.com/build/frameworks/overview/) ; *"Only files in the publish directory are deployed"* — [docs.netlify.com/build/configure-builds/overview](https://docs.netlify.com/build/configure-builds/overview/) | `dist` — Cloudflare preset for React (Vite) is `dist` — [developers.cloudflare.com/pages/configuration/build-configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) |
| **Required Vite `base` for this repo** | **Must set** `base: '/PORTFOLIO/'` for `https://Lealene.github.io/PORTFOLIO/` — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy). With custom apex domain (e.g. `lealene.com`) set `base: '/'` or omit — same source. Unlike other hosts, project-site URL is nested under repo name — [docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) |
| Alt: no `base` needed | ✅ Zero-config — `base` defaults to `/` is correct for root domains `*.vercel.app` — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite) | ✅ Zero-config — `dist` at root | ✅ Zero-config — `dist` at root |
| **SPA / hash routing** | Hash (`#secret-admin`) needs **no** server fallback — fragments never hit the server. History-mode would need a 404 hack; GitHub Pages has no `_redirects` equivalent (only custom `404.html` docs page — no SPA rewrite in primary docs). Rate: **not needed for this project** | History-mode needs `vercel.json` rewrite `/* → /index.html` — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite) (`"Using Vite to make SPAs"` section). Hash routing: **no `vercel.json` needed** | History-mode needs `_redirects` rule `/* /index.html 200` — [docs.netlify.com/manage/routing/redirects/rewrites-proxies](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/) (*History pushState and single-page apps*). Hash routing: **no `_redirects` needed** | History-mode uses `_redirects` with same syntax. Cloudflare docs limit `_redirects` to 2000 static + 100 dynamic rules — [developers.cloudflare.com/pages/configuration/redirects](https://developers.cloudflare.com/pages/configuration/redirects/). Hash routing: **no `_redirects` needed** |
| **Free tier cost** | **Free** for public repos; private Pages needs Pro. Limits listed below. Source: [docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) | **Hobby $0/mo** for personal non-commercial use — [vercel.com/pricing](https://vercel.com/pricing). Includes: 1M Edge Requests, 100 GB Fast Data Transfer, 1M Function Invocations, 100K/100 config reads/writes/mo, unlimited deploys, 1h logs/traces — same source | **Free $0/mo** (300 credits) for individuals — [netlify.com/pricing](https://www.netlify.com/pricing/). Credits consumed: 15 credits/production deploy, 20 credits/GB bandwidth, 2 credits/10k requests — same source. Alternative Pro $20/mo with 3000 credits | **Free** plan (unlimited bandwidth per Cloudflare mission + Pages free) — [cloudflare.com/plans/free](https://www.cloudflare.com/plans/free/) + Pages Limits page lists free caps instead of pricing — [developers.cloudflare.com/pages/platform/limits](https://developers.cloudflare.com/pages/platform/limits/) |
| **Bandwidth / builds limits (free)** | Recommended repo limit 1 GB, **published site ≤1 GB**, **soft 100 GB/mo bandwidth**, **soft 10 builds/hour** (not when using Actions), **10 min deploy timeout** — [docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) | **100 GB** Fast Data Transfer + **1M Edge Requests**/mo on Hobby; overage not allowed on Hobby (must upgrade) — [vercel.com/pricing](https://vercel.com/pricing) | Credit model: bandwidth 20 credits/GB ($0.13/GB at Pro pack rate); requests 2 credits/10k. Free has 300 credits total (~15 GB bandwidth if only that). Usage prices at [netlify.com/pricing](https://www.netlify.com/pricing/) | **500 builds/mo**, 1 concurrent build, **20K files/site**, **25 MiB/file** max — [developers.cloudflare.com/pages/platform/limits](https://developers.cloudflare.com/pages/platform/limits/). Build timeout **20 min** — same source. Bandwidth effectively unlimited (Cloudflare Free) per [cloudflare.com/plans/free](https://www.cloudflare.com/plans/free/) |
| **Custom domain + HTTPS** | Supports apex (`example.com`) and `www`/subdomains; **HTTPS enforced via Let's Encrypt** with "Enforce HTTPS" toggle — [docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) + [docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https). Requires `A`/`AAAA`/`CNAME` DNS per docs. Project-site also available at `lealene.github.io/PORTFOLIO` by default — [docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) | Automatic HTTPS/TLS, auto certs — [vercel.com/pricing](https://vercel.com/pricing) ("HTTPS Certificates Included") + Domain docs — [vercel.com/docs/domains](https://vercel.com/docs/domains). Adding domain in dashboard auto-provisions cert | Custom domains with SSL — Free plan bullet "Add Custom domains with SSL" — [netlify.com/pricing](https://www.netlify.com/pricing/) | Add custom domain via Dashboard → Workers & Pages → Custom domains; apex needs zone on Cloudflare — [developers.cloudflare.com/pages/configuration/custom-domains](https://developers.cloudflare.com/pages/configuration/custom-domains/). Free supports 100 custom domains/project — [developers.cloudflare.com/pages/platform/limits](https://developers.cloudflare.com/pages/platform/limits/). HTTPS via Cloudflare proxy; CAA note for Let's Encrypt — same custom-domains source |
| **Deploy via git push vs CLI** | **GitHub Actions** (recommended) or branch deploy. Publishing sources: branch or Actions workflow — [docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). No CLI deploy; push to `main` triggers deploy | **Both.** `vercel` CLI (`npm i -g vercel; vercel`) or Git import (GitHub/GitLab/Bitbucket) with preview URLs per PR — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite) (`Vercel CLI` + `Vercel with Git` sections) | **Both.** `netlify deploy` / `netlify deploy --prod` via CLI — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) (Netlify CLI) + Git import from GitHub/GitLab/Bitbucket/Azure with Preview Deploys — [docs.netlify.com/build/configure-builds/overview](https://docs.netlify.com/build/configure-builds/overview/) | **Both.** Git integration (GitHub/GitLab) with auto builds per push — [developers.cloudflare.com/pages/get-started/git-integration](https://developers.cloudflare.com/pages/get-started/git-integration/) + Direct Upload/C3/Wrangler for non-Git. Once Git integrated cannot switch to Direct Upload — same source. Also `npx wrangler deploy` after `npm run build` per Vite guide — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) |
| **Preview deploys** | No built-in PR previews on Pages alone (Actions can emulate but not native) | Automatic Preview Deployments per branch/PR — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite) | Unlimited deploy previews — [netlify.com/pricing](https://www.netlify.com/pricing/) + docs Branch/Preview config | Unlimited preview deployments — [developers.cloudflare.com/pages/platform/limits](https://developers.cloudflare.com/pages/platform/limits/) |
| **Gotcha for THIS project** | `base: '/PORTFOLIO/'` required else `/profile.jpg`, `/resume.pdf`, `/sticker.jpg`, `/favicon.svg` 404 on subpath. No `base` in `vite.config.js:1-7` today — must add. Also must use **Actions source** not branch source for Vite builds — [docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) + [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) step "Source → GitHub Actions" | **None.** Best zero-config fit. `vercel.json` SPA rewrite not needed now (hash routing); needed only if switching to `createBrowserRouter`. Framework auto-detection handles `dist` — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite) | **None** today. Same hash-routing caveat: `_redirects` only needed if history mode. Build plugin `@netlify/vite-plugin` optional — [docs.netlify.com/build/frameworks/overview](https://docs.netlify.com/build/frameworks/overview/) Vite section | **Pages is flagged as "Are you sure you want to use Pages? Workers supports most Pages use cases"** — [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/). Not a blocker, but new projects recommended to use **Workers** going forward. Build preset unchanged. |

---

## Per-platform deep dive (with primary-source citations)

### 1. Vite — what the build tool itself says

- `vite build` uses `<root>/index.html` as entry and *"produces an application bundle that is suitable to be served over a static hosting service"* — [vite.dev/guide/build](https://vite.dev/guide/build).
- Default output is `dist/` — *"By default, the build output will be placed at `dist`"* — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy). Can be changed via `build.outDir` — same source.
- `base` defaults to `/` — [vite.dev/config/shared-options#base](https://vite.dev/config/shared-options#base). Valid values: absolute pathname (`/foo/`), full URL, or `./`/empty for embedded deploy — same source. For nested public paths, *"specify the `base` config option and all asset paths will be rewritten"* — [vite.dev/guide/build](https://vite.dev/guide/build) (Public Base Path).
- `vite preview` is explicitly *not* a production server — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) (`vite preview is intended for previewing the build locally and not meant as a production server`).
- The static-deploy guide explicitly for each platform: build command is `npm run build` everywhere — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy).

### 2. GitHub Pages

**How it works for this repo:**
- Types: **User site** (`<owner>.github.io`) vs **Project site** (`<owner>.github.io/<repo>`) — project sites live under repo name — [docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages). This repo `PORTFOLIO` is a project site → default URL `https://lealene.github.io/PORTFOLIO/` (case-insensitive).
- Publishing: from branch *or* from **GitHub Actions workflow** — [docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Vite requires Actions because it needs a build step — the Vite guide says go to **Settings → Pages → Source → GitHub Actions** and create `.github/workflows/deploy.yml` — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy).
- Required config: Vite's GitHub Pages section: *"If you are deploying to `https://<USERNAME>.github.io/<REPO>/` then set `base` to `'/<REPO>/'`"* — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy). Also `base` docs: default is `/` — [vite.dev/config/shared-options#base](https://vite.dev/config/shared-options#base). So `vite.config.js:1-7` must become `base: '/PORTFOLIO/'` for the default URL, or `base: '/'` if a custom apex domain is added — same static-deploy source.
- SPA handling: GitHub Pages has **no native SPA rewrite** (no `_redirects`/`vercel.json` equivalent in Pages primary docs). It does have **Creating a custom 404 page** — but not referenced in main flow here. For this project it doesn't matter because **hash routing never sends the fragment to the server** — `src/App.jsx:421-423` uses `window.location.hash`.
- Absolute asset breakage: this project's absolute paths (`/profile.jpg`, `/resume.pdf`, etc. in `src/App.jsx:109`, `src/App.jsx:715`) will resolve to `https://lealene.github.io/profile.jpg` (wrong) instead of `https://lealene.github.io/PORTFOLIO/profile.jpg` unless `base` is set — per the same [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) rule.
- Limits: **1 GB recommended repo**, **published site ≤1 GB**, **soft 100 GB/mo bandwidth**, **soft 10 builds/hour** (not applicable when using Actions), **10 min deploy timeout** — [docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- Custom domain: supports `www`, custom subdomain, and apex — [docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages). Apex configured via `A`/`ALIAS`/`ANAME`, subdomains via `CNAME` — same source.
- HTTPS: *"All GitHub Pages sites, including sites that are correctly configured with a custom domain, support HTTPS and HTTPS enforcement"* via Let's Encrypt — [docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https). Toggle "Enforce HTTPS" in Pages settings — same source.
- **Verdict for this portfolio:** cheapest (no extra account), stays inside GitHub, but **only ideal if you accept `base` config or a custom domain**. Otherwise assets 404 on the default project URL — a direct consequence of this repo's absolute public paths.

### 3. Vercel

- **Zero-config for Vite.** *"Vercel will detect that you are using Vite and will enable the correct settings"* — both for **Vercel CLI** and **Vercel with Git** — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite). Install CLI via `npm i -g vercel` and run `vercel` — same source.
- **Build:** framework preset handles `npm run build` → `dist` implicitly. Env vars prefixed with `VITE_`, e.g. `VITE_VERCEL_ENV` → `preview|production|development` — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite).
- **SPA handling:** Section *"Using Vite to make SPAs"* explicitly says: *"If your Vite app is configured to deploy as a Single Page Application (SPA), deep linking won't work out of the box. To enable deep linking ... create a `vercel.json` with rewrites source `/(.*) → /index.html`"* — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite). For this project `appType` defaults to `'spa'` per [vite.dev/config/shared-options#base](https://vite.dev/config/shared-options#base) (appType defaults `spa`), but **hash routing avoids the issue entirely** — the doc's rewrite is only needed for `history` pushState. So **no `vercel.json` required** for `src/App.jsx:421-659`.
- **Git integration:** Push to GitHub/GitLab/Bitbucket generates **Preview Deployments** per branch/PR and **Production Deployment** on `main` — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite).
- **Pricing (Hobby):** $0/mo for personal non-commercial use; includes **1M Edge Requests**, **100 GB Fast Data Transfer**, **1M Function Invocations**, **10 GB Fast Origin Transfer** etc.; overage not purchasable on Hobby — [vercel.com/pricing](https://vercel.com/pricing). This is ample for a portfolio (expected < 1 GB/mo).
- **Custom domain + HTTPS:** HTTPS certificates included — [vercel.com/pricing](https://vercel.com/pricing) (Vercel Delivery Network table). Domain management covered in — [vercel.com/docs/domains](https://vercel.com/docs/domains). Auto provisions certs.
- **Gotcha for this project:** None today. The only risk is future **Supabase** migration (`src/App.jsx:127-131` TODO): if you add server functions, Vercel Functions scale to zero and are included in Hobby limits — [vercel.com/pricing](https://vercel.com/pricing) (Fluid Active CPU/memory). Keep an eye on 100 GB bandwidth vs adding heavy images.
- **Verdict:** Best zero-config host for this repo's current shape: no `base` fix needed, fastest global CDN, ideal if you don't already need to stay GitHub-only.

### 4. Netlify

- **Build settings:** Defined as **Build command**, **Publish directory**, **Base directory**, **Package directory** — [docs.netlify.com/build/configure-builds/overview](https://docs.netlify.com/build/configure-builds/overview/). Only files in publish directory are deployed — same source.
- **Vite typical settings:** **Build command `vite build`**, **Publish directory `dist`** — explicitly listed in framework overview under "Vite" — [docs.netlify.com/build/frameworks/overview](https://docs.netlify.com/build/frameworks/overview/). Generic SPA page repeats: publish directory *"often called `dist` but varies"*; set build command to `npm run YOUR_BUILD_SCRIPT` — [docs.netlify.com/build/configure-builds/javascript-spas](https://docs.netlify.com/build/configure-builds/javascript-spas/).
- **Deploy methods:** Netlify CLI — `npm install -g netlify-cli`, `netlify init`, `netlify deploy`, `netlify deploy --prod` — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) (Netlify CLI section). Or Git import from GitHub/GitLab/Bitbucket/Azure DevOps — *"Import the project to Netlify"* → preview vs production deploys — same Vite static-deploy source, and Netlify build overview confirms continuous deployment via Git — [docs.netlify.com/build/configure-builds/overview](https://docs.netlify.com/build/configure-builds/overview/).
- **SPA handling:** Docs explicitly: *"Avoid 404s for SPAs: If your project is a single page app that uses the history pushState method ... you must add a rewrite rule"* — [docs.netlify.com/build/configure-builds/javascript-spas](https://docs.netlify.com/build/configure-builds/javascript-spas/). The rule is `/* /index.html 200` in `_redirects` or `[[redirects]] from="/*" to="/index.html" status=200` in `netlify.toml` — [docs.netlify.com/manage/routing/redirects/rewrites-proxies](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/) (History pushState and single-page apps). Again, **not required** for this project's hash routing, but required if migrating to `react-router` history mode. `_redirects` file must end up in publish directory — [docs.netlify.com/routing/redirects](https://docs.netlify.com/routing/redirects/) (Tip: must be in `dist`).
- **Pricing:** **Free $0/mo** (individual, 300 credits) — [netlify.com/pricing](https://www.netlify.com/pricing/). Production deploy costs **15 credits** each, bandwidth **20 credits/GB** ($0.13/GB at Pro pack rate), **2 credits/10k requests** — same source. For a static portfolio with maybe ~50 deploys/mo and ~5 GB bandwidth → ~850 credits, still within Free with some headroom; but meter is tighter than Vercel's 100 GB included.
- **Custom domain + HTTPS:** Free plan explicitly includes *"Add Custom domains with SSL"* and *"Global CDN"* — [netlify.com/pricing](https://www.netlify.com/pricing/).
- **Verdict:** Solid #2 — zero-config `dist`, mature redirect docs, but credit-based free tier is less generous than Vercel's 100 GB for image-heavy portfolios like this (profile/sticker/jpg assets in `public/`).

### 5. Cloudflare Pages

- **Overview:** *"Deploy full-stack applications instantly to the Cloudflare global network"*; available on all plans; connect Git provider or upload prebuilt assets or use C3 — [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/). **Note banner:** *"Are you sure you want to use Pages? Workers supports most Pages use cases and offers a broader feature set"* — same source. Means Pages is in maintenance mode vs **Workers Static Assets** for new projects.
- **Build config:** Preset table lists **React (Vite) → Build command `npm run build`, Build directory `dist`** — [developers.cloudflare.com/pages/configuration/build-configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/). Understanding build config: root directory is where build runs — same source.
- **Git integration:** In Dashboard → **Workers & Pages → Create application → Pages → Connect to Git** (GitHub/GitLab); **Production branch** is `main`; other branches become preview deployments — [developers.cloudflare.com/pages/get-started/git-integration](https://developers.cloudflare.com/pages/get-started/git-integration/). *"You cannot switch to Direct Upload later"* once Git integrated — same source.
- **Deploy fallback:** After `npm run build`, deploy via `npx wrangler deploy` — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) (Cloudflare Workers/Pages sections). Needs `wrangler.jsonc` with `"name"` — same Vite source.
- **SPA handling:** `_redirects` file without extension in static asset directory — limited to **2000 static + 100 dynamic = 2100 rules**, 1000 chars each — [developers.cloudflare.com/pages/configuration/redirects](https://developers.cloudflare.com/pages/configuration/redirects/). Same as Netlify, **not needed** for hash routing — but needed for history-mode fallback.
- **Limits (Free):** **500 builds/mo** (1 concurrent), **20,000 files/site** (100K on paid via env var), **25 MiB max file size**, **100 projects/account**, **100 custom domains/project (Free)** — [developers.cloudflare.com/pages/platform/limits](https://developers.cloudflare.com/pages/platform/limits/). Build timeout **20 min** — same source. Bandwidth not listed as a cap because Cloudflare Free is *unlimited* in practice — see mission statement — [cloudflare.com/plans/free](https://www.cloudflare.com/plans/free/).
- **Custom domains:** Add in Dashboard → Custom domains → **Set up a domain**; apex requires zone on Cloudflare (nameservers at Cloudflare); subdomain via CNAME to `<site>.pages.dev` — [developers.cloudflare.com/pages/configuration/custom-domains](https://developers.cloudflare.com/pages/configuration/custom-domains/). Must go through dashboard flow; manually adding CNAME alone gives 522 — same source.
- **Verdict:** Excellent for unlimited bandwidth/CF edge, but **Pages banner warning** suggests prefer **Workers** for new projects. For a simple personal portfolio, overhead of choosing Pages vs Workers is unnecessary when Vercel/Netlify are zero-config. Free tier is generous but dashboard is more complex than Vercel/Netlify.

---

## Recommendation — ranked for *this* portfolio

Needs weighted: (1) free/cheap, (2) fast/easy zero-config, (3) custom domain optional, (4) admin is client-side so no server needed, (5) `PORTFOLIO` GitHub repo name and absolute asset paths (`/profile.jpg`) create a GitHub Pages footgun.

| Rank | Platform | Why for this project |
|---|---|---|
| **1 — Recommended** | **Vercel** | **Zero-config winner.** No `base` change, no `_redirects`/`vercel.json` (hash routing), auto-detected `dist`, fastest global CDN included free, 100 GB transfer free — more than enough. Best GitHub push → Preview URL workflow. Easiest path to future **Supabase** (Vercel Functions/Edge ready). Cite: detection + SPA note — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite); 100 GB free — [vercel.com/pricing](https://vercel.com/pricing); domain HTTPS — [vercel.com/docs/domains](https://vercel.com/docs/domains) |
| **2** | **Netlify** | Equal zero-config, excellent SPA docs. Credit model slightly tighter but still free for portfolio. Use if you prefer Netlify's drag/drop or `_redirects` mental model. Cite: `vite build` + `dist` — [docs.netlify.com/build/frameworks/overview](https://docs.netlify.com/build/frameworks/overview/); SPA rewrite — [docs.netlify.com/manage/routing/redirects/rewrites-proxies](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/); free credits — [netlify.com/pricing](https://www.netlify.com/pricing/) |
| **3** | **Cloudflare Pages (consider Workers)** | Unlimited bandwidth is great for image-heavy portfolios (`sticker.jpg`, `profile.jpg` etc.) and 500 builds/mo — [developers.cloudflare.com/pages/platform/limits](https://developers.cloudflare.com/pages/platform/limits/). But Pages intro banner pushes **Workers** — [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/) — so choosing it now may require migration. Only pick if you already use Cloudflare DNS or need CF's edge. |
| **4** | **GitHub Pages** | Free and inside GitHub, but **requires `base: '/PORTFOLIO/'`** (or custom domain) to avoid 404s from absolute paths. Vite explicitly warns — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy) — and no `base` is set in `vite.config.js:1-7` today. GH Pages limits (100 GB soft, 1 GB site) are fine but preview flow is weaker. Reserve for "GitHub-only" constraint or when you already own a custom apex domain (then `base: '/'` again). Cite: limits — [docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits); domain + HTTPS — [docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) |

**Bottom line:** For a personal portfolio that's *static today* with hash routing and no SSR, **`npm run build` → `dist`** deploys anywhere. **Vercel** is the fastest path to live with least config and least surprise (no `base` footgun), so it is the primary recommendation. Netlify is a close second. Cloudflare Pages is viable but flagged as legacy vs Workers. GitHub Pages only wins if you must stay 100% GitHub-native and are willing to fix `base`.

---

## Gotchas specific to this repo — mandatory checks before any deploy

1. **Absolute public paths will 404 on GitHub Pages subpath.** `src/App.jsx:109` (`/sticker.jpg`), `src/App.jsx:715` (`/profile.jpg`), `index.html:5` (`/favicon.svg`), and placeholder SVGs in `src/App.jsx:135-139` are all root-absolute. On Vercel/Netlify/Cloudflare they resolve to domain root (correct). On GitHub Pages `https://Lealene.github.io/PORTFOLIO/` they must resolve under `/PORTFOLIO/` — requires Vite `base: '/PORTFOLIO/'` per — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy). Alternatives: set `base: './'` for relative URLs per — [vite.dev/guide/build](https://vite.dev/guide/build) (Relative base), or add a custom apex domain so `base: '/'` works per — [docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).

2. **No SPA fallback needed TODAY, but document the trigger.** Hash fragments (`#secret-admin`, `#about`) never reach server — no `_redirects`/`vercel.json` required. If you ever switch from `window.location.hash` in `src/App.jsx:644` to `createBrowserRouter` or History API, add **Vercel** `vercel.json` rewrite — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite); **Netlify** `/* /index.html 200` — [docs.netlify.com/manage/routing/redirects/rewrites-proxies](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/); **Cloudflare** `_redirects` — [developers.cloudflare.com/pages/configuration/redirects](https://developers.cloudflare.com/pages/configuration/redirects/).

3. **`localStorage`/`IndexedDB` caveat:** projects persist per-browser in `src/App.jsx:210-280`. Deployed site will not share admin edits across visitors/laptops. The `TODO: Supabase` at `src/App.jsx:127-131` is the intended fix — when migrating, choose a host with Functions (Vercel/Netlify/Cloudflare Workers) rather than pure static Pages.

4. **`dist` is gitignored** — `.gitignore:dist`. That's correct (Actions/CI will rebuild), but if you do manual `gh-pages` branch pushing, you must either remove `dist` from ignore or use `actions/upload-pages-artifact` path `'./dist'` per — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy).

---

## Next steps — concrete commands to deploy to recommended platform (Vercel)

### Option A — Vercel via Git (recommended, zero CLI install)

1. Ensure `vite build` works locally:
   ```bash
   npm ci
   npm run build
   npm run preview -- --port 4173
   # open http://localhost:4173  — verify /profile.jpg, /resume.pdf load
   ```
   Per Vite: *"You may run `npm run build` ... By default, the build output will be placed at `dist`"* — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy).

2. Push latest to `main` (already `https://github.com/Lealene/PORTFOLIO.git`):
   ```bash
   git push origin main
   ```

3. Import on Vercel: go to [vercel.com/new](https://vercel.com/new) (link is in — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite)), select repo `Lealene/PORTFOLIO`, **Framework Preset: Vite** (auto-detected — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite)), leave Build Command `npm run build`, Output Directory `dist`, click **Deploy**. No `base` change needed.

4. Custom domain (optional): Project → Settings → Domains → Add `lealene.com` / `www.lealene.com` — docs — [vercel.com/docs/domains](https://vercel.com/docs/domains). HTTPS auto provisioned — [vercel.com/pricing](https://vercel.com/pricing).

### Option B — Vercel via CLI (one-shot preview without Git import)

```bash
npm i -g vercel
vercel login
vercel          # follow prompts (scope, link to existing or create project)
vercel --prod   # promote preview to production
```
Vercel will state *"detected that you are using Vite and will enable the correct settings"* — [vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite).

### If you must use GitHub Pages (fallback)

Add to `vite.config.js:5-7`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: '/PORTFOLIO/', // per Vite static-deploy GH Pages rule
})
```
Cite: `base: '/<REPO>/'` for `https://<USERNAME>.github.io/<REPO>/` — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy).

Then create `.github/workflows/deploy.yml` verbatim from Vite guide's sample (Node LTS, `npm ci`, `npm run build`, `actions/configure-pages`, `actions/upload-pages-artifact` with `path: './dist'`, `actions/deploy-pages`) — [vite.dev/guide/static-deploy](https://vite.dev/guide/static-deploy). In repo Settings → **Pages → Source → GitHub Actions** — [docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Push to `main` and site appears at `https://lealene.github.io/PORTFOLIO/`. If you later attach a custom apex domain, revert `base` to `'/'` — same Vite source.

### If you choose Netlify or Cloudflare Pages instead

- **Netlify:** `npm run build` → `dist` per — [docs.netlify.com/build/frameworks/overview](https://docs.netlify.com/build/frameworks/overview/). Import via app.netlify.com/start, set Build command `npm run build`, Publish directory `dist`. Only add `_redirects` with `/* /index.html 200` if you leave hash routing — [docs.netlify.com/manage/routing/redirects/rewrites-proxies](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/).
- **Cloudflare Pages:** In Cloudflare dashboard → Workers & Pages → Create → Connect to Git → select `Lealene/PORTFOLIO` → Preset **React (Vite)** → Build command `npm run build`, Build directory `dist` per — [developers.cloudflare.com/pages/configuration/build-configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) and — [developers.cloudflare.com/pages/get-started/git-integration](https://developers.cloudflare.com/pages/get-started/git-integration/). Note Pages recommendation to consider **Workers** — [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/).

---

## Sources — every primary URL fetched (in order fetched)

1. https://vite.dev/guide/static-deploy
2. https://docs.github.com/en/pages
3. https://vercel.com/docs
4. https://docs.netlify.com/
5. https://developers.cloudflare.com/pages/
6. https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
7. https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
8. https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages
9. https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
10. https://vercel.com/docs/frameworks/frontend/vite
11. https://vercel.com/pricing
12. https://docs.netlify.com/build/configure-builds/overview/
13. https://docs.netlify.com/routing/redirects/
14. https://www.netlify.com/pricing/
15. https://developers.cloudflare.com/pages/platform/limits/
16. https://developers.cloudflare.com/pages/get-started/git-integration/
17. https://developers.cloudflare.com/pages/configuration/redirects/
18. https://developers.cloudflare.com/pages/configuration/build-configuration/
19. https://www.cloudflare.com/plans/free/
20. https://docs.netlify.com/build/frameworks/overview/
21. https://vercel.com/docs/domains
22. https://developers.cloudflare.com/pages/configuration/custom-domains/
23. https://docs.netlify.com/build/configure-builds/javascript-spas/
24. https://vite.dev/config/shared-options#base
25. https://vite.dev/guide/build
26. https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
27. https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/

*All claims in this document are cited inline to one of the above.*
