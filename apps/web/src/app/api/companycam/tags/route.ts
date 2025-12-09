import { NextRequest, NextResponse } from 'next/server';
import { getCompanyCamClient } from '@/lib/companycam';
import { MASTER_TAG, SERVICE_TAGS, BEFORE_TAG, AFTER_TAG } from '@/lib/companycam/types';

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

    // Check which tags we're looking for
    const tagAnalysis = {
      total_tags: allTags.length,
      all_tags: allTags,
      filtering_analysis: {
        master_tag: {
          looking_for: MASTER_TAG,
          found: allTags.some((tag: any) =>
            (tag.display_value || tag.value || tag.name || '').toLowerCase() === MASTER_TAG.toLowerCase()
          ),
          exact_match: allTags.find((tag: any) =>
            (tag.display_value || tag.value || tag.name || '').toLowerCase() === MASTER_TAG.toLowerCase()
          ),
          similar_matches: allTags.filter((tag: any) => {
            const tagName = (tag.display_value || tag.value || tag.name || '').toLowerCase();
            return tagName.includes('website') ||
                   tagName.includes('rr') ||
                   tagName.includes('russell');
          }),
        },
        service_tags: SERVICE_TAGS.map(serviceTag => {
          const exactMatch = allTags.find((tag: any) =>
            (tag.display_value || tag.value || tag.name || '').toLowerCase() === serviceTag.toLowerCase()
          );
          return {
            looking_for: serviceTag,
            found: !!exactMatch,
            exact_match: exactMatch,
            similar_matches: allTags.filter((tag: any) =>
              (tag.display_value || tag.value || tag.name || '').toLowerCase().includes(serviceTag.toLowerCase())
            ),
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

  // Check for master tag
  const hasMasterTag = allTags.some(tag =>
    (tag.display_value || tag.value || tag.name || '').toLowerCase() === MASTER_TAG.toLowerCase()
  );
  if (!hasMasterTag) {
    const websiteTags = allTags.filter(tag => {
      const tagName = (tag.display_value || tag.value || tag.name || '').toLowerCase();
      return tagName.includes('website') ||
             tagName.includes('rr') ||
             tagName.includes('russell');
    });
    if (websiteTags.length > 0) {
      recommendations.push(`Master tag "${MASTER_TAG}" not found. Did you mean: ${websiteTags.map(t => t.display_value || t.value || t.name || '').join(', ')}?`);
    } else {
      recommendations.push(`Master tag "${MASTER_TAG}" not found in CompanyCam. Please create this tag and apply it to your photos.`);
    }
  }

  // Check for service tags
  const foundServiceTags = SERVICE_TAGS.filter(serviceTag =>
    allTags.some(tag => (tag.display_value || tag.value || tag.name || '').toLowerCase() === serviceTag.toLowerCase())
  );
  const missingServiceTags = SERVICE_TAGS.filter(serviceTag =>
    !allTags.some(tag => (tag.display_value || tag.value || tag.name || '').toLowerCase() === serviceTag.toLowerCase())
  );

  if (missingServiceTags.length > 0) {
    recommendations.push(`Missing service tags: ${missingServiceTags.join(', ')}. These tags should be created in CompanyCam.`);
  }

  if (foundServiceTags.length > 0) {
    recommendations.push(` Found ${foundServiceTags.length} matching service tags: ${foundServiceTags.join(', ')}`);
  }

  // Overall status
  if (hasMasterTag && foundServiceTags.length > 0) {
    recommendations.push(` Filtering should work! Make sure photos have both the master tag ("${MASTER_TAG}") and at least one service tag.`);
  }

  return recommendations;
}
