import { NextRequest, NextResponse } from 'next/server';
import { getCompanyCamClient } from '@/lib/companycam';
import { MASTER_TAG, SERVICE_TAGS } from '@/lib/companycam/types';

/**
 * DEBUG ENDPOINT - GET /api/companycam/photos-debug
 *
 * Shows what's happening with photo fetching and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.COMPANYCAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: 'COMPANYCAM_API_KEY not configured'
      }, { status: 500 });
    }

    const client = getCompanyCamClient();

    // Fetch more photos to find ones with tags (up to 50)
    const photos = await client.get<any>('/photos?per_page=50');

    const photosArray = Array.isArray(photos) ? photos : (photos.data || []);

    const debugInfo: any = {
      total_photos_fetched: photosArray.length,
      filtering_requirements: {
        master_tag: MASTER_TAG,
        service_tags: SERVICE_TAGS,
      },
      raw_photo_sample: photosArray[0], // Show first photo structure
      photos_with_tags: [],
      filtering_results: {
        passed: [],
        failed: [],
      },
    };

    // Fetch tags for each photo
    for (const photo of photosArray.slice(0, 20)) { // Limit to 20 for debugging
      try {
        const photoTags = await client.get<any>(`/photos/${photo.id}/tags`);
        const tagsArray = Array.isArray(photoTags) ? photoTags : (photoTags.data || []);

        const tagNames = tagsArray.map((tag: any) => tag.display_value || tag.value || tag.name || '');

        // Check master tag
        const hasMasterTag = tagNames.some((tag: string) =>
          tag.toLowerCase() === MASTER_TAG.toLowerCase()
        );

        // Check service tags
        const matchedServiceTags = SERVICE_TAGS.filter(serviceTag =>
          tagNames.some((tag: string) => tag.toLowerCase() === serviceTag.toLowerCase())
        );

        const passesFilter = hasMasterTag && matchedServiceTags.length > 0;

        const photoInfo = {
          photo_id: photo.id,
          uri: photo.uri,
          captured_at: photo.captured_at,
          tags: tagNames,
          filtering: {
            has_master_tag: hasMasterTag,
            matched_service_tags: matchedServiceTags,
            passes_filter: passesFilter,
          },
        };

        debugInfo.photos_with_tags.push(photoInfo);

        if (passesFilter) {
          debugInfo.filtering_results.passed.push(photo.id);
        } else {
          debugInfo.filtering_results.failed.push({
            photo_id: photo.id,
            reason: !hasMasterTag ? 'Missing master tag' : 'Missing service tag',
          });
        }
      } catch (error) {
        debugInfo.photos_with_tags.push({
          photo_id: photo.id,
          error: error instanceof Error ? error.message : 'Failed to fetch tags',
        });
      }
    }

    debugInfo.summary = {
      total_fetched: photosArray.length,
      total_checked: debugInfo.photos_with_tags.length,
      passed_filter: debugInfo.filtering_results.passed.length,
      failed_filter: debugInfo.filtering_results.failed.length,
    };

    return NextResponse.json(debugInfo, { status: 200 });

  } catch (error) {
    console.error('[CompanyCam Photos Debug] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
