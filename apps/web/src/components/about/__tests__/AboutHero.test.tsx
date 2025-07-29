import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AboutHero from '../AboutHero';

// Mock the about data
vi.mock('@/data/about', () => ({
  companyInfo: {
    foundedYear: 2015,
    companyStory: 'Test company story about Russell Roofing providing quality services.',
    missionStatement: 'Test mission statement for Russell Roofing excellence.',
    team: [
      { id: '1', name: 'John Doe', title: 'CEO' },
      { id: '2', name: 'Jane Smith', title: 'Manager' }
    ]
  }
}));

describe('AboutHero Component', () => {
  beforeEach(() => {
    // Mock the current year to be consistent
    vi.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2024);
  });

  it('renders the hero section with correct content', () => {
    render(<AboutHero />);

    // Check main heading
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Russell Roofing')).toBeInTheDocument();

    // Check company story
    expect(screen.getByText(/Test company story about Russell Roofing/)).toBeInTheDocument();

    // Check mission statement
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText(/Test mission statement for Russell Roofing/)).toBeInTheDocument();
  });

  it('displays correct statistics', () => {
    render(<AboutHero />);

    // Years in business (2024 - 2015 = 9)
    expect(screen.getByText('9+')).toBeInTheDocument();
    expect(screen.getByText('Years of Experience')).toBeInTheDocument();

    // Team members count
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Expert Team Members')).toBeInTheDocument();

    // Homes protected
    expect(screen.getByText('1000+')).toBeInTheDocument();
    expect(screen.getByText('Homes Protected')).toBeInTheDocument();
  });

  it('has proper styling and layout classes', () => {
    const { container } = render(<AboutHero />);
    
    // Check main section styling
    const section = container.firstChild as HTMLElement;
    expect(section).toHaveClass('relative', 'bg-white', 'py-16', 'md:py-24');

    // Check for responsive grid
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('lg:grid-cols-2', 'gap-12', 'items-center');
  });

  it('includes hero image with proper attributes', () => {
    render(<AboutHero />);

    const heroImage = screen.getByAltText('Russell Roofing team and facility');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', '/images/about/company-hero.jpg.placeholder');
    expect(heroImage).toHaveClass('w-full', 'h-full', 'object-cover');
  });

  it('includes GAF Master Elite certification badge', () => {
    render(<AboutHero />);

    const certBadge = screen.getByAltText('GAF Master Elite Contractor');
    expect(certBadge).toBeInTheDocument();
    expect(certBadge).toHaveAttribute('src', '/images/certifications/gaf-master-elite.jpg.placeholder');

    expect(screen.getByText('GAF Master Elite')).toBeInTheDocument();
    expect(screen.getByText('Top 3% of Contractors')).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<AboutHero />);

    // Check for section element
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });
});