import { NextRequest, NextResponse } from 'next/server';
import { getCompanyCamClient } from '@/lib/companycam';
import { SERVICE_TAG_IDS, BEFORE_TAG, AFTER_TAG } from '@/lib/companycam/types';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * GET /api/companycam/tags
 *
 * Lists all tags in your CompanyCam account (sorted alphabetically)
 * This helps debug tag filtering by showing exactly what tags exist
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
    // Default page size is 25, so we need to fetch multiple pages
    let allTagsArray: any[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await client.get<any>(`/tags?page=${page}&per_page=100`);
      const tagsArray = Array.isArray(response) ? response : (response.data || []);

      if (tagsArray.length === 0) {
        hasMorePages = false;
      } else {
        allTagsArray = [...allTagsArray, ...tagsArray];
        page++;

        // Safety limit to prevent infinite loops
        if (page > 10 || tagsArray.length < 100) {
          hasMorePages = false;
        }
      }
    }

    const tagsArray = allTagsArray;

    // Extract tag information
    const allTags = tagsArray.map((tag: any) => ({
      id: tag.id,
      display_value: tag.display_value,
      value: tag.value,
      name: tag.name,
      color: tag.color,
      tag_type: tag.tag_type,
      created_at: tag.created_at,
    }));

    // Check if user just wants simple list
    const { searchParams } = new URL(request.url);
    if (searchParams.get('simple') === 'true') {
      return NextResponse.json({
        total_tags: allTags.length,
        tag_display_values: allTags.map((tag: any) => tag.display_value || tag.value || tag.name).sort(),
        all_tags: allTags.sort((a: any, b: any) =>
          (a.display_value || a.value || a.name || '').localeCompare(b.display_value || b.value || b.name || '')
        ),
      }, { status: 200 });
    }

    // Check which tags we're looking for (by ID)
    const tagAnalysis = {
      total_tags: allTags.length,
      all_tags: allTags,
      filtering_analysis: {
        service_tags: Object.entries(SERVICE_TAG_IDS).map(([category, tagId]) => {
          const matchById = allTags.find((tag: any) => String(tag.id) === tagId);
          return {
            category,
            tag_id: tagId,
            found: !!matchById,
            match: matchById,
          };
        }),
        before_after_tags: {
          before: {
            looking_for: BEFORE_TAG,
            found: allTags.some((tag: any) =>
              (tag.display_value || tag.value || tag.name || '').toLowerCase() === BEFORE_TAG.toLowerCase()
            ),
            exact_match: allTags.find((tag: any) =>
              (tag.display_value || tag.value || tag.name || '').toLowerCase() === BEFORE_TAG.toLowerCase()
            ),
          },
          after: {
            looking_for: AFTER_TAG,
            found: allTags.some((tag: any) =>
              (tag.display_value || tag.value || tag.name || '').toLowerCase() === AFTER_TAG.toLowerCase()
            ),
            exact_match: allTags.find((tag: any) =>
              (tag.display_value || tag.value || tag.name || '').toLowerCase() === AFTER_TAG.toLowerCase()
            ),
          },
        },
      },
      recommendations: generateRecommendations(allTags),
    };

    return NextResponse.json(tagAnalysis, { status: 200 });

  } catch (error) {
    console.error('[CompanyCam Tags] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

/**
 * Generate recommendations based on tag analysis
 */
function generateRecommendations(allTags: any[]): string[] {
  const recommendations: string[] = [];

  const foundCategories: string[] = [];
  const missingCategories: string[] = [];

  for (const [category, tagId] of Object.entries(SERVICE_TAG_IDS)) {
    const found = allTags.some((tag: any) => String(tag.id) === tagId);
    if (found) {
      foundCategories.push(category);
    } else {
      missingCategories.push(`${category} (ID: ${tagId})`);
    }
  }

  if (missingCategories.length > 0) {
    recommendations.push(`Missing service tags: ${missingCategories.join(', ')}.`);
  }

  if (foundCategories.length > 0) {
    recommendations.push(`Found ${foundCategories.length} matching service tags: ${foundCategories.join(', ')}`);
    recommendations.push(`Filtering should work! Photos need at least one service tag to appear on the website.`);
  }

  return recommendations;
}
