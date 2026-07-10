# Story 8.3: Self-Hosted Umami Analytics with Private Dashboard

## Status
done

## Story
**As** Russell Roofing (site owner),
**I want** a free, privacy-friendly web analytics dashboard reachable at a private `russellroofing.com/analytics`
URL that is not linked anywhere on the public site,
**so that** we can see where traffic comes from and how SEO improvements move the numbers, without paying
for a tool or exposing data publicly.

## Context / Why
Research (`_bmad-output/planning-artifacts/technical-research-analytics-seo.md`, §5) recommended **Umami**
over Plausible for this stack: the site runs on **Vercel (serverless)**, where Plausible cannot run
(it needs a persistent server with PostgreSQL **and** ClickHouse). Umami needs only Node + PostgreSQL and
deploys on Vercel with **Supabase's free Postgres tier** — a genuinely $0/mo, GDPR-friendly setup.

**Architecture decision:** Umami is a **separate application**, so it deploys as its **own Vercel project**
(not merged into `apps/web`). The main site then proxies to it via Next.js/Vercel **rewrites** so both the
dashboard (`/analytics`) and the tracking script are served first-party from `russellroofing.com`
(first-party serving also dodges ad-blockers → more accurate counts).

**Confirmed current state:**
- Main site config: `apps/web/next.config.mjs`, `apps/web/vercel.json`.
- Root layout (where a tracking script would mount): `apps/web/src/app/layout.tsx`.
- Existing structured data + env-validation patterns already established.

## Acceptance Criteria
1. A Umami instance is deployed (own Vercel project) backed by a Supabase Postgres database on free tiers.
2. The default Umami admin credentials are changed; access is restricted to Russell Roofing's designated
   owner(s). Credentials are stored securely (not in the repo).
3. The main site loads the Umami tracking script **first-party** (proxied via `russellroofing.com`), and
   pageviews are recorded for the production site.
4. `russellroofing.com/analytics` serves the Umami dashboard via a rewrite, is **not** linked in nav/footer
   or sitemap, and requires login (Umami auth; optionally Vercel password protection as a second layer).
5. Analytics collection is cookieless / privacy-friendly (no cookie-consent banner required for Umami).
6. Existing Google Analytics (if present) is left in place to run in parallel (see §GA4 below); no GA
   removal in this story.
7. A short internal runbook is added (`docs/analytics-umami.md`) covering login, adding a site, reading the
   dashboard, and the "how RR uses this" summary.

## Tasks / Subtasks
> **Code scaffolding is DONE and shipped inert (gated on env vars).** The remaining unchecked items are
> **RR infrastructure actions** — see `docs/analytics-umami.md`. Nothing activates until `UMAMI_URL` +
> `NEXT_PUBLIC_UMAMI_WEBSITE_ID` are set on the main site's Vercel project.

- [x] Provision database (AC: 1) — Supabase project created; Session-pooler `DATABASE_URL` wired
- [x] Deploy Umami (AC: 1, 2) — deployed as its own Vercel project (`umami-gilt-three.vercel.app`) with
      `BASE_PATH=/analytics`; DB migrated (tables present); default admin password changed
- [x] First-party tracking on the main site (AC: 3, 5)
  - [x] Website added in the dashboard; `website-id` = `4099339e-4cb2-479c-b555-73871c167fe2`
  - [x] Rewrites in `apps/web/next.config.mjs` proxy the script + collector (`/stats/script.js`,
        `/stats/api/send`, plus `/api/send` fallback) — gated on `UMAMI_URL`
  - [x] Tracking `<script>` mounted via `UmamiAnalytics.tsx` in `app/layout.tsx`; cookieless (no consent)
  - [x] Verified events arrive for production traffic (pageview appeared in Realtime)
- [x] Private dashboard route (AC: 4)
  - [x] Rewrite maps `russellroofing.com/analytics` → the Umami dashboard (`BASE_PATH=/analytics`)
  - [x] Confirmed absent from nav, footer, and `app/sitemap.ts` (it's a rewrite, not a page)
  - [x] Umami login required
- [x] Runbook (AC: 7)
  - [x] Wrote `docs/analytics-umami.md` (setup, login, credentials location, add-a-site, reading metrics,
        "how RR uses this")
- [x] Verify end-to-end (AC: 3, 4, 5)
  - [x] Visited site → pageview appeared in the dashboard (Realtime)
  - [x] `/analytics` requires auth and is unlinked
  - [x] No cookie banner introduced by Umami

## Dev Notes

### Why separate Vercel project (not inside apps/web)
Umami is its own Next.js/Node app with its own DB migrations and admin UI. Bundling it into the marketing
app would couple deploys and bloat the build. Keep it standalone; connect via rewrites only.

### First-party proxy pattern (dodges ad-blockers)
[Source: research §5.5; Umami docs "Running on Vercel"]
Serving `script.js` and the `/api/send` collector under the main domain avoids third-party blocking that
otherwise hides 10–30% of visits. Implement with `rewrites()` in `next.config.mjs`.

### Supabase connection strings
[Source: Umami-on-Vercel guides]
Use the **pooled** connection (`?pgbouncer=true&connection_limit=1`) for `DATABASE_URL` and the **direct**
connection for `DIRECT_DATABASE_URL` (migrations). Mismatched pooling is the most common setup failure.

### Security
- "Unlinked" ≠ private. The dashboard MUST require Umami login; Vercel password protection is a good second
  layer. Change default admin creds immediately. Store secrets in Vercel env / a password manager — never
  in the repo.

### Vercel plan note
Confirm which plan `apps/web` runs on. Hobby is free but intended for non-commercial use; if the main site
is on a Pro team, host the Umami project in the same account. This does not change the $0 database cost but
affects where "free" applies. *(Flag for Dwalton to confirm.)*

### GA4
Leave any existing Google Analytics running in parallel for ~3 months (research §5.4). A later story can
retire GA4 if unused (which also removes GA's cookie-consent requirement).

### Tech stack
[Source: docs/project-context.md] Next.js 14 App Router on Vercel; env validated in `app/layout.tsx` via
`lib/env-validation.ts` — add any new public vars (e.g., `NEXT_PUBLIC_UMAMI_WEBSITE_ID`) to that validator.

## Testing
- Manual E2E: production pageview appears in dashboard; `/analytics` gated + unlinked; no cookie banner.
- `pnpm typecheck` / `pnpm lint` green on `apps/web` after config + layout changes.
- Confirm no regression to existing `MainStructuredData` / head content in `layout.tsx`.

## RR (Client) Actions Required
- **Decide who owns the analytics login** (name + email for the Umami account).
- **Confirm the production domain / subdomain** to use for the Umami instance and the `/analytics` proxy.
- **Confirm the Vercel plan** the site runs on (affects "free" hosting eligibility — see Dev Notes).
- After launch: use the dashboard per `docs/analytics-umami.md` (a plain-language "how to use it" summary
  is also included in the client recommendation doc).

## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-07-09 | 1.0 | Initial story scoped from analytics/SEO research | Mary (Analyst) |

## Dev Agent Record

**Agent:** Claude (auto-bmad-assisted direct implementation), 2026-07-10

### Summary
Scaffolded the entire main-site side of Umami analytics — first-party tracking proxy, tracking script,
and the private `/analytics` dashboard rewrite — **all gated on env vars so it ships completely inert**
until the infrastructure (Supabase + Umami Vercel project) is stood up. Wrote the full setup runbook.
The infra provisioning + credential setup + E2E verification are RR actions (in the runbook), which is
why this story stays at `review` rather than `done`.

### Files changed (code — done, live-safe)
- `apps/web/next.config.mjs` — added `rewrites()` (gated on `UMAMI_URL`): first-party
  `/stats/script.js` + `/stats/api/send` proxy (ad-blocker resistant) and `/analytics(/*)` dashboard
  proxy. Returns `[]` when `UMAMI_URL` is unset → no effect.
- `apps/web/src/components/UmamiAnalytics.tsx` — new: renders the first-party Umami `<script>` via
  `next/script`, gated on `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (returns null when unset). Cookieless →
  no consent gating. `data-host-url` points at `/stats` so events hit the first-party collector.
- `apps/web/src/app/layout.tsx` — mounts `<UmamiAnalytics />`.
- `apps/web/src/lib/env-validation.ts` — registered `UMAMI_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID` as
  optional vars.
- `docs/analytics-umami.md` — new: full runbook (Supabase, Umami-on-Vercel with `BASE_PATH=/analytics`,
  securing it, wiring the two main-site env vars, E2E verification, "how RR uses this", GA4 parallel).

### Design decisions
- **Env-gated no-op.** Verified: production build with both vars unset contains **0** umami references —
  zero risk shipping to main before the infra exists.
- **`BASE_PATH=/analytics`** on the Umami deploy is required so the dashboard's assets resolve under the
  proxied `/analytics` path (documented in the runbook). Without it, only the dashboard HTML would proxy
  and its assets would 404.
- **AC6 (GA4):** left untouched — no GA code changed.
- **AC4 sitemap:** `/analytics` is a rewrite, not a Next route, so it is structurally absent from
  `app/sitemap.ts` (which enumerates explicit page lists) and from nav/footer.

### Validation
- Production build: success; `/analytics` + `/stats/*` produce no output when vars unset. `tsc` + `eslint`
  clean on all touched files. (Pre-existing, unrelated failures remain: the `NODE_ENV` typecheck errors
  and the env-validation test that expects an optional Google var to be required — both present on `main`
  before this change.)

### Go-live (2026-07-10) — DONE
Infra stood up and verified end-to-end: Supabase Postgres (Session pooler), Umami v3.2.0 deployed at
`umami-gilt-three.vercel.app` with `BASE_PATH=/analytics`, website `4099339e-4cb2-479c-b555-73871c167fe2`,
`UMAMI_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID` set on the main site. A production pageview appeared in the
Umami **Realtime** view. Three fixes were needed during bring-up (all committed):
- `/stats/*` rewrites retargeted to Umami's `/analytics/...` paths (BASE_PATH puts script + collector there).
- Added a `/api/send` fallback rewrite (tracker-version-robust collector addressing).
- **Dropped the absolute `data-host-url`** so events post **same-origin** — the apex `russellroofing.com`
  307-redirects to `www`, and the cross-origin POST hit that redirect (browsers won't follow it on a CORS
  request), so no events recorded until the tracker sent to the same `www` origin the page loads from.

Optional, non-blocking: enabling Vercel password protection on the Umami project as a second auth layer,
and confirming the Vercel plan / analytics-login owner (operational).

## QA Results
_(to be completed by reviewer)_
