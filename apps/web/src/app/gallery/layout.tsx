import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Gallery - Roofing, Siding & Exterior Work Photos',
  description: 'Browse our portfolio of completed roofing, siding, window, masonry and exterior projects in Greater Philadelphia, South Jersey, Montgomery, Bucks & Delaware Counties.',
  keywords: [
    'roofing project photos',
    'siding installation gallery',
    'exterior renovation portfolio',
    'before and after roofing',
    'Philadelphia roofing projects',
    'home improvement gallery',
  ],
  openGraph: {
    title: 'Project Gallery - Russell Roofing & Exteriors',
    description: 'Explore our portfolio of completed roofing, siding, and home improvement projects showcasing quality craftsmanship.',
    type: 'website',
  },
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
