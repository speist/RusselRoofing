# Blog Migration Runbook — finishing the Sanity setup

Everything that *doesn't* need your Sanity login is already done. The steps below
are the few that require **you to be logged in to Sanity** (a browser auth I can't
do for you). They take ~10 minutes. Run them from a terminal.

> You need: Node 20+ (you have 22), and your Sanity account (already created).

---

## Step 1 — Get your Sanity project ID

You created a Sanity account with the Growth trial. Find your **Project ID**:

- Go to **https://www.sanity.io/manage**, click your project → **Project ID** is shown
  in Settings (an 8-character string like `a1b2c3d4`).

*(Or, after `sanity login` in Step 2, run `npx sanity projects list` to see it.)*

---

## Step 2 — Configure & install the Studio

```bash
cd "studio"
cp .env.example .env
# edit .env and paste your project ID after SANITY_STUDIO_PROJECT_ID=
npm install
npx sanity login        # opens a browser — log in with your Sanity account
```

If your project has no `production` dataset yet:
```bash
npx sanity dataset create production --visibility public
```

---

## Step 3 — Import the 57 posts

```bash
# still in studio/
npm run import
# (= sanity dataset import ../blog-migration/sanity-blog-import.ndjson production --replace)
```

This uploads all 57 posts **and** fetches every featured + inline image automatically
(via the `_sanityAsset` URLs in the file). Expect it to take a couple of minutes while
images upload. You'll see a success summary at the end.

---

## Step 4 — See your content

```bash
npm run dev      # opens the Studio locally at http://localhost:3333
```
Log in and you should see all 57 posts with images, text, and tags. Click any post to edit.

To put the Studio on a shareable URL for your team (the "separate publish link"):
```bash
npx sanity deploy        # pick a name -> https://<name>.sanity.studio
```
Invite the other 1–2 people in **sanity.io/manage → members** as **Administrators**
(the free plan's editing role).

---

## What happens next (Amelia will handle, when you're ready)

Step 4 from the migration plan: repoint `russellroofing.com/news` and `/news/[slug]`
from HubSpot to Sanity. **The public URLs do not change.** Visitors see the same pages;
only the data source swaps. We'll do that as a separate, reviewable change.

---

## Reference — what's already prepared in this folder

| File | What it is |
|------|-----------|
| `sanity-blog-import.ndjson` | 57 posts in Sanity import format, body converted to Portable Text |
| `hubspot-blog-export-raw.json` | Lossless raw archive (safety net) |
| `images/` | All featured images + 18 distinct inline images, downloaded locally |
| `convert/convert.mjs` | The HTML→Portable Text converter (re-runnable) |
| `EXPORT-REPORT.md` | Field mapping + notes |

**Content fidelity:** all 57 post texts converted (1,947 Portable Text blocks, 0 empty),
hyperlinks preserved, 18 distinct inline images embedded, 40 duplicate-hero and 2 broken
inline images dropped intentionally (nothing lost silently — the raw archive keeps everything).
