import React from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://russellroofing.com'

// Company information
const companyInfo = {
  name: 'Russell Roofing & Exteriors',
  legalName: 'Russell Roofing & Exteriors',
  description: 'Professional roofing, siding, gutters, windows, skylights, masonry, and exterior services serving Greater Philadelphia, South Jersey, Central Jersey, Montgomery County, Bucks County, and Delaware County since 1992.',
  foundingDate: '1992',
  address: {
    streetAddress: '1200 Pennsylvania Ave',
    addressLocality: 'Oreland',
    addressRegion: 'PA',
    postalCode: '19075',
    addressCountry: 'US',
  },
  telephone: '1-888-567-7663',
  email: 'info@russellroofing.com',
  url: BASE_URL,
  logo: `${BASE_URL}/rrlogo-white.svg`,
  image: `${BASE_URL}/images/og-image.png`,
  sameAs: [
    'https://www.facebook.com/RussellRoofing',
    'https://twitter.com/russellroofing',
    'https://www.linkedin.com/company/russell-roofing',
    'https://www.instagram.com/russellroofingcompany/',
  ],
  serviceArea: [
    'Greater Philadelphia Area',
    'South Jersey',
    'Central Jersey',
    'Montgomery County, PA',
    'Bucks County, PA',
    'Delaware County, PA',
  ],
  services: [
    'Roofing',
    'Roof Repair',
    'Roof Replacement',
    'Siding Installation',
    'Gutter Services',
    'Commercial Roofing',
    'Church & Institutional Roofing',
    'Historical Restoration',
    'Masonry',
    'Window Installation',
    'Skylight Installation',
  ],
}

// LocalBusiness Schema
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    '@id': `${BASE_URL}/#organization`,
    name: companyInfo.name,
    legalName: companyInfo.legalName,
    description: companyInfo.description,
    url: companyInfo.url,
    logo: companyInfo.logo,
    image: companyInfo.image,
    telephone: companyInfo.telephone,
    email: companyInfo.email,
    foundingDate: companyInfo.foundingDate,
    address: {
      '@type': 'PostalAddress',
      ...companyInfo.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.1167,
      longitude: -75.1833,
    },
    areaServed: companyInfo.serviceArea.map((area) => ({
      '@type': 'Place',
      name: area,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Exterior Services',
      itemListElement: companyInfo.services.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
        position: index + 1,
      })),
    },
    sameAs: companyInfo.sameAs,
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Organization Schema
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: companyInfo.name,
    url: companyInfo.url,
    logo: {
      '@type': 'ImageObject',
      url: companyInfo.logo,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: companyInfo.telephone,
      contactType: 'customer service',
      email: companyInfo.email,
      areaServed: 'US',
      availableLanguage: 'English',
    },
    sameAs: companyInfo.sameAs,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// WebSite Schema with SearchAction
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: companyInfo.name,
    url: companyInfo.url,
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Service Schema for service pages
interface ServiceSchemaProps {
  name: string
  description: string
  image?: string
  url: string
}

export function ServiceSchema({ name, description, image, url }: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'RoofingContractor',
      '@id': `${BASE_URL}/#organization`,
    },
    areaServed: companyInfo.serviceArea.map((area) => ({
      '@type': 'Place',
      name: area,
    })),
    ...(image && { image }),
    url,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Article Schema for blog posts
interface ArticleSchemaProps {
  title: string
  description: string
  image?: string
  url: string
  datePublished: string
  dateModified?: string
  authorName?: string
}

export function ArticleSchema({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  authorName = 'Russell Roofing',
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    ...(image && { image }),
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: companyInfo.name,
      logo: {
        '@type': 'ImageObject',
        url: companyInfo.logo,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Combined schema component for the main layout
export function MainStructuredData() {
  return (
    <>
      <LocalBusinessSchema />
      <OrganizationSchema />
      <WebSiteSchema />
    </>
  )
}
