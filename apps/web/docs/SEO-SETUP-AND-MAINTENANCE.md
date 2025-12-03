# SEO Setup and Maintenance Guide

This document outlines the SEO implementation for Russell Roofing & Exteriors website and provides guidance for ongoing maintenance.

---

## What's Been Implemented

### 1. Sitemap (`/sitemap.xml`)
**File:** `src/app/sitemap.ts`

**What it does:**
- Automatically lists all pages on the website for search engines
- Includes static pages, service pages, and HubSpot blog posts
- Updates automatically when new blog posts are published

**No maintenance required** - sitemap updates automatically.

---

### 2. Robots.txt (`/robots.txt`)
**File:** `src/app/robots.ts`

**What it does:**
- Tells search engines which pages to crawl
- Blocks API routes and internal Next.js files
- Points search engines to the sitemap

**No maintenance required** - this is a set-and-forget configuration.

---

### 3. Meta Tags (Title, Description, Keywords)
**Files:** `src/app/layout.tsx` and individual page layouts

**What it does:**
- Controls how your site appears in Google search results
- Each page has unique, keyword-optimized titles and descriptions
- Includes service areas: Greater Philadelphia, South Jersey, Central Jersey, Montgomery County, Bucks County, Delaware County

**Current page coverage:**

| Page | Title | Description | Status |
|------|-------|-------------|--------|
| Home | Russell Roofing & Exteriors - Roofing, Siding & More | Full service description | Complete |
| About | About Us - Expert Roofing Services | Company history | Complete |
| Services | Home Exterior Services | All services overview | Complete |
| Each Service | [Service Name] - Professional Services | Service-specific | Complete |
| Gallery | Project Gallery - Photos | Portfolio description | Complete |
| News | News & Articles - Tips & Advice | Blog overview | Complete |
| Contact | Contact Us - Get In Touch | Contact info | Complete |
| Estimate | Free Estimate - Get a Quote | CTA focused | Complete |
| Careers | Careers | Job opportunities | Complete |
| Community | Community Involvement | Giving back | Complete |

---

### 4. Structured Data (JSON-LD)
**File:** `src/components/StructuredData.tsx`

**What it does:**
- Provides rich information to Google about your business
- Can show star ratings, address, phone number in search results
- Includes LocalBusiness, Organization, and Website schemas

**Business information included:**
- Company name: Russell Roofing & Exteriors
- Address: 1200 Pennsylvania Ave, Oreland, PA 19075
- Phone: 1-888-567-7663
- Email: info@russellroofing.com
- Founded: 1992
- Service areas: Greater Philadelphia, South Jersey, Central Jersey, Montgomery County, Bucks County, Delaware County
- Services: Roofing, Siding, Gutters, Windows, Skylights, Masonry, Commercial, Historical Restoration

---

### 5. Open Graph Image (Social Sharing)
**File:** `src/app/opengraph-image.tsx`

**What it does:**
- Creates the image shown when your site is shared on Facebook, LinkedIn, Twitter
- Automatically generated with your branding (burgundy background, company name)
- Shows: Company name, services, service areas, contact info

---

## What YOU Need To Do (External Setup)

### 1. Google Analytics 4 (GA4) - Track Visitors

**Time required:** 10 minutes

**Steps:**
1. Go to [analytics.google.com](https://analytics.google.com)
2. Sign in with a Google account
3. Click "Admin" (gear icon at bottom left)
4. Click "Create Property"
5. Enter:
   - Property name: "Russell Roofing Website"
   - Reporting time zone: Eastern Time
   - Currency: USD
6. Click "Create"
7. Select "Web" for platform
8. Enter your website URL
9. Copy the **Measurement ID** (starts with `G-`)

**After you have the Measurement ID:**
- Add to Vercel environment variables as `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Let me know the ID and I'll add the tracking code

---

### 2. Google Search Console - Monitor Search Performance

**Time required:** 15 minutes

**Steps:**
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Sign in with a Google account
3. Click "Add property"
4. Select "URL prefix" option
5. Enter: `https://russellroofing.com` (or your actual domain)
6. Choose verification method:
   - **Recommended:** HTML tag (I can add this to the code)
   - Alternative: DNS TXT record (through your domain provider)
7. Complete verification

**After verification:**
1. Go to "Sitemaps" in left menu
2. Add sitemap URL: `sitemap.xml`
3. Click "Submit"

**If you choose HTML tag verification:**
- Copy the meta tag Google provides
- Send it to me and I'll add it to the website

---

## Ongoing Maintenance Schedule

### Weekly (5 minutes)
- [ ] Check Google Search Console for errors
  - Go to Search Console → "Pages" → Look for any errors
  - Fix any "Page with redirect" or "Not found (404)" errors

### Monthly (15 minutes)
- [ ] Review Search Console "Performance" report
  - Note top search queries
  - Identify queries with low click-through rate (opportunity to improve titles)
- [ ] Review Google Analytics traffic
  - Check which pages get most traffic
  - Note any traffic drops

### Quarterly (30 minutes)
- [ ] Review and refresh meta descriptions for underperforming pages
- [ ] Check that all blog posts are in sitemap
- [ ] Review competitors' search rankings

### Yearly
- [ ] Full SEO audit
- [ ] Review and update business information if changed
- [ ] Check for new SEO best practices

---

## How to Leverage the Data

### Google Search Console Insights

| What You See | What It Means | Action to Take |
|--------------|---------------|----------------|
| Queries with high impressions but low clicks | People see your site but don't click | Improve meta title/description |
| Position 4-10 queries | Close to page 1 | Create more content on these topics |
| Crawl errors | Google can't access pages | Fix broken links |
| Mobile usability issues | Site problems on phones | Contact developer to fix |

### Google Analytics Insights

| What You See | What It Means | Action to Take |
|--------------|---------------|----------------|
| High bounce rate on a page | People leave immediately | Improve page content |
| Traffic source breakdown | Where visitors come from | Invest more in top sources |
| Popular pages | What content people want | Create similar content |
| Low traffic pages | Content not being found | Improve SEO or remove page |

---

## HubSpot Blog Integration

Your HubSpot blogs are automatically:
- Displayed on the `/news` page
- Included in the sitemap
- Indexed by Google as part of your main site

**Best practices for blog posts:**
1. Use keywords in blog titles (e.g., "5 Signs You Need a Roof Replacement in Philadelphia")
2. Write 800+ words per post
3. Include internal links to service pages
4. Add images with descriptive alt text
5. Publish consistently (aim for 2-4 posts per month)

---

## Quick Reference: File Locations

| Feature | File Location |
|---------|---------------|
| Sitemap | `src/app/sitemap.ts` |
| Robots.txt | `src/app/robots.ts` |
| Main metadata | `src/app/layout.tsx` |
| Structured data | `src/components/StructuredData.tsx` |
| OG image | `src/app/opengraph-image.tsx` |
| News page metadata | `src/app/news/layout.tsx` |
| Gallery page metadata | `src/app/gallery/layout.tsx` |
| Estimate page metadata | `src/app/estimate/layout.tsx` |

---

## Environment Variables for SEO

Add these to your Vercel environment variables:

```
# Required for canonical URLs
NEXT_PUBLIC_SITE_URL=https://russellroofing.com

# Google Analytics (after setup)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Testing Your SEO

### Test Meta Tags
1. Go to [metatags.io](https://metatags.io)
2. Enter your page URL
3. See preview of how it appears in Google, Facebook, Twitter

### Test Structured Data
1. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your page URL
3. Check for any errors

### Test Page Speed
1. Go to [PageSpeed Insights](https://pagespeed.web.dev/)
2. Enter your page URL
3. Aim for 90+ on mobile and desktop

---

## Troubleshooting

### "Page not indexed" in Search Console
- Check robots.txt isn't blocking the page
- Ensure page has content (not empty)
- Request indexing manually in Search Console

### Social sharing image not showing
- Clear cache and try again
- Use Facebook Sharing Debugger to refresh
- Wait 24 hours for cache to update

### Sitemap not showing all pages
- Blog posts are fetched dynamically - may take time to populate
- Rebuild site to regenerate sitemap
- Check for API errors in build logs

---

## Need Help?

For any SEO-related changes or questions:
1. Check this documentation first
2. Review Google's official guidelines
3. Contact the developer for code changes

**Resources:**
- [Google Search Central](https://developers.google.com/search)
- [Google Analytics Help](https://support.google.com/analytics)
- [Search Console Help](https://support.google.com/webmasters)
