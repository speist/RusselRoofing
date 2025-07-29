import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ServiceGallery from '../ServiceGallery';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe('ServiceGallery', () => {
  it('renders gallery with correct title', () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    expect(screen.getByText('Our Roofing Services Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Browse through our recent projects to see the quality of our workmanship')).toBeInTheDocument();
  });

  it('displays gallery images for roofing service', () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    expect(screen.getByAltText('Complete roof replacement in Westfield')).toBeInTheDocument();
    expect(screen.getByText('Complete Roof Replacement')).toBeInTheDocument();
    expect(screen.getByText('Westfield, NJ')).toBeInTheDocument();
  });

  it('displays gallery images for siding service', () => {
    render(<ServiceGallery serviceSlug="siding" serviceTitle="Siding Services" />);
    
    expect(screen.getByAltText('Colonial home siding renovation')).toBeInTheDocument();
    expect(screen.getByText('Colonial Home Renovation')).toBeInTheDocument();
    expect(screen.getByText('Princeton, NJ')).toBeInTheDocument();
  });

  it('opens lightbox when image is clicked', () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    const firstImage = screen.getByAltText('Complete roof replacement in Westfield');
    fireEvent.click(firstImage.parentElement!);
    
    // Check if lightbox is open (there should be 2 instances of the image)
    const images = screen.getAllByAltText('Complete roof replacement in Westfield');
    expect(images).toHaveLength(2); // One in grid, one in lightbox
  });

  it('closes lightbox when close button is clicked', () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    // Open lightbox
    const firstImage = screen.getByAltText('Complete roof replacement in Westfield');
    fireEvent.click(firstImage.parentElement!);
    
    // Close lightbox
    const closeButton = screen.getByLabelText('Close lightbox');
    fireEvent.click(closeButton);
    
    // Check if lightbox is closed (should only be 1 instance of the image)
    const images = screen.getAllByAltText('Complete roof replacement in Westfield');
    expect(images).toHaveLength(1);
  });

  it('closes lightbox when background is clicked', () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    // Open lightbox
    const firstImage = screen.getByAltText('Complete roof replacement in Westfield');
    fireEvent.click(firstImage.parentElement!);
    
    // Click on background (the overlay div)
    const images = screen.getAllByAltText('Complete roof replacement in Westfield');
    const overlay = images[1].closest('.fixed'); // Get the lightbox image's overlay
    fireEvent.click(overlay!);
    
    // Check if lightbox is closed
    const finalImages = screen.getAllByAltText('Complete roof replacement in Westfield');
    expect(finalImages).toHaveLength(1);
  });

  it('shows location and date in lightbox', () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    // Open lightbox
    const firstImage = screen.getByAltText('Complete roof replacement in Westfield');
    fireEvent.click(firstImage.parentElement!);
    
    // Check for location and date in lightbox
    const locations = screen.getAllByText('Westfield, NJ');
    expect(locations.length).toBeGreaterThan(1); // One in grid, one in lightbox
    
    const dates = screen.getAllByText('January 2024');
    expect(dates.length).toBeGreaterThan(0);
  });

  it('renders view more gallery link', () => {
    render(<ServiceGallery serviceSlug="roofing" serviceTitle="Roofing Services" />);
    
    const viewMoreLink = screen.getByText('View Full Gallery');
    expect(viewMoreLink).toBeInTheDocument();
    expect(viewMoreLink.closest('a')).toHaveAttribute('href', '/gallery');
  });

  it('returns null when no images are available', () => {
    const { container } = render(<ServiceGallery serviceSlug="unknown-service" serviceTitle="Unknown Service" />);
    
    expect(container.firstChild).toBeNull();
  });

  it('handles storm-damage service correctly', () => {
    render(<ServiceGallery serviceSlug="storm-damage" serviceTitle="Storm Damage Repair" />);
    
    // Storm damage should show roofing images
    expect(screen.getByAltText('Complete roof replacement in Westfield')).toBeInTheDocument();
  });
});