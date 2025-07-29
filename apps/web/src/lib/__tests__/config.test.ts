import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getEnvironment,
  isDevelopment,
  isProduction,
  isTest,
  isPreview,
  getAppConfig,
  getConfig,
  resetConfig,
  isServiceConfigured,
  getServiceConfig,
  logConfigStatus
} from '../config';

describe('Configuration Utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env for each test
    process.env = { ...originalEnv };
    resetConfig();
  });

  afterEach(() => {
    process.env = originalEnv;
    resetConfig();
  });

  describe('Environment Detection', () => {
    it('should detect development environment', () => {
      process.env.NODE_ENV = 'development';
      expect(getEnvironment()).toBe('development');
      expect(isDevelopment()).toBe(true);
      expect(isProduction()).toBe(false);
      expect(isTest()).toBe(false);
      expect(isPreview()).toBe(false);
    });

    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production';
      expect(getEnvironment()).toBe('production');
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(true);
      expect(isTest()).toBe(false);
      expect(isPreview()).toBe(false);
    });

    it('should detect test environment', () => {
      process.env.NODE_ENV = 'test';
      expect(getEnvironment()).toBe('test');
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(false);
      expect(isTest()).toBe(true);
      expect(isPreview()).toBe(false);
    });

    it('should detect preview environment', () => {
      process.env.NODE_ENV = 'production';
      process.env.VERCEL_ENV = 'preview';
      expect(getEnvironment()).toBe('preview');
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(false);
      expect(isTest()).toBe(false);
      expect(isPreview()).toBe(true);
    });

    it('should default to development for unknown environments', () => {
      process.env.NODE_ENV = 'unknown' as any;
      expect(getEnvironment()).toBe('development');
      expect(isDevelopment()).toBe(true);
    });
  });

  describe('getAppConfig', () => {
    it('should return complete configuration object', () => {
      process.env.NODE_ENV = 'development';
      process.env.HUBSPOT_API_KEY = 'test-hubspot-key';
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-google-key';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
      
      const config = getAppConfig();
      
      expect(config).toHaveProperty('environment', 'development');
      expect(config).toHaveProperty('isDevelopment', true);
      expect(config).toHaveProperty('apis');
      expect(config).toHaveProperty('features');
      expect(config).toHaveProperty('integrations');
      expect(config).toHaveProperty('notifications');
      expect(config).toHaveProperty('cache');
    });

    it('should configure different URLs for different environments', () => {
      // Development
      process.env.NODE_ENV = 'development';
      let config = getAppConfig();
      expect(config.siteUrl).toBe('http://localhost:3000');
      expect(config.apiUrl).toBe('http://localhost:3000/api');
      
      resetConfig();
      
      // Production
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      config = getAppConfig();
      expect(config.siteUrl).toBe('https://russellroofing.com');
      expect(config.apiUrl).toBe('https://russellroofing.com/api');
      
      resetConfig();
      
      // Preview with Vercel URL
      process.env.NODE_ENV = 'production';
      process.env.VERCEL_ENV = 'preview';
      process.env.VERCEL_URL = 'test-branch-123.vercel.app';
      delete process.env.NEXT_PUBLIC_SITE_URL;
      config = getAppConfig();
      expect(config.siteUrl).toBe('https://test-branch-123.vercel.app');
    });

    it('should configure feature flags based on environment', () => {
      // Development
      process.env.NODE_ENV = 'development';
      let config = getAppConfig();
      expect(config.features.enableAnalytics).toBe(false);
      expect(config.features.enableDebugMode).toBe(true);
      expect(config.features.enableMockData).toBe(true);
      expect(config.features.enableRateLimiting).toBe(false);
      
      resetConfig();
      
      // Production
      process.env.NODE_ENV = 'production';
      config = getAppConfig();
      expect(config.features.enableAnalytics).toBe(true);
      expect(config.features.enableDebugMode).toBe(false);
      expect(config.features.enableMockData).toBe(false);
      expect(config.features.enableRateLimiting).toBe(true);
    });

    it('should parse comma-separated environment variables', () => {
      process.env.NODE_ENV = 'development';
      process.env.EMERGENCY_EMAIL_LIST = 'email1@test.com,email2@test.com,email3@test.com';
      process.env.EMERGENCY_PHONE_NUMBERS = '+1234567890,+0987654321';
      
      const config = getAppConfig();
      
      expect(config.notifications.emergencyEmails).toEqual([
        'email1@test.com',
        'email2@test.com',
        'email3@test.com'
      ]);
      expect(config.notifications.emergencyPhones).toEqual([
        '+1234567890',
        '+0987654321'
      ]);
    });

    it('should configure mock mode based on API key availability', () => {
      process.env.NODE_ENV = 'development';
      
      // Without API keys
      let config = getAppConfig();
      expect(config.apis.hubspot.mockMode).toBe(true);
      expect(config.apis.instagram.mockMode).toBe(true);
      
      resetConfig();
      
      // With API keys
      process.env.HUBSPOT_API_KEY = 'test-key';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-token';
      config = getAppConfig();
      expect(config.apis.hubspot.mockMode).toBe(true); // Still true in development
      expect(config.apis.instagram.mockMode).toBe(true); // Still true in development
      
      resetConfig();
      
      // Production with API keys
      process.env.NODE_ENV = 'production';
      process.env.HUBSPOT_API_KEY = 'test-key';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-token';
      config = getAppConfig();
      expect(config.apis.hubspot.mockMode).toBe(false);
      expect(config.apis.instagram.mockMode).toBe(false);
    });

    it('should configure different cache durations for different environments', () => {
      // Development
      process.env.NODE_ENV = 'development';
      let config = getAppConfig();
      expect(config.cache.reviewsCacheDuration).toBe(5 * 60 * 1000); // 5 minutes
      expect(config.cache.instagramCacheDuration).toBe(5 * 60 * 1000); // 5 minutes
      
      resetConfig();
      
      // Production
      process.env.NODE_ENV = 'production';
      config = getAppConfig();
      expect(config.cache.reviewsCacheDuration).toBe(6 * 60 * 60 * 1000); // 6 hours
      expect(config.cache.instagramCacheDuration).toBe(60 * 60 * 1000); // 1 hour
    });
  });

  describe('Configuration Caching', () => {
    it('should cache configuration between calls', () => {
      process.env.NODE_ENV = 'development';
      
      const config1 = getConfig();
      const config2 = getConfig();
      
      expect(config1).toBe(config2); // Same reference
    });

    it('should reset cache when resetConfig is called', () => {
      process.env.NODE_ENV = 'development';
      
      const config1 = getConfig();
      resetConfig();
      const config2 = getConfig();
      
      expect(config1).not.toBe(config2); // Different references
      expect(config1).toEqual(config2); // Same values
    });
  });

  describe('Service Configuration', () => {
    it('should correctly detect configured services', () => {
      process.env.NODE_ENV = 'development';
      
      // No services configured
      expect(isServiceConfigured('hubspot')).toBe(false);
      expect(isServiceConfigured('google')).toBe(false);
      expect(isServiceConfigured('instagram')).toBe(false);
      
      // Configure HubSpot
      process.env.HUBSPOT_API_KEY = 'test-key';
      resetConfig();
      expect(isServiceConfigured('hubspot')).toBe(true);
      
      // Configure Google (needs both keys)
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-key';
      process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
      resetConfig();
      expect(isServiceConfigured('google')).toBe(true);
      
      // Configure Instagram (needs both keys)
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-token';
      process.env.INSTAGRAM_USER_ID = 'test-user-id';
      resetConfig();
      expect(isServiceConfigured('instagram')).toBe(true);
    });

    it('should return service-specific configuration', () => {
      process.env.NODE_ENV = 'development';
      process.env.HUBSPOT_API_KEY = 'test-hubspot-key';
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-google-key';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
      
      const hubspotConfig = getServiceConfig('hubspot');
      const googleConfig = getServiceConfig('google');
      const instagramConfig = getServiceConfig('instagram');
      
      expect(hubspotConfig.apiKey).toBe('test-hubspot-key');
      expect(googleConfig.placesApiKey).toBe('test-google-key');
      expect(instagramConfig.accessToken).toBe('test-instagram-token');
    });
  });

  describe('logConfigStatus', () => {
    it('should only log in development environment', () => {
      const consoleSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
      
      // Test in production (should not log)
      process.env.NODE_ENV = 'production';
      logConfigStatus();
      expect(consoleSpy).not.toHaveBeenCalled();
      
      // Test in development (should log)
      process.env.NODE_ENV = 'development';
      logConfigStatus();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});