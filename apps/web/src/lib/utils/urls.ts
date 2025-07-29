/**
 * URL Utility Functions
 * Environment-aware URL generation for custom domain support
 */

import { getConfig } from '../config';

/**
 * URL Configuration interface for type safety
 */
export interface URLConfig {
  baseURL: string;
  apiURL: string;
  webhookURL: string;
  domain: string;
  secure: boolean;
}

/**
 * Get URL configuration based on current environment
 */
export function getURLConfig(): URLConfig {
  const config = getConfig();
  const baseURL = config.siteUrl;
  const apiURL = config.apiUrl;
  
  // Extract domain from baseURL
  const urlObj = new URL(baseURL);
  const domain = urlObj.hostname + (urlObj.port ? `:${urlObj.port}` : '');
  const secure = urlObj.protocol === 'https:';
  
  return {
    baseURL,
    apiURL,
    webhookURL: `${apiURL}/webhooks`,
    domain,
    secure
  };
}

/**
 * Generate absolute URL from relative path
 * @param path - Relative path (with or without leading slash)
 * @returns Absolute URL
 */
export function getAbsoluteURL(path: string): string {
  const { baseURL } = getURLConfig();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseURL}${cleanPath}`;
}

/**
 * Generate API URL for endpoint
 * @param endpoint - API endpoint (with or without leading slash)
 * @returns Full API URL
 */
export function getAPIURL(endpoint: string): string {
  const { apiURL } = getURLConfig();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${apiURL}${cleanEndpoint}`;
}

/**
 * Generate webhook URL
 * @param webhook - Webhook path (with or without leading slash)
 * @returns Full webhook URL
 */
export function getWebhookURL(webhook: string): string {
  const { webhookURL } = getURLConfig();
  const cleanWebhook = webhook.startsWith('/') ? webhook : `/${webhook}`;
  return `${webhookURL}${cleanWebhook}`;
}

/**
 * Check if current context is secure (HTTPS)
 * @returns True if running over HTTPS
 */
export function isSecureContext(): boolean {
  const { secure } = getURLConfig();
  return secure;
}

/**
 * Generate canonical URL for SEO
 * @param path - Page path
 * @returns Canonical URL
 */
export function getCanonicalURL(path: string = '/'): string {
  return getAbsoluteURL(path);
}

/**
 * Get current domain configuration
 * @returns Domain configuration object
 */
export function getDomainConfig() {
  const { domain, secure } = getURLConfig();
  return {
    domain,
    secure,
    protocol: secure ? 'https:' : 'http:',
    origin: `${secure ? 'https' : 'http'}://${domain}`
  };
}

/**
 * Validate if a URL belongs to the current domain
 * @param url - URL to validate
 * @returns True if URL is from current domain
 */
export function isCurrentDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const { domain } = getURLConfig();
    return urlObj.hostname === domain.split(':')[0];
  } catch {
    return false;
  }
}

/**
 * Convert relative URL to absolute if needed
 * @param url - URL that might be relative or absolute
 * @returns Absolute URL
 */
export function ensureAbsoluteURL(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return getAbsoluteURL(url);
}