import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;
    const liveOnly = searchParams.get('liveOnly') !== 'false'; // Default to true
    const id = searchParams.get('id');

    // If ID is provided, get single community activity by ID
    if (id) {
      console.log('[Community API] Fetching community activity by ID:', id);
      const result = await hubspotService.getCommunityActivityById(id);

      if (result.success && result.data) {
        console.log('[Community API] Activity found:', {
          id: result.data.id,
          name: result.data.properties.name,
          live: result.data.properties.live,
        });
        return NextResponse.json({
          success: true,
          data: result.data,
        });
      } else if (result.success && !result.data) {
        console.log('[Community API] Activity not found for ID:', id);
        return NextResponse.json(
          {
            success: false,
            error: 'Community activity not found',
          },
          { status: 404 }
        );
      } else {
        console.error('[Community API] Error fetching activity by ID:', result.error);
        return NextResponse.json(
          {
            success: false,
            error: result.error?.message || 'Failed to fetch community activity',
          },
          { status: 500 }
        );
      }
    }

    // Otherwise, get list of community activities
    console.log('[Community API] Fetching activities list with params:', { limit, liveOnly });
    const result = await hubspotService.getCommunityActivities({
      limit,
      liveOnly,
    });

    if (result.success && result.data) {
      console.log('[Community API] Returning activities:', {
        total: result.data.total,
        count: result.data.results.length,
        sample: result.data.results.slice(0, 2).map(activity => ({
          id: activity.id,
          name: activity.properties.name,
          year: activity.properties.year,
          impact: activity.properties.impact,
          live: activity.properties.live,
        })),
      });
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      console.error('[Community API] Failed to fetch activities:', result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error?.message || 'Failed to fetch community activities',
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Community API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
