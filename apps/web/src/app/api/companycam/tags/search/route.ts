import { NextRequest, NextResponse } from 'next/server';
import { getCompanyCamClient } from '@/lib/companycam';
import { SERVICE_TAG_IDS } from '@/lib/companycam/types';

// Force dynamic rendering - this endpoint makes API calls
export const dynamic = 'force-dynamic';

/**
 * GET /api/companycam/tags/search
 *
 * Searches for tags matching the user's requirements (by tag ID)
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

    // Fetch all tags from CompanyCam with pagination
    let allTags: any[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await client.get<any>(`/tags?page=${page}&per_page=100`);
      const tagsArray = Array.isArray(response) ? response : (response.data || []);

      if (tagsArray.length === 0) {
        hasMorePages = false;
      } else {
        allTags = [...allTags, ...tagsArray];
        page++;
        // Safety limit
        if (page > 10 || tagsArray.length < 100) {
          hasMorePages = false;
        }
      }
    }

    const results: any = {
      debug_info: {
        total_tags_fetched: allTags.length,
        pages_fetched: page - 1,
        first_tag_sample: allTags[0],
      },
      total_tags_in_companycam: allTags.length,
      required_service_tags: SERVICE_TAG_IDS,
      search_results: {},
      found_tags: [],
      missing_tags: [],
      recommendations: [],
    };

    // Search for each required service tag by ID
    for (const [category, tagId] of Object.entries(SERVICE_TAG_IDS)) {
      const matchById = allTags.find((tag: any) => String(tag.id) === tagId);

      results.search_results[category] = {
        tag_id: tagId,
        found: !!matchById,
        match: matchById ? {
          id: matchById.id,
          display_value: matchById.display_value,
          value: matchById.value,
          name: matchById.name,
          tag_type: matchById.tag_type,
        } : null,
      };

      if (matchById) {
        results.found_tags.push(category);
      } else {
        results.missing_tags.push(category);
      }
    }

    // Generate recommendations
    if (results.missing_tags.length > 0) {
      results.recommendations.push(
        `Missing ${results.missing_tags.length} tags: ${results.missing_tags.join(', ')}`
      );
      results.recommendations.push(
        `Create these tags in CompanyCam and apply them to your photos.`
      );
    }

    if (results.found_tags.length > 0) {
      results.recommendations.push(
        `Found ${results.found_tags.length} matching tags: ${results.found_tags.join(', ')}`
      );
    }

    // Summary
    results.summary = {
      service_tags_found: results.found_tags.length,
      total_required: Object.keys(SERVICE_TAG_IDS).length,
      total_found: results.found_tags.length,
      total_missing: results.missing_tags.length,
      ready_for_filtering: results.found_tags.length > 0,
    };

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('[CompanyCam Tag Search] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
