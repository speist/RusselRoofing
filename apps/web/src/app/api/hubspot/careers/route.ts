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

    // If ID is provided, get single career by ID
    if (id) {
      console.log('[Careers API] Fetching career by ID:', id);
      const result = await hubspotService.getCareerById(id);

      if (result.success && result.data) {
        console.log('[Careers API] Career found:', {
          id: result.data.id,
          title: result.data.properties.job_title,
          live: result.data.properties.live,
        });
        return NextResponse.json({
          success: true,
          data: result.data,
        });
      } else if (result.success && !result.data) {
        console.log('[Careers API] Career not found for ID:', id);
        return NextResponse.json(
          {
            success: false,
            error: 'Career posting not found',
          },
          { status: 404 }
        );
      } else {
        console.error('[Careers API] Error fetching career by ID:', result.error);
        return NextResponse.json(
          {
            success: false,
            error: result.error?.message || 'Failed to fetch career posting',
          },
          { status: 500 }
        );
      }
    }

    // Otherwise, get list of careers
    console.log('[Careers API] Fetching careers list with params:', { limit, liveOnly });
    const result = await hubspotService.getCareers({
      limit,
      liveOnly,
    });

    if (result.success && result.data) {
      console.log('[Careers API] Returning careers:', {
        total: result.data.total,
        count: result.data.results.length,
        sample: result.data.results.slice(0, 2).map(career => ({
          id: career.id,
          title: career.properties.job_title,
          department: career.properties.department,
          location: career.properties.location,
          employment_type: career.properties.employment_type,
          salary_range: career.properties.salary_range,
          live: career.properties.live,
        })),
      });
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      console.error('[Careers API] Failed to fetch careers:', result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error?.message || 'Failed to fetch careers',
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Careers API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
