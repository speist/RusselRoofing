# Umami Analytics — Setup & Runbook (Story 8.3)

Free, privacy-friendly (cookieless, GDPR-friendly) web analytics for russellroofing.com, self-hosted on
Vercel + Supabase Postgres at **$0/mo recurring**. The dashboard lives at a private
`russellroofing.com/analytics` that is **not linked anywhere** on the public site and requires login.

> **What's already in the code (done):** the main site is wired to load Umami **first-party** and to
> proxy the dashboard, all gated on two env vars. Until you set them, nothing loads and the site is
> unchanged. This doc is the infrastructure half — the part that needs your accounts/credentials.

---

## Architecture (why it's built this way)

- Umami is its **own app**, deployed as a **separate Vercel project** (not inside `apps/web`) with its own
  Postgres DB and admin UI.
- The main site **proxies** to it via `rewrites()` in `apps/web/next.config.mjs`, so:
  - the tracking script is served first-party from `/stats/script.js` and events POST to `/stats/api/send`
    → **dodges ad-blockers** (recovers ~10–30% of otherwise-hidden visits);
  - the dashboard is reachable at `/analytics`.
- Umami is **cookieless**, so it needs **no cookie-consent banner**.

```
Visitor → russellroofing.com/stats/script.js ──(rewrite)──▶ <umami>/script.js
Visitor → russellroofing.com/stats/api/send  ──(rewrite)──▶ <umami>/api/send
You     → russellroofing.com/analytics       ──(rewrite)──▶ <umami>/analytics  (login required)
```

---

## One-time setup

### Decisions to make first (RR)
- **Who owns the analytics login** (name + email for the Umami admin/user).
- **Vercel plan** the main site runs on. Hobby is free but non-commercial; if `apps/web` is on a Pro
  team, create the Umami project in that **same** team. (Doesn't change the $0 DB cost.)

### 1. Create the database (Supabase — free tier)
1. Create a Supabase project (any region near your users); set + save a strong DB password.
2. Click **Connect** → **Connection string** → **URI**, and copy the **Session pooler** string
   (host `...pooler.supabase.com`, **port `5432`**). This one value is `DATABASE_URL`.
   ```
   postgresql://postgres.<ref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres
   ```
   > ⚠️ Use the **Session pooler (5432)** — it's IPv4 (works from Vercel) and supports Umami's Prisma
   > migrations. Do **not** use the Direct connection (IPv6-only, fails from Vercel) or the Transaction
   > pooler (6543, breaks `prisma migrate`). Single string, session pooler — this is the #1 gotcha.
   - Free-tier note: Supabase pauses a project after ~1 week of inactivity — a non-issue with live
     traffic, but if analytics ever go quiet, un-pause it in the dashboard.

### 2. Deploy Umami (its own Vercel project)
1. Deploy from the official template/repo `umami-software/umami` (Vercel → New Project → import the repo,
   or use their "Deploy to Vercel" button).
2. Set environment variables on **the Umami project**:
   - `DATABASE_URL` = the Supabase **Session pooler** string from step 1 (port 5432)
   - `APP_SECRET` = any long random string (e.g. `openssl rand -hex 32`)
   - **`BASE_PATH` = `/analytics`**  ← required so the dashboard's assets resolve under `/analytics`
     when proxied from the main domain. It also moves Umami's script + collector under `/analytics`,
     which is why the main-site `/stats/*` rewrites target `${UMAMI_URL}/analytics/...`.
3. Deploy. The first build runs the DB migration automatically. Note the Umami project's URL
   (e.g. `https://rr-analytics.vercel.app`).

### 3. Secure it (do this immediately)
1. Log in to the Umami dashboard (default creds are `admin` / `umami`).
2. **Change the admin password immediately.** Create the RR owner user; store credentials in a password
   manager — **never in this repo**.
3. (Optional, recommended) Enable **Vercel password protection** on the Umami project as a second layer.

### 4. Register the website & get the ID
1. In Umami: **Settings → Websites → Add website**. Name it "Russell Roofing", domain `russellroofing.com`.
2. Copy the generated **Website ID** (a UUID).

### 5. Wire the main site (Vercel env on the `apps/web` project)
Add these to the **main site's** Vercel project (Production, and Preview if you want tracking there):

| Variable | Value | Notes |
|---|---|---|
| `UMAMI_URL` | the Umami project URL, e.g. `https://rr-analytics.vercel.app` | enables the `/stats/*` + `/analytics` rewrites (server-side) |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | the Website ID UUID from step 4 | mounts the tracking script (client-side) |

Redeploy the main site. That's it — the code already handles the rest.

> If either variable is unset, that half stays off: no `UMAMI_URL` → no rewrites; no website ID → no
> tracking script. Setting both activates everything.

---

## Verify (end-to-end)
1. Visit `https://russellroofing.com` in a normal browser (no ad-blocker for the first check).
2. In DevTools → Network, confirm `stats/script.js` loads (200) and a request to `stats/api/send` fires
   on navigation.
3. Open `https://russellroofing.com/analytics` → you should get the **Umami login** (not a 404, not the
   public site). Log in → your visit should appear within ~1 minute.
4. Confirm `/analytics` is **not** linked in the nav, footer, or `sitemap.xml` (it isn't — it's a rewrite,
   not a page).
5. Confirm no new cookie banner appeared (Umami is cookieless).

**If events don't arrive:** the tracker's collector path can vary by Umami version. Check where
`stats/api/send` returns — if it 404s, confirm the `/stats/api/send` rewrite and that `data-host-url`
(in `src/components/UmamiAnalytics.tsx`) resolves to `https://russellroofing.com/stats`. As a fallback,
you can point the collector at the Umami host directly (drop `data-host-url`) — but you lose the
ad-blocker resistance.

---

## How RR uses this (day-to-day)
- **URL:** `https://russellroofing.com/analytics` — log in with the RR analytics account (in the password
  manager).
- **What to watch:** total visitors/pageviews over time; **Referrers** (where traffic comes from —
  Google, direct, social); **Pages** (which service pages get traffic). After the SEO work (Stories 8.1
  gallery/FAQ schema, 8.2 image SEO), watch organic/referrer traffic to those pages trend up.
- **Add another site** later: Umami → Settings → Websites → Add website, then drop its script on that site.

## Parallel Google Analytics
Any existing GA4 stays running in parallel (no removal in this story). Keep both for ~3 months to compare,
then a later story can retire GA4 if unused (which also removes GA's cookie-consent requirement).

---

## Reference (what's in the repo)
- `apps/web/next.config.mjs` — `rewrites()` for `/stats/script.js`, `/stats/api/send`, `/analytics*`
  (gated on `UMAMI_URL`).
- `apps/web/src/components/UmamiAnalytics.tsx` — first-party tracking script (gated on
  `NEXT_PUBLIC_UMAMI_WEBSITE_ID`), mounted in `apps/web/src/app/layout.tsx`.
- `apps/web/src/lib/env-validation.ts` — `UMAMI_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID` registered as
  optional vars.
