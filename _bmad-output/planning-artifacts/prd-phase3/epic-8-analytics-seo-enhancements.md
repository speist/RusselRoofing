# Epic 8: Analytics & SEO Enhancements

**Goal:** To capture the high-value, low-effort SEO and analytics wins identified in the
analytics/SEO research (`_bmad-output/planning-artifacts/technical-research-analytics-seo.md` and
`RR-analytics-seo-recommendation-CLIENT.md`), so the site is more discoverable in Google and AI
answers and Russell Roofing can measure the impact — without adding recurring cost or exposing data.

* **Story 8.1: FAQ Structured Data (FAQPage JSON-LD)**
    * **As a** homeowner searching Google or an AI assistant for roofing answers, **I want** Russell
      Roofing's FAQ answers to be eligible to appear directly in search results and AI answers, **so
      that** I find Russell Roofing's expertise before I find a competitor's.
    * **Acceptance Criteria:**
        1.  A reusable `FAQSchema` component is added to `apps/web/src/components/StructuredData.tsx`
            that accepts an array of `{ question, answer }` and emits valid `FAQPage` JSON-LD.
        2.  Each `/services/[slug]` page that renders FAQs also emits the matching `FAQPage` schema,
            generated from the **same** `serviceFAQs` data source (no duplicated content — set-and-forget).
        3.  The emitted JSON-LD passes Google's Rich Results Test with zero errors and is detected as a
            valid FAQ result.
        4.  Answers in the schema are plain text (any HTML/entities stripped or decoded) per schema.org
            FAQ requirements.
        5.  No visual change to the rendered page; this is metadata only.

* **Story 8.2: Gallery Image SEO Optimization (Alt Text + Filenames)**
    * **As a** search engine (and a homeowner using image/local search), **I want** Russell Roofing's
      project photos to have descriptive, location-aware alt text and filenames, **so that** the gallery
      contributes to organic and local SEO instead of being invisible to search.
    * **Acceptance Criteria:**
        1.  Gallery `alt` text is rewritten to be descriptive and, where known, service- + location-specific
            rather than generic phrases.
        2.  Alt text remains accurate to each image and stays within ~125 characters.
        3.  Where practical, image filenames are made descriptive, with `src`/`thumbnailSrc` references
            updated and no broken images.
        4.  `pnpm gallery:validate` passes; the gallery renders with no missing images and no console errors.
        5.  A contributor note documents the alt-text + filename convention for future CompanyCam images.

* **Story 8.3: Self-Hosted Umami Analytics with Private Dashboard**
    * **As** Russell Roofing (site owner), **I want** a free, privacy-friendly web analytics dashboard at a
      private `russellroofing.com/analytics` URL not linked anywhere on the public site, **so that** we can
      see traffic sources and SEO impact without paying for a tool or exposing data publicly.
    * **Acceptance Criteria:**
        1.  A Umami instance is deployed (own Vercel project) backed by a Supabase Postgres database on free
            tiers.
        2.  Default Umami admin credentials are changed; access restricted to designated owner(s);
            credentials stored securely (not in the repo).
        3.  The main site loads the Umami tracking script first-party (proxied via `russellroofing.com`) and
            records production pageviews.
        4.  `russellroofing.com/analytics` serves the dashboard via a rewrite, is not linked in nav/footer or
            sitemap, and requires login.
        5.  Collection is cookieless / privacy-friendly (no cookie-consent banner required).
        6.  Existing Google Analytics (if present) is left in place to run in parallel; no GA removal here.
        7.  A short internal runbook (`docs/analytics-umami.md`) covers login, adding a site, reading the
            dashboard, and how RR uses it.

---
