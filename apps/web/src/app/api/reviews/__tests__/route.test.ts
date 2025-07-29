import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';
import { sampleReviews } from '@/data/reviews';

// Mock environment variables
const mockEnv = {
  GOOGLE_PLACES_API_KEY: 'test-api-key',
  RUSSELL_ROOFING_PLACE_ID: 'test-place-id'
};

// Mock Google Places API response
const mockGooglePlacesResponse = {
  result: {
    reviews: [
      {
        author_name: 'John Smith',
        rating: 5,
        text: 'Excellent service! Highly recommended.',
        time: 1640995200, // 2022-01-01
        author_url: 'https://maps.google.com/user123',
        profile_photo_url: 'https://lh3.googleusercontent.com/photo.jpg'
      },
      {
        author_name: 'Jane Doe',
        rating: 4, // This should be filtered out
        text: 'Good service but could be better.',
        time: 1640908800, // 2021-12-31
      },
      {
        author_name: 'Bob Johnson',
        rating: 5,
        text: 'Outstanding work! The team was professional and completed the job on time.',
        time: 1640822400, // 2021-12-30
      }
    ],
    rating: 4.7,
    user_ratings_total: 150
  },
  status: 'OK'
};

// Mock fetch globally
global.fetch = vi.fn();

describe('/api/reviews', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock environment variables
    Object.entries(mockEnv).forEach(([key, value]) => {
      vi.stubEnv(key, value);
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return live reviews from Google Places API', async () => {
    // Mock successful API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGooglePlacesResponse
    });

    const request = new NextRequest('http://localhost:3000/api/reviews');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.source).toBe('live');
    expect(data.reviews).toHaveLength(2); // Only 5-star reviews
    expect(data.reviews[0]).toMatchObject({
      customerName: 'John Smith',
      rating: 5,
      reviewText: 'Excellent service! Highly recommended.',
      verified: true,
      platform: 'google'
    });
    expect(data.reviews[1]).toMatchObject({
      customerName: 'Bob Johnson',
      rating: 5,
      verified: true,
      platform: 'google'
    });
  });

  it('should fallback to sample reviews when API key is missing', async () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', '');

    const request = new NextRequest('http://localhost:3000/api/reviews');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.source).toBe('fallback');
    expect(data.reviews).toEqual(sampleReviews);
    expect(data.error).toBe('Google Places API key not configured');
  });

  it('should fallback to sample reviews when Place ID is missing', async () => {
    vi.stubEnv('RUSSELL_ROOFING_PLACE_ID', '');

    const request = new NextRequest('http://localhost:3000/api/reviews');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.source).toBe('fallback');
    expect(data.reviews).toEqual(sampleReviews);
    expect(data.error).toBe('Russell Roofing Place ID not configured');
  });

  it('should fallback to sample reviews when API request fails', async () => {
    // Mock failed API response
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/reviews');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.source).toBe('fallback');
    expect(data.reviews).toEqual(sampleReviews);
    expect(data.error).toBe('Network error');
  });

  it('should fallback to sample reviews when API returns error status', async () => {
    // Mock API error response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockGooglePlacesResponse,
        status: 'INVALID_REQUEST'
      })
    });

    const request = new NextRequest('http://localhost:3000/api/reviews');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.source).toBe('fallback');
    expect(data.reviews).toEqual(sampleReviews);
    expect(data.error).toBe('Google Places API error: INVALID_REQUEST');
  });

  it('should fallback to sample reviews when no reviews found', async () => {
    // Mock empty reviews response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockGooglePlacesResponse,
        result: {
          ...mockGooglePlacesResponse.result,
          reviews: []
        }
      })
    });

    const request = new NextRequest('http://localhost:3000/api/reviews');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.source).toBe('fallback');
    expect(data.reviews).toEqual(sampleReviews);
    expect(data.error).toBe('No reviews found in Google Places response');
  });

  it('should properly transform Google Places review data', async () => {
    const testReview = {
      author_name: 'Test User',
      rating: 5,
      text: 'This is a very long review text that should be truncated to create a short text version for display purposes in the carousel component',
      time: 1640995200, // 2022-01-01
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockGooglePlacesResponse,
        result: {
          ...mockGooglePlacesResponse.result,
          reviews: [testReview]
        }
      })
    });

    const request = new NextRequest('http://localhost:3000/api/reviews');
    const response = await GET(request);
    const data = await response.json();

    const transformedReview = data.reviews[0];
    expect(transformedReview.id).toMatch(/^google-1640995200-0$/);
    expect(transformedReview.customerName).toBe('Test User');
    expect(transformedReview.rating).toBe(5);
    expect(transformedReview.date).toBe('2022-01-01');
    expect(transformedReview.verified).toBe(true);
    expect(transformedReview.platform).toBe('google');
    expect(transformedReview.shortText).toBe('This is a very long review text that should be truncated to create a short text version for display ...');
  });

  it('should filter out non-5-star reviews', async () => {
    const mixedRatingsResponse = {
      ...mockGooglePlacesResponse,
      result: {
        ...mockGooglePlacesResponse.result,
        reviews: [
          { author_name: 'User 1', rating: 5, text: 'Great!', time: 1640995200 },
          { author_name: 'User 2', rating: 4, text: 'Good', time: 1640995100 },
          { author_name: 'User 3', rating: 3, text: 'OK', time: 1640995000 },
          { author_name: 'User 4', rating: 5, text: 'Excellent!', time: 1640994900 },
        ]
      }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mixedRatingsResponse
    });

    const request = new NextRequest('http://localhost:3000/api/reviews');
    const response = await GET(request);
    const data = await response.json();

    expect(data.reviews).toHaveLength(2);
    expect(data.reviews.every((review: { rating: number }) => review.rating === 5)).toBe(true);
    expect(data.reviews[0].customerName).toBe('User 1');
    expect(data.reviews[1].customerName).toBe('User 4');
  });
});