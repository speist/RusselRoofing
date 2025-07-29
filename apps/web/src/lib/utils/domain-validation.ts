/**
 * Domain validation utilities for production domain testing
 * Validates SSL certificates, domain configuration, and health checks
 */

import { getURLConfig, getDomainConfig } from './urls';

/**
 * Domain health check result interface
 */
export interface DomainHealthCheck {
  domain: string;
  timestamp: Date;
  checks: {
    dns: { status: 'pass' | 'fail'; message: string };
    ssl: { status: 'pass' | 'fail'; message: string; expiryDate?: Date };
    https: { status: 'pass' | 'fail'; message: string };
    redirect: { status: 'pass' | 'fail'; message: string };
    security: { status: 'pass' | 'fail'; message: string };
    api: { status: 'pass' | 'fail'; message: string };
  };
  overall: 'healthy' | 'warning' | 'error';
}

/**
 * Validate domain configuration
 * @param domain - Domain to validate (optional, uses current domain if not provided)
 * @returns Domain health check results
 */
export async function validateDomain(domain?: string): Promise<DomainHealthCheck> {
  const targetDomain = domain || getDomainConfig().domain;
  const timestamp = new Date();
  
  const checks = {
    dns: await checkDNSResolution(targetDomain),
    ssl: await checkSSLCertificate(targetDomain),
    https: await checkHTTPSRedirect(targetDomain),
    redirect: await checkRedirectConfiguration(targetDomain),
    security: await checkSecurityHeaders(targetDomain),
    api: await checkAPIEndpoints(targetDomain),
  };

  // Determine overall health
  const failedChecks = Object.values(checks).filter(check => check.status === 'fail').length;
  let overall: 'healthy' | 'warning' | 'error';
  
  if (failedChecks === 0) {
    overall = 'healthy';
  } else if (failedChecks <= 2) {
    overall = 'warning';
  } else {
    overall = 'error';
  }

  return {
    domain: targetDomain,
    timestamp,
    checks,
    overall,
  };
}

/**
 * Check DNS resolution for domain
 */
async function checkDNSResolution(domain: string) {
  try {
    // In a browser environment, we can't directly do DNS lookups
    // This would need to be implemented server-side or using a DNS service
    const response = await fetch(`https://${domain}`, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    
    return {
      status: 'pass' as const,
      message: `DNS resolution successful for ${domain}`
    };
  } catch (error) {
    return {
      status: 'fail' as const,
      message: `DNS resolution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Check SSL certificate validity
 */
async function checkSSLCertificate(domain: string) {
  try {
    const response = await fetch(`https://${domain}`, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      return {
        status: 'pass' as const,
        message: 'SSL certificate is valid and active'
      };
    } else {
      return {
        status: 'fail' as const,
        message: `SSL check failed with status: ${response.status}`
      };
    }
  } catch (error) {
    return {
      status: 'fail' as const,
      message: `SSL certificate check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Check HTTPS redirect functionality
 */
async function checkHTTPSRedirect(domain: string) {
  try {
    // Try to access HTTP version and see if it redirects
    const response = await fetch(`http://${domain}`, { 
      method: 'HEAD',
      redirect: 'manual',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location && location.startsWith('https://')) {
        return {
          status: 'pass' as const,
          message: 'HTTP to HTTPS redirect is working correctly'
        };
      }
    }
    
    return {
      status: 'fail' as const,
      message: 'HTTP to HTTPS redirect is not configured properly'
    };
  } catch (error) {
    return {
      status: 'fail' as const,
      message: `HTTPS redirect check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Check redirect configuration (www to non-www or vice versa)
 */
async function checkRedirectConfiguration(domain: string) {
  try {
    const baseUrl = `https://${domain}`;
    const wwwUrl = `https://www.${domain}`;
    
    const [baseResponse, wwwResponse] = await Promise.all([
      fetch(baseUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) }),
      fetch(wwwUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    ]);
    
    if (baseResponse.ok && wwwResponse.ok) {
      return {
        status: 'pass' as const,
        message: 'Both www and non-www versions are accessible'
      };
    } else if (baseResponse.ok || wwwResponse.ok) {
      return {
        status: 'pass' as const,
        message: 'Domain is accessible (check redirect configuration if needed)'
      };
    } else {
      return {
        status: 'fail' as const,
        message: 'Neither www nor non-www versions are accessible'
      };
    }
  } catch (error) {
    return {
      status: 'fail' as const,
      message: `Redirect configuration check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Check security headers
 */
async function checkSecurityHeaders(domain: string) {
  try {
    const response = await fetch(`https://${domain}`, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    
    const requiredHeaders = [
      'strict-transport-security',
      'x-frame-options',
      'x-content-type-options'
    ];
    
    const missingHeaders = requiredHeaders.filter(header => 
      !response.headers.has(header)
    );
    
    if (missingHeaders.length === 0) {
      return {
        status: 'pass' as const,
        message: 'All required security headers are present'
      };
    } else {
      return {
        status: 'fail' as const,
        message: `Missing security headers: ${missingHeaders.join(', ')}`
      };
    }
  } catch (error) {
    return {
      status: 'fail' as const,
      message: `Security headers check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Check API endpoints accessibility
 */
async function checkAPIEndpoints(domain: string) {
  try {
    const healthEndpoint = `https://${domain}/api/health`;
    const response = await fetch(healthEndpoint, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      return {
        status: 'pass' as const,
        message: 'API endpoints are accessible'
      };
    } else {
      return {
        status: 'fail' as const,
        message: `API health check failed with status: ${response.status}`
      };
    }
  } catch (error) {
    return {
      status: 'fail' as const,
      message: `API endpoints check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Get domain monitoring configuration
 */
export function getDomainMonitoringConfig() {
  const { domain, secure } = getDomainConfig();
  
  return {
    domain,
    monitoringEndpoints: [
      `${secure ? 'https' : 'http'}://${domain}`,
      `${secure ? 'https' : 'http'}://${domain}/api/health`,
      `${secure ? 'https' : 'http'}://${domain}/api/reviews`,
      `${secure ? 'https' : 'http'}://${domain}/api/instagram`,
    ],
    checkInterval: 300000, // 5 minutes
    alertThresholds: {
      consecutiveFailures: 3,
      responseTimeMs: 5000,
    },
  };
}

/**
 * Generate domain validation report
 */
export function generateValidationReport(healthCheck: DomainHealthCheck): string {
  const { domain, timestamp, checks, overall } = healthCheck;
  
  let report = `Domain Validation Report for ${domain}\n`;
  report += `Generated: ${timestamp.toISOString()}\n`;
  report += `Overall Status: ${overall.toUpperCase()}\n\n`;
  
  Object.entries(checks).forEach(([checkName, result]) => {
    const icon = result.status === 'pass' ? '✅' : '❌';
    report += `${icon} ${checkName.toUpperCase()}: ${result.message}\n`;
  });
  
  return report;
}

/**
 * Check if domain is using HTTPS
 */
export function isDomainSecure(domain: string = getDomainConfig().domain): boolean {
  return domain.includes('localhost') ? false : true; // localhost is typically HTTP in dev
}

/**
 * Validate custom domain format
 */
export function isValidDomainFormat(domain: string): boolean {
  if (!domain || domain.length === 0 || domain.length > 253) {
    return false;
  }
  
  // Must contain at least one dot for a valid domain
  if (!domain.includes('.')) {
    return false;
  }
  
  // Cannot start or end with dot or dash
  if (domain.startsWith('.') || domain.endsWith('.') || domain.startsWith('-') || domain.endsWith('-')) {
    return false;
  }
  
  // Cannot contain consecutive dots
  if (domain.includes('..')) {
    return false;
  }
  
  // Cannot contain protocol
  if (domain.includes('://')) {
    return false;
  }
  
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  return domainRegex.test(domain);
}