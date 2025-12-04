import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://russellroofing.com'

// Static pages with their priorities and change frequencies
const staticPages = [
  { path: '', priority: 1.0, changeFreq: 'weekly' as const },
  { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
  { path: '/services', priority: 0.9, changeFreq: 'monthly' as const },
  { path: '/gallery', priority: 0.7, changeFreq: 'weekly' as const },
  { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
  { path: '/estimate', priority: 0.9, changeFreq: 'monthly' as const },
  { path: '/news', priority: 0.7, changeFreq: 'daily' as const },
  { path: '/careers', priority: 0.6, changeFreq: 'weekly' as const },
  { path: '/community', priority: 0.6, changeFreq: 'monthly' as const },
  { path: '/privacy-policy', priority: 0.3, changeFreq: 'yearly' as const },
]

// Service pages
const servicePages = [
  'roofing',
  'siding-and-gutters',
  'commercial',
  'churches-and-institutions',
  'historical-restorations',
  'masonry',
  'windows',
  'skylights',
]

// Service area pages
const serviceAreaPages = [
  'greater-philadelphia',
  'montgomery-county',
  'bucks-county',
  'delaware-county',
  'south-jersey',
  'central-jersey',
]

// Fetch blog posts from HubSpot API for dynamic sitemap
async function getBlogPosts(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/hubspot/blog?limit=100`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.warn('Failed to fetch blog posts for sitemap')
      return []
    }

    const data = await response.json()

    if (data.success && data.data?.results) {
      return data.data.results.map((post: { slug: string; updated?: string; publishDate?: string }) => ({
        slug: post.slug,
        updatedAt: post.updated || post.publishDate || new Date().toISOString(),
      }))
    }

    return []
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString()

  // Static pages
  const staticUrls: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: currentDate,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }))

  // Service pages
  const serviceUrls: MetadataRoute.Sitemap = servicePages.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Service area pages
  const serviceAreaUrls: MetadataRoute.Sitemap = [
    // Service areas index page
    {
      url: `${BASE_URL}/service-areas`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    // Individual service area pages
    ...serviceAreaPages.map((slug) => ({
      url: `${BASE_URL}/service-areas/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  // Blog posts from HubSpot
  const blogPosts = await getBlogPosts()
  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/news/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticUrls, ...serviceUrls, ...serviceAreaUrls, ...blogUrls]
}
