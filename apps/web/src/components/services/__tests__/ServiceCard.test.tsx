import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ServiceCard } from '../ServiceCard';
import { Service } from '@/data/services';

// Mock Next.js Link component
vi.mock('next/link', () => {
  return {
    default: function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
      return <a href={href}>{children}</a>;
    }
  };
});

// Mock Next.js Image component
vi.mock('next/image', () => {
  return {
    default: function MockImage({ src, alt, fill, className, sizes }: any) {
      return <img src={src} alt={alt} className={className} data-fill={fill} data-sizes={sizes} />;
    }
  };
});

const mockService: Service = {
  id: '1',
  slug: 'roofing',
  title: 'Roofing Services',
  shortDescription: 'Complete roof installations, repairs, and maintenance',
  description: 'Professional roofing services including new installations, repairs, and preventive maintenance.',
  icon: '/images/icons/roofing.svg',
  image: '/images/gallery/roofing/full/roofing-complete-replacement-westfield-2024-01-15.jpg',
  features: ['New Installations', 'Roof Repairs', 'Preventive Maintenance', 'Emergency Services'],
  category: 'Roofing',
  popular: true
};

const mockServiceNonPopular: Service = {
  ...mockService,
  id: '2',
  slug: 'gutters',
  title: 'Gutter Services',
  shortDescription: 'Gutter installation, cleaning, and maintenance',
  popular: false
};

describe('ServiceCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders service card with all required content', () => {
    render(<ServiceCard service={mockService} />);
    
    // Should show service title and description
    expect(screen.getByText('Roofing Services')).toBeInTheDocument();
    expect(screen.getByText('Complete roof installations, repairs, and maintenance')).toBeInTheDocument();
    
    // Should show service image with proper alt text
    expect(screen.getByAltText('Roofing Services')).toBeInTheDocument();
    
    // Should show service icon
    expect(screen.getByAltText('Roofing Services icon')).toBeInTheDocument();
    
    // Should show key features
    expect(screen.getByText('Key Features:')).toBeInTheDocument();
    expect(screen.getByText('New Installations')).toBeInTheDocument();
    expect(screen.getByText('Roof Repairs')).toBeInTheDocument();
    expect(screen.getByText('Preventive Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Emergency Services')).toBeInTheDocument();
    
    // Should show "Learn More" link
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  test('displays popular badge for popular services', () => {
    render(<ServiceCard service={mockService} />);
    
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  test('does not display popular badge for non-popular services', () => {
    render(<ServiceCard service={mockServiceNonPopular} />);
    
    expect(screen.queryByText('Popular')).not.toBeInTheDocument();
  });

  test('links to correct service detail page', () => {
    render(<ServiceCard service={mockService} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/services/roofing');
  });

  test('limits features to first 4 items', () => {
    const serviceWithManyFeatures: Service = {
      ...mockService,
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5', 'Feature 6']
    };
    
    render(<ServiceCard service={serviceWithManyFeatures} />);
    
    // Should show first 4 features
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
    expect(screen.getByText('Feature 4')).toBeInTheDocument();
    
    // Should not show features beyond 4
    expect(screen.queryByText('Feature 5')).not.toBeInTheDocument();
    expect(screen.queryByText('Feature 6')).not.toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(<ServiceCard service={mockService} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('has proper image sizing attributes', () => {
    render(<ServiceCard service={mockService} />);
    
    const serviceImage = screen.getByAltText('Roofing Services');
    expect(serviceImage).toHaveAttribute('data-sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw');
  });
});

describe('ServiceCard Accessibility', () => {
  test('has proper semantic structure', () => {
    render(<ServiceCard service={mockService} />);
    
    // Should have proper heading hierarchy
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Roofing Services');
    
    // Images should have descriptive alt text
    const serviceImage = screen.getByAltText('Roofing Services');
    expect(serviceImage).toBeInTheDocument();
    
    const iconImage = screen.getByAltText('Roofing Services icon');
    expect(iconImage).toBeInTheDocument();
  });

  test('maintains keyboard accessibility', () => {
    render(<ServiceCard service={mockService} />);
    
    // The main link should be focusable
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    
    // Should have proper focus handling
    link.focus();
    expect(link).toHaveFocus();
  });

  test('has proper list structure for features', () => {
    render(<ServiceCard service={mockService} />);
    
    // Features should be in a list structure
    const featuresList = screen.getByRole('list');
    expect(featuresList).toBeInTheDocument();
    
    const featureItems = screen.getAllByRole('listitem');
    expect(featureItems).toHaveLength(4); // First 4 features
  });
});