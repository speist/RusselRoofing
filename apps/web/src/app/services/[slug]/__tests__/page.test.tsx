import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { notFound } from 'next/navigation';
import ServiceDetailPage, { generateStaticParams, generateMetadata } from '../page';
import { services } from '@/data/services';
import { getServiceDetailsBySlug } from '@/data/service-details';

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
    const roofingServiceDetail = getServiceDetailsBySlug('roofing')!;

    render(<ServiceDetailPage params={mockParams} />);

    // Check if the service title is rendered in the breadcrumb
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(within(nav).getByText(roofingService.title)).toBeInTheDocument();
    
    // Check if the service overview is rendered
    expect(screen.getByText(roofingServiceDetail.overview)).toBeInTheDocument();
    
    // Check if features are rendered
    roofingServiceDetail.featureDetails.forEach(feature => {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
    });
    
    // Check if CTAs are present
    expect(screen.getAllByText('Get Free Estimate').length).toBeGreaterThan(0);
    
    // Check if breadcrumb navigation is present
    expect(within(nav).getByText('Home')).toBeInTheDocument();
    expect(within(nav).getByText('Services')).toBeInTheDocument();
  });

  it('calls notFound() for invalid slug', () => {
    const mockParams = { slug: 'invalid-service' };

    expect(() => {
      render(<ServiceDetailPage params={mockParams} />);
    }).toThrow('NEXT_NOT_FOUND');

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

});