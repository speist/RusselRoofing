import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get contact profile for progressive profiling
    const profile = await hubspotService.getContactProfile(email);

    if (profile.isReturning && profile.knownFields) {
      return NextResponse.json({
        isReturning: true,
        welcomeMessage: profile.welcomeMessage,
        knownFields: profile.knownFields
      });
    }

    // Return 404 for new visitors (expected behavior)
    return NextResponse.json(
      { isReturning: false },
      { status: 404 }
    );

  } catch (error: any) {
    console.error('[HubSpot API] Progressive profiling error:', error);
    
    // For progressive profiling, we fail silently and return 404
    // This allows the form to work normally for new users
    return NextResponse.json(
      { isReturning: false },
      { status: 404 }
    );
  }
}