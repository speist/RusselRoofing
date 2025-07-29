import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';
import { ContactInput } from '@/lib/hubspot/types';
import { envMiddleware } from '@/lib/middleware/env-check';

export async function POST(request: NextRequest) {
  // Validate environment variables required for HubSpot API
  const envCheck = envMiddleware.hubspot(request);
  if (envCheck) {
    return envCheck; // Return error response if validation fails
  }

  try {
    const data = await request.json() as ContactInput;

    // Validate required fields
    if (!data.email || !data.firstname || !data.lastname) {
      return NextResponse.json(
        { error: 'Missing required fields: email, firstname, lastname' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create or update contact using HubSpot service
    const result = await hubspotService.createOrUpdateContact(data);

    if (result.success && result.data) {
      return NextResponse.json({
        contactId: result.data.id,
        email: data.email,
        message: 'Contact created/updated successfully',
        data: result.data
      });
    } else {
      console.error('[HubSpot API] Contact creation failed:', result.error);
      return NextResponse.json(
        { 
          error: result.error?.message || 'Failed to create/update contact',
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