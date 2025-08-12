import { NextRequest, NextResponse } from 'next/server';
import { getServiceConfig, isServiceConfigured, getConfig } from '@/lib/config';
import { envMiddleware } from '@/lib/middleware/env-check';

interface InstagramPost {
  id: string;
  media_url: string;
  caption?: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  timestamp: string;
}

interface InstagramResponse {
  posts: InstagramPost[];
  error?: string;
}

interface InstagramApiResponse {
  data: {
    id: string;
    media_url: string;
    caption?: string;
    permalink: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    timestamp: string;
  }[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

let cachedData: { posts: InstagramPost[]; timestamp: number } | null = null;

// Exported for testing purposes
export function resetCache() {
  cachedData = null;
}

export async function GET(request: NextRequest): Promise<NextResponse<InstagramResponse>> {
  // Validate environment variables for Instagram API (with graceful degradation)
  const envCheck = envMiddleware.instagram(request);
  if (envCheck) {
    console.warn('Instagram API environment validation failed, returning empty posts');
    return NextResponse.json({
      posts: [],
      error: 'Instagram API not configured'
    });
  }

  try {
    const config = getConfig();
    
    // Check cache first
    if (cachedData && Date.now() - cachedData.timestamp < config.cache.instagramCacheDuration) {
      return NextResponse.json({ posts: cachedData.posts }, { status: 200 });
    }

    // Check if Instagram is configured
    if (!isServiceConfigured('instagram')) {
      console.error('Instagram API not configured');
      return NextResponse.json(
        { posts: [], error: 'Instagram API credentials not configured' },
        { status: 500 }
      );
    }

    const instagramConfig = getServiceConfig('instagram');
    const accessToken = instagramConfig.accessToken;
    const userId = instagramConfig.userId;

    // Construct Instagram API URL
    const fields = 'id,media_url,caption,permalink,media_type,timestamp';
    const limit = 6; // We want 6 images for the grid
    const apiUrl = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;

    // Fetch data from Instagram API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Instagram API error:', response.status, errorText);
      
      // Return specific error messages based on status code
      let errorMessage = 'Failed to fetch Instagram posts';
      if (response.status === 401) {
        errorMessage = 'Instagram access token is invalid or expired';
      } else if (response.status === 400) {
        errorMessage = 'Invalid Instagram API request parameters';
      } else if (response.status === 429) {
        errorMessage = 'Instagram API rate limit exceeded';
      }

      return NextResponse.json(
        { posts: [], error: errorMessage },
        { status: response.status }
      );
    }

    const data: InstagramApiResponse = await response.json();

    // Filter only IMAGE and CAROUSEL_ALBUM posts (no videos for the grid)
    const filteredPosts = data.data
      .filter(post => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM')
      .slice(0, 6) // Ensure we only get 6 posts maximum
      .map(post => ({
        id: post.id,
        media_url: post.media_url,
        caption: post.caption || '',
        permalink: post.permalink,
        media_type: post.media_type,
        timestamp: post.timestamp,
      }));

    // Update cache
    cachedData = {
      posts: filteredPosts,
      timestamp: Date.now(),
    };

    return NextResponse.json({ posts: filteredPosts }, { status: 200 });

  } catch (error) {
    console.error('Instagram API route error:', error);
    return NextResponse.json(
      { posts: [], error: 'Internal server error while fetching Instagram posts' },
      { status: 500 }
    );
  }
}