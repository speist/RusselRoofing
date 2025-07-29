import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InstagramFeed } from '../instagram-feed';

// Mock fetch globally
global.fetch = vi.fn();
const mockFetch = global.fetch as any;

// Mock window.open
global.window.open = vi.fn();

describe('InstagramFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockInstagramPosts = [
    {
      id: '1',
      media_url: 'https://example.com/image1.jpg',
      caption: 'Great roofing project completed!',
      permalink: 'https://instagram.com/p/test1',
      media_type: 'IMAGE' as const,
      timestamp: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      media_url: 'https://example.com/image2.jpg',
      caption: 'Another successful installation',
      permalink: 'https://instagram.com/p/test2',
      media_type: 'CAROUSEL_ALBUM' as const,
      timestamp: '2024-01-02T00:00:00Z',
    },
  ];

  test('renders loading skeletons initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<InstagramFeed />);

    expect(screen.getByText('Follow Our Latest Work')).toBeInTheDocument();
    expect(screen.getByText(/see our most recent projects/i)).toBeInTheDocument();

    // Should show 6 skeleton loaders
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThanOrEqual(6);
  });

  test('renders Instagram posts successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mockInstagramPosts }),
    } as Response);

    render(<InstagramFeed />);

    await waitFor(() => {
      expect(screen.getByText('Great roofing project completed!')).toBeInTheDocument();
    });

    // Should show the posts
    expect(screen.getByAltText('Instagram post 1')).toBeInTheDocument();
    expect(screen.getByAltText('Instagram post 2')).toBeInTheDocument();
  });

  test('shows fallback content when API fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ posts: [], error: 'Server error' }),
    } as Response);

    render(<InstagramFeed />);

    await waitFor(() => {
      expect(screen.getByText(/currently showing demo content/i)).toBeInTheDocument();
    });

    // Should show fallback images
    const images = screen.getAllByAltText(/instagram post/i);
    expect(images.length).toBe(6);
  });

  test('shows fallback content when fetch throws error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<InstagramFeed />);

    await waitFor(() => {
      expect(screen.getByText(/currently showing demo content/i)).toBeInTheDocument();
    });
  });

  test('handles hover effects correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mockInstagramPosts }),
    } as Response);

    render(<InstagramFeed />);

    await waitFor(() => {
      expect(screen.getByText('Great roofing project completed!')).toBeInTheDocument();
    });

    // Find the first post container
    const postContainers = document.querySelectorAll('.group');
    const firstPost = postContainers[0];

    // Hover over the first post
    fireEvent.mouseEnter(firstPost);

    // Should show the Instagram icon and caption overlay
    const instagramIcon = document.querySelector('svg');
    expect(instagramIcon).toBeInTheDocument();
  });

  test('opens Instagram links when clicked', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mockInstagramPosts }),
    } as Response);

    render(<InstagramFeed />);

    await waitFor(() => {
      expect(screen.getByText('Great roofing project completed!')).toBeInTheDocument();
    });

    // Click on the first post
    const postContainers = document.querySelectorAll('.group');
    fireEvent.click(postContainers[0]);

    expect(window.open).toHaveBeenCalledWith(
      'https://instagram.com/p/test1',
      '_blank',
      'noopener,noreferrer'
    );
  });

  test('opens Instagram profile when CTA button is clicked', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mockInstagramPosts }),
    } as Response);

    render(<InstagramFeed />);

    await waitFor(() => {
      const followButton = screen.getByText('Follow Us on Instagram');
      fireEvent.click(followButton);

      expect(window.open).toHaveBeenCalledWith(
        'https://instagram.com/russellroofingcompany',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  test('displays carousel indicator for CAROUSEL_ALBUM posts', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mockInstagramPosts }),
    } as Response);

    render(<InstagramFeed />);

    await waitFor(() => {
      // The second post is a CAROUSEL_ALBUM, should have an indicator
      const carouselIndicators = document.querySelectorAll('.absolute.top-3.right-3');
      expect(carouselIndicators.length).toBeGreaterThan(0);
    });
  });

  test('truncates long captions correctly', async () => {
    const longCaptionPost = {
      ...mockInstagramPosts[0],
      caption: 'This is a very long caption that should be truncated because it exceeds the maximum length allowed for display in the hover overlay',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: [longCaptionPost] }),
    } as Response);

    render(<InstagramFeed />);

    await waitFor(() => {
      // Caption should be truncated (we won't see the full text)
      expect(screen.queryByText(longCaptionPost.caption)).not.toBeInTheDocument();
    });
  });

  test('handles posts without captions', async () => {
    const postWithoutCaption = {
      ...mockInstagramPosts[0],
      caption: undefined,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: [postWithoutCaption] }),
    } as Response);

    render(<InstagramFeed />);

    await waitFor(() => {
      expect(screen.getByAltText('Instagram post 1')).toBeInTheDocument();
    });

    // Should render without errors even with undefined caption
  });

  test('filters out non-image posts and limits to 6 posts', async () => {
    const mixedPosts = [
      ...mockInstagramPosts,
      {
        id: '3',
        media_url: 'https://example.com/video1.mp4',
        caption: 'Video post',
        permalink: 'https://instagram.com/p/test3',
        media_type: 'VIDEO' as const,
        timestamp: '2024-01-03T00:00:00Z',
      },
      // Add more posts to test the 6-post limit
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `extra-${i}`,
        media_url: `https://example.com/image${i + 10}.jpg`,
        caption: `Extra post ${i}`,
        permalink: `https://instagram.com/p/extra${i}`,
        media_type: 'IMAGE' as const,
        timestamp: `2024-01-${String(i + 10).padStart(2, '0')}T00:00:00Z`,
      })),
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ posts: mixedPosts }),
    } as Response);

    render(<InstagramFeed />);

    await waitFor(() => {
      // Should only show 6 images maximum (videos filtered out)
      const images = screen.getAllByAltText(/instagram post/i);
      expect(images.length).toBeLessThanOrEqual(6);
    });
  });

  test('makes correct API call to Instagram endpoint', () => {
    render(<InstagramFeed />);

    expect(fetch).toHaveBeenCalledWith('/api/instagram', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});