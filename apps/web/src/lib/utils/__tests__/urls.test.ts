/**
 * Tests for URL utility functions
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getURLConfig,
  getAbsoluteURL,
  getAPIURL,
  getWebhookURL,
  isSecureContext,
  getCanonicalURL,
  getDomainConfig,
  isCurrentDomain,
  ensureAbsoluteURL
} from '../urls';
import { resetConfig } from '../../config';

describe('URL Utils', () => {
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
    delete process.env.VERCEL_URL;
    delete process.env.CUSTOM_DOMAIN;
  });

  describe('getURLConfig', () => {
    it('should return development config by default', () => {
      process.env.NODE_ENV = 'development';
      
      const config = getURLConfig();
      
      expect(config.baseURL).toBe('http://localhost:3000');
      expect(config.apiURL).toBe('http://localhost:3000/api');
      expect(config.webhookURL).toBe('http://localhost:3000/api/webhooks');
      expect(config.domain).toBe('localhost:3000');
      expect(config.secure).toBe(false);
    });

    it('should return production config', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      
      const config = getURLConfig();
      
      expect(config.baseURL).toBe('https://russellroofing.com');
      expect(config.apiURL).toBe('https://russellroofing.com/api');
      expect(config.webhookURL).toBe('https://russellroofing.com/api/webhooks');
      expect(config.domain).toBe('russellroofing.com');
      expect(config.secure).toBe(true);
    });

    it('should handle preview environment with Vercel URL', () => {
      process.env.NODE_ENV = 'production';
      process.env.VERCEL_ENV = 'preview';
      process.env.VERCEL_URL = 'project-abc123.vercel.app';
      
      const config = getURLConfig();
      
      expect(config.baseURL).toBe('https://project-abc123.vercel.app');
      expect(config.apiURL).toBe('https://project-abc123.vercel.app/api');
      expect(config.webhookURL).toBe('https://project-abc123.vercel.app/api/webhooks');
      expect(config.domain).toBe('project-abc123.vercel.app');
      expect(config.secure).toBe(true);
    });

    it('should handle custom API URL', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      process.env.NEXT_PUBLIC_API_URL = 'https://api.russellroofing.com';
      
      const config = getURLConfig();
      
      expect(config.baseURL).toBe('https://russellroofing.com');
      expect(config.apiURL).toBe('https://api.russellroofing.com');
      expect(config.webhookURL).toBe('https://api.russellroofing.com/webhooks');
    });
  });

  describe('getAbsoluteURL', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
    });

    it('should generate absolute URL with leading slash', () => {
      expect(getAbsoluteURL('/about')).toBe('https://russellroofing.com/about');
    });

    it('should generate absolute URL without leading slash', () => {
      expect(getAbsoluteURL('about')).toBe('https://russellroofing.com/about');
    });

    it('should handle empty path', () => {
      expect(getAbsoluteURL('')).toBe('https://russellroofing.com/');
    });

    it('should handle root path', () => {
      expect(getAbsoluteURL('/')).toBe('https://russellroofing.com/');
    });
  });

  describe('getAPIURL', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
    });

    it('should generate API URL with leading slash', () => {
      expect(getAPIURL('/reviews')).toBe('https://russellroofing.com/api/reviews');
    });

    it('should generate API URL without leading slash', () => {
      expect(getAPIURL('reviews')).toBe('https://russellroofing.com/api/reviews');
    });

    it('should handle nested endpoints', () => {
      expect(getAPIURL('/instagram/refresh-token')).toBe('https://russellroofing.com/api/instagram/refresh-token');
    });
  });

  describe('getWebhookURL', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
    });

    it('should generate webhook URL with leading slash', () => {
      expect(getWebhookURL('/hubspot')).toBe('https://russellroofing.com/api/webhooks/hubspot');
    });

    it('should generate webhook URL without leading slash', () => {
      expect(getWebhookURL('hubspot')).toBe('https://russellroofing.com/api/webhooks/hubspot');
    });
  });

  describe('isSecureContext', () => {
    it('should return false for development', () => {
      process.env.NODE_ENV = 'development';
      expect(isSecureContext()).toBe(false);
    });

    it('should return true for production', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      expect(isSecureContext()).toBe(true);
    });
  });

  describe('getCanonicalURL', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
    });

    it('should generate canonical URL with default path', () => {
      expect(getCanonicalURL()).toBe('https://russellroofing.com/');
    });

    it('should generate canonical URL with custom path', () => {
      expect(getCanonicalURL('/services')).toBe('https://russellroofing.com/services');
    });
  });

  describe('getDomainConfig', () => {
    it('should return development domain config', () => {
      process.env.NODE_ENV = 'development';
      
      const config = getDomainConfig();
      
      expect(config.domain).toBe('localhost:3000');
      expect(config.secure).toBe(false);
      expect(config.protocol).toBe('http:');
      expect(config.origin).toBe('http://localhost:3000');
    });

    it('should return production domain config', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      
      const config = getDomainConfig();
      
      expect(config.domain).toBe('russellroofing.com');
      expect(config.secure).toBe(true);
      expect(config.protocol).toBe('https:');
      expect(config.origin).toBe('https://russellroofing.com');
    });
  });

  describe('isCurrentDomain', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
    });

    it('should return true for same domain URL', () => {
      expect(isCurrentDomain('https://russellroofing.com/about')).toBe(true);
    });

    it('should return false for different domain URL', () => {
      expect(isCurrentDomain('https://example.com/about')).toBe(false);
    });

    it('should return false for invalid URL', () => {
      expect(isCurrentDomain('not-a-url')).toBe(false);
    });

    it('should handle URLs with ports', () => {
      process.env.NODE_ENV = 'development';
      resetConfig();
      expect(isCurrentDomain('http://localhost:3000/api')).toBe(true);
    });
  });

  describe('ensureAbsoluteURL', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
    });

    it('should return absolute URL unchanged', () => {
      const url = 'https://example.com/path';
      expect(ensureAbsoluteURL(url)).toBe(url);
    });

    it('should convert relative URL to absolute', () => {
      expect(ensureAbsoluteURL('/about')).toBe('https://russellroofing.com/about');
    });

    it('should handle http URLs', () => {
      const url = 'http://example.com/path';
      expect(ensureAbsoluteURL(url)).toBe(url);
    });
  });
});