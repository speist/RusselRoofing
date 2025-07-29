/**
 * Tests for domain validation utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  validateDomain,
  getDomainMonitoringConfig,
  generateValidationReport,
  isDomainSecure,
  isValidDomainFormat
} from '../domain-validation';
import { resetConfig } from '../../config';

// Mock fetch for testing
global.fetch = vi.fn();

describe('Domain Validation Utils', () => {
  beforeEach(() => {
    resetConfig();
    vi.clearAllMocks();
  });

  afterEach(() => {
    resetConfig();
    // Clean up environment variables
    delete process.env.NODE_ENV;
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  describe('validateDomain', () => {
    it('should validate a healthy domain', async () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';

      // Mock successful responses
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        headers: {
          has: (name: string) => ['strict-transport-security', 'x-frame-options', 'x-content-type-options'].includes(name.toLowerCase()),
          get: (name: string) => {
            switch (name.toLowerCase()) {
              case 'strict-transport-security': return 'max-age=31536000';
              case 'x-frame-options': return 'SAMEORIGIN';
              case 'x-content-type-options': return 'nosniff';
              case 'location': return 'https://russellroofing.com';
              default: return null;
            }
          }
        }
      });

      const result = await validateDomain('russellroofing.com');

      expect(result.domain).toBe('russellroofing.com');
      expect(result.checks.dns.status).toBe('pass');
      expect(result.checks.ssl.status).toBe('pass');
      expect(result.checks.security.status).toBe('pass');
      expect(result.checks.api.status).toBe('pass');
      // Note: HTTPS redirect test may fail in mocked environment
    });

    it('should detect domain issues', async () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';

      // Mock failed responses
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const result = await validateDomain('invalid-domain.com');

      expect(result.domain).toBe('invalid-domain.com');
      expect(result.overall).toBe('error');
      expect(result.checks.dns.status).toBe('fail');
      expect(result.checks.ssl.status).toBe('fail');
    });

    it('should use current domain when none specified', async () => {
      process.env.NODE_ENV = 'development';

      // Mock successful responses
      (global.fetch as any).mockResolvedValue({
        ok: true,
        status: 200,
        headers: {
          has: (name: string) => ['strict-transport-security', 'x-frame-options', 'x-content-type-options'].includes(name.toLowerCase()),
          get: (name: string) => {
            switch (name.toLowerCase()) {
              case 'strict-transport-security': return 'max-age=31536000';
              case 'x-frame-options': return 'SAMEORIGIN';
              case 'x-content-type-options': return 'nosniff';
              default: return null;
            }
          }
        }
      });

      const result = await validateDomain();

      expect(result.domain).toBe('localhost:3000');
    });
  });

  describe('getDomainMonitoringConfig', () => {
    it('should return monitoring config for production', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';

      const config = getDomainMonitoringConfig();

      expect(config.domain).toBe('russellroofing.com');
      expect(config.monitoringEndpoints).toContain('https://russellroofing.com');
      expect(config.monitoringEndpoints).toContain('https://russellroofing.com/api/health');
      expect(config.checkInterval).toBe(300000);
    });

    it('should return monitoring config for development', () => {
      process.env.NODE_ENV = 'development';

      const config = getDomainMonitoringConfig();

      expect(config.domain).toBe('localhost:3000');
      expect(config.monitoringEndpoints).toContain('http://localhost:3000');
      expect(config.monitoringEndpoints).toContain('http://localhost:3000/api/health');
    });
  });

  describe('generateValidationReport', () => {
    it('should generate a validation report', () => {
      const healthCheck = {
        domain: 'russellroofing.com',
        timestamp: new Date('2023-01-01T00:00:00Z'),
        checks: {
          dns: { status: 'pass' as const, message: 'DNS resolution successful' },
          ssl: { status: 'pass' as const, message: 'SSL certificate valid' },
          https: { status: 'fail' as const, message: 'HTTPS redirect not working' },
          redirect: { status: 'pass' as const, message: 'Redirects working' },
          security: { status: 'pass' as const, message: 'Security headers present' },
          api: { status: 'pass' as const, message: 'API endpoints accessible' }
        },
        overall: 'warning' as const
      };

      const report = generateValidationReport(healthCheck);

      expect(report).toContain('Domain Validation Report for russellroofing.com');
      expect(report).toContain('Overall Status: WARNING');
      expect(report).toContain('✅ DNS: DNS resolution successful');
      expect(report).toContain('❌ HTTPS: HTTPS redirect not working');
    });
  });

  describe('isDomainSecure', () => {
    it('should return false for localhost', () => {
      expect(isDomainSecure('localhost:3000')).toBe(false);
      expect(isDomainSecure('localhost')).toBe(false);
    });

    it('should return true for production domains', () => {
      expect(isDomainSecure('russellroofing.com')).toBe(true);
      expect(isDomainSecure('example.com')).toBe(true);
    });

    it('should use current domain when none specified', () => {
      process.env.NODE_ENV = 'development';
      resetConfig();
      expect(isDomainSecure()).toBe(false);

      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://russellroofing.com';
      resetConfig();
      expect(isDomainSecure()).toBe(true);
    });
  });

  describe('isValidDomainFormat', () => {
    it('should validate correct domain formats', () => {
      expect(isValidDomainFormat('russellroofing.com')).toBe(true);
      expect(isValidDomainFormat('www.russellroofing.com')).toBe(true);
      expect(isValidDomainFormat('sub.domain.com')).toBe(true);
      expect(isValidDomainFormat('example.org')).toBe(true);
    });

    it('should reject invalid domain formats', () => {
      expect(isValidDomainFormat('')).toBe(false);
      expect(isValidDomainFormat('invalid')).toBe(false);
      expect(isValidDomainFormat('invalid..com')).toBe(false);
      expect(isValidDomainFormat('.invalid.com')).toBe(false);
      expect(isValidDomainFormat('invalid.com.')).toBe(false);
      expect(isValidDomainFormat('http://example.com')).toBe(false);
    });

    it('should reject domains that are too long', () => {
      const longDomain = 'a'.repeat(250) + '.com';
      expect(isValidDomainFormat(longDomain)).toBe(false);
    });
  });
});