# HubSpot -> Sanity Blog Export Report

**Posts exported:** 57
**Featured images downloaded:** 57 ok, 0 failed (24.9 MB; required a browser User-Agent — HubSpot CDN 403s the default)
**Tags resolved:** 13 | **Authors resolved:** 2

> **Heads-up — body HTML carries WordPress/Elementor markup.** The posts were
> originally imported into HubSpot from WordPress, so `bodyHtml` is wrapped in
> `<div class="elementor ...">` containers with inline styling. This is preserved
> verbatim (lossless), but it should be **cleaned** when we render or convert to
> Portable Text — otherwise the Elementor wrappers/classes carry over as noise.

## Files
| File | Purpose |
|------|---------|
| `hubspot-blog-export-raw.json` | Lossless archive of every HubSpot field (safety net) |
| `sanity-blog-import.ndjson` | Sanity import-ready (one document per line) |
| `images/` | Local copies of featured images (0 files) |

## How to import into Sanity (when the schema is ready)
```bash
# from your Sanity studio project:
sanity dataset import path/to/sanity-blog-import.ndjson production
```
The `mainImage` field uses Sanity's `_sanityAsset` URL convention, so the importer
fetches and uploads each featured image automatically.

## Field mapping (HubSpot -> Sanity `post`)
| HubSpot | Sanity field |
|---------|--------------|
| name | title |
| slug (leaf) | slug.current |
| publishDate | publishedAt |
| postSummary (text) | excerpt |
| postBody (HTML) | bodyHtml (see note) |
| blogAuthorId -> name | authorName |
| tagIds -> names | tags[] |
| metaDescription | metaDescription |
| htmlTitle | seoTitle |
| featuredImage | mainImage (_sanityAsset) |
| featuredImageAltText | featuredImageAlt |

## ONE conversion step remaining
`bodyHtml` holds the original post HTML verbatim (lossless). Sanity's rich-text
("Portable Text") is not HTML, so at schema-wiring time we either:
  (a) render the HTML field directly on the /news page (simplest, zero data loss), or
  (b) convert HTML -> Portable Text with @sanity/block-tools during import.
No content is lost either way — this file is the complete source of truth.
