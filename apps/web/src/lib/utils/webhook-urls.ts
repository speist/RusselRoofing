/**
 * Webhook URL utilities for third-party integrations
 * Handles production domain configuration for webhooks
 */

import { getWebhookURL, getAbsoluteURL } from './urls';

/**
 * Get HubSpot webhook URLs for different event types
 */
export function getHubSpotWebhookURLs() {
  return {
    contact: getWebhookURL('/hubspot/contact'),
    deal: getWebhookURL('/hubspot/deal'),
    company: getWebhookURL('/hubspot/company'),
    ticket: getWebhookURL('/hubspot/ticket'),
  };
}

/**
 * Get Instagram webhook URLs (if needed for future integration)
 */
export function getInstagramWebhookURLs() {
  return {
    media: getWebhookURL('/instagram/media'),
    story: getWebhookURL('/instagram/story'),
  };
}

/**
 * Get OAuth redirect URLs for third-party authentication
 */
export function getOAuthRedirectURLs() {
  return {
    facebook: getAbsoluteURL('/auth/facebook/callback'),
    instagram: getAbsoluteURL('/auth/instagram/callback'),
    google: getAbsoluteURL('/auth/google/callback'),
  };
}

/**
 * Get all webhook configuration for external services
 * Used when configuring third-party services
 */
export function getAllWebhookConfig() {
  return {
    hubspot: getHubSpotWebhookURLs(),
    instagram: getInstagramWebhookURLs(),
    oauth: getOAuthRedirectURLs(),
  };
}

/**
 * Validate webhook URL format
 * @param url - Webhook URL to validate
 * @returns True if URL is properly formatted
 */
export function isValidWebhookURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && urlObj.pathname.startsWith('/api/webhooks/');
  } catch {
    return false;
  }
}

/**
 * Get webhook URL for environment (development vs production)
 * Useful for displaying configuration instructions
 */
export function getWebhookConfigInstructions() {
  const config = getAllWebhookConfig();
  
  return {
    hubspot: {
      description: 'Configure these webhook URLs in your HubSpot app settings:',
      urls: config.hubspot,
    },
    instagram: {
      description: 'Configure these webhook URLs in your Facebook/Instagram app settings:',
      urls: config.instagram,
    },
    oauth: {
      description: 'Configure these redirect URLs in your OAuth app settings:',
      urls: config.oauth,
    },
  };
}