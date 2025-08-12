import { NextRequest, NextResponse } from 'next/server';
import { GET, resetCache } from '../route';

// Mock dependencies
vi.mock('@/lib/middleware/env-check', () => ({
  envMiddleware: {
    instagram: vi.fn(),
  },
}));

vi.mock('@/lib/config', () => ({
  getConfig: vi.fn(),
  getServiceConfig: vi.fn(),
  isServiceConfigured: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn();
const mockFetch = global.fetch as vi.MockedFunction<typeof fetch>;

// Import the mocked modules
import { envMiddleware } from '@/lib/middleware/env-check';
import { getConfig, getServiceConfig, isServiceConfigured } from '@/lib/config';

describe('/api/instagram', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    resetCache();

    // Default mock for middleware: success
    (envMiddleware.instagram as vi.Mock).mockReturnValue(undefined);

    // Default mock for config
    (getConfig as vi.Mock).mockReturnValue({
      cache: { instagramCacheDuration: 3600 * 1000 },
    });
    (isServiceConfigured as vi.Mock).mockReturnValue(true);
    (getServiceConfig as vi.Mock).mockReturnValue({
      accessToken: 'test_access_token',
      userId: 'test_user_id',
    });
  });

  const mockInstagramApiResponse = {
    data: [
      { id: '1', media_url: 'https://example.com/image1.jpg', caption: 'Test caption 1', permalink: 'https://instagram.com/p/test1', media_type: 'IMAGE', timestamp: '2024-01-01T00:00:00Z' },
      { id: '2', media_url: 'https://example.com/image2.jpg', caption: 'Test caption 2', permalink: 'https://instagram.com/p/test2', media_type: 'CAROUSEL_ALBUM', timestamp: '2024-01-02T00:00:00Z' },
      { id: '3', media_url: 'https://example.com/video1.mp4', caption: 'Test video', permalink: 'https://instagram.com/p/test3', media_type: 'VIDEO', timestamp: '2024-01-03T00:00:00Z' },
    ],
  };

  test('successfully fetches Instagram posts', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockInstagramApiResponse,
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toHaveLength(2);
    expect(data.posts[0].id).toBe('1');
    expect(data.posts[1].id).toBe('2');
    expect(data.error).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(
      'https://graph.instagram.com/test_user_id/media?fields=id,media_url,caption,permalink,media_type,timestamp&limit=6&access_token=test_access_token',
      expect.any(Object)
    );
  });

  test('returns error when env validation fails', async () => {
    const errorResponse = NextResponse.json({ posts: [], error: 'Instagram API not configured' });
    (envMiddleware.instagram as vi.Mock).mockReturnValue(errorResponse);

    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toEqual([]);
    expect(data.error).toBe('Instagram API not configured');
    expect(fetch).not.toHaveBeenCalled();
  });

  test('handles Instagram API 401 error (invalid token)', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401, text: async () => 'Invalid access token' } as Response);
    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.posts).toEqual([]);
    expect(data.error).toBe('Instagram access token is invalid or expired');
  });

  test('handles Instagram API 400 error (bad request)', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 400, text: async () => 'Bad request' } as Response);
    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.posts).toEqual([]);
    expect(data.error).toBe('Invalid Instagram API request parameters');
  });

  test('handles Instagram API 429 error (rate limit)', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 429, text: async () => 'Rate limit' } as Response);
    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();
    expect(response.status).toBe(429);
    expect(data.posts).toEqual([]);
    expect(data.error).toBe('Instagram API rate limit exceeded');
  });

  test('handles generic Instagram API errors', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500, text: async () => 'Server error' } as Response);
    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data.posts).toEqual([]);
    expect(data.error).toBe('Failed to fetch Instagram posts');
  });

  test('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data.posts).toEqual([]);
    expect(data.error).toBe('Internal server error while fetching Instagram posts');
  });

  test('filters VIDEO posts and limits to 6 posts', async () => {
    const manyPostsResponse = {
      data: Array.from({ length: 10 }, (_, i) => ({ id: `${i}`, media_type: i % 3 === 0 ? 'VIDEO' : 'IMAGE' } as any)),
    };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => manyPostsResponse } as Response);
    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.posts.length).toBeLessThanOrEqual(6);
    expect(data.posts.every(p => p.media_type !== 'VIDEO')).toBe(true);
  });

  test('handles posts without captions', async () => {
    const responseWithoutCaptions = { data: [{ id: '1', media_type: 'IMAGE' }] };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => responseWithoutCaptions } as Response);
    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.posts).toHaveLength(1);
    expect(data.posts[0].caption).toBe('');
  });

  test('uses cache when available and not expired', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockInstagramApiResponse } as Response);
    const request1 = new NextRequest('http://localhost:3000/api/instagram');
    await GET(request1);
    expect(fetch).toHaveBeenCalledTimes(1);

    const request2 = new NextRequest('http://localhost:3000/api/instagram');
    await GET(request2);
    expect(fetch).toHaveBeenCalledTimes(1); // Should not fetch again
  });
});