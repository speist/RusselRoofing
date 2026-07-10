# Deferred Work Ledger

Cross-story record of work consciously deferred. Each entry names the story it came from.

## Deferred from: story 8-2-gallery-image-seo-optimization (2026-07-10)

- Descriptive gallery filenames (AC3) — rename the 44 gallery images (+44 thumbnails) under
  `apps/web/public/images/gallery/**` to the validator pattern
  `{service}-{project-type}-{location}-{YYYY-MM-DD}` and update `src`/`thumbnailSrc` in
  `apps/web/src/data/gallery.ts`, then re-run `pnpm gallery:process` + `pnpm gallery:validate`.
  **Blocked on real per-image metadata:** the pattern requires a real date + location per image, but
  the data has neither (all `location: "New Jersey"`, no `completedDate`). Do NOT fabricate. Needs the
  RR action (real project locations/dates) first. This is also what makes `pnpm gallery:validate`
  report its 88 pre-existing naming issues.
- Fix mis-tagged gallery categories — `masonry-01…06` in `gallery.ts` have `serviceTypes: ["Gutters"]`,
  so masonry photos appear under the *Gutters* filter. Retag to a masonry/specialty category.

## Deferred from: story 8-3-umami-privacy-analytics (2026-07-10)

- Umami go-live infrastructure (AC1–4 live verification) — **RR action, not code.** The main-site code
  is shipped inert (gated on `UMAMI_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID`). To activate, follow
  `docs/analytics-umami.md`: create a Supabase Postgres project; deploy Umami as its own Vercel project
  with `BASE_PATH=/analytics`; change the default admin password + create the RR user; add the website
  and copy its ID; set `UMAMI_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID` on the main site's Vercel project;
  then verify E2E (pageview appears, `/analytics` gated + unlinked, no cookie banner). Also confirm the
  Vercel plan and the analytics-login owner.
