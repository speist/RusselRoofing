import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectGallery } from '../ProjectGallery';
import { ProjectImage } from '@/types/gallery';

// Mock IntersectionObserver for LazyImage
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn((element) => {
    // Simulate immediate intersection
    callback([{ isIntersecting: true, target: element }]);
  }),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const mockImages: ProjectImage[] = [
  {
    id: '1',
    src: '/test-image-1.jpg',
    alt: 'Test roofing project',
    thumbnailSrc: '/test-thumb-1.jpg',
    blurDataUrl: 'data:image/jpeg;base64,test',
    serviceTypes: ['Roofing'],
    projectTitle: 'Modern Roof Replacement',
    description: 'Complete roof replacement project',
    location: 'Test City, NJ',
    completedDate: '2024-01-15',
    aspectRatio: 1.5
  },
  {
    id: '2',
    src: '/test-image-2.jpg',
    alt: 'Test siding project',
    thumbnailSrc: '/test-thumb-2.jpg',
    blurDataUrl: 'data:image/jpeg;base64,test2',
    serviceTypes: ['Siding'],
    projectTitle: 'Siding Installation',
    description: 'Premium siding installation',
    location: 'Test Town, NJ',
    completedDate: '2024-02-20',
    aspectRatio: 1.2
  },
  {
    id: '3',
    src: '/test-image-3.jpg',
    alt: 'Test commercial project',
    thumbnailSrc: '/test-thumb-3.jpg',
    blurDataUrl: 'data:image/jpeg;base64,test3',
    serviceTypes: ['Commercial', 'Roofing'],
    projectTitle: 'Commercial Roof Restoration',
    description: 'Large-scale commercial project',
    location: 'Business Park, NJ',
    completedDate: '2024-03-10',
    aspectRatio: 1.8
  }
];

describe('ProjectGallery', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('renders gallery with all images by default', () => {
    render(<ProjectGallery images={mockImages} />);
    
    // Should show all filter options
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Roofing')).toBeInTheDocument();
    expect(screen.getByText('Siding')).toBeInTheDocument();
    expect(screen.getByText('Commercial')).toBeInTheDocument();
    
    // Should show all images
    expect(screen.getByAltText('Test roofing project')).toBeInTheDocument();
    expect(screen.getByAltText('Test siding project')).toBeInTheDocument();
    expect(screen.getByAltText('Test commercial project')).toBeInTheDocument();
  });

  test('filters images by service type', async () => {
    render(<ProjectGallery images={mockImages} />);
    
    // Click on Roofing filter
    fireEvent.click(screen.getByText('Roofing'));
    
    await waitFor(() => {
      // Should show roofing projects (image 1 and 3)
      expect(screen.getByAltText('Test roofing project')).toBeInTheDocument();
      expect(screen.getByAltText('Test commercial project')).toBeInTheDocument();
      // Should not show siding-only project
      expect(screen.queryByAltText('Test siding project')).not.toBeInTheDocument();
    });
  });

  test('shows project counts in filter buttons', () => {
    render(<ProjectGallery images={mockImages} />);
    
    // Check that counts are displayed
    expect(screen.getByText('3')).toBeInTheDocument(); // All count
    expect(screen.getByText('2')).toBeInTheDocument(); // Roofing count (images 1 and 3)
    expect(screen.getByText('1')).toBeInTheDocument(); // Siding count (image 2)
  });

  test('opens lightbox when image is clicked', async () => {
    render(<ProjectGallery images={mockImages} />);
    
    // Click on first image
    const firstImage = screen.getByAltText('Test roofing project');
    fireEvent.click(firstImage.closest('div'));
    
    await waitFor(() => {
      // Should show lightbox with project details
      expect(screen.getByText('Modern Roof Replacement')).toBeInTheDocument();
      expect(screen.getByText('Complete roof replacement project')).toBeInTheDocument();
    });
  });

  test('shows no results message when filter has no matches', () => {
    const emptyFilterImages = mockImages.filter(img => img.serviceTypes.includes('NonExistent'));
    render(<ProjectGallery images={emptyFilterImages} />);
    
    expect(screen.getByText('No projects found')).toBeInTheDocument();
    expect(screen.getByText('No projects match the selected category. Try selecting a different filter.')).toBeInTheDocument();
  });

  test('hides filter when showFilter is false', () => {
    render(<ProjectGallery images={mockImages} showFilter={false} />);
    
    // Filter buttons should not be visible
    expect(screen.queryByText('All')).not.toBeInTheDocument();
    expect(screen.queryByText('Roofing')).not.toBeInTheDocument();
    
    // Images should still be visible
    expect(screen.getByAltText('Test roofing project')).toBeInTheDocument();
  });

  test('supports initial category selection', () => {
    render(<ProjectGallery images={mockImages} initialCategory="Siding" />);
    
    // Should start with Siding filter active
    const sidingButton = screen.getByText('Siding');
    expect(sidingButton).toHaveClass('bg-primary-burgundy');
    
    // Should only show siding project
    expect(screen.queryByAltText('Test roofing project')).not.toBeInTheDocument();
    expect(screen.getByAltText('Test siding project')).toBeInTheDocument();
    expect(screen.queryByAltText('Test commercial project')).not.toBeInTheDocument();
  });

  test('applies custom className to gallery container', () => {
    const { container } = render(<ProjectGallery images={mockImages} className="custom-gallery" />);
    
    expect(container.firstChild).toHaveClass('custom-gallery');
  });

  test('applies custom gridClassName to grid component', () => {
    render(<ProjectGallery images={mockImages} gridClassName="custom-grid" />);
    
    // The grid should have the custom class applied
    const gridElement = document.querySelector('.custom-grid');
    expect(gridElement).toBeInTheDocument();
  });
});

describe('ProjectGallery Accessibility', () => {
  test('has proper ARIA labels and roles', () => {
    render(<ProjectGallery images={mockImages} />);
    
    // Images should have proper alt text
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });
    
    // Filter buttons should be accessible
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });

  test('supports keyboard navigation', () => {
    render(<ProjectGallery images={mockImages} />);
    
    // Filter buttons should be focusable
    const allButton = screen.getByText('All');
    allButton.focus();
    expect(allButton).toHaveFocus();
    
    // Should be able to tab through filter buttons
    fireEvent.keyDown(allButton, { key: 'Tab' });
  });
});