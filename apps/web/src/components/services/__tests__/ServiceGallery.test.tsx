import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ServiceGallery from '../ServiceGallery';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

// Mock IntersectionObserver for LazyImage, which is used by gallery images
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn((element) => {
    if (element) {
      callback([{ isIntersecting: true, target: element }]);
    }
  }),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('ServiceGallery', () => {
  it('renders gallery with correct title', async () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    expect(await screen.findByText('Our Roofing Services Portfolio')).toBeInTheDocument();
    expect(await screen.findByText('Browse through our recent projects to see the quality of our workmanship')).toBeInTheDocument();
  });

  it('displays gallery images for roofing service', async () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    expect(await screen.findByAltText('Complete roof replacement in Westfield')).toBeInTheDocument();
    expect(await screen.findByText('Complete Roof Replacement')).toBeInTheDocument();
    expect(await screen.findByText('Westfield, NJ')).toBeInTheDocument();
  });

  it('displays gallery images for siding service', async () => {
    render(<ServiceGallery serviceSlug="siding" serviceTitle="Siding Services" />);
    
    expect(await screen.findByAltText('Colonial home siding renovation')).toBeInTheDocument();
    expect(await screen.findByText('Colonial Home Renovation')).toBeInTheDocument();
    expect(await screen.findByText('Princeton, NJ')).toBeInTheDocument();
  });

  it('opens lightbox when image is clicked', async () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    const firstImage = await screen.findByAltText('Complete roof replacement in Westfield');
    fireEvent.click(firstImage.parentElement!);
    
    // Check if lightbox is open (there should be 2 instances of the image)
    const images = await screen.findAllByAltText('Complete roof replacement in Westfield');
    expect(images).toHaveLength(2); // One in grid, one in lightbox
  });

  it('closes lightbox when close button is clicked', async () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    // Open lightbox
    const firstImage = await screen.findByAltText('Complete roof replacement in Westfield');
    fireEvent.click(firstImage.parentElement!);
    
    // Wait for lightbox to open and get close button
    const closeButton = await screen.findByLabelText('Close lightbox');
    fireEvent.click(closeButton);
    
    // Check if lightbox is closed
    await waitFor(() => {
      const images = screen.getAllByAltText('Complete roof replacement in Westfield');
      expect(images).toHaveLength(1);
    });
  });

  it('closes lightbox when background is clicked', async () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    // Open lightbox
    const firstImage = await screen.findByAltText('Complete roof replacement in Westfield');
    fireEvent.click(firstImage.parentElement!);
    
    // Wait for the lightbox to appear and get the overlay
    const closeButton = await screen.findByLabelText('Close lightbox');
    const overlay = closeButton.closest('[class*="fixed inset-0"]');
    fireEvent.click(overlay);
    
    // Check if lightbox is closed
    await waitFor(() => {
      expect(screen.queryByLabelText('Close lightbox')).not.toBeInTheDocument();
    });
  });

  it('shows location and date in lightbox', async () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    // Open lightbox
    const firstImage = await screen.findByAltText('Complete roof replacement in Westfield');
    fireEvent.click(firstImage.parentElement!);
    
    // Check for location and date within the lightbox
    const closeButton = await screen.findByLabelText('Close lightbox');
    const lightbox = closeButton.closest('[class*="fixed inset-0"]');
    expect(within(lightbox).getByText('Westfield, NJ')).toBeInTheDocument();
    expect(within(lightbox).getByText('January 2024')).toBeInTheDocument();
  });

  it('renders view more gallery link', async () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    const viewMoreLink = await screen.findByText('View Full Gallery');
    expect(viewMoreLink).toBeInTheDocument();
    expect(viewMoreLink.closest('a')).toHaveAttribute('href', '/gallery');
  });

  it('returns null when no images are available', async () => {
    const { container } = render(<ServiceGallery serviceSlug="unknown-service" serviceTitle="Unknown Service" />);
    
    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });

  it('handles storm-damage service correctly', async () => {
    render(<ServiceGallery serviceSlug="storm-damage" serviceTitle="Storm Damage Repair" />);
    
    // Storm damage should show roofing images
    expect(await screen.findByAltText('Complete roof replacement in Westfield')).toBeInTheDocument();
  });
});