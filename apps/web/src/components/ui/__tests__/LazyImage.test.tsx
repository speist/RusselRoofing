import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LazyImage } from '../LazyImage';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
global.IntersectionObserver = mockIntersectionObserver;

describe('LazyImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image description',
    aspectRatio: 1.5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with proper aspect ratio', () => {
    const { container } = render(<LazyImage {...defaultProps} />);
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ paddingTop: '66.66666666666666%' }); // 1/1.5 * 100
  });

  test('shows blur placeholder when provided', () => {
    render(
      <LazyImage 
        {...defaultProps} 
        blurDataUrl="data:image/jpeg;base64,testblur" 
      />
    );
    
    const blurImage = screen.getByAltText('');
    expect(blurImage).toHaveAttribute('src', 'data:image/jpeg;base64,testblur');
    expect(blurImage).toHaveClass('blur-sm');
  });

  test('shows thumbnail fallback when no blur data provided', () => {
    render(
      <LazyImage 
        {...defaultProps} 
        thumbnailSrc="/thumbnail.jpg"
      />
    );
    
    const thumbnailImage = screen.getByAltText('');
    expect(thumbnailImage).toHaveAttribute('src', '/thumbnail.jpg');
    expect(thumbnailImage).toHaveClass('blur-sm');
  });

  test('sets up intersection observer on mount', () => {
    render(<LazyImage {...defaultProps} />);
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        rootMargin: '200px',
        threshold: 0.1
      }
    );
  });

  test('uses custom root margin when provided', () => {
    render(<LazyImage {...defaultProps} rootMargin="100px" />);
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );
  });

  test('shows loading spinner when image is in view but not loaded', () => {
    // Mock intersection observer to trigger in view
    const mockObserver = {
      observe: jest.fn((element) => {
        // Simulate image coming into view
        const callback = mockIntersectionObserver.mock.calls[0][0];
        callback([{ isIntersecting: true, target: element }]);
      }),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
    mockIntersectionObserver.mockReturnValue(mockObserver);

    render(<LazyImage {...defaultProps} />);
    
    // Should show loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('shows error fallback when image fails to load', async () => {
    // Mock intersection observer to trigger in view
    const mockObserver = {
      observe: jest.fn((element) => {
        const callback = mockIntersectionObserver.mock.calls[0][0];
        callback([{ isIntersecting: true, target: element }]);
      }),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
    mockIntersectionObserver.mockReturnValue(mockObserver);

    render(<LazyImage {...defaultProps} />);
    
    // Simulate image load error
    const image = screen.getByAltText('Test image description');
    fireEvent.error(image);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load image')).toBeInTheDocument();
    });
  });

  test('calls onLoad callback when image loads successfully', async () => {
    const mockOnLoad = jest.fn();
    
    // Mock intersection observer to trigger in view
    const mockObserver = {
      observe: jest.fn((element) => {
        const callback = mockIntersectionObserver.mock.calls[0][0];
        callback([{ isIntersecting: true, target: element }]);
      }),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
    mockIntersectionObserver.mockReturnValue(mockObserver);

    render(<LazyImage {...defaultProps} onLoad={mockOnLoad} />);
    
    // Simulate image load success
    const image = screen.getByAltText('Test image description');
    fireEvent.load(image);
    
    expect(mockOnLoad).toHaveBeenCalledTimes(1);
  });

  test('calls onError callback when image fails to load', async () => {
    const mockOnError = jest.fn();
    
    // Mock intersection observer to trigger in view
    const mockObserver = {
      observe: jest.fn((element) => {
        const callback = mockIntersectionObserver.mock.calls[0][0];
        callback([{ isIntersecting: true, target: element }]);
      }),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
    mockIntersectionObserver.mockReturnValue(mockObserver);

    render(<LazyImage {...defaultProps} onError={mockOnError} />);
    
    // Simulate image load error
    const image = screen.getByAltText('Test image description');
    fireEvent.error(image);
    
    expect(mockOnError).toHaveBeenCalledTimes(1);
  });

  test('applies custom className', () => {
    const { container } = render(
      <LazyImage {...defaultProps} className="custom-image" />
    );
    
    expect(container.firstChild).toHaveClass('custom-image');
  });

  test('has proper accessibility attributes', () => {
    render(
      <LazyImage 
        {...defaultProps} 
        blurDataUrl="data:image/jpeg;base64,testblur"
      />
    );
    
    // Blur/thumbnail images should be hidden from screen readers
    const decorativeImages = screen.getAllByAltText('');
    decorativeImages.forEach(img => {
      expect(img).toHaveAttribute('aria-hidden', 'true');
    });
    
    // Main image should have proper alt text
    const mainImage = screen.getByAltText('Test image description');
    expect(mainImage).toBeInTheDocument();
  });
});