import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.contactId || !data.dealId) {
      return NextResponse.json(
        { error: 'Missing required fields: contactId, dealId' },
        { status: 400 }
      );
    }

    // Associate contact with deal using HubSpot service
    const result = await hubspotService.associateContactToDeal(data.contactId, data.dealId);

    if (result.success) {
      return NextResponse.json({
        dealId: data.dealId,
        contactId: data.contactId,
        message: 'Association created successfully'
      });
    } else {
      console.error('[HubSpot API] Association failed:', result.error);
      return NextResponse.json(
        { 
          error: result.error?.message || 'Failed to associate deal with contact',
          details: result.error
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[HubSpot API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}