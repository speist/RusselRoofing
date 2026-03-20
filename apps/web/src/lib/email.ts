import { Resend } from 'resend';

const TO_EMAIL = 'info@russellroofing.com';

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not configured');
  }
  return new Resend(apiKey);
}

interface SendEmailOptions {
  subject: string;
  html: string;
}

export async function sendEmail({ subject, html }: SendEmailOptions) {
  const resend = getResend();
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@russellroofing.com';

  const { data, error } = await resend.emails.send({
    from: `Russell Roofing Website <${fromEmail}>`,
    to: [TO_EMAIL],
    subject,
    html,
  });

  if (error) {
    console.error('[Email] Failed to send:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log('[Email] Sent successfully:', data?.id);
  return data;
}

// Format a contact form submission into an HTML email
export function formatContactEmail(data: {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  message: string;
  preferredContact?: string;
  timePreference?: string;
  isEmergency?: boolean;
}): string {
  const emergencyBanner = data.isEmergency
    ? `<div style="background-color: #fee2e2; border: 2px solid #dc2626; padding: 12px; margin-bottom: 20px; border-radius: 8px;">
        <strong style="color: #dc2626; font-size: 16px;">EMERGENCY REQUEST</strong>
      </div>`
    : '';

  const addressLine = [data.address, data.city, data.state, data.zip]
    .filter(Boolean)
    .join(', ');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${emergencyBanner}
      <h2 style="color: #960120; border-bottom: 2px solid #960120; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; width: 200px; vertical-align: top;">Name:</td>
          <td style="padding: 8px 12px;">${data.firstname} ${data.lastname}</td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Email:</td>
          <td style="padding: 8px 12px;"><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Phone:</td>
          <td style="padding: 8px 12px;"><a href="tel:${data.phone}">${data.phone}</a></td>
        </tr>
        ${addressLine ? `
        <tr style="background-color: #f9fafb;">
          <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Property Address:</td>
          <td style="padding: 8px 12px;">${addressLine}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Preferred Contact:</td>
          <td style="padding: 8px 12px;">${data.preferredContact || 'Not specified'}</td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="padding: 8px 12px; font-weight: bold; vertical-align: top;">Best Time:</td>
          <td style="padding: 8px 12px;">${data.timePreference || 'Not specified'}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; padding: 16px; background-color: #f3f4f6; border-radius: 8px;">
        <strong>Message:</strong>
        <p style="white-space: pre-wrap; margin-top: 8px;">${data.message}</p>
      </div>
      <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
        Submitted from russellroofing.com on ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
      </p>
    </div>
  `;
}

// Format an estimate form submission into an HTML email
export function formatEstimateEmail(data: {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredContact: string;
    timePreference: string;
    isEmergency: boolean;
  };
  property: {
    propertyType: string;
    address: string;
  };
  project: {
    selectedServices: string[];
    fieldValues: Record<string, string | number | undefined>;
    estimateRange: { min: number; max: number };
  };
}): string {
  const { contact, property, project } = data;

  const emergencyBanner = contact.isEmergency
    ? `<div style="background-color: #fee2e2; border: 2px solid #dc2626; padding: 12px; margin-bottom: 20px; border-radius: 8px;">
        <strong style="color: #dc2626; font-size: 16px;">EMERGENCY REQUEST</strong>
      </div>`
    : '';

  const fieldDetails = Object.entries(project.fieldValues)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `<tr><td style="padding: 6px 12px; font-weight: bold;">${key}:</td><td style="padding: 6px 12px;">${value}</td></tr>`)
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${emergencyBanner}
      <h2 style="color: #960120; border-bottom: 2px solid #960120; padding-bottom: 10px;">
        New Estimate Request
      </h2>

      <h3 style="color: #374151; margin-top: 20px;">Contact Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; width: 200px;">Name:</td>
          <td style="padding: 8px 12px;">${contact.firstName} ${contact.lastName}</td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="padding: 8px 12px; font-weight: bold;">Email:</td>
          <td style="padding: 8px 12px;"><a href="mailto:${contact.email}">${contact.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 12px;"><a href="tel:${contact.phone}">${contact.phone}</a></td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="padding: 8px 12px; font-weight: bold;">Preferred Contact:</td>
          <td style="padding: 8px 12px;">${contact.preferredContact}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold;">Best Time:</td>
          <td style="padding: 8px 12px;">${contact.timePreference}</td>
        </tr>
      </table>

      <h3 style="color: #374151; margin-top: 20px;">Property Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; width: 200px;">Property Type:</td>
          <td style="padding: 8px 12px;">${property.propertyType}</td>
        </tr>
        <tr style="background-color: #f9fafb;">
          <td style="padding: 8px 12px; font-weight: bold;">Address:</td>
          <td style="padding: 8px 12px;">${property.address}</td>
        </tr>
      </table>

      <h3 style="color: #374151; margin-top: 20px;">Services Requested</h3>
      <ul style="margin: 8px 0; padding-left: 20px;">
        ${project.selectedServices.map(s => `<li style="padding: 4px 0;">${s}</li>`).join('')}
      </ul>

      ${fieldDetails ? `
      <h3 style="color: #374151; margin-top: 20px;">Project Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${fieldDetails}
      </table>` : ''}

      <div style="margin-top: 20px; padding: 16px; background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
        <strong>Estimate Range:</strong> $${project.estimateRange.min.toLocaleString()} - $${project.estimateRange.max.toLocaleString()}
      </div>

      <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
        Submitted from russellroofing.com on ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
      </p>
    </div>
  `;
}
