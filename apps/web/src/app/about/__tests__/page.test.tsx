import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AboutPage from '../page';

// Mock the about components
vi.mock('@/components/about/AboutHero', () => ({
  default: () => <div data-testid="about-hero">About Hero Component</div>
}));

vi.mock('@/components/about/CompanyHistory', () => ({
  default: () => <div data-testid="company-history">Company History Component</div>
}));

vi.mock('@/components/about/TeamSection', () => ({
  default: () => <div data-testid="team-section">Team Section Component</div>
}));

vi.mock('@/components/about/ValuesSection', () => ({
  default: () => <div data-testid="values-section">Values Section Component</div>
}));

vi.mock('@/components/about/CertificationsSection', () => ({
  default: () => <div data-testid="certifications-section">Certifications Section Component</div>
}));

vi.mock('@/components/about/CommunitySection', () => ({
  default: () => <div data-testid="community-section">Community Section Component</div>
}));

describe('About Page', () => {
  it('renders all about page sections correctly', () => {
    render(<AboutPage />);

    // Check that all main sections are rendered
    expect(screen.getByTestId('about-hero')).toBeInTheDocument();
    expect(screen.getByTestId('company-history')).toBeInTheDocument();
    expect(screen.getByTestId('team-section')).toBeInTheDocument();
    expect(screen.getByTestId('values-section')).toBeInTheDocument();
    expect(screen.getByTestId('certifications-section')).toBeInTheDocument();
    expect(screen.getByTestId('community-section')).toBeInTheDocument();
  });

  it('has the correct page structure and layout', () => {
    const { container } = render(<AboutPage />);
    
    // Check for correct background color (light grey)
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-light-grey');
    
    // Check for main content container
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveClass('pt-16');
  });

  it('renders sections in the correct order', () => {
    render(<AboutPage />);

    const main = screen.getByRole('main');
    const children = Array.from(main.children);

    expect(children[0]).toHaveAttribute('data-testid', 'about-hero');
    expect(children[1]).toHaveAttribute('data-testid', 'company-history');
    expect(children[2]).toHaveAttribute('data-testid', 'team-section');
    expect(children[3]).toHaveAttribute('data-testid', 'values-section');
    expect(children[4]).toHaveAttribute('data-testid', 'certifications-section');
    expect(children[5]).toHaveAttribute('data-testid', 'community-section');
  });
});