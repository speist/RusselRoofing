/**
 * Security Utilities
 * Utilities for security validation and monitoring in production
 */

import { getEnvironment, isProduction, getConfig } from './config';

/**
 * Security configuration interface
 */
interface SecurityConfig {
  maxRequestSize: number;
  allowedOrigins: string[];
  rateLimitConfig: {
    windowMs: number;
    maxRequests: number;
  };
  contentSecurityPolicy: {
    defaultSrc: string[];
    scriptSrc: string[];
    styleSrc: string[];
    imgSrc: string[];
    connectSrc: string[];
  };
}

/**
 * Get security configuration based on environment
 */
export function getSecurityConfig(): SecurityConfig {
  const environment = getEnvironment();
  const config = getConfig();
  
  const baseConfig: SecurityConfig = {
    maxRequestSize: 1024 * 1024, // 1MB
    allowedOrigins: [config.siteUrl],
    rateLimitConfig: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100
    },
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"]
    }
  };

  if (environment === 'production') {
    return {
      ...baseConfig,
      maxRequestSize: 512 * 1024, // 512KB in production
      allowedOrigins: [
        config.siteUrl,
        config.siteUrl.replace('https://', 'https://www.'),
        ...(config.customDomain ? [`https://${config.customDomain}`, `https://www.${config.customDomain}`] : [])
      ],
      rateLimitConfig: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 50 // More restrictive in production
      },
      contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://maps.googleapis.com',
          'https://assets.calendly.com',
          'https://widget.calendly.com'
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://assets.calendly.com'
        ],
        imgSrc: [
          "'self'",
          'data:',
          'https:',
          'https://maps.gstatic.com',
          'https://maps.googleapis.com',
          'https://scontent.cdninstagram.com'
        ],
        connectSrc: [
          "'self'",
          'https://maps.googleapis.com',
          'https://graph.instagram.com',
          'https://api.hubapi.com'
        ]
      }
    };
  }

  return baseConfig;
}

/**
 * Validate that sensitive data is not exposed to client-side
 */
export function validateClientSideExposure(): {
  isValid: boolean;
  exposedSecrets: string[];
  warnings: string[];
} {
  const exposedSecrets: string[] = [];
  const warnings: string[] = [];

  // Check for server-side variables that might be accidentally exposed
  const serverOnlyVars = [
    'HUBSPOT_API_KEY',
    'GOOGLE_PLACES_API_KEY',
    'INSTAGRAM_ACCESS_TOKEN',
    'FACEBOOK_APP_SECRET',
    'HUBSPOT_WEBHOOK_SECRET'
  ];

  // In browser environment, check if server-only variables are accessible
  if (typeof window !== 'undefined') {
    serverOnlyVars.forEach(varName => {
      // @ts-ignore - We're intentionally checking for potential exposure
      if (window.__NEXT_DATA__?.env?.[varName] || 
          // @ts-ignore
          window.process?.env?.[varName]) {
        exposedSecrets.push(varName);
      }
    });
  }

  // Check for variables that should be prefixed with NEXT_PUBLIC_
  const shouldBePublicVars = [
    'GOOGLE_PLACES_API_KEY', // Should be NEXT_PUBLIC_GOOGLE_PLACES_API_KEY for client use
    'SITE_URL',              // Should be NEXT_PUBLIC_SITE_URL
    'CALENDLY_URL'           // Should be NEXT_PUBLIC_CALENDLY_URL
  ];

  shouldBePublicVars.forEach(varName => {
    if (process.env[varName] && !varName.startsWith('NEXT_PUBLIC_')) {
      warnings.push(`${varName} might need NEXT_PUBLIC_ prefix for client-side usage`);
    }
  });

  return {
    isValid: exposedSecrets.length === 0,
    exposedSecrets,
    warnings
  };
}

/**
 * Generate Content Security Policy header value
 */
export function generateCSPHeader(): string {
  const config = getSecurityConfig();
  const csp = config.contentSecurityPolicy;
  
  const directives = [
    `default-src ${csp.defaultSrc.join(' ')}`,
    `script-src ${csp.scriptSrc.join(' ')}`,
    `style-src ${csp.styleSrc.join(' ')}`,
    `img-src ${csp.imgSrc.join(' ')}`,
    `connect-src ${csp.connectSrc.join(' ')}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`
  ];

  return directives.join('; ');
}

/**
 * Sanitize sensitive data from logs
 */
export function sanitizeForLogging(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'key',
    'apikey',
    'api_key',
    'access_token',
    'auth',
    'authorization',
    'hubspot_api_key',
    'instagram_access_token',
    'facebook_app_secret'
  ];

  const sanitized = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some(sensitive => 
      lowerKey.includes(sensitive)
    );

    if (isSensitive) {
      // @ts-ignore
      sanitized[key] = typeof value === 'string' && value.length > 0
        ? `${value.substring(0, 4)}****${value.substring(value.length - 4)}`
        : '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      // @ts-ignore
      sanitized[key] = sanitizeForLogging(value);
    } else {
      // @ts-ignore
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Validate API key format and strength
 */
export function validateAPIKeyFormat(key: string, service: 'hubspot' | 'google' | 'instagram'): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!key || key.trim().length === 0) {
    issues.push('API key is empty');
    return { isValid: false, issues };
  }

  // Basic length validation
  if (key.length < 10) {
    issues.push('API key is too short (minimum 10 characters)');
  }

  // Service-specific validation
  switch (service) {
    case 'hubspot':
      if (!key.startsWith('pat-')) {
        issues.push('HubSpot API key should start with "pat-"');
      }
      if (key.length < 40) {
        issues.push('HubSpot API key should be at least 40 characters');
      }
      break;
    
    case 'google':
      if (key.length !== 39) {
        issues.push('Google API key should be exactly 39 characters');
      }
      if (!/^[A-Za-z0-9_-]+$/.test(key)) {
        issues.push('Google API key contains invalid characters');
      }
      break;
    
    case 'instagram':
      if (key.length < 100) {
        issues.push('Instagram access token should be at least 100 characters');
      }
      break;
  }

  // Check for common weak patterns
  if (/^(test|demo|example|placeholder)/i.test(key)) {
    issues.push('API key appears to be a placeholder or test value');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Monitor for potential security issues
 */
export function securityHealthCheck(): {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check client-side exposure
  const exposureCheck = validateClientSideExposure();
  if (!exposureCheck.isValid) {
    issues.push(`Sensitive data exposed to client: ${exposureCheck.exposedSecrets.join(', ')}`);
  }
  
  if (exposureCheck.warnings.length > 0) {
    recommendations.push(...exposureCheck.warnings);
  }

  // Check environment
  if (isProduction() && getEnvironment() !== 'production') {
    issues.push('Environment mismatch: running in production but NODE_ENV is not set to production');
  }

  // Check for development features in production
  if (isProduction()) {
    if (process.env.NODE_ENV !== 'production') {
      issues.push('NODE_ENV should be "production" in production environment');
    }
    
    // Check for debug flags
    if (process.env.DEBUG || process.env.NEXT_PUBLIC_DEBUG_MODE) {
      issues.push('Debug mode should be disabled in production');
    }
  }

  // Determine status
  let status: 'healthy' | 'warning' | 'critical' = 'healthy';
  if (issues.length > 0) {
    status = issues.some(issue => issue.includes('exposed') || issue.includes('mismatch')) ? 'critical' : 'warning';
  } else if (recommendations.length > 0) {
    status = 'warning';
  }

  return {
    status,
    issues,
    recommendations
  };
}

/**
 * Log security status for monitoring
 */
export function logSecurityStatus(): void {
  if (!isProduction()) {
    const healthCheck = securityHealthCheck();
    
    console.group('[Security] Health Check');
    console.log(`Status: ${healthCheck.status.toUpperCase()}`);
    
    if (healthCheck.issues.length > 0) {
      console.warn('Issues:');
      healthCheck.issues.forEach(issue => console.warn(`  - ${issue}`));
    }
    
    if (healthCheck.recommendations.length > 0) {
      console.info('Recommendations:');
      healthCheck.recommendations.forEach(rec => console.info(`  - ${rec}`));
    }
    
    console.groupEnd();
  }
}

/**
 * Rate limiting helper for API routes
 */
export function createRateLimiter() {
  const requests = new Map<string, { count: number; resetTime: number }>();
  const config = getSecurityConfig();
  
  return function rateLimiter(identifier: string): {
    allowed: boolean;
    remainingRequests: number;
    resetTime: number;
  } {
    const now = Date.now();
    const windowStart = now - config.rateLimitConfig.windowMs;
    
    // Clean up old entries
    requests.forEach((value, key) => {
      if (value.resetTime < now) {
        requests.delete(key);
      }
    });
    
    // Get current request data
    const currentData = requests.get(identifier) || { 
      count: 0, 
      resetTime: now + config.rateLimitConfig.windowMs 
    };
    
    // Check if window has reset
    if (currentData.resetTime < now) {
      currentData.count = 0;
      currentData.resetTime = now + config.rateLimitConfig.windowMs;
    }
    
    // Increment request count
    currentData.count++;
    requests.set(identifier, currentData);
    
    return {
      allowed: currentData.count <= config.rateLimitConfig.maxRequests,
      remainingRequests: Math.max(0, config.rateLimitConfig.maxRequests - currentData.count),
      resetTime: currentData.resetTime
    };
  };
}