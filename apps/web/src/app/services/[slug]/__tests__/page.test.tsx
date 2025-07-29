import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import ServiceDetailPage, { generateStaticParams, generateMetadata } from '../page';
import { services } from '@/data/services';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('ServiceDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders service page correctly for valid slug', () => {
    const mockParams = { slug: 'roofing' };
    const roofingService = services.find(s => s.slug === 'roofing')!;

    render(<ServiceDetailPage params={mockParams} />);

    // Check if the service title is rendered
    expect(screen.getByText(roofingService.title)).toBeInTheDocument();
    
    // Check if the service description is rendered
    expect(screen.getByText(roofingService.description)).toBeInTheDocument();
    
    // Check if the service category is rendered
    expect(screen.getByText(roofingService.category)).toBeInTheDocument();
    
    // Check if features are rendered
    roofingService.features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
    
    // Check if CTAs are present
    expect(screen.getAllByText('Get Free Estimate')).toHaveLength(2);
    expect(screen.getByText('View Our Work')).toBeInTheDocument();
    
    // Check if breadcrumb navigation is present
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
  });

  it('calls notFound() for invalid slug', () => {
    const mockParams = { slug: 'invalid-service' };

    expect(() => {
      render(<ServiceDetailPage params={mockParams} />);
    }).toThrow();

    expect(notFound).toHaveBeenCalled();
  });

  it('generates static params for all services', async () => {
    const staticParams = await generateStaticParams();
    
    expect(staticParams).toHaveLength(services.length);
    expect(staticParams).toEqual(
      services.map(service => ({ slug: service.slug }))
    );
  });

  it('generates metadata correctly for valid service', async () => {
    const mockParams = { slug: 'roofing' };
    const roofingService = services.find(s => s.slug === 'roofing')!;

    const metadata = await generateMetadata({ params: mockParams });

    expect(metadata.title).toBe(`${roofingService.title} | Russell Roofing - Professional ${roofingService.category} Services`);
    expect(metadata.description).toBe(roofingService.description);
    expect(metadata.keywords).toBe(`${roofingService.title.toLowerCase()}, ${roofingService.category.toLowerCase()}, ${roofingService.features.join(', ').toLowerCase()}, Russell Roofing`);
  });

  it('generates not found metadata for invalid service', async () => {
    const mockParams = { slug: 'invalid-service' };

    const metadata = await generateMetadata({ params: mockParams });

    expect(metadata.title).toBe('Service Not Found | Russell Roofing');
    expect(metadata.description).toBe('The service you\'re looking for could not be found.');
  });

  it('displays popular service badge when applicable', () => {
    const mockParams = { slug: 'roofing' };
    
    render(<ServiceDetailPage params={mockParams} />);
    
    expect(screen.getByText('Popular Service')).toBeInTheDocument();
  });

  it('does not display popular service badge for non-popular services', () => {
    const mockParams = { slug: 'gutters' };
    
    render(<ServiceDetailPage params={mockParams} />);
    
    expect(screen.queryByText('Popular Service')).not.toBeInTheDocument();
  });
});