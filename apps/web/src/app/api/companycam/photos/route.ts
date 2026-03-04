import { NextRequest, NextResponse } from 'next/server';
import { getCompanyCamClient } from '@/lib/companycam';
import { envMiddleware } from '@/lib/middleware/env-check';
import type { GalleryPhoto } from '@/lib/companycam/types';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

interface CompanyCamPhotosResponse {
  photos: GalleryPhoto[];
  total: number;
  page?: number;
  pageSize?: number;
  error?: string;
}

// Cache for photos (1 hour)
let cachedData: { photos: GalleryPhoto[]; timestamp: number } | null = null;
const CACHE_DURATION = 3600 * 1000; // 1 hour

/**
 * GET /api/companycam/photos
 *
 * Fetches photos from CompanyCam filtered by service tag IDs.
 * Photos need a single service tag to appear.
 *
 * Query Parameters:
 * - serviceTag: Filter by specific service (e.g., "Roofing", "Commercial")
 * - beforeAfter: Filter by before/after tags ("before", "after", "both")
 * - page: Page number for pagination (default: 1)
 * - perPage: Items per page (default: 50)
 * - noCache: Skip cache and fetch fresh data (default: false)
 */
export async function GET(request: NextRequest): Promise<NextResponse<CompanyCamPhotosResponse>> {
  // Validate environment variables for CompanyCam API (with graceful degradation)
  const envCheck = envMiddleware.companycam?.(request);
  if (envCheck) {
    console.warn('CompanyCam API environment validation failed, returning empty photos');
    return NextResponse.json({
      photos: [],
      total: 0,
      error: 'CompanyCam API not configured'
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const serviceTag = searchParams.get('serviceTag') || undefined;
    const beforeAfter = searchParams.get('beforeAfter') as 'before' | 'after' | 'both' | undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '50', 10);
    const noCache = searchParams.get('noCache') === 'true';

    // Check cache first (unless noCache is specified)
    if (!noCache && cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      // Apply filtering to cached data if serviceTag or beforeAfter is specified
      let filteredPhotos = cachedData.photos;

      if (serviceTag) {
        filteredPhotos = filteredPhotos.filter(photo =>
          photo.tags.some(tag => tag.toLowerCase() === serviceTag.toLowerCase())
        );
      }

      if (beforeAfter) {
        filteredPhotos = filteredPhotos.filter(photo => {
          if (beforeAfter === 'before') return photo.isBeforePhoto;
          if (beforeAfter === 'after') return photo.isAfterPhoto;
          if (beforeAfter === 'both') return photo.isBeforePhoto && photo.isAfterPhoto;
          return true;
        });
      }

      // Apply pagination
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedPhotos = filteredPhotos.slice(startIndex, endIndex);

      return NextResponse.json({
        photos: paginatedPhotos,
        total: filteredPhotos.length,
        page,
        pageSize: perPage,
      }, { status: 200 });
    }

    // Get CompanyCam client
    const client = getCompanyCamClient();

    // Fetch all photos matching filters (client handles API pagination internally)
    const allPhotos = await client.getPhotosByTags({
      serviceTag,
      beforeAfter,
    });

    // Update cache with all photos (unfiltered fetch only)
    if (!serviceTag && !beforeAfter) {
      cachedData = {
        photos: allPhotos,
        timestamp: Date.now(),
      };
    }

    // Apply client-side pagination for the response
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedPhotos = allPhotos.slice(startIndex, endIndex);

    return NextResponse.json({
      photos: paginatedPhotos,
      total: allPhotos.length,
      page,
      pageSize: perPage,
    }, { status: 200 });

  } catch (error) {
    console.error('[CompanyCam API] Error fetching photos:', error);

    // Provide specific error messages
    let errorMessage = 'Failed to fetch photos from CompanyCam';
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        errorMessage = 'CompanyCam API key is invalid or expired';
      } else if (error.message.includes('404')) {
        errorMessage = 'No photos found';
      } else if (error.message.includes('429')) {
        errorMessage = 'CompanyCam API rate limit exceeded';
      } else if (error.message.includes('required')) {
        errorMessage = 'CompanyCam API key is not configured';
      }
    }

    return NextResponse.json(
      { photos: [], total: 0, error: errorMessage },
      { status: 500 }
    );
  }
}
