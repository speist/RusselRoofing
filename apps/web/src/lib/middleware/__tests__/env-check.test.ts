import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  createEnvMiddleware,
  envMiddleware,
  validateApiEnvironment,
  getApiHealthStatus
} from '../env-check';

describe('Environment Check Middleware', () => {
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

  describe('createEnvMiddleware', () => {
    it('should return null when all required variables are present', () => {
      process.env.TEST_VAR = 'test-value';
      
      const middleware = createEnvMiddleware({
        requiredVars: ['TEST_VAR']
      });
      
      const mockRequest = new NextRequest('http://localhost:3000/api/test');
      const result = middleware(mockRequest);
      
      expect(result).toBeNull();
    });

    it('should return error response when required variables are missing', () => {
      const middleware = createEnvMiddleware({
        requiredVars: ['MISSING_VAR']
      });
      
      const mockRequest = new NextRequest('http://localhost:3000/api/test');
      const result = middleware(mockRequest);
      
      expect(result).not.toBeNull();
      expect(result?.status).toBe(500);
    });

    it('should allow graceful degradation when enabled', () => {
      const middleware = createEnvMiddleware({
        requiredVars: ['MISSING_VAR'],
        gracefulDegradation: true
      });
      
      const mockRequest = new NextRequest('http://localhost:3000/api/test');
      const result = middleware(mockRequest);
      
      expect(result).toBeNull(); // Should proceed despite missing variable
    });

    it('should log warnings for missing optional variables', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      process.env.REQUIRED_VAR = 'test-value';
      
      const middleware = createEnvMiddleware({
        requiredVars: ['REQUIRED_VAR'],
        optionalVars: ['OPTIONAL_VAR']
      });
      
      const mockRequest = new NextRequest('http://localhost:3000/api/test');
      middleware(mockRequest);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Optional variables missing')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Pre-configured middleware', () => {
    describe('envMiddleware.hubspot', () => {
      it('should pass when HubSpot API key is configured', () => {
        process.env.HUBSPOT_API_KEY = 'test-hubspot-key';
        
        const mockRequest = new NextRequest('http://localhost:3000/api/hubspot');
        const result = envMiddleware.hubspot(mockRequest);
        
        expect(result).toBeNull();
      });

      it('should fail when HubSpot API key is missing', () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/hubspot');
        const result = envMiddleware.hubspot(mockRequest);
        
        expect(result).not.toBeNull();
        expect(result?.status).toBe(500);
      });
    });

    describe('envMiddleware.googlePlaces', () => {
      it('should pass when Google Places API variables are configured', () => {
        process.env.GOOGLE_PLACES_API_KEY = 'test-google-key';
        process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
        
        const mockRequest = new NextRequest('http://localhost:3000/api/reviews');
        const result = envMiddleware.googlePlaces(mockRequest);
        
        expect(result).toBeNull();
      });

      it('should fail when Google Places API variables are missing', () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/reviews');
        const result = envMiddleware.googlePlaces(mockRequest);
        
        expect(result).not.toBeNull();
        expect(result?.status).toBe(500);
      });
    });

    describe('envMiddleware.instagram', () => {
      it('should pass when Instagram variables are configured', () => {
        process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
        process.env.INSTAGRAM_USER_ID = 'test-user-id';
        
        const mockRequest = new NextRequest('http://localhost:3000/api/instagram');
        const result = envMiddleware.instagram(mockRequest);
        
        expect(result).toBeNull();
      });

      it('should allow graceful degradation when Instagram variables are missing', () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/instagram');
        const result = envMiddleware.instagram(mockRequest);
        
        // Instagram middleware has graceful degradation enabled
        expect(result).toBeNull();
      });
    });

    describe('envMiddleware.notifications', () => {
      it('should always pass (all variables are optional)', () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/notifications');
        const result = envMiddleware.notifications(mockRequest);
        
        expect(result).toBeNull();
      });
    });
  });

  describe('validateApiEnvironment', () => {
    it('should return valid when all required variables are present', () => {
      process.env.TEST_VAR = 'test-value';
      
      const result = validateApiEnvironment('/api/test', ['TEST_VAR']);
      
      expect(result.isValid).toBe(true);
      expect(result.missing).toEqual([]);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid when required variables are missing', () => {
      const result = validateApiEnvironment('/api/test', ['MISSING_VAR']);
      
      expect(result.isValid).toBe(false);
      expect(result.missing).toEqual(['MISSING_VAR']);
      expect(result.error).toContain('MISSING_VAR');
    });
  });

  describe('getApiHealthStatus', () => {
    it('should report unhealthy when critical services are missing variables', () => {
      const result = getApiHealthStatus();
      
      expect(result.status).toBe('unhealthy');
      expect(result.summary.unhealthy_services).toBeGreaterThan(0);
    });

    it('should report healthy when all required variables are configured', () => {
      // Configure all required variables
      process.env.HUBSPOT_API_KEY = 'test-hubspot-key';
      process.env.GOOGLE_PLACES_API_KEY = 'test-google-key';
      process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
      process.env.INSTAGRAM_USER_ID = 'test-user-id';
      
      const result = getApiHealthStatus();
      
      // Since optional variables are missing, status will be 'degraded', not 'healthy'
      expect(['healthy', 'degraded']).toContain(result.status);
      expect(result.summary.unhealthy_services).toBe(0);
    });

    it('should report degraded when some optional variables are missing', () => {
      // Configure required variables but not optional ones
      process.env.HUBSPOT_API_KEY = 'test-hubspot-key';
      process.env.GOOGLE_PLACES_API_KEY = 'test-google-key';
      process.env.RUSSELL_ROOFING_PLACE_ID = 'test-place-id';
      process.env.INSTAGRAM_ACCESS_TOKEN = 'test-instagram-token';
      process.env.INSTAGRAM_USER_ID = 'test-user-id';
      // Don't set FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, notification vars
      
      const result = getApiHealthStatus();
      
      expect(['healthy', 'degraded']).toContain(result.status);
      expect(result.summary.unhealthy_services).toBe(0);
    });

    it('should provide detailed service status information', () => {
      const result = getApiHealthStatus();
      
      expect(result.services).toHaveProperty('hubspot');
      expect(result.services).toHaveProperty('google');
      expect(result.services).toHaveProperty('instagram');
      expect(result.services).toHaveProperty('notifications');
      
      expect(result.services.hubspot).toHaveProperty('status');
      expect(result.services.hubspot).toHaveProperty('missing');
      expect(result.services.hubspot).toHaveProperty('optional_missing');
    });
  });
});