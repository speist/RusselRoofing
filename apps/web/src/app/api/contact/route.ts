import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, formatContactEmail } from '@/lib/email';
import { verifyRecaptchaToken, checkHoneypot, HONEYPOT_FIELD_NAME } from '@/lib/recaptcha';

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
      isEmergency,
      recaptchaToken
    } = body;

    // Honeypot check (cheap, runs before remote reCAPTCHA call)
    const honeypotResult = checkHoneypot(body[HONEYPOT_FIELD_NAME], 'contact_submit');
    if (!honeypotResult.success) {
      // Return a 200 to avoid signaling rejection to the bot
      return NextResponse.json({ success: true });
    }

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken, 'contact_submit');
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { success: false, error: recaptchaResult.error || 'Spam check failed' },
        { status: 403 }
      );
    }

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
