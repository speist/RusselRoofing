import { NextRequest, NextResponse } from 'next/server';
import { getCompanyCamClient } from '@/lib/companycam';
import { MASTER_TAG, SERVICE_TAGS } from '@/lib/companycam/types';

/**
 * GET /api/companycam/tags/search
 *
 * Searches for tags matching the user's requirements
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

    // The tags you specified in your requirements
    const requiredTags = [
      MASTER_TAG,      // Master tag
      ...SERVICE_TAGS, // Service tags
    ];

    const results: any = {
      debug_info: {
        total_tags_fetched: allTags.length,
        pages_fetched: page - 1,
        first_tag_sample: allTags[0],
      },
      total_tags_in_companycam: allTags.length,
      required_tags: requiredTags,
      search_results: {},
      found_tags: [],
      missing_tags: [],
      recommendations: [],
    };

    // Search for each required tag
    requiredTags.forEach(requiredTag => {
      const searchResults = allTags.filter((tag: any) => {
        const displayValue = tag.display_value || '';
        const value = tag.value || '';
        const name = tag.name || '';

        // Case-insensitive search in display_value, value, or name
        return displayValue.toLowerCase().includes(requiredTag.toLowerCase()) ||
               value.toLowerCase().includes(requiredTag.toLowerCase()) ||
               name.toLowerCase().includes(requiredTag.toLowerCase());
      });

      results.search_results[requiredTag] = {
        found: searchResults.length > 0,
        count: searchResults.length,
        matches: searchResults.map((tag: any) => ({
          id: tag.id,
          display_value: tag.display_value,
          value: tag.value,
          name: tag.name,
          tag_type: tag.tag_type,
        })),
      };

      if (searchResults.length > 0) {
        results.found_tags.push(requiredTag);
      } else {
        results.missing_tags.push(requiredTag);
      }
    });

    // Generate recommendations
    if (results.missing_tags.length > 0) {
      results.recommendations.push(
        `L Missing ${results.missing_tags.length} tags: ${results.missing_tags.join(', ')}`
      );
      results.recommendations.push(
        `Create these tags in CompanyCam and apply them to your photos.`
      );
    }

    if (results.found_tags.length > 0) {
      results.recommendations.push(
        ` Found ${results.found_tags.length} matching tags: ${results.found_tags.join(', ')}`
      );
    }

    // Summary
    results.summary = {
      master_tag_found: results.search_results[MASTER_TAG]?.found || false,
      service_tags_found: results.found_tags.filter((tag: string) => tag !== MASTER_TAG).length,
      total_required: requiredTags.length,
      total_found: results.found_tags.length,
      total_missing: results.missing_tags.length,
      ready_for_filtering: results.search_results[MASTER_TAG]?.found &&
                          results.found_tags.filter((tag: string) => tag !== MASTER_TAG).length > 0,
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
