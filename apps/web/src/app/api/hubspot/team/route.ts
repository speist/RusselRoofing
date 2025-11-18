import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Don't cache, always fetch fresh data

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;
    const liveOnly = searchParams.get('liveOnly') !== 'false'; // Default to true
    const id = searchParams.get('id');

    // If ID is provided, get single team member by ID
    if (id) {
      console.log('[Team API] Fetching team member by ID:', id);
      const result = await hubspotService.getTeamMemberById(id);

      if (result.success && result.data) {
        console.log('[Team API] Team member found:', {
          id: result.data.id,
          name: result.data.properties.employee_name,
          live: result.data.properties.live,
        });
        return NextResponse.json({
          success: true,
          data: result.data,
        });
      } else if (result.success && !result.data) {
        console.log('[Team API] Team member not found for ID:', id);
        return NextResponse.json(
          {
            success: false,
            error: 'Team member not found',
          },
          { status: 404 }
        );
      } else {
        console.error('[Team API] Error fetching team member by ID:', result.error);
        return NextResponse.json(
          {
            success: false,
            error: result.error?.message || 'Failed to fetch team member',
          },
          { status: 500 }
        );
      }
    }

    // Otherwise, get list of team members
    console.log('[Team API] Fetching team members list with params:', { limit, liveOnly });
    const result = await hubspotService.getTeamMembers({
      limit,
      liveOnly,
    });

    if (result.success && result.data) {
      console.log('[Team API] Returning team members:', {
        total: result.data.total,
        count: result.data.results.length,
        sample: result.data.results.slice(0, 2).map(member => ({
          id: member.id,
          name: member.properties.employee_name,
          title: member.properties.employee_title,
          live: member.properties.live,
        })),
      });
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      console.error('[Team API] Failed to fetch team members:', result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error?.message || 'Failed to fetch team members',
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Team API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
