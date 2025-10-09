import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields - need contactId and either dealId or ticketId
    if (!data.contactId || (!data.dealId && !data.ticketId)) {
      return NextResponse.json(
        { error: 'Missing required fields: contactId and either dealId or ticketId' },
        { status: 400 }
      );
    }

    let result;
    let associationType = '';
    let associatedId = '';

    // Associate contact with deal or ticket based on provided data
    if (data.dealId) {
      result = await hubspotService.associateContactToDeal(data.contactId, data.dealId);
      associationType = 'deal';
      associatedId = data.dealId;
    } else if (data.ticketId) {
      result = await hubspotService.associateContactToTicket(data.contactId, data.ticketId);
      associationType = 'ticket';
      associatedId = data.ticketId;
    }

    if (result && result.success) {
      return NextResponse.json({
        [associationType === 'deal' ? 'dealId' : 'ticketId']: associatedId,
        contactId: data.contactId,
        message: `Contact successfully associated with ${associationType}`
      });
    } else {
      console.error('[HubSpot API] Association failed:', result?.error);
      return NextResponse.json(
        {
          error: result?.error?.message || `Failed to associate ${associationType} with contact`,
          details: result?.error
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