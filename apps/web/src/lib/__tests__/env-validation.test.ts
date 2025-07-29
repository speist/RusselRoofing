import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  validateEnvironment,
  validateEnvironmentOrThrow,
  isEnvironmentVariableConfigured,
  getEnvironmentVariable,
  getServiceEnvironmentVariables,
  logEnvironmentStatus
} from '../env-validation';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env for each test
    process.env = { ...originalEnv };
    // Clear all our app-specific environment variables
    delete process.env.HUBSPOT_API_KEY;
    delete process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    delete process.env.GOOGLE_PLACES_API_KEY;
    delete process.env.RUSSELL_ROOFING_PLACE_ID;
    delete process.env.INSTAGRAM_ACCESS_TOKEN;
    delete process.env.INSTAGRAM_USER_ID;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('validateEnvironment', () => {
    it('should fail validation when required variables are missing', () => {
      const result = validateEnvironment();
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(error => error.includes('HUBSPOT_API_KEY'))).toBe(true);
      expect(result.errors.some(error => error.includes('NEXT_PUBLIC_GOOGLE_PLACES_API_KEY'))).toBe(true);
    });

    it('should pass validation when all required variables are set', () => {
      // Set all required environment variables
      process.env.HUBSPOT_API_KEY = 'test-hubspot-key';
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-google-key';
      process.env.GOOGLE_PLACES_API_KEY = 'test-google-server-key';
      process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
      process.env.INSTAGRAM_USER_ID = 'test-user-id';
      
      const result = validateEnvironment();
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.configured.length).toBeGreaterThan(0);
    });

    it('should validate email format in email environment variables', () => {
      process.env.HUBSPOT_API_KEY = 'test-key';
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-google-key';
      process.env.GOOGLE_PLACES_API_KEY = 'test-google-server-key';
      process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
      process.env.INSTAGRAM_USER_ID = 'test-user-id';
      process.env.EMERGENCY_EMAIL_LIST = 'invalid-email,another-invalid';
      
      const result = validateEnvironment();
      
      expect(result.warnings.some(warning => 
        warning.includes('EMERGENCY_EMAIL_LIST') && warning.includes('invalid email')
      )).toBe(true);
    });

    it('should validate phone format in phone environment variables', () => {
      process.env.HUBSPOT_API_KEY = 'test-key';
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-google-key';
      process.env.GOOGLE_PLACES_API_KEY = 'test-google-server-key';
      process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
      process.env.INSTAGRAM_USER_ID = 'test-user-id';
      process.env.EMERGENCY_PHONE_NUMBERS = 'invalid-phone,123';
      
      const result = validateEnvironment();
      
      expect(result.warnings.some(warning => 
        warning.includes('EMERGENCY_PHONE_NUMBERS') && warning.includes('invalid phone')
      )).toBe(true);
    });

    it('should validate URL format in URL environment variables', () => {
      process.env.HUBSPOT_API_KEY = 'test-key';
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-google-key';
      process.env.GOOGLE_PLACES_API_KEY = 'test-google-server-key';
      process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
      process.env.INSTAGRAM_USER_ID = 'test-user-id';
      process.env.NEXT_PUBLIC_SITE_URL = 'not-a-valid-url';
      
      const result = validateEnvironment();
      
      expect(result.warnings.some(warning => 
        warning.includes('NEXT_PUBLIC_SITE_URL') && warning.includes('invalid URL')
      )).toBe(true);
    });

    it('should provide comprehensive summary', () => {
      process.env.HUBSPOT_API_KEY = 'test-key';
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-google-key';
      
      const result = validateEnvironment();
      
      expect(result.summary).toHaveProperty('total');
      expect(result.summary).toHaveProperty('required');
      expect(result.summary).toHaveProperty('configured');
      expect(result.summary).toHaveProperty('missing');
      expect(result.summary.total).toBeGreaterThan(0);
    });
  });

  describe('validateEnvironmentOrThrow', () => {
    it('should throw error when validation fails', () => {
      expect(() => {
        validateEnvironmentOrThrow();
      }).toThrow('❌ Environment Configuration Error');
    });

    it('should not throw when validation passes', () => {
      // Set all required environment variables
      process.env.HUBSPOT_API_KEY = 'test-hubspot-key';
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-google-key';
      process.env.GOOGLE_PLACES_API_KEY = 'test-google-server-key';
      process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
      process.env.INSTAGRAM_USER_ID = 'test-user-id';
      
      expect(() => {
        validateEnvironmentOrThrow();
      }).not.toThrow();
    });

    it('should log warnings when validation passes with warnings', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Set required vars but add optional vars with warnings
      process.env.HUBSPOT_API_KEY = 'test-hubspot-key';
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-google-key';
      process.env.GOOGLE_PLACES_API_KEY = 'test-google-server-key';
      process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
      process.env.INSTAGRAM_USER_ID = 'test-user-id';
      process.env.EMERGENCY_EMAIL_LIST = 'invalid-email';
      
      validateEnvironmentOrThrow();
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('isEnvironmentVariableConfigured', () => {
    it('should return true for configured variables', () => {
      process.env.TEST_VAR = 'test-value';
      expect(isEnvironmentVariableConfigured('TEST_VAR')).toBe(true);
    });

    it('should return false for missing variables', () => {
      expect(isEnvironmentVariableConfigured('MISSING_VAR')).toBe(false);
    });

    it('should return false for empty variables', () => {
      process.env.EMPTY_VAR = '';
      expect(isEnvironmentVariableConfigured('EMPTY_VAR')).toBe(false);
    });

    it('should return false for whitespace-only variables', () => {
      process.env.WHITESPACE_VAR = '   ';
      expect(isEnvironmentVariableConfigured('WHITESPACE_VAR')).toBe(false);
    });
  });

  describe('getEnvironmentVariable', () => {
    it('should return environment variable value', () => {
      process.env.TEST_VAR = 'test-value';
      expect(getEnvironmentVariable('TEST_VAR')).toBe('test-value');
    });

    it('should return fallback for missing variables', () => {
      expect(getEnvironmentVariable('MISSING_VAR', 'fallback')).toBe('fallback');
    });

    it('should return empty string as default fallback', () => {
      expect(getEnvironmentVariable('MISSING_VAR')).toBe('');
    });
  });

  describe('getServiceEnvironmentVariables', () => {
    it('should return HubSpot environment variables', () => {
      process.env.HUBSPOT_API_KEY = 'test-hubspot-key';
      process.env.NEXT_PUBLIC_HUBSPOT_API_KEY = 'test-public-key';
      
      const hubspotVars = getServiceEnvironmentVariables('hubspot');
      
      expect(hubspotVars).toHaveProperty('HUBSPOT_API_KEY', 'test-hubspot-key');
      expect(hubspotVars).toHaveProperty('NEXT_PUBLIC_HUBSPOT_API_KEY', 'test-public-key');
    });

    it('should return Google environment variables', () => {
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-google-key';
      process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
      
      const googleVars = getServiceEnvironmentVariables('google');
      
      expect(googleVars).toHaveProperty('NEXT_PUBLIC_GOOGLE_PLACES_API_KEY', 'test-google-key');
      expect(googleVars).toHaveProperty('RUSSELL_ROOFING_PLACE_ID', 'test-place-id');
    });

    it('should return Instagram environment variables', () => {
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
      process.env.INSTAGRAM_USER_ID = 'test-user-id';
      
      const instagramVars = getServiceEnvironmentVariables('instagram');
      
      expect(instagramVars).toHaveProperty('INSTAGRAM_ACCESS_TOKEN', 'test-instagram-token');
      expect(instagramVars).toHaveProperty('INSTAGRAM_USER_ID', 'test-user-id');
    });
  });

  describe('logEnvironmentStatus', () => {
    it('should only log in development environment', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      const consoleSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
      
      // Test in production (should not log)
      process.env.NODE_ENV = 'production';
      logEnvironmentStatus();
      expect(consoleSpy).not.toHaveBeenCalled();
      
      // Test in development (should log)
      process.env.NODE_ENV = 'development';
      logEnvironmentStatus();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalNodeEnv;
    });
  });
});