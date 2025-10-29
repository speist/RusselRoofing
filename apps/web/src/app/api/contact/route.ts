import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';
import { ContactInput, DealInput } from '@/lib/hubspot/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      firstname,
      lastname,
      email,
      phone,
      message,
      preferredContact,
      timePreference,
      isEmergency
    } = body;

    if (!firstname || !lastname || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create contact data
    const contactData: ContactInput = {
      email,
      firstname,
      lastname,
      phone,
      address: '', // Not collected in Get in Touch form
      property_type: 'single_family', // Default value
      preferred_contact_method: preferredContact || 'email',
      preferred_contact_time: timePreference,
      lead_source: 'instant_estimate',
    };

    // Create or update contact in HubSpot
    const contactResult = await hubspotService.createOrUpdateContact(contactData);

    if (!contactResult.success) {
      console.error('[Contact API] Failed to create contact:', contactResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to create contact in HubSpot' },
        { status: 500 }
      );
    }

    const contact = contactResult.data!;
    console.log('[Contact API] Contact created/updated:', contact.id);

    // Create deal data with "5% Lead" stage
    const dealData: DealInput = {
      dealname: `${firstname} ${lastname} - Website Contact`,
      amount: '0', // No amount provided in contact form
      dealstage: 'qualifiedtobuy', // HubSpot stage for "5% Lead"
      services_requested: 'general_inquiry',
      estimate_min: 0,
      estimate_max: 0,
      is_emergency: isEmergency || false,
      project_description: message || 'Contact form inquiry',
      property_type: 'single_family',
      preferred_contact_method: preferredContact || 'email',
      preferred_contact_time: timePreference,
      lead_priority: isEmergency ? 'high' : 'low',
      lead_score: isEmergency ? 15 : 5,
    };

    // Create deal in HubSpot
    const dealResult = await hubspotService.createDeal(dealData);

    if (!dealResult.success) {
      console.error('[Contact API] Failed to create deal:', dealResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to create deal in HubSpot' },
        { status: 500 }
      );
    }

    const deal = dealResult.data!;
    console.log('[Contact API] Deal created:', deal.id);

    // Associate contact with deal
    const associationResult = await hubspotService.associateContactToDeal(
      contact.id,
      deal.id
    );

    if (!associationResult.success) {
      console.error('[Contact API] Failed to associate contact with deal:', associationResult.error);
      // Don't fail the request if association fails - contact and deal are created
    } else {
      console.log('[Contact API] Successfully associated contact with deal');
    }

    return NextResponse.json({
      success: true,
      data: {
        contactId: contact.id,
        dealId: deal.id,
      },
    });
  } catch (error: any) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
