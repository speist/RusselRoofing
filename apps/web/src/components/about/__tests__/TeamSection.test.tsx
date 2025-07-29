import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TeamSection from '../TeamSection';

// Mock the about data
vi.mock('@/data/about', () => ({
  companyInfo: {
    team: [
      {
        id: 'test-1',
        name: 'John Smith',
        title: 'CEO',
        bio: 'Experienced leader with 20+ years in roofing.',
        experience: '20+ years in roofing',
        certifications: ['GAF Master Elite', 'OSHA Certified'],
        image: '/images/team/john-smith.jpg.placeholder',
        email: 'john@russellroofing.com',
        phone: '(555) 123-4567',
        specialties: ['Residential Roofing', 'Business Development']
      },
      {
        id: 'test-2',
        name: 'Jane Doe',
        title: 'Operations Manager',
        bio: 'Project management expert ensuring quality.',
        experience: '15+ years in construction',
        certifications: ['PMP Certified'],
        image: '/images/team/jane-doe.jpg.placeholder',
        specialties: ['Project Management', 'Quality Control']
      }
    ]
  }
}));

describe('TeamSection Component', () => {
  it('renders section header correctly', () => {
    render(<TeamSection />);

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Meet Our')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText(/Our experienced professionals are dedicated/)).toBeInTheDocument();
  });

  it('renders all team members', () => {
    render(<TeamSection />);

    // Check that both team members are rendered
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('CEO')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Operations Manager')).toBeInTheDocument();
  });

  it('displays team member details correctly', () => {
    render(<TeamSection />);

    // Check John Smith details
    expect(screen.getByText('Experienced leader with 20+ years in roofing.')).toBeInTheDocument();
    expect(screen.getByText('20+ years in roofing')).toBeInTheDocument();
    expect(screen.getByText('GAF Master Elite')).toBeInTheDocument();
    expect(screen.getByText('OSHA Certified')).toBeInTheDocument();

    // Check contact information
    expect(screen.getByText('john@russellroofing.com')).toBeInTheDocument();
    expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();

    // Check specialties
    expect(screen.getByText('Residential Roofing')).toBeInTheDocument();
    expect(screen.getByText('Business Development')).toBeInTheDocument();
  });

  it('renders team member images with correct attributes', () => {
    render(<TeamSection />);

    const johnImage = screen.getByAltText('John Smith - CEO');
    expect(johnImage).toBeInTheDocument();
    expect(johnImage).toHaveAttribute('src', '/images/team/john-smith.jpg.placeholder');

    const janeImage = screen.getByAltText('Jane Doe - Operations Manager');
    expect(janeImage).toBeInTheDocument();
    expect(janeImage).toHaveAttribute('src', '/images/team/jane-doe.jpg.placeholder');
  });

  it('includes proper contact links', () => {
    render(<TeamSection />);

    const emailLink = screen.getByRole('link', { name: 'john@russellroofing.com' });
    expect(emailLink).toHaveAttribute('href', 'mailto:john@russellroofing.com');

    const phoneLink = screen.getByRole('link', { name: '(555) 123-4567' });
    expect(phoneLink).toHaveAttribute('href', 'tel:(555) 123-4567');
  });

  it('displays call-to-action section', () => {
    render(<TeamSection />);

    expect(screen.getByText('Ready to Work with Our Team?')).toBeInTheDocument();
    expect(screen.getByText(/Get in touch today to schedule your free consultation/)).toBeInTheDocument();

    // Check CTA buttons
    const estimateButton = screen.getByRole('link', { name: 'Get Free Estimate' });
    expect(estimateButton).toHaveAttribute('href', '/estimate');

    const contactButton = screen.getByRole('link', { name: 'Contact Us' });
    expect(contactButton).toHaveAttribute('href', '/contact');
  });

  it('has proper grid layout classes', () => {
    const { container } = render(<TeamSection />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-2', 'xl:grid-cols-2', 'gap-8');
  });

  it('handles team members without contact info', () => {
    render(<TeamSection />);

    // Jane Doe doesn't have email/phone in mock data
    // Should still render properly without contact section
    const janeCard = screen.getByText('Jane Doe').closest('.bg-white');
    expect(janeCard).toBeInTheDocument();
  });

  it('renders specialties as badges', () => {
    render(<TeamSection />);

    const specialty = screen.getByText('Project Management');
    expect(specialty).toHaveClass('bg-gray-100', 'text-gray-700', 'px-2', 'py-1', 'rounded-full', 'text-xs');
  });
});