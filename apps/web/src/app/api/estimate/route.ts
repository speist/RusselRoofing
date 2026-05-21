import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, formatEstimateEmail } from '@/lib/email';
import { verifyRecaptchaToken, checkHoneypot, HONEYPOT_FIELD_NAME } from '@/lib/recaptcha';

export const dynamic = 'force-dynamic';

// Estimate form API endpoint - sends email to info@russellroofing.com
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { contact, property, project, recaptchaToken } = body;

    // Honeypot check (cheap, runs before remote reCAPTCHA call)
    const honeypotResult = checkHoneypot(body[HONEYPOT_FIELD_NAME], 'estimate_submit');
    if (!honeypotResult.success) {
      // Return a 200 to avoid signaling rejection to the bot
      return NextResponse.json({ success: true });
    }

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken, 'estimate_submit');
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { success: false, error: recaptchaResult.error || 'Spam check failed' },
        { status: 403 }
      );
    }

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
