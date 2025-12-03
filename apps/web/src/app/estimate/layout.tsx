import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Estimate - Get a Quote for Roofing & Exterior Services',
  description: 'Request a free estimate for roofing, siding, gutters, windows, skylights, and masonry services. Serving Greater Philadelphia, South Jersey, Montgomery, Bucks & Delaware Counties.',
  keywords: [
    'free roofing estimate',
    'roof replacement quote',
    'siding installation estimate',
    'exterior services quote',
    'Philadelphia roofing estimate',
    'home improvement quote',
  ],
  openGraph: {
    title: 'Get a Free Estimate - Russell Roofing & Exteriors',
    description: 'Request a free, no-obligation estimate for your roofing, siding, or exterior project. Fast response guaranteed!',
    type: 'website',
  },
}

export default function EstimateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
