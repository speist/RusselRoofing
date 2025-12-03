import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Articles - Roofing Tips, Industry Insights & Expert Advice',
  description: 'Stay informed with the latest roofing industry insights, maintenance tips, and expert advice from Russell Roofing. Learn about home improvement, roof care, and exterior services.',
  keywords: [
    'roofing tips',
    'home improvement advice',
    'roof maintenance',
    'roofing industry news',
    'exterior home care',
    'Philadelphia roofing blog',
  ],
  openGraph: {
    title: 'News & Articles - Russell Roofing & Exteriors',
    description: 'Expert roofing tips, industry insights, and home improvement advice from our experienced team.',
    type: 'website',
  },
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
