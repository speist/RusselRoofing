import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, formatContactEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// Contact form API endpoint - sends email to info@russellroofing.com
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstname,
      lastname,
      email,
      phone,
      address,
      city,
      state,
      zip,
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

    const subject = isEmergency
      ? `[EMERGENCY] New Contact: ${firstname} ${lastname}`
      : `New Contact Form: ${firstname} ${lastname}`;

    const html = formatContactEmail({
      firstname,
      lastname,
      email,
      phone,
      address,
      city,
      state,
      zip,
      message,
      preferredContact,
      timePreference,
      isEmergency,
    });

    await sendEmail({ subject, html });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
