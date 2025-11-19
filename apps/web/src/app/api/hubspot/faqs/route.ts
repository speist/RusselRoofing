import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const serviceArea = searchParams.get('serviceArea');
    const id = searchParams.get('id');

    // If ID is provided, get single FAQ by ID
    if (id) {
      console.log('[FAQ API] Fetching FAQ by ID:', id);
      const result = await hubspotService.getFAQById(id);

      if (result.success && result.data) {
        return NextResponse.json({
          success: true,
          data: result.data,
        });
      } else if (result.success && !result.data) {
        console.log('[FAQ API] FAQ not found for ID:', id);
        return NextResponse.json(
          {
            success: false,
            error: 'FAQ not found',
          },
          { status: 404 }
        );
      } else {
        console.error('[FAQ API] Error fetching FAQ by ID:', result.error);
        return NextResponse.json(
          {
            success: false,
            error: result.error?.message || 'Failed to fetch FAQ',
          },
          { status: 500 }
        );
      }
    }

    // Otherwise, get list of FAQs (optionally filtered by service area)
    console.log('[FAQ API] Fetching FAQs for service area:', serviceArea || 'all');
    const result = await hubspotService.getFAQs({
      serviceArea: serviceArea || undefined,
    });

    if (result.success && result.data) {
      console.log('[FAQ API] Returning FAQs:', {
        total: result.data.total,
        count: result.data.results.length,
        serviceArea: serviceArea || 'all',
        sample: result.data.results.slice(0, 2).map(faq => ({
          id: faq.id,
          service_area: faq.properties.service_area,
          question: faq.properties.question.substring(0, 50) + '...',
        })),
      });

      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      console.error('[FAQ API] Failed to fetch FAQs:', result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error?.message || 'Failed to fetch FAQs',
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[FAQ API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
