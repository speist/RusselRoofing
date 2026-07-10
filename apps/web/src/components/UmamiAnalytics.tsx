import Script from "next/script";

/**
 * Umami analytics tracking script (Story 8.3).
 *
 * Loaded FIRST-PARTY: the script is served from `/stats/script.js` and events are
 * sent to `/stats/api/send`, both proxied to the self-hosted Umami instance by the
 * rewrites in `next.config.mjs`. First-party serving dodges ad-blockers, so counts
 * are more accurate. Umami is cookieless / privacy-friendly, so this needs no
 * cookie-consent gating.
 *
 * Entirely gated on `NEXT_PUBLIC_UMAMI_WEBSITE_ID`: when it's unset (the default),
 * this renders nothing and no analytics load. Set it (plus `UMAMI_URL` for the
 * rewrites) once the Umami instance is deployed. See `docs/analytics-umami.md`.
 */
export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return null;

  // Where the tracker POSTs events. Points at the first-party proxy base so events
  // hit `/stats/api/send` on this domain (then rewritten to the Umami collector).
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://russellroofing.com"
  ).replace(/\/$/, "");

  return (
    <Script
      src="/stats/script.js"
      data-website-id={websiteId}
      data-host-url={`${siteUrl}/stats`}
      strategy="afterInteractive"
    />
  );
}
