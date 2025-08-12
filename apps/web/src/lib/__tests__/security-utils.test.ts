import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getSecurityConfig,
  validateClientSideExposure,
  generateCSPHeader,
  sanitizeForLogging,
  validateAPIKeyFormat,
  securityHealthCheck,
  createRateLimiter
} from '../security-utils';
import { resetConfig } from '../config';

describe('Security Utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    resetConfig();
  });

  afterEach(() => {
    process.env = originalEnv;
    resetConfig();
  });

  describe('getSecurityConfig', () => {
    it('should return development config for development environment', () => {
      process.env.NODE_ENV = 'development';
      
      const config = getSecurityConfig();
      
      expect(config.allowedOrigins).toContain('http://localhost:3000');
      expect(config.rateLimitConfig.maxRequests).toBe(100);
      expect(config.maxRequestSize).toBe(1024 * 1024);
    });

    it('should return production config for production environment', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      
      const config = getSecurityConfig();
      
      expect(config.allowedOrigins).toContain('https://russellroofing.com');
      expect(config.rateLimitConfig.maxRequests).toBe(50);
      expect(config.maxRequestSize).toBe(512 * 1024);
    });

    it('should include proper CSP configuration', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      
      const config = getSecurityConfig();
      
      expect(config.contentSecurityPolicy.scriptSrc).toContain('https://maps.googleapis.com');
      expect(config.contentSecurityPolicy.connectSrc).toContain('https://api.hubapi.com');
      expect(config.contentSecurityPolicy.imgSrc).toContain('https://scontent.cdninstagram.com');
    });
  });

  describe('validateClientSideExposure', () => {
    it('should detect exposed server-side variables', () => {
      // Mock window object for client-side test
      const mockWindow = {
        __NEXT_DATA__: {
          env: {
            HUBSPOT_API_KEY: 'exposed-secret'
          }
        }
      };

      // @ts-ignore
      global.window = mockWindow;
      
      const result = validateClientSideExposure();
      
      expect(result.isValid).toBe(false);
      expect(result.exposedSecrets).toContain('HUBSPOT_API_KEY');
      
      // Cleanup
      // @ts-ignore
      delete global.window;
    });

    it('should pass validation when no secrets are exposed', () => {
      const result = validateClientSideExposure();
      
      expect(result.isValid).toBe(true);
      expect(result.exposedSecrets).toHaveLength(0);
    });

    it('should provide warnings for variables that might need NEXT_PUBLIC_ prefix', () => {
      process.env.SITE_URL = 'https://example.com';
      
      const result = validateClientSideExposure();
      
      expect(result.warnings.some(warning => 
        warning.includes('SITE_URL') && warning.includes('NEXT_PUBLIC_')
      )).toBe(true);
    });
  });

  describe('generateCSPHeader', () => {
    it('should generate valid CSP header string', () => {
      process.env.NODE_ENV = 'production';
      
      const cspHeader = generateCSPHeader();
      
      expect(cspHeader).toContain("default-src 'self'");
      expect(cspHeader).toContain("frame-ancestors 'none'");
      expect(cspHeader).toContain("base-uri 'self'");
      expect(cspHeader).toContain('https://maps.googleapis.com');
    });

    it('should include proper directives', () => {
      const cspHeader = generateCSPHeader();
      
      expect(cspHeader).toMatch(/script-src[^;]+/);
      expect(cspHeader).toMatch(/style-src[^;]+/);
      expect(cspHeader).toMatch(/img-src[^;]+/);
      expect(cspHeader).toMatch(/connect-src[^;]+/);
    });
  });

  describe('sanitizeForLogging', () => {
    it('should redact sensitive keys', () => {
      const sensitiveData = {
        username: 'john',
        password: 'secretpassword123',
        hubspot_api_key: 'pat-test-sample-key-555555555555',
        normalField: 'normalvalue'
      };
      
      const sanitized = sanitizeForLogging(sensitiveData);
      
      expect(sanitized.username).toBe('john');
      expect(sanitized.normalField).toBe('normalvalue');
      expect(sanitized.password).toBe('secr****d123');
      expect(sanitized.hubspot_api_key).toBe('pat-****5555');
    });

    it('should handle nested objects', () => {
      const nestedData = {
        user: {
          name: 'John',
          token: 'secret123456789'
        },
        config: {
          apikey: 'api_key_123456789'
        }
      };
      
      const sanitized = sanitizeForLogging(nestedData);
      
      expect(sanitized.user.name).toBe('John');
      expect(sanitized.user.token).toBe('secr****6789');
      expect(sanitized.config.apikey).toBe('api_****6789');
    });

    it('should handle arrays', () => {
      const arrayData = [
        { name: 'Item1', secret: 'secret123' },
        { name: 'Item2', token: 'token456' }
      ];
      
      const sanitized = sanitizeForLogging(arrayData);
      
      expect(sanitized[0].name).toBe('Item1');
      expect(sanitized[0].secret).toBe('secr****t123');
      expect(sanitized[1].token).toBe('toke****n456');
    });

    it('should handle non-object types', () => {
      expect(sanitizeForLogging('string')).toBe('string');
      expect(sanitizeForLogging(123)).toBe(123);
      expect(sanitizeForLogging(null)).toBe(null);
      expect(sanitizeForLogging(undefined)).toBe(undefined);
    });
  });

  describe('validateAPIKeyFormat', () => {
    it('should validate HubSpot API key format', () => {
      const validKey = 'pat-test-sample-key-for-validation-test-a';
      const invalidKey = 'invalid-key';
      
      const validResult = validateAPIKeyFormat(validKey, 'hubspot');
      const invalidResult = validateAPIKeyFormat(invalidKey, 'hubspot');
      
      expect(validResult.isValid).toBe(true);
      expect(validResult.issues).toHaveLength(0);
      
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.issues.some(issue => issue.includes('pat-'))).toBe(true);
    });

    it('should validate Google API key format', () => {
      const validKey = 'AIzaSyDd1fG5h6i7jK8lM9nOpQrStUvWxYz1234'; // 39 chars
      const invalidKey = 'too-short';
      
      const validResult = validateAPIKeyFormat(validKey, 'google');
      const invalidResult = validateAPIKeyFormat(invalidKey, 'google');
      
      expect(validResult.isValid).toBe(true);
      expect(validResult.issues).toHaveLength(0);
      
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.issues.some(issue => issue.includes('39 characters'))).toBe(true);
    });

    it('should validate Instagram access token format', () => {
      const validToken = 'a'.repeat(150); // Long token
      const invalidToken = 'short';
      
      const validResult = validateAPIKeyFormat(validToken, 'instagram');
      const invalidResult = validateAPIKeyFormat(invalidToken, 'instagram');
      
      expect(validResult.isValid).toBe(true);
      expect(validResult.issues).toHaveLength(0);
      
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.issues.some(issue => issue.includes('100 characters'))).toBe(true);
    });

    it('should detect placeholder values', () => {
      const placeholderKey = 'test-key-placeholder';
      
      const result = validateAPIKeyFormat(placeholderKey, 'hubspot');
      
      expect(result.isValid).toBe(false);
      expect(result.issues.some(issue => issue.includes('placeholder'))).toBe(true);
    });

    it('should handle empty keys', () => {
      const result = validateAPIKeyFormat('', 'hubspot');
      
      expect(result.isValid).toBe(false);
      expect(result.issues.some(issue => issue.includes('empty'))).toBe(true);
    });
  });

  describe('securityHealthCheck', () => {
    it('should return healthy status when no issues found', () => {
      process.env.NODE_ENV = 'development';
      
      const result = securityHealthCheck();
      
      expect(result.status).toBe('healthy');
      expect(result.issues).toHaveLength(0);
    });

    it.skip('should detect environment mismatch', () => {
      // Set up proper production environment with mismatch in NODE_ENV
      process.env.NODE_ENV = 'development';  
      process.env.VERCEL_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      // Add required environment variables to pass production validation
      process.env.HUBSPOT_API_KEY = 'pat-test-key';
      process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-key';
      process.env.GOOGLE_PLACES_API_KEY = 'test-key';
      process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-token';
      process.env.INSTAGRAM_USER_ID = 'test-user-id';
      
      const result = securityHealthCheck();
      
      // Should detect issues because NODE_ENV !== 'production' in production  
      expect(result.status).toBe('warning');
    });

    it('should detect debug mode in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.DEBUG = 'true';
      
      // Mock isProduction to return true
      vi.doMock('../config', () => ({
        isProduction: () => true,
        getEnvironment: () => 'production'
      }));
      
      const result = securityHealthCheck();
      
      expect(result.issues.some(issue => 
        issue.includes('Debug mode')
      )).toBe(true);
    });
  });

  describe('createRateLimiter', () => {
    it('should allow requests within limit', () => {
      const rateLimiter = createRateLimiter();
      
      const result1 = rateLimiter('user1');
      const result2 = rateLimiter('user1');
      
      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
      expect(result2.remainingRequests).toBeLessThan(result1.remainingRequests);
    });

    it('should block requests exceeding limit', () => {
      const rateLimiter = createRateLimiter();
      const userId = 'test-user';
      
      // Make requests up to the limit
      let result;
      for (let i = 0; i < 101; i++) {
        result = rateLimiter(userId);
      }
      
      expect(result?.allowed).toBe(false);
      expect(result?.remainingRequests).toBe(0);
    });

    it('should handle different users separately', () => {
      const rateLimiter = createRateLimiter();
      
      const user1Result = rateLimiter('user1');
      const user2Result = rateLimiter('user2');
      
      expect(user1Result.allowed).toBe(true);
      expect(user2Result.allowed).toBe(true);
      expect(user1Result.remainingRequests).toBe(user2Result.remainingRequests);
    });

    it('should reset window after time passes', async () => {
      vi.useFakeTimers();
      const rateLimiter = createRateLimiter();
      const userId = 'test-user';
      
      // Exhaust the limit
      for (let i = 0; i < 100; i++) {
        rateLimiter(userId);
      }
      let result = rateLimiter(userId);
      expect(result.allowed).toBe(false);

      // Advance time past the window
      const config = getSecurityConfig();
      vi.advanceTimersByTime(config.rateLimitConfig.windowMs + 1);

      const result2 = rateLimiter(userId);
      expect(result2.allowed).toBe(true);
      expect(result2.remainingRequests).toBe(99);
      
      vi.useRealTimers();
    });
  });
});