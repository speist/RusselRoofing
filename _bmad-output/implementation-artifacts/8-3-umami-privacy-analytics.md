# Story 8.3: Self-Hosted Umami Analytics with Private Dashboard

## Status
Draft

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
- [ ] Provision database (AC: 1)
  - [ ] Create a Supabase project; capture pooled (`pgbouncer`, port 6543) and direct connection strings
  - [ ] Note free-tier caveats (pause-on-inactivity is a non-issue with live traffic; document anyway)
- [ ] Deploy Umami (AC: 1, 2)
  - [ ] Deploy Umami (Vercel template or fork of `umami-software/umami`) as its own Vercel project
  - [ ] Set env: `DATABASE_URL` (pooled +`pgbouncer=true&connection_limit=1`), `DIRECT_DATABASE_URL` (direct),
        `APP_SECRET`
  - [ ] Run/confirm DB migration; log in; **change the default admin password**; create the RR user
- [ ] First-party tracking on the main site (AC: 3, 5)
  - [ ] Add Umami site in the dashboard; obtain `website-id`
  - [ ] Add rewrites in `apps/web/next.config.mjs` to proxy the script + event endpoint to the Umami host
        (e.g., `/stats/script.js` → `<umami>/script.js`, `/stats/api/send` → `<umami>/api/send`)
  - [ ] Mount the tracking `<script>` in `app/layout.tsx` using the first-party proxied path + `website-id`
  - [ ] Verify events arrive for production traffic (respect Do Not Track; exclude internal traffic if desired)
- [ ] Private dashboard route (AC: 4)
  - [ ] Add a rewrite mapping `russellroofing.com/analytics` → the Umami dashboard
  - [ ] Confirm it is absent from nav, footer, and `app/sitemap.ts`
  - [ ] Confirm Umami login is required; optionally enable Vercel password protection on the Umami project
- [ ] Runbook (AC: 7)
  - [ ] Write `docs/analytics-umami.md` (login URL, credentials location, add-a-site, reading metrics,
        "how RR uses this")
- [ ] Verify end-to-end (AC: 3, 4, 5)
  - [ ] Visit site → confirm a pageview appears in the dashboard within ~1 min
  - [ ] Confirm `/analytics` requires auth and is unlinked
  - [ ] Confirm no cookie banner is introduced by Umami

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
_(to be completed by dev agent)_

## QA Results
_(to be completed by reviewer)_
