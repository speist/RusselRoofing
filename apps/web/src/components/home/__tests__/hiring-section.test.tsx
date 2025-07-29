import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HiringSection } from '../hiring-section';

// Mock window.location.href
Object.defineProperty(window, 'location', {
  value: {
    href: ''
  },
  writable: true
});

describe('HiringSection', () => {
  it('renders the hiring section with correct heading', () => {
    render(<HiringSection />);
    
    expect(screen.getByText(/We.*re Hiring!/)).toBeDefined();
  });

  it('displays all three job positions', () => {
    render(<HiringSection />);
    
    expect(screen.getByText('FOREMAN')).toBeDefined();
    expect(screen.getByText('SUPERINTENDENT')).toBeDefined();
    expect(screen.getByText('ROOFING LABORER')).toBeDefined();
  });

  it('displays introductory text about joining the team', () => {
    render(<HiringSection />);
    
    expect(screen.getByText(/Join the Russell Roofing team/)).toBeDefined();
    expect(screen.getByText(/We.*re looking for dedicated professionals/)).toBeDefined();
  });

  it('displays the email contact prominently', () => {
    render(<HiringSection />);
    
    expect(screen.getByText('info@russellroofing.com')).toBeDefined();
  });

  it('has apply buttons for each position', () => {
    render(<HiringSection />);
    
    const applyButtons = screen.getAllByText('Apply Now');
    expect(applyButtons).toHaveLength(3);
  });

  it('has a main email us button', () => {
    render(<HiringSection />);
    
    expect(screen.getByText('Email Us')).toBeDefined();
  });

  it('creates mailto links when apply buttons are clicked', () => {
    render(<HiringSection />);
    
    const foremanApplyButton = screen.getAllByText('Apply Now')[0];
    fireEvent.click(foremanApplyButton);
    
    expect(window.location.href).toContain('mailto:info@russellroofing.com');
    expect(window.location.href).toContain('subject=Job Application: FOREMAN');
  });

  it('displays call-to-action section', () => {
    render(<HiringSection />);
    
    expect(screen.getByText('Ready to Apply?')).toBeDefined();
    expect(screen.getByText(/Send us your resume/)).toBeDefined();
  });

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<HiringSection />);
    
    const section = container.querySelector('section');
    expect(section?.className).toContain('bg-background-light');
  });
});