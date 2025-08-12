import { NextRequest, NextResponse } from 'next/server';
import { Review } from '@/types/review';
import { sampleReviews } from '@/data/reviews';
import { getServiceConfig, isServiceConfigured, getConfig } from '@/lib/config';
import { envMiddleware } from '@/lib/middleware/env-check';

interface GooglePlacesReview {
  author_name: string;
  rating: number;
  text: string;
  time: number; // Unix timestamp
  author_url?: string;
  profile_photo_url?: string;
}

interface GooglePlacesResponse {
  result: {
    reviews: GooglePlacesReview[];
    rating: number;
    user_ratings_total: number;
  };
  status: string;
}

interface ReviewsApiResponse {
  reviews: Review[];
  source: 'live' | 'fallback';
  error?: string;
}

// Simple in-memory cache
let cachedReviews: { data: Review[]; timestamp: number } | null = null;

// Rate limiting - simple in-memory store (in production, use Redis)
let lastRequestTime = 0;

// Constants for better maintainability
const SHORT_TEXT_MAX_LENGTH = 100;

// Reset function for tests
export function resetCache() {
  cachedReviews = null;
  lastRequestTime = 0;
}

function transformGooglePlacesReview(googleReview: GooglePlacesReview, index: number): Review {
  const date = new Date(googleReview.time * 1000);
  const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Generate short text (first 100 characters + ellipsis)
  const shortText = googleReview.text.length > SHORT_TEXT_MAX_LENGTH 
    ? googleReview.text.substring(0, SHORT_TEXT_MAX_LENGTH) + '...'
    : googleReview.text;

  return {
    id: `google-${googleReview.time}-${index}`,
    customerName: googleReview.author_name,
    rating: googleReview.rating,
    reviewText: googleReview.text,
    shortText,
    date: formattedDate,
    verified: true,
    platform: 'google'
  };
}

async function fetchGooglePlacesReviews(): Promise<Review[]> {
  if (!isServiceConfigured('google')) {
    console.warn('Google Places API not configured');
    throw new Error('Google Places API not configured');
  }

  const googleConfig = getServiceConfig('google');
  const apiKey = googleConfig.serverPlacesApiKey;
  const placeId = googleConfig.russellRoofingPlaceId;

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Google Places API request failed: ${response.status}`);
  }

  const data: GooglePlacesResponse = await response.json();

  if (data.status !== 'OK') {
    throw new Error(`Google Places API error: ${data.status}`);
  }

  if (!data.result.reviews || data.result.reviews.length === 0) {
    throw new Error('No reviews found in Google Places response');
  }

  // Filter for 5-star reviews only and transform to our Review interface
  const fiveStarReviews = data.result.reviews
    .filter(review => review.rating === 5)
    .map((review, index) => transformGooglePlacesReview(review, index));

  return fiveStarReviews;
}

export async function GET(request: NextRequest): Promise<NextResponse<ReviewsApiResponse>> {
  // Validate environment variables for Google Places API (with graceful degradation)
  const envCheck = envMiddleware.googlePlaces(request);
  if (envCheck) {
    console.warn('Google Places API environment validation failed, falling back to sample reviews');
    return NextResponse.json({
      reviews: sampleReviews,
      source: 'fallback',
      error: 'Google Places API not configured'
    });
  }

  try {
    const config = getConfig();
    
    // Check rate limiting
    const now = Date.now();
    if (config.features.enableRateLimiting && now - lastRequestTime < config.cache.rateLimitWindow) {
      console.warn('Rate limit exceeded, falling back to sample reviews');
      return NextResponse.json({
        reviews: sampleReviews,
        source: 'fallback',
        error: 'Rate limit exceeded'
      });
    }

    // Check cache first
    if (cachedReviews && now - cachedReviews.timestamp < config.cache.reviewsCacheDuration) {
      console.log('Serving reviews from cache');
      return NextResponse.json({
        reviews: cachedReviews.data,
        source: 'live'
      });
    }

    // Update rate limit tracker
    lastRequestTime = now;

    // Fetch fresh data from Google Places API
    const liveReviews = await fetchGooglePlacesReviews();

    // Update cache
    cachedReviews = {
      data: liveReviews,
      timestamp: now
    };

    console.log(`Fetched ${liveReviews.length} live reviews from Google Places API`);

    return NextResponse.json({
      reviews: liveReviews,
      source: 'live'
    });

  } catch (error) {
    console.error('Error fetching reviews from Google Places API:', error);
    
    // Fallback to sample reviews
    return NextResponse.json({
      reviews: sampleReviews,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}