import { NextRequest } from 'next/server';
import { GET } from '../route';

// Mock environment variables
const mockEnv = {
  INSTAGRAM_ACCESS_TOKEN: 'test_access_token',
  INSTAGRAM_USER_ID: 'test_user_id',
};

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('/api/instagram', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset process.env for each test
    process.env = { ...mockEnv };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockInstagramApiResponse = {
    data: [
      {
        id: '1',
        media_url: 'https://example.com/image1.jpg',
        caption: 'Test caption 1',
        permalink: 'https://instagram.com/p/test1',
        media_type: 'IMAGE',
        timestamp: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        media_url: 'https://example.com/image2.jpg',
        caption: 'Test caption 2',
        permalink: 'https://instagram.com/p/test2',
        media_type: 'CAROUSEL_ALBUM',
        timestamp: '2024-01-02T00:00:00Z',
      },
      {
        id: '3',
        media_url: 'https://example.com/video1.mp4',
        caption: 'Test video',
        permalink: 'https://instagram.com/p/test3',
        media_type: 'VIDEO',
        timestamp: '2024-01-03T00:00:00Z',
      },
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
    expect(data.posts).toHaveLength(2); // Only IMAGE and CAROUSEL_ALBUM posts
    expect(data.posts[0].id).toBe('1');
    expect(data.posts[1].id).toBe('2');
    expect(data.error).toBeUndefined();

    // Verify fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledWith(
      'https://graph.instagram.com/test_user_id/media?fields=id,media_url,caption,permalink,media_type,timestamp&limit=6&access_token=test_access_token',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  });

  test('returns error when access token is missing', async () => {
    delete process.env.INSTAGRAM_ACCESS_TOKEN;

    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.posts).toEqual([]);
    expect(data.error).toBe('Instagram API credentials not configured');
    expect(fetch).not.toHaveBeenCalled();
  });

  test('returns error when user ID is missing', async () => {
    delete process.env.INSTAGRAM_USER_ID;

    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.posts).toEqual([]);
    expect(data.error).toBe('Instagram API credentials not configured');
    expect(fetch).not.toHaveBeenCalled();
  });

  test('handles Instagram API 401 error (invalid token)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Invalid access token',
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.posts).toEqual([]);
    expect(data.error).toBe('Instagram access token is invalid or expired');
  });

  test('handles Instagram API 400 error (bad request)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Bad request parameters',
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.posts).toEqual([]);
    expect(data.error).toBe('Invalid Instagram API request parameters');
  });

  test('handles Instagram API 429 error (rate limit)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => 'Rate limit exceeded',
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.posts).toEqual([]);
    expect(data.error).toBe('Instagram API rate limit exceeded');
  });

  test('handles generic Instagram API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal server error',
    } as Response);

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
      data: Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        media_url: `https://example.com/image${i + 1}.jpg`,
        caption: `Caption ${i + 1}`,
        permalink: `https://instagram.com/p/test${i + 1}`,
        media_type: i % 3 === 0 ? 'VIDEO' : 'IMAGE', // Every 3rd post is a video
        timestamp: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
      })),
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => manyPostsResponse,
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts.length).toBeLessThanOrEqual(6);
    // Ensure no VIDEO posts are included
    data.posts.forEach((post: any) => {
      expect(post.media_type).not.toBe('VIDEO');
    });
  });

  test('handles posts without captions', async () => {
    const responseWithoutCaptions = {
      data: [
        {
          id: '1',
          media_url: 'https://example.com/image1.jpg',
          // No caption field
          permalink: 'https://instagram.com/p/test1',
          media_type: 'IMAGE',
          timestamp: '2024-01-01T00:00:00Z',
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => responseWithoutCaptions,
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toHaveLength(1);
    expect(data.posts[0].caption).toBe('');
  });

  test('uses cache when available and not expired', async () => {
    // First request - should fetch from API
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockInstagramApiResponse,
    } as Response);

    const request1 = new NextRequest('http://localhost:3000/api/instagram');
    const response1 = await GET(request1);
    const data1 = await response1.json();

    expect(response1.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);

    // Second request immediately after - should use cache
    const request2 = new NextRequest('http://localhost:3000/api/instagram');
    const response2 = await GET(request2);
    const data2 = await response2.json();

    expect(response2.status).toBe(200);
    expect(data2.posts).toEqual(data1.posts);
    // Fetch should still only have been called once due to caching
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});