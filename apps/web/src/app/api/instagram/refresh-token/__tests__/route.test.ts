import { NextRequest } from 'next/server';
import { POST } from '../route';

// Mock fetch globally
global.fetch = vi.fn();
const mockFetch = global.fetch as vi.MockedFunction<typeof fetch>;

// Mock console methods to avoid noise in tests
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('/api/instagram/refresh-token', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('INSTAGRAM_ACCESS_TOKEN', 'test_access_token');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const mockTokenRefreshResponse = {
    access_token: 'new_access_token_12345',
    token_type: 'bearer',
    expires_in: 5183944, // ~60 days in seconds
  };

  test('successfully refreshes Instagram token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenRefreshResponse,
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram/refresh-token', {
      method: 'POST',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Token refreshed successfully');
    expect(data.expires_in).toBe(5183944);
    expect(data.token_updated).toBe(true);

    // Verify fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledWith(
      'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=test_access_token',
      expect.any(Object)
    );

    // Verify console logs for token update instructions
    expect(mockConsoleLog).toHaveBeenCalledWith('Token refreshed successfully. New token expires in:', 5183944, 'seconds');
    expect(mockConsoleLog).toHaveBeenCalledWith('⚠️  IMPORTANT: Update your INSTAGRAM_ACCESS_TOKEN environment variable with:', 'new_access_token_12345');
  });

  test('returns error when access token is missing', async () => {
    vi.stubEnv('INSTAGRAM_ACCESS_TOKEN', '');

    const request = new NextRequest('http://localhost:3000/api/instagram/refresh-token', {
      method: 'POST',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Instagram access token not configured');
    expect(fetch).not.toHaveBeenCalled();

    // Verify error logging
    expect(mockConsoleError).toHaveBeenCalledWith('Instagram access token missing');
  });

  test('handles Instagram API 401 error (invalid token)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Invalid access token',
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram/refresh-token', {
      method: 'POST',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Current Instagram access token is invalid');

    // Verify error logging
    expect(mockConsoleError).toHaveBeenCalledWith('Token refresh error:', 401, 'Invalid access token');
  });

  test('handles Instagram API 400 error (bad request)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Bad request parameters',
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram/refresh-token', {
      method: 'POST',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid token refresh request');

    // Verify error logging
    expect(mockConsoleError).toHaveBeenCalledWith('Token refresh error:', 400, 'Bad request parameters');
  });

  test('handles generic Instagram API errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal server error',
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram/refresh-token', {
      method: 'POST',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to refresh Instagram token');

    // Verify error logging
    expect(mockConsoleError).toHaveBeenCalledWith('Token refresh error:', 500, 'Internal server error');
  });

  test('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/instagram/refresh-token', {
      method: 'POST',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error while refreshing token');

    // Verify error logging
    expect(mockConsoleError).toHaveBeenCalledWith('Token refresh route error:', expect.any(Error));
  });

  test('does not expose actual token in response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenRefreshResponse,
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram/refresh-token', {
      method: 'POST',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    
    // Ensure the actual token is not included in the response for security
    expect(data).not.toHaveProperty('access_token');
    expect(data).not.toHaveProperty('new_token');
    
    // But should indicate that token was updated
    expect(data.token_updated).toBe(true);
  });

  test('provides proper response format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenRefreshResponse,
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram/refresh-token', {
      method: 'POST',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: 'Token refreshed successfully',
      expires_in: 5183944,
      token_updated: true,
    });
  });

  test('handles different expiry periods', async () => {
    const shortExpiryResponse = {
      ...mockTokenRefreshResponse,
      expires_in: 1800, // 30 minutes
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => shortExpiryResponse,
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/instagram/refresh-token', {
      method: 'POST',
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.expires_in).toBe(1800);

    // Verify console logs with different expiry time
    expect(mockConsoleLog).toHaveBeenCalledWith('Token refreshed successfully. New token expires in:', 1800, 'seconds');
  });
});