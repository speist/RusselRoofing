#!/usr/bin/env python3
"""
Export all HubSpot blog posts for migration to Sanity.

Produces, in blog-migration/:
  - hubspot-blog-export-raw.json   Lossless archive of every field HubSpot returns (safety net)
  - sanity-blog-import.ndjson      Sanity-import-ready (newline-delimited JSON, one doc/line)
  - images/                        Downloaded featured images (local backup)
  - EXPORT-REPORT.md               Human-readable summary of what was captured

Run from repo root:  python3 blog-migration/export-hubspot-blog.py
Requires COMPANYCAM unused; needs HUBSPOT_API_KEY (read from apps/web/.env.local).
"""
import json, os, re, sys, time, urllib.request, urllib.parse, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
ENV  = ROOT.parent / "apps" / "web" / ".env.local"
IMG_DIR = ROOT / "images"
IMG_DIR.mkdir(parents=True, exist_ok=True)

# --- load HUBSPOT_API_KEY from .env.local ---
def load_key():
    for line in ENV.read_text().splitlines():
        if line.strip().startswith("HUBSPOT_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("HUBSPOT_API_KEY not found in apps/web/.env.local")

KEY = load_key()
BASE = "https://api.hubapi.com"

def api(path):
    req = urllib.request.Request(BASE + path,
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.load(r)

# --- resolve tag-id -> name and author-id -> name maps ---
def build_map(path, name_field="name"):
    out, after = {}, None
    while True:
        p = path + (f"?limit=100&after={after}" if after else "?limit=100")
        d = api(p)
        for x in d.get("results", []):
            out[str(x.get("id"))] = x.get(name_field) or x.get("displayName") or ""
        after = d.get("paging", {}).get("next", {}).get("after")
        if not after:
            break
    return out

print("Resolving tags and authors...")
tag_map    = build_map("/cms/v3/blogs/tags", "name")
author_map = build_map("/cms/v3/blogs/authors", "displayName")
print(f"  {len(tag_map)} tags, {len(author_map)} authors")

# --- page through all published posts ---
print("Fetching posts...")
posts, offset = [], 0
while True:
    d = api(f"/cms/v3/blogs/posts?limit=100&offset={offset}&state=PUBLISHED")
    batch = d.get("results", [])
    posts.extend(batch)
    total = d.get("total", 0)
    offset += len(batch)
    print(f"  {len(posts)}/{total}")
    if not batch or offset >= total:
        break

# --- write lossless raw archive ---
(ROOT / "hubspot-blog-export-raw.json").write_text(
    json.dumps({"exported_total": len(posts), "posts": posts}, indent=2))

# --- helpers ---
def strip_html(html):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html or "")).strip()

def slugify(slug):
    # HubSpot slugs may include the "russell-roofing-blog/" prefix; keep only the leaf
    return (slug or "").split("/")[-1]

def safe_name(s):
    return re.sub(r"[^a-zA-Z0-9._-]", "_", s)[:120]

# --- build Sanity NDJSON + download featured images ---
ndjson_lines, img_ok, img_fail = [], 0, 0
for p in posts:
    pid   = str(p.get("id"))
    slug  = slugify(p.get("slug"))
    tags  = [tag_map.get(str(t), str(t)) for t in (p.get("tagIds") or [])]
    author = author_map.get(str(p.get("blogAuthorId")), p.get("authorName") or "")
    feat  = p.get("featuredImage") or ""

    # download featured image as local backup
    local_img = ""
    if feat:
        ext = os.path.splitext(urllib.parse.urlparse(feat).path)[1] or ".jpg"
        fname = f"{safe_name(slug or pid)}{ext}"
        try:
            urllib.request.urlretrieve(feat, IMG_DIR / fname)
            local_img = f"images/{fname}"
            img_ok += 1
        except Exception as e:
            img_fail += 1
            print(f"  [warn] image download failed for {slug or pid}: {e}")

    doc = {
        "_type": "post",
        "_id": f"hubspot-{pid}",
        "title": p.get("name") or "",
        "slug": {"_type": "slug", "current": slug},
        "publishedAt": p.get("publishDate") or p.get("created") or "",
        "excerpt": strip_html(p.get("postSummary")),
        # Raw HTML preserved losslessly; converted to Portable Text at schema-wiring step.
        "bodyHtml": p.get("postBody") or "",
        "authorName": author,
        "tags": tags,
        "metaDescription": p.get("metaDescription") or "",
        "seoTitle": p.get("htmlTitle") or "",
        "originalUrl": p.get("url") or "",
        "featuredImageAlt": p.get("featuredImageAltText") or "",
        "localFeaturedImage": local_img,
    }
    # _sanityAsset tells `sanity dataset import` to fetch + create the image asset automatically
    if feat:
        doc["mainImage"] = {"_sanityAsset": f"image@{feat}"}

    ndjson_lines.append(json.dumps(doc, ensure_ascii=False))
    time.sleep(0.05)  # be gentle on the API

(ROOT / "sanity-blog-import.ndjson").write_text("\n".join(ndjson_lines) + "\n")

# --- report ---
report = f"""# HubSpot -> Sanity Blog Export Report

**Posts exported:** {len(posts)}
**Featured images downloaded:** {img_ok} ok, {img_fail} failed
**Tags resolved:** {len(tag_map)} | **Authors resolved:** {len(author_map)}

## Files
| File | Purpose |
|------|---------|
| `hubspot-blog-export-raw.json` | Lossless archive of every HubSpot field (safety net) |
| `sanity-blog-import.ndjson` | Sanity import-ready (one document per line) |
| `images/` | Local copies of featured images ({img_ok} files) |

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
"""
(ROOT / "EXPORT-REPORT.md").write_text(report)
print(f"\nDone. {len(posts)} posts, {img_ok} images. See blog-migration/EXPORT-REPORT.md")
