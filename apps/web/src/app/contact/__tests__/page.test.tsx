import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ContactPage from '../page';

// Mock the contact components since they have complex dependencies
vi.mock('@/components/contact/ContactForm', () => {
  return {
    ContactForm: () => <div data-testid="contact-form">Contact Form</div>
  };
});

vi.mock('@/components/contact/ContactInfo', () => {
  return {
    ContactInfo: () => <div data-testid="contact-info">Contact Info</div>,
    BusinessHours: () => <div data-testid="business-hours">Business Hours</div>
  };
});

vi.mock('@/components/contact/ServiceAreaMap', () => {
  return {
    ServiceAreaMap: () => <div data-testid="service-area-map">Service Area Map</div>
  };
});

describe('ContactPage', () => {
  it('renders the contact page with all main sections', () => {
    render(<ContactPage />);
    
    // Check for main heading
    expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument();
    
    // Check for hero section content
    expect(screen.getByText(/ready to start your roofing project/i)).toBeInTheDocument();
    
    // Check for main sections
    expect(screen.getByRole('heading', { name: /send us a message/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /contact information/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /our service area/i })).toBeInTheDocument();
    
    // Check for mocked components
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('contact-info')).toBeInTheDocument();
    expect(screen.getByTestId('business-hours')).toBeInTheDocument();
    expect(screen.getByTestId('service-area-map')).toBeInTheDocument();
  });

  it('renders contact method icons in hero section', () => {
    render(<ContactPage />);
    
    // Check for contact method descriptions
    expect(screen.getByText(/call us/i)).toBeInTheDocument();
    expect(screen.getByText(/email us/i)).toBeInTheDocument();
    expect(screen.getByText(/visit us/i)).toBeInTheDocument();
    
    // Check for availability descriptions
    expect(screen.getByText(/available 24\/7 for emergencies/i)).toBeInTheDocument();
    expect(screen.getByText(/get a response within 24 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/see our work in your area/i)).toBeInTheDocument();
  });

  it('has correct page structure and styling', () => {
    render(<ContactPage />);
    
    // Check for main container
    const main = screen.getByRole('main');
    expect(main).toHaveClass('pb-16');
    
    // Check for gradient hero section
    const heroSection = screen.getByText(/get in touch/i).closest('section');
    expect(heroSection).toHaveClass('bg-gradient-to-r', 'from-[#960120]', 'to-[#7a0118]');
  });
});