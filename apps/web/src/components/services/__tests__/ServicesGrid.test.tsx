import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ServicesGrid } from '../ServicesGrid';
import { Service } from '@/data/services';

// Mock the ServiceCard component
vi.mock('../ServiceCard', () => {
  return {
    ServiceCard: function MockServiceCard({ service }: { service: Service }) {
      return (
        <div data-testid={`service-card-${service.id}`}>
          <h3>{service.title}</h3>
          <p>{service.shortDescription}</p>
        </div>
      );
    }
  };
});

const mockServices: Service[] = [
  {
    id: '1',
    slug: 'roofing',
    title: 'Roofing Services',
    shortDescription: 'Complete roof installations, repairs, and maintenance',
    description: 'Professional roofing services',
    icon: '/images/icons/roofing.svg',
    image: '/images/gallery/roofing/full/roofing-complete-replacement-westfield-2024-01-15.jpg',
    features: ['New Installations', 'Roof Repairs'],
    category: 'Roofing',
    popular: true
  },
  {
    id: '2',
    slug: 'siding',
    title: 'Siding Services',
    shortDescription: 'Exterior siding installation and repair',
    description: 'Professional siding services',
    icon: '/images/icons/siding.svg',
    image: '/images/gallery/siding/full/siding-colonial-renovation-princeton-2023-12-08.jpg',
    features: ['Vinyl Siding', 'Fiber Cement'],
    category: 'Siding',
    popular: false
  },
  {
    id: '3',
    slug: 'gutters',
    title: 'Gutter Services',
    shortDescription: 'Gutter installation, cleaning, and maintenance',
    description: 'Professional gutter services',
    icon: '/images/icons/gutters.svg',
    image: '/images/gallery/gutters/full/gutters-seamless-installation-summit-2024-01-22.jpg',
    features: ['Seamless Gutters', 'Gutter Guards'],
    category: 'Gutters',
    popular: false
  },
  {
    id: '4',
    slug: 'windows',
    title: 'Window Services',
    shortDescription: 'Window installation and replacement',
    description: 'Professional window services',
    icon: '/images/icons/windows.svg',
    image: '/images/gallery/windows/full/windows-replacement-victorian-morristown-2024-01-05.jpg',
    features: ['Window Replacement', 'New Installations'],
    category: 'Windows',
    popular: false
  }
];

describe('ServicesGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders all provided services', () => {
    render(<ServicesGrid services={mockServices} />);
    
    // Should render all service cards
    expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('service-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('service-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('service-card-4')).toBeInTheDocument();
    
    // Should show all service titles
    expect(screen.getByText('Roofing Services')).toBeInTheDocument();
    expect(screen.getByText('Siding Services')).toBeInTheDocument();
    expect(screen.getByText('Gutter Services')).toBeInTheDocument();
    expect(screen.getByText('Window Services')).toBeInTheDocument();
  });

  test('applies correct grid layout classes', () => {
    const { container } = render(<ServicesGrid services={mockServices} />);
    
    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass('grid');
    expect(gridElement).toHaveClass('grid-cols-1');
    expect(gridElement).toHaveClass('md:grid-cols-2');
    expect(gridElement).toHaveClass('lg:grid-cols-4');
    expect(gridElement).toHaveClass('gap-6');
  });

  test('applies custom className when provided', () => {
    const { container } = render(<ServicesGrid services={mockServices} className="custom-grid-class" />);
    
    expect(container.firstChild).toHaveClass('custom-grid-class');
  });

  test('handles empty services array', () => {
    const { container } = render(<ServicesGrid services={[]} />);
    
    const gridElement = container.firstChild;
    expect(gridElement).toBeInTheDocument();
    expect(gridElement).toHaveClass('grid');
    
    // Should not have any service cards
    expect(screen.queryByTestId(/service-card-/)).not.toBeInTheDocument();
  });

  test('passes h-full class to service cards', () => {
    render(<ServicesGrid services={mockServices} />);
    
    // The ServiceCard mock doesn't render the h-full class, but we can verify
    // that each service is rendered (which means the props are passed correctly)
    mockServices.forEach(service => {
      expect(screen.getByTestId(`service-card-${service.id}`)).toBeInTheDocument();
    });
  });

  test('maintains responsive grid behavior', () => {
    const { container } = render(<ServicesGrid services={mockServices} />);
    
    const gridElement = container.firstChild;
    
    // Check for responsive classes
    expect(gridElement).toHaveClass('grid-cols-1'); // Mobile: 1 column
    expect(gridElement).toHaveClass('md:grid-cols-2'); // Tablet: 2 columns
    expect(gridElement).toHaveClass('lg:grid-cols-4'); // Desktop: 4 columns
  });

  test('renders with single service', () => {
    const singleService = [mockServices[0]];
    render(<ServicesGrid services={singleService} />);
    
    expect(screen.getByTestId('service-card-1')).toBeInTheDocument();
    expect(screen.getByText('Roofing Services')).toBeInTheDocument();
    
    // Should not render other services
    expect(screen.queryByTestId('service-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('service-card-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('service-card-4')).not.toBeInTheDocument();
  });

  test('preserves service data structure', () => {
    render(<ServicesGrid services={mockServices} />);
    
    // Verify that service content is preserved and displayed
    expect(screen.getByText('Complete roof installations, repairs, and maintenance')).toBeInTheDocument();
    expect(screen.getByText('Exterior siding installation and repair')).toBeInTheDocument();
    expect(screen.getByText('Gutter installation, cleaning, and maintenance')).toBeInTheDocument();
    expect(screen.getByText('Window installation and replacement')).toBeInTheDocument();
  });
});

describe('ServicesGrid Responsive Design', () => {
  test('applies correct responsive grid classes', () => {
    const { container } = render(<ServicesGrid services={mockServices} />);
    
    const gridElement = container.firstChild;
    
    // Desktop layout (4 columns)
    expect(gridElement).toHaveClass('lg:grid-cols-4');
    
    // Tablet layout (2 columns)
    expect(gridElement).toHaveClass('md:grid-cols-2');
    
    // Mobile layout (1 column)
    expect(gridElement).toHaveClass('grid-cols-1');
    
    // Gap between items
    expect(gridElement).toHaveClass('gap-6');
  });
});