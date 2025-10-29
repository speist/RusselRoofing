import { NextRequest, NextResponse } from 'next/server';
import { hubspotService, NoteInput } from '@/lib/hubspot/api';
import { ContactInput, DealInput } from '@/lib/hubspot/types';

// Contact form API endpoint - handles HubSpot integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the raw body from the form
    console.log('[Contact API] Received form data:', {
      body,
      timestamp: new Date().toISOString(),
    });

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

    // First, search for existing contact by email and name
    console.log('[Contact API] Searching for existing contact:', { email, firstname, lastname });
    const searchResult = await hubspotService.findContactByEmailAndName(email, firstname, lastname);

    let contact: { id: string };

    if (searchResult.success && searchResult.data) {
      // Contact found - use existing contact
      contact = searchResult.data;
      console.log('[Contact API] Using existing contact:', contact.id);
    } else {
      // No contact found - create new contact
      console.log('[Contact API] Creating new contact');
      const contactData: ContactInput = {
        email,
        firstname,
        lastname,
        phone,
        address: '', // Not collected in Get in Touch form
        property_type: 'single_family', // Default value (note: property_type is not sent to HubSpot)
        preferred_contact_method: preferredContact || 'email',
        preferred_contact_time: timePreference,
        lead_source: 'RR Website',
        lead_source_category: 'Digital Marketing / Online Presence',
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

      contact = contactResult.data!;
      console.log('[Contact API] Contact created/updated:', contact.id);
    }

    // Create deal data with "Lead (5%)" stage in Sales Pipeline
    // Pipeline ID: 765276511 (Sales Pipeline)
    // Stage ID: 1114664036 (Lead 5%)
    const dealData: DealInput = {
      dealname: `${firstname} ${lastname} - RR Website`,
      amount: '0', // No amount provided in contact form
      pipeline: '765276511', // Sales Pipeline (internal ID)
      dealstage: '1114664036', // Lead (5%) stage (internal ID)
      services_requested: '', // Not used in contact form
      estimate_min: 0, // Not used in contact form
      estimate_max: 0, // Not used in contact form
      is_emergency: isEmergency || false,
      project_description: message || 'Contact form inquiry',
      property_type: 'single_family',
      preferred_contact_method: preferredContact || 'email',
      preferred_contact_time: timePreference,
      lead_priority: isEmergency ? 'high' : 'low',
      lead_score: isEmergency ? 15 : 5,
    };

    // Log deal data before sending to HubSpot
    console.log('[Contact API] Deal data before createDeal:', {
      dealData,
      preferredContact,
      timePreference,
      isEmergency,
      timestamp: new Date().toISOString(),
    });

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

    // Create note with message if provided
    if (message && message.trim()) {
      const noteData: NoteInput = {
        note: message.trim(),
        timestamp: Date.now(),
      };

      const noteResult = await hubspotService.createNote(noteData);

      if (noteResult.success && noteResult.data) {
        const note = noteResult.data;
        console.log('[Contact API] Note created:', note.id);

        // Associate note with deal
        const noteDealAssocResult = await hubspotService.associateNoteToDeal(
          note.id,
          deal.id
        );

        if (!noteDealAssocResult.success) {
          console.error('[Contact API] Failed to associate note with deal:', noteDealAssocResult.error);
        } else {
          console.log('[Contact API] Successfully associated note with deal');
        }

        // Associate note with contact
        const noteContactAssocResult = await hubspotService.associateNoteToContact(
          note.id,
          contact.id
        );

        if (!noteContactAssocResult.success) {
          console.error('[Contact API] Failed to associate note with contact:', noteContactAssocResult.error);
        } else {
          console.log('[Contact API] Successfully associated note with contact');
        }
      } else {
        console.error('[Contact API] Failed to create note:', noteResult.error);
      }
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
