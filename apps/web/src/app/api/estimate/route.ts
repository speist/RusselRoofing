import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, formatEstimateEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// Estimate form API endpoint - sends email to info@russellroofing.com
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { contact, property, project } = body;

    if (!contact?.firstName || !contact?.lastName || !contact?.email || !contact?.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required contact fields' },
        { status: 400 }
      );
    }

    if (!property?.address) {
      return NextResponse.json(
        { success: false, error: 'Missing property address' },
        { status: 400 }
      );
    }

    const subject = contact.isEmergency
      ? `[EMERGENCY] New Estimate Request: ${contact.firstName} ${contact.lastName}`
      : `New Estimate Request: ${contact.firstName} ${contact.lastName}`;

    const html = formatEstimateEmail({ contact, property, project });

    await sendEmail({ subject, html });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Estimate API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
