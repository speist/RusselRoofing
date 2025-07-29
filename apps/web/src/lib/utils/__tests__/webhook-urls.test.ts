/**
 * Tests for webhook URL utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getHubSpotWebhookURLs,
  getInstagramWebhookURLs,
  getOAuthRedirectURLs,
  getAllWebhookConfig,
  isValidWebhookURL,
  getWebhookConfigInstructions
} from '../webhook-urls';
import { resetConfig } from '../../config';

describe('Webhook URL Utils', () => {
  beforeEach(() => {
    resetConfig();
  });

  afterEach(() => {
    resetConfig();
    // Clean up environment variables
    delete process.env.NODE_ENV;
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  describe('getHubSpotWebhookURLs', () => {
    it('should return HubSpot webhook URLs for development', () => {
      process.env.NODE_ENV = 'development';
      
      const urls = getHubSpotWebhookURLs();
      
      expect(urls.contact).toBe('http://localhost:3000/api/webhooks/hubspot/contact');
      expect(urls.deal).toBe('http://localhost:3000/api/webhooks/hubspot/deal');
      expect(urls.company).toBe('http://localhost:3000/api/webhooks/hubspot/company');
      expect(urls.ticket).toBe('http://localhost:3000/api/webhooks/hubspot/ticket');
    });

    it('should return HubSpot webhook URLs for production', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      
      const urls = getHubSpotWebhookURLs();
      
      expect(urls.contact).toBe('https://russellroofing.com/api/webhooks/hubspot/contact');
      expect(urls.deal).toBe('https://russellroofing.com/api/webhooks/hubspot/deal');
      expect(urls.company).toBe('https://russellroofing.com/api/webhooks/hubspot/company');
      expect(urls.ticket).toBe('https://russellroofing.com/api/webhooks/hubspot/ticket');
    });
  });

  describe('getInstagramWebhookURLs', () => {
    it('should return Instagram webhook URLs for production', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      
      const urls = getInstagramWebhookURLs();
      
      expect(urls.media).toBe('https://russellroofing.com/api/webhooks/instagram/media');
      expect(urls.story).toBe('https://russellroofing.com/api/webhooks/instagram/story');
    });
  });

  describe('getOAuthRedirectURLs', () => {
    it('should return OAuth redirect URLs', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      
      const urls = getOAuthRedirectURLs();
      
      expect(urls.facebook).toBe('https://russellroofing.com/auth/facebook/callback');
      expect(urls.instagram).toBe('https://russellroofing.com/auth/instagram/callback');
      expect(urls.google).toBe('https://russellroofing.com/auth/google/callback');
    });
  });

  describe('getAllWebhookConfig', () => {
    it('should return all webhook configurations', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      
      const config = getAllWebhookConfig();
      
      expect(config).toHaveProperty('hubspot');
      expect(config).toHaveProperty('instagram');
      expect(config).toHaveProperty('oauth');
      
      expect(config.hubspot.contact).toBe('https://russellroofing.com/api/webhooks/hubspot/contact');
      expect(config.oauth.facebook).toBe('https://russellroofing.com/auth/facebook/callback');
    });
  });

  describe('isValidWebhookURL', () => {
    it('should validate HTTPS webhook URLs', () => {
      expect(isValidWebhookURL('https://russellroofing.com/api/webhooks/hubspot/contact')).toBe(true);
      expect(isValidWebhookURL('https://example.com/api/webhooks/test')).toBe(true);
    });

    it('should reject HTTP webhook URLs', () => {
      expect(isValidWebhookURL('http://russellroofing.com/api/webhooks/hubspot/contact')).toBe(false);
    });

    it('should reject non-webhook paths', () => {
      expect(isValidWebhookURL('https://russellroofing.com/api/test')).toBe(false);
      expect(isValidWebhookURL('https://russellroofing.com/webhooks/test')).toBe(false);
    });

    it('should reject invalid URLs', () => {
      expect(isValidWebhookURL('not-a-url')).toBe(false);
      expect(isValidWebhookURL('')).toBe(false);
    });
  });

  describe('getWebhookConfigInstructions', () => {
    it('should return configuration instructions', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      
      const instructions = getWebhookConfigInstructions();
      
      expect(instructions.hubspot.description).toContain('Configure these webhook URLs');
      expect(instructions.hubspot.urls.contact).toBe('https://russellroofing.com/api/webhooks/hubspot/contact');
      
      expect(instructions.oauth.description).toContain('Configure these redirect URLs');
      expect(instructions.oauth.urls.facebook).toBe('https://russellroofing.com/auth/facebook/callback');
    });
  });
});