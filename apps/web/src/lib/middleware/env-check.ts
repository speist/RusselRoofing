/**
 * Environment Variable Validation Middleware for API Routes
 * Provides runtime validation for API endpoints requiring specific environment variables
 */

import { NextRequest, NextResponse } from 'next/server';
import { isEnvironmentVariableConfigured, getEnvironmentConfig } from '@/lib/env-validation';

export interface EnvCheckOptions {
  requiredVars: string[];
  optionalVars?: string[];
  category?: string;
  gracefulDegradation?: boolean;
}

/**
 * Create environment validation middleware for API routes
 */
export function createEnvMiddleware(options: EnvCheckOptions) {
  return function envCheckMiddleware(request: NextRequest): NextResponse | null {
    const { requiredVars, optionalVars = [], category, gracefulDegradation = false } = options;
    
    // Check required environment variables
    const missingRequired = requiredVars.filter(varName => !isEnvironmentVariableConfigured(varName));
    const missingOptional = optionalVars.filter(varName => !isEnvironmentVariableConfigured(varName));
    
    // If required variables are missing, return error response
    if (missingRequired.length > 0) {
      const error = {
        error: 'Server configuration error',
        message: 'Required environment variables are not configured',
        missing: missingRequired,
        category: category || 'api',
        gracefulDegradation,
        details: missingRequired.map(varName => {
          const config = getEnvironmentConfig().find(env => env.name === varName);
          return {
            name: varName,
            description: config?.description || 'Environment variable',
            category: config?.category || 'unknown'
          };
        })
      };
      
      // Log detailed error for debugging
      console.error(`[API Middleware] Environment validation failed for ${request.nextUrl.pathname}`);
      console.error(`Missing required variables: ${missingRequired.join(', ')}`);
      
      if (gracefulDegradation) {
        console.warn('[API Middleware] Proceeding with graceful degradation');
        return null; // Allow request to continue
      }
      
      return NextResponse.json(error, { status: 500 });
    }
    
    // Log warnings for missing optional variables
    if (missingOptional.length > 0) {
      console.warn(`[API Middleware] Optional variables missing for ${request.nextUrl.pathname}: ${missingOptional.join(', ')}`);
    }
    
    // Validation passed, continue with request
    return null;
  };
}

/**
 * Pre-configured middleware for common service requirements
 */
export const envMiddleware = {
  /**
   * HubSpot API middleware - requires HubSpot API key
   */
  hubspot: createEnvMiddleware({
    requiredVars: ['HUBSPOT_API_KEY'],
    optionalVars: ['HUBSPOT_PORTAL_ID', 'HUBSPOT_BASE_URL'],
    category: 'hubspot'
  }),
  
  /**
   * Google Places API middleware - requires Google Places API key
   */
  googlePlaces: createEnvMiddleware({
    requiredVars: ['GOOGLE_PLACES_API_KEY', 'RUSSELL_ROOFING_PLACE_ID'],
    category: 'google'
  }),
  
  /**
   * Instagram API middleware - requires Instagram access token
   */
  instagram: createEnvMiddleware({
    requiredVars: ['INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_USER_ID'],
    optionalVars: ['FACEBOOK_APP_ID', 'FACEBOOK_APP_SECRET'],
    category: 'instagram',
    gracefulDegradation: true // Allow degraded functionality if tokens expire
  }),
  
  /**
   * Notification middleware - all variables are optional with fallbacks
   */
  notifications: createEnvMiddleware({
    requiredVars: [],
    optionalVars: [
      'EMERGENCY_PHONE_NUMBERS',
      'EMERGENCY_EMAIL_LIST',
      'SENIOR_SALES_EMAIL_LIST',
      'SALES_TEAM_EMAIL_LIST'
    ],
    category: 'notification',
    gracefulDegradation: true
  }),

  /**
   * CompanyCam API middleware - requires CompanyCam API key
   */
  companycam: createEnvMiddleware({
    requiredVars: ['COMPANYCAM_API_KEY'],
    category: 'companycam',
    gracefulDegradation: true // Allow degraded functionality if API key is not configured
  })
};

/**
 * Validate environment for specific API endpoint
 */
export function validateApiEnvironment(endpoint: string, requiredVars: string[]): {
  isValid: boolean;
  missing: string[];
  error?: string;
} {
  const missing = requiredVars.filter(varName => !isEnvironmentVariableConfigured(varName));
  
  return {
    isValid: missing.length === 0,
    missing,
    error: missing.length > 0 
      ? `API endpoint ${endpoint} requires environment variables: ${missing.join(', ')}`
      : undefined
  };
}

/**
 * Health check function for API environment validation
 */
export function getApiHealthStatus(): {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, {
    status: 'healthy' | 'degraded' | 'unhealthy';
    missing: string[];
    optional_missing: string[];
  }>;
  summary: {
    total_services: number;
    healthy_services: number;
    degraded_services: number;
    unhealthy_services: number;
  };
} {
  const services = {
    hubspot: {
      required: ['HUBSPOT_API_KEY'],
      optional: ['HUBSPOT_PORTAL_ID', 'HUBSPOT_BASE_URL']
    },
    google: {
      required: ['GOOGLE_PLACES_API_KEY', 'RUSSELL_ROOFING_PLACE_ID'],
      optional: []
    },
    instagram: {
      required: ['INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_USER_ID'],
      optional: ['FACEBOOK_APP_ID', 'FACEBOOK_APP_SECRET']
    },
    companycam: {
      required: ['COMPANYCAM_API_KEY'],
      optional: []
    },
    notifications: {
      required: [],
      optional: ['EMERGENCY_PHONE_NUMBERS', 'EMERGENCY_EMAIL_LIST', 'SENIOR_SALES_EMAIL_LIST', 'SALES_TEAM_EMAIL_LIST']
    }
  };
  
  const serviceStatuses: Record<string, any> = {};
  let healthyCount = 0;
  let degradedCount = 0;
  let unhealthyCount = 0;
  
  Object.entries(services).forEach(([serviceName, { required, optional }]) => {
    const missingRequired = required.filter(varName => !isEnvironmentVariableConfigured(varName));
    const missingOptional = optional.filter(varName => !isEnvironmentVariableConfigured(varName));
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (missingRequired.length === 0) {
      status = missingOptional.length === 0 ? 'healthy' : 'degraded';
    } else {
      status = 'unhealthy';
    }
    
    serviceStatuses[serviceName] = {
      status,
      missing: missingRequired,
      optional_missing: missingOptional
    };
    
    if (status === 'healthy') healthyCount++;
    else if (status === 'degraded') degradedCount++;
    else unhealthyCount++;
  });
  
  // Determine overall status
  let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
  if (unhealthyCount > 0) {
    overallStatus = 'unhealthy';
  } else if (degradedCount > 0) {
    overallStatus = 'degraded';
  } else {
    overallStatus = 'healthy';
  }
  
  return {
    status: overallStatus,
    services: serviceStatuses,
    summary: {
      total_services: Object.keys(services).length,
      healthy_services: healthyCount,
      degraded_services: degradedCount,
      unhealthy_services: unhealthyCount
    }
  };
}