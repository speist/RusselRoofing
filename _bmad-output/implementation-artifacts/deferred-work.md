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
- ✅ Fix mis-tagged gallery categories — `masonry-01…06` in `gallery.ts` had `serviceTypes: ["Gutters"]`,
  so masonry photos appeared under the *Gutters* filter. **Resolved in** `src/data/gallery.ts` +
  `src/types/gallery.ts`: added a `Masonry` gallery category and retagged all 6 entries to `["Masonry"]`.

## Deferred from: story 8-3-umami-privacy-analytics (2026-07-10)

- ✅ Umami go-live infrastructure (AC1–4 live verification). **Resolved in** the live Umami deploy
  (2026-07-10): Supabase Postgres + Umami (`umami-gilt-three.vercel.app`, `BASE_PATH=/analytics`) stood
  up, `UMAMI_URL` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID` set on the main site, and a production pageview
  verified in Umami Realtime. See `docs/analytics-umami.md` and story 8-3's Dev Agent Record.
