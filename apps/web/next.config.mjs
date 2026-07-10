// Note: Environment validation is handled in the app itself to avoid build issues

// Security headers for production deployment
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: '*.hubspotusercontent-na1.net',
      },
      {
        protocol: 'https',
        hostname: '50177320.fs1.hubspotusercontent-na1.net',
      },
      {
        protocol: 'https',
        hostname: '*.hubspotusercontent.net',
      },
      {
        protocol: 'https',
        hostname: '*.hs-sites.com',
      },
      {
        protocol: 'https',
        hostname: '*.hubspot.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'vumbnail.com',
      },
      // CompanyCam CDN for gallery images
      {
        protocol: 'https',
        hostname: '*.companycam.com',
      },
      {
        protocol: 'https',
        hostname: 'photos.companycam.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      // Instagram CDN for social media feed images
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '*.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent-*.cdninstagram.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  // Umami analytics (Story 8.3). Self-hosted Umami runs as its OWN Vercel project;
  // we proxy it first-party from this domain so the tracking script + collector dodge
  // ad-blockers, and the dashboard is reachable at /analytics. Entirely gated on
  // UMAMI_URL — unset (the default) means these rewrites are omitted and nothing changes.
  // The Umami project MUST be deployed with BASE_PATH=/analytics for the dashboard
  // asset paths to resolve under /analytics (see docs/analytics-umami.md).
  async rewrites() {
    const umami = (process.env.UMAMI_URL || '').replace(/\/$/, '');
    if (!umami) return [];
    return [
      // First-party tracking proxy (script + event collector). Umami runs with
      // BASE_PATH=/analytics, so its script + collector live under /analytics too.
      { source: '/stats/script.js', destination: `${umami}/analytics/script.js` },
      { source: '/stats/api/send', destination: `${umami}/analytics/api/send` },
      // Private dashboard (same BASE_PATH=/analytics deploy).
      { source: '/analytics', destination: `${umami}/analytics` },
      { source: '/analytics/:path*', destination: `${umami}/analytics/:path*` },
    ];
  },
};

export default nextConfig;
