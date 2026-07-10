# Story 8.2: Gallery Image SEO Optimization (Alt Text + Filenames)

## Status
review

## Story
**As a** search engine (and a homeowner using image/local search),
**I want** Russell Roofing's project photos to have descriptive, location-aware alt text and filenames,
**so that** the gallery contributes to organic and local SEO instead of being invisible to search.

## Context / Why
Research (`_bmad-output/planning-artifacts/technical-research-analytics-seo.md`, §4.3) established that
website gallery photos only help organic SEO when they carry **descriptive filenames + alt text**. Current
gallery data uses generic alt text and generic filenames.

**Confirmed current state:**
- Gallery data: `apps/web/src/data/gallery.ts` (`sampleProjects: ProjectImage[]`), fields include `alt`,
  `src`, `serviceTypes`, `projectTitle`, `location`, `description`.
- Current alt text is generic, e.g. `"Professional roofing installation"`, `"Quality roofing workmanship"`.
- Filenames are generic, e.g. `/images/gallery/roofing/full/roofing-01.jpg`.
- Rendering: `apps/web/src/components/gallery/GalleryGrid.tsx`, `GalleryLightbox.tsx` (both consume `alt`).
- Image tooling: `scripts/` (`gallery:validate`, `gallery:process`, etc.).

**Related operational item (not code):** confirm whether the CompanyCam feed posts photos to the **Google
Business Profile listing** (map-pack freshness signal) or only to the website. Captured in "RR Actions" below.

## Acceptance Criteria
1. Gallery `alt` text is rewritten to be descriptive and, where known, service- + location-specific
   (e.g., "Slate roof replacement on a colonial home in Glenside, PA") rather than generic phrases.
2. Alt text remains accurate to each image and stays within ~125 characters.
3. Where practical, image filenames are made descriptive (e.g., `slate-roof-replacement-glenside-pa.jpg`),
   with `src`/`thumbnailSrc` references updated and no broken images.
4. `pnpm gallery:validate` passes; the gallery renders with no missing images and no console errors.
5. A short contributor note is added (e.g., in `docs/gallery-management.md`) documenting the alt-text +
   filename convention so future CompanyCam-sourced images follow it.

## Tasks / Subtasks
- [x] Rewrite alt text (AC: 1, 2)
  - [x] For each entry in `sampleProjects`, compose descriptive alt from service + location + project type
  - [x] Keep accurate to the actual image; avoid keyword stuffing; ≤125 chars (max is 45 chars)
- [ ] (Optional, if low-risk) Descriptive filenames (AC: 3, 4) — **DEFERRED** (needs real per-image date + location; see Dev Agent Record)
  - [ ] Rename files under `public/images/gallery/**` to descriptive slugs
  - [ ] Update `src` and `thumbnailSrc` in `gallery.ts`
  - [ ] Re-run `pnpm gallery:validate` (and `gallery:process` if needed) and verify render
- [x] Document the convention (AC: 5)
  - [x] Add alt-text + filename guidance to `docs/gallery-management.md`
- [x] Verify (AC: 4 — render)
  - [x] Production build renders `/gallery`; new alt text present in built output; typecheck + lint clean

## Dev Notes

### Data shape
[Source: `apps/web/src/data/gallery.ts`, `apps/web/src/types/gallery.ts`]
Each `ProjectImage` already carries `serviceTypes`, `projectTitle`, and `location` — use these to build
alt text so it stays consistent with existing metadata.

### Scope guardrails
- This is a **content/data** change plus optional file renames — no component logic changes required.
- If filename renames risk broken references or churn, ship AC 1–2 + 5 first; treat AC 3 as a follow-up.
- Do not fabricate locations. If a photo's real location is unknown, keep alt descriptive by service/type
  without inventing a city.

### Tech stack
[Source: docs/project-context.md] Next.js 14, TypeScript strict. Gallery scripts are Node under `scripts/`.

## Testing
- `pnpm gallery:validate` passes.
- Manual: `/gallery` grid + lightbox render correctly; spot-check alt text via DOM inspector.
- `pnpm lint` / `pnpm typecheck` green.

## RR (Client) Actions Required
- **Confirm the CompanyCam → Google Business Profile connection.** Check whether CompanyCam is posting job
  photos to the **Google Business Profile listing** or only to the website. If only the website, either
  enable CompanyCam's Google Business Profile integration or have someone manually post 2–3 recent job
  photos to the GBP each week (the map-pack freshness signal). *(Operational — no code.)*
- Optionally provide real project locations for existing gallery photos to make alt text location-specific.

## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-07-09 | 1.0 | Initial story scoped from analytics/SEO research | Mary (Analyst) |

## Dev Agent Record

**Agent:** Claude (auto-bmad-assisted direct implementation), 2026-07-10

### Summary
Rewrote the alt text for all 44 gallery images from generic phrases to descriptive, location-aware
text derived from each entry's own metadata, and documented the alt-text + filename SEO conventions.
The descriptive-filename rename (AC3) is deferred — it requires real per-image metadata we don't have.

### Files changed
- `apps/web/src/data/gallery.ts` — all 44 `alt` strings rewritten to `"{projectTitle} in {location}"`
  (descriptive, location-aware, accurate to the actual subject, ≤125 chars; max is 45). Built from the
  entry's own `projectTitle`/`location` — no fabricated cities.
- `apps/web/src/data/__tests__/gallery.test.ts` — new: asserts every alt is non-empty, ≤125 chars,
  mentions its known location, and never reverts to a generic phrase (regression guard).
- `docs/gallery-management.md` — added an "SEO Conventions (Story 8.2)" section: the alt-text rule, the
  validator's filename pattern, the no-fabrication rule, the deferred-rename status, and known data
  follow-ups.

### Validation
- New gallery test: 3/3 pass. `tsc` + `eslint` on `gallery.ts`: clean.
- Production build: `/gallery` renders; the new alt text ("… in New Jersey") is present in the built
  output. No component logic changed.

### AC3 (descriptive filenames) — DEFERRED, with rationale
`pnpm gallery:validate` fails on 88 naming-convention issues **both before and after** this change —
it is pre-existing, not a regression. The validator's required filename pattern is
`{service}-{project-type}-{location}-{YYYY-MM-DD}` (see `apps/web/scripts/validate-gallery.js`), which
demands a **real date and location per image**. The current data has neither (every entry is the
generic `location: "New Jersey"`, no `completedDate`). Renaming 88 files to that pattern would require
**fabricating dates/locations**, which the story's guardrail explicitly forbids. So AC3 (and the
"validate passes" half of AC4) is deferred until real per-image metadata is available — an RR action.
Logged to `deferred-work.md`.

### Notes / data bugs found
- **Mis-tagged categories:** `masonry-01…06` have `serviceTypes: ["Gutters"]`, so masonry photos show
  under the *Gutters* gallery filter. Alt text was based on the accurate `projectTitle` (masonry), not
  the wrong tag. The tag bug itself is out of scope here — flagged in the doc + deferred ledger.
- All gallery `location` values are the generic "New Jersey"; real city/town locations would materially
  improve local image SEO (RR action).

## QA Results
_(to be completed by reviewer)_
