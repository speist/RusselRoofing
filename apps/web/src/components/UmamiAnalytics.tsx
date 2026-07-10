import Script from "next/script";

/**
 * Umami analytics tracking script (Story 8.3).
 *
 * Loaded FIRST-PARTY: the script is served from `/stats/script.js`, proxied to the
 * self-hosted Umami instance by the rewrites in `next.config.mjs`. First-party
 * serving dodges ad-blockers, so counts are more accurate. Umami is cookieless /
 * privacy-friendly, so this needs no cookie-consent gating.
 *
 * We do NOT set `data-host-url`, so the tracker posts events SAME-ORIGIN — to
 * whatever host the page is actually served from (www, apex, or a preview URL).
 * A hardcoded absolute host-url breaks when the site canonicalises apex -> www:
 * the cross-origin POST hits a 307 redirect that browsers refuse to follow. The
 * same-origin request lands on our own domain and is proxied to the Umami
 * collector. Whichever path the tracker uses — `/api/send`, `/stats/api/send`, or
 * `/analytics/api/send` — is covered by the rewrites in `next.config.mjs`.
 *
 * Entirely gated on `NEXT_PUBLIC_UMAMI_WEBSITE_ID`: when it's unset (the default),
 * this renders nothing and no analytics load. Set it (plus `UMAMI_URL` for the
 * rewrites) once the Umami instance is deployed. See `docs/analytics-umami.md`.
 */
export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return null;

  return (
    <Script
      src="/stats/script.js"
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
