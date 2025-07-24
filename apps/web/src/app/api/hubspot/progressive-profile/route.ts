import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Get progressive profile data
    const profile = await hubspotService.getContactProfile(email);

    return NextResponse.json(profile);

  } catch (error: any) {
    console.error('[HubSpot API] Progressive profiling error:', error);
    
    // For progressive profiling, we fail gracefully
    // Return a basic profile indicating new user
    return NextResponse.json({
      isReturning: false
    });
  }
}