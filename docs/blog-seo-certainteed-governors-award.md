# SEO & AI-Search Recommendations — CertainTeed 2025 Governor's Award Post

**Prepared for:** Russell Roofing marketing / web team
**Post:** "Russell Roofing Receives CertainTeed's Prestigious 2025 Governor's Award"
**Platform:** Sanity.io blog → published at `russellroofing.com/news/<slug>`

This document has three parts:

1. **Content recommendations** — copy you can paste directly into the Sanity fields for this post (and reuse the pattern for future posts).
2. **Technical findings & work completed** — a site audit for the web team, and the fixes that have now been implemented.
3. **What to relay to RR** — a short, plain-language summary for the RR contact.

---

## ✅ Status update (implemented)

The technical gap this document originally flagged **has been fixed and shipped to the code** (and the Sanity Studio was redeployed). In short:

- Blog post pages now output a **per-post SEO title, meta description, canonical URL, Open Graph, and Twitter card** — so what you type in Sanity's SEO fields now actually reaches Google and AI search.
- Each post now emits **BlogPosting** structured data, and **FAQPage** structured data when the post has an FAQ.
- A new **optional FAQ field** was added to the Sanity editor (already live at russellroofing.sanity.studio) so you can add the Q&As below to this post.

That means the Part 1 content recommendations below are now fully "wired up" — filling them in will show up in search. Details and remaining nice-to-haves are in Part 2.

---

# PART 1 — Content Recommendations (paste into Sanity)

## SEO Title
Keep under ~60 characters so Google doesn't truncate it. Lead with the keyword + brand + year (people and AI models search "2025").

> **Russell Roofing Wins CertainTeed 2025 Governor's Award**  *(54 characters)*

Alternate (adds a location signal, slightly longer):
> **Russell Roofing Earns CertainTeed 2025 Governor's Award | PA & NJ**

## SEO Meta Description
~150–158 characters. Includes the award name, the benefit, and the region.

> **Russell Roofing has earned CertainTeed's prestigious 2025 Governor's Award for excellence in roof installation and customer satisfaction across PA & NJ.**  *(154 characters)*

## URL Slug
Short, keyword-rich, no filler words. In Sanity this generates the `/news/<slug>` URL.

> `certainteed-2025-governors-award`

Full URL: `russellroofing.com/news/certainteed-2025-governors-award`

## Tags
Keep it to 5–7 tight, reusable tags. These act as topical/entity signals and let you build related-post groupings over time.

- `CertainTeed`
- `Awards & Recognition`
- `Roof Installation`
- `Roofing Warranties`
- `Roof Replacement`
- `Philadelphia Suburbs`

## Featured Image + Alt Text
- Use a **real photo** — the award, the team, or a completed Russell Roofing roof. Avoid a bare CertainTeed logo as the only image.
- Set the featured-image **alt text** to something descriptive, e.g.:
  > `Russell Roofing team with the CertainTeed 2025 Governor's Award`
- This same image should serve as the social-share (Open Graph) image so links look sharp on Facebook/LinkedIn/iMessage.

## Author + Publish Date
- Attribute the post to a real person or "Russell Roofing Team."
- Make sure the publish date is shown. Author + date are trust signals (E-E-A-T) that Google and AI models weigh for home-investment content.

---

## Suggested FAQ Section (use the new "FAQ" field in Sanity)

There's now a dedicated **FAQ (optional)** field in the Sanity post editor (in the same list of fields as Title, Tags, etc.). Add each Q&A as its own item — this renders a "Frequently Asked Questions" section at the bottom of the post **and** automatically generates the FAQ structured data that AI answer engines and Google's "People also ask" pull from. Keep each answer to 1–3 sentences.

**Q: Is the CertainTeed Governor's Award hard to earn?**
A: Yes. It's reserved for select credentialed contractors who consistently meet CertainTeed's highest standards for installation quality, customer service, and professionalism. It can't be purchased — it must be earned through demonstrated performance.

**Q: Does this award affect my roof warranty?**
A: It's directly related. Proper, manufacturer-standard installation is what qualifies homeowners for CertainTeed's highest levels of warranty protection, including workmanship coverage backed by the manufacturer.

**Q: What areas does Russell Roofing serve?**
A: Russell Roofing serves the Philadelphia suburbs — including Montgomery, Chester, Delaware, and Bucks Counties — as well as Mercer County and communities throughout South and Central New Jersey.

**Q: Why does manufacturer recognition matter when choosing a roofer?**
A: Anyone can buy shingles and install a roof, but most roofing problems come from improper installation, not defective materials. Manufacturer recognition like the Governor's Award is independent proof that a contractor installs to spec — giving homeowners added confidence their investment is protected.

---

## Other On-Page Suggestions

1. **Internal links (do before publishing).** Link key phrases to your money pages so this post passes authority to them:
   - "roof replacement" → your Roofing service page (`/services/roofing`)
   - "free roof inspection" in the closing CTA → your estimate/contact page
   - County/area mentions → a matching service-area page if one exists (`/service-areas/...`)

2. **Optimize for AI / answer engines.** AI models favor content that answers a question in one clean, quotable sentence right under a clear heading. The post already does this well with *"What Is the CertainTeed Governor's Award?"* — keep that pattern, and make the first sentence under each heading a self-contained, liftable answer. Question-style H2s ("Why does manufacturer recognition matter?") are ideal.

3. **Fix one geographic inconsistency.** The intro lists "South & Central New Jersey," but the "Serving Homeowners Throughout the Philadelphia Suburbs" section only lists PA counties + Mercer County. Add the NJ areas (or a couple of named NJ towns) to that list so the location keywords are consistent throughout — that section is your strongest local-SEO real estate.

4. **Add one authoritative outbound link.** Link to CertainTeed's official award/credentialing page. A single credible citation helps both Google and AI models verify the claim.

---

# PART 2 — Technical Findings & Work Completed (for the web team)

**Original problem (now fixed):** the blog's SEO fields all existed in Sanity and were correctly queried, but the public post pages were client-side rendered with no `generateMetadata()` and no JSON-LD — so the SEO title, meta description, and structured data never reached Google or AI crawlers. That has been implemented.

## What was changed (shipped to the codebase)

| Area | Change |
|---|---|
| `apps/web/src/app/news/[slug]/page.tsx` | Converted from a client-only shell to a **server component**. Added `generateMetadata()` (per-post title, description, canonical, Open Graph *article*, Twitter card) and server-rendered **BlogPosting** + conditional **FAQPage** JSON-LD. Uses ISR (`revalidate = 60`). |
| `apps/web/src/app/news/[slug]/BlogPostArticle.tsx` | New client component holding the visual article (keeps the interactive image behavior while data is now fetched server-side). Renders the FAQ section when present. |
| `apps/web/src/lib/sanity/blog.ts` | Query now also fetches `_updatedAt` and the new `faqs`. |
| `apps/web/src/components/StructuredData.tsx` | `ArticleSchema` now emits `@type: BlogPosting` (was generic `Article`) + `mainEntityOfPage`. |
| `studio/schemaTypes/post.ts` | Added an optional **FAQ** field (question/answer pairs). |
| `studio/sanity.cli.ts` | Pinned `studioHost: 'russellroofing'` so Studio deploys are non-interactive. |
| `apps/web/src/app/sitemap.ts` | Fixed `lastModified` to read the real `updatedAt` (was reading a field that never existed, so it always fell back to publish date). |

**Verified:** production build passes; a live post fetched from the built server now includes the per-post `<title>`, meta description, canonical, `og:type=article`, Twitter card, and `BlogPosting` JSON-LD in the initial server HTML. The Sanity Studio was redeployed to **https://russellroofing.sanity.studio** with the new FAQ field.

## Remaining nice-to-haves (optional, not blocking)

1. **`/news` listing page is still client-rendered.** Individual post pages (what actually rank) are fixed; converting the listing page is a lower-priority follow-up.
2. **Per-post Open Graph image route.** Social shares currently use the featured image via metadata, which is fine; a dedicated `opengraph-image` per post is a future polish item.
3. **`getBlogPostBySlug` runs twice per request** (once in `generateMetadata`, once in the page). Harmless with ISR caching; can be deduped by wrapping the call in React `cache()` if desired.
4. **Author is a plain string.** Fine today; a future `author` reference document would enable richer `Person` structured data.

---

## Original audit detail (for reference)

## What EXISTS (good foundation)
- The Sanity `post` schema already has the right SEO fields: `seoTitle`, `metaDescription`, `excerpt`, `tags`, `authorName`, `publishedAt`, `mainImage`, `featuredImageAlt`, `slug`.
  *(`studio/schemaTypes/post.ts`)*
- Those fields **are** fetched by the GROQ detail query and delivered to the page. *(`apps/web/src/lib/sanity/blog.ts`)*
- A ready-made `ArticleSchema` JSON-LD component already exists. *(`apps/web/src/components/StructuredData.tsx`)*
- Site-wide LocalBusiness / Organization / WebSite JSON-LD, a dynamic `sitemap.ts` that includes `/news/<slug>` URLs, and a `robots.ts` are all in place.

## What's MISSING / broken for blog posts
1. **No `generateMetadata()` on the post page** (`apps/web/src/app/news/[slug]/page.tsx`). Every post currently inherits the generic, static `/news` section metadata — so there is no per-post `<title>`, meta description, canonical, Open Graph, or Twitter card. The `seoTitle`/`metaDescription` values reach the page but are never used for `<head>` output.
2. **No JSON-LD on blog posts.** The existing `ArticleSchema` component is never rendered anywhere. Posts emit no `Article`/`BlogPosting` and no `FAQPage` structured data. *(Recommend upgrading `ArticleSchema` from `@type: Article` to `@type: BlogPosting`, or adding a BlogPosting variant.)*
3. **The post pages are client-side rendered** (`"use client"` on both `/news` and `/news/[slug]`, fetching from `/api/blog` in a `useEffect`). This is the **root blocker**: metadata and JSON-LD added inside a client component don't land in the initial server HTML that crawlers and AI-search bots read. These need to be server components (or a server wrapper that renders metadata + JSON-LD, with the interactive bits kept client-side).
4. **No canonical URL** logic. Worth adding, especially given `originalUrl` (legacy HubSpot URLs) is currently used as the display link.
5. **No per-post Open Graph image.** Only a single global `opengraph-image.tsx` exists; `mainImage` should be exposed as the per-post OG image.
6. **No `dateModified`/updated field** in the schema or query. The sitemap's `lastModified` silently falls back to publish date.
7. **Breadcrumb JSON-LD** component exists but is unused on posts.
8. **`authorName` is a plain string**, which limits rich `author`/`Person` structured data. Fine for now; a future enhancement.

## Recommended fix sequence (highest impact first)
1. **Convert `/news/[slug]` to server-render** the metadata + structured data (server component or server wrapper). *Unblocks everything below.*
2. **Add `generateMetadata()`** mapping Sanity `seoTitle` → title (fallback to `title`), `metaDescription` → description (fallback to `excerpt`), `mainImage` → OpenGraph/Twitter image, plus a self-referencing canonical.
3. **Render `BlogPosting` JSON-LD** on each post using the existing `ArticleSchema` component (upgraded to `BlogPosting`), populated from `title`, `metaDescription`/`excerpt`, `mainImage`, `publishedAt`, `authorName`, and publisher = Russell Roofing.
4. **Render `FAQPage` JSON-LD** when a post includes an FAQ block (like this one). The `FAQSchema` component already exists and is used on service pages — reuse it.
5. Add a per-post `opengraph-image` and a `dateModified` field when convenient.

### Proposed BlogPosting JSON-LD (shape for this post)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Russell Roofing Receives CertainTeed's Prestigious 2025 Governor's Award",
  "description": "Russell Roofing has earned CertainTeed's prestigious 2025 Governor's Award for excellence in roof installation and customer satisfaction across PA & NJ.",
  "image": "https://russellroofing.com/<featured-image-url>",
  "author": { "@type": "Organization", "name": "Russell Roofing" },
  "publisher": {
    "@type": "Organization",
    "name": "Russell Roofing & Exteriors",
    "logo": { "@type": "ImageObject", "url": "https://russellroofing.com/<logo-url>" }
  },
  "datePublished": "2026-07-22",
  "dateModified": "2026-07-22",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://russellroofing.com/news/certainteed-2025-governors-award"
  },
  "about": ["CertainTeed Governor's Award", "roof installation", "roofing warranties"],
  "areaServed": ["Montgomery County PA", "Chester County PA", "Delaware County PA", "Bucks County PA", "Mercer County NJ", "South and Central New Jersey"]
}
```

### Proposed FAQPage JSON-LD (built from the FAQ section above)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is the CertainTeed Governor's Award hard to earn?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. It's reserved for select credentialed contractors who consistently meet CertainTeed's highest standards for installation quality, customer service, and professionalism. It can't be purchased — it must be earned through demonstrated performance." }
    },
    {
      "@type": "Question",
      "name": "Does this award affect my roof warranty?",
      "acceptedAnswer": { "@type": "Answer", "text": "It's directly related. Proper, manufacturer-standard installation is what qualifies homeowners for CertainTeed's highest levels of warranty protection, including workmanship coverage backed by the manufacturer." }
    },
    {
      "@type": "Question",
      "name": "What areas does Russell Roofing serve?",
      "acceptedAnswer": { "@type": "Answer", "text": "Russell Roofing serves the Philadelphia suburbs — including Montgomery, Chester, Delaware, and Bucks Counties — as well as Mercer County and communities throughout South and Central New Jersey." }
    },
    {
      "@type": "Question",
      "name": "Why does manufacturer recognition matter when choosing a roofer?",
      "acceptedAnswer": { "@type": "Answer", "text": "Anyone can buy shingles and install a roof, but most roofing problems come from improper installation, not defective materials. Manufacturer recognition like the Governor's Award is independent proof that a contractor installs to spec — giving homeowners added confidence their investment is protected." }
    }
  ]
}
```

---

## Quick reference — paste-ready values

| Field | Value |
|---|---|
| **SEO Title** | Russell Roofing Wins CertainTeed 2025 Governor's Award |
| **Meta Description** | Russell Roofing has earned CertainTeed's prestigious 2025 Governor's Award for excellence in roof installation and customer satisfaction across PA & NJ. |
| **Slug** | `certainteed-2025-governors-award` |
| **Tags** | CertainTeed · Awards & Recognition · Roof Installation · Roofing Warranties · Roof Replacement · Philadelphia Suburbs |
| **Featured image alt** | Russell Roofing team with the CertainTeed 2025 Governor's Award |

---

# PART 3 — What to Relay to RR (plain-language summary)

You can share this section directly with your Russell Roofing contact.

**Good news: your blog is now set up for strong SEO and AI-search visibility, and it's ready for your first post.**

Here's what to do for the CertainTeed Governor's Award post when you create it in the editor (https://russellroofing.sanity.studio):

1. **Paste in the SEO fields** using the "Quick reference" table above — SEO Title, SEO meta description, Slug, Tags, and the Featured image alt text. These control how your post appears in Google and when shared on social media.

2. **Use a real photo** as the Featured image (the award, your team, or a completed roof) — not just a logo. Add the alt text from the table.

3. **Add the FAQ section.** There's a new **"FAQ (optional)"** field in the editor. Add the four questions and answers from the "Suggested FAQ Section" above. This helps you show up in Google's "People also ask" and in AI assistant answers.

4. **Two small edits to the article copy** for best results:
   - Add your New Jersey service areas to the "Serving Homeowners" list so it matches the intro (which mentions South & Central NJ).
   - In the closing "Need a Roof Replacement?" call-to-action, make sure "free roof inspection" links to your contact/estimate page.

**What we handled on the technical side (no action needed from you):** we updated the website so that everything you type in those SEO fields now correctly reaches Google and AI search engines, added the behind-the-scenes data ("structured data") that search engines and AI tools use to understand and feature your posts, and set up the new FAQ feature in your editor. This benefits **every** blog post going forward, not just this one.

**One note:** the post's Google title will appear exactly as you type it in the "SEO title" field (we don't auto-add "| Russell Roofing" after it), so include the brand in that field if you want it shown — the recommended SEO title above already does.
