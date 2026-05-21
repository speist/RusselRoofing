const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_SCORE_THRESHOLD = 0.7;

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export async function verifyRecaptchaToken(
  token: string,
  expectedAction?: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.error('[reCAPTCHA] RECAPTCHA_SECRET_KEY is not set — spam protection is DISABLED. Configure this env var in Vercel.');
    return { success: true };
  }

  if (!token) {
    console.warn('[reCAPTCHA] Submission rejected: no token provided', { action: expectedAction });
    return { success: false, error: 'Missing reCAPTCHA token' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data: RecaptchaVerifyResponse = await response.json();

    if (!data.success) {
      console.warn('[reCAPTCHA] Submission rejected: Google verification failed', {
        action: expectedAction,
        errorCodes: data['error-codes'],
      });
      return { success: false, error: 'reCAPTCHA verification failed' };
    }

    if (expectedAction && data.action !== expectedAction) {
      console.warn('[reCAPTCHA] Submission rejected: action mismatch', {
        expected: expectedAction,
        received: data.action,
      });
      return { success: false, error: 'reCAPTCHA action mismatch' };
    }

    if (data.score !== undefined && data.score < RECAPTCHA_SCORE_THRESHOLD) {
      console.warn('[reCAPTCHA] Submission rejected: score below threshold', {
        action: expectedAction,
        score: data.score,
        threshold: RECAPTCHA_SCORE_THRESHOLD,
      });
      return { success: false, score: data.score, error: 'Submission blocked as suspected spam' };
    }

    console.info('[reCAPTCHA] Submission verified', { action: expectedAction, score: data.score });
    return { success: true, score: data.score };
  } catch (error) {
    console.error('[reCAPTCHA] Verification error:', error);
    return { success: false, error: 'reCAPTCHA verification error' };
  }
}

// Honeypot field name — must match the hidden input rendered in forms.
// Bots that fill all visible fields will populate this too; humans never see it.
export const HONEYPOT_FIELD_NAME = 'website_url';

export function checkHoneypot(value: unknown, action?: string): { success: boolean; error?: string } {
  if (typeof value === 'string' && value.trim().length > 0) {
    console.warn('[Honeypot] Submission rejected: honeypot field was filled', { action, value: value.slice(0, 80) });
    return { success: false, error: 'Submission blocked as suspected spam' };
  }
  return { success: true };
}
