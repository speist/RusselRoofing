/**
 * Application Configuration
 * Environment-aware configuration management for different deployment environments
 */

import { validateEnvironmentOrThrow, getEnvironmentVariable } from './env-validation';

export type Environment = 'development' | 'production' | 'test' | 'preview';

/**
 * Get current environment with fallback
 */
export function getEnvironment(): Environment {
  // Check for Vercel preview deployments first
  if (process.env.VERCEL_ENV === 'preview') {
    return 'preview';
  }
  
  const env = process.env.NODE_ENV as Environment;
  if (['development', 'production', 'test'].includes(env)) {
    return env;
  }
  
  return 'development';
}

/**
 * Environment detection utilities
 */
export const isDevelopment = (): boolean => getEnvironment() === 'development';
export const isProduction = (): boolean => getEnvironment() === 'production';
export const isTest = (): boolean => getEnvironment() === 'test';
export const isPreview = (): boolean => getEnvironment() === 'preview';

/**
 * Application configuration interface
 */
interface AppConfig {
  // Environment info
  environment: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  isPreview: boolean;
  
  // URLs and domains
  siteUrl: string;
  apiUrl: string;
  customDomain?: string;
  
  // Feature flags
  features: {
    enableAnalytics: boolean;
    enableDebugMode: boolean;
    enableMockData: boolean;
    enableRateLimiting: boolean;
  };
  
  // API configurations
  apis: {
    hubspot: {
      apiKey: string;
      portalId?: string;
      publicApiKey?: string;
      publicPortalId?: string;
      baseUrl: string;
      webhookSecret?: string;
      mockMode: boolean;
    };
    google: {
      placesApiKey: string;
      serverPlacesApiKey: string;
      russellRoofingPlaceId: string;
      analyticsId?: string;
    };
    instagram: {
      accessToken: string;
      userId: string;
      facebookAppId?: string;
      facebookAppSecret?: string;
      mockMode: boolean;
    };
  };
  
  // Third-party integrations
  integrations: {
    calendlyUrl: string;
  };
  
  // Notification configuration
  notifications: {
    emergencyPhones: string[];
    emergencyEmails: string[];
    seniorSalesEmails: string[];
    salesTeamEmails: string[];
  };
  
  // Performance and caching
  cache: {
    reviewsCacheDuration: number;
    instagramCacheDuration: number;
    rateLimitWindow: number;
  };
}

/**
 * Parse comma-separated environment variable into array
 */
function parseCommaSeparatedEnvVar(envVar: string, fallback: string[] = []): string[] {
  const value = getEnvironmentVariable(envVar);
  if (!value) return fallback;
  
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

/**
 * Get application configuration based on current environment
 */
export function getAppConfig(): AppConfig {
  const environment = getEnvironment();
  
  // Validate environment variables in production (but not during tests)
  if (isProduction() && !isTest()) {
    try {
      validateEnvironmentOrThrow();
    } catch (error) {
      console.error('Production environment validation failed:', error);
      // In production, we might want to fail gracefully or use fallbacks
      // For now, we'll log the error and continue
    }
  }
  
  // Determine site URL with fallbacks
  const getSiteUrl = (): string => {
    if (isProduction()) {
      return getEnvironmentVariable('NEXT_PUBLIC_SITE_URL', 'https://russellroofing.com');
    }
    
    if (isPreview()) {
      return getEnvironmentVariable('VERCEL_URL') 
        ? `https://${getEnvironmentVariable('VERCEL_URL')}`
        : 'http://localhost:3000';
    }
    
    return 'http://localhost:3000';
  };
  
  const siteUrl = getSiteUrl();
  
  return {
    // Environment info
    environment,
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    isTest: isTest(),
    isPreview: isPreview(),
    
    // URLs and domains
    siteUrl,
    apiUrl: getEnvironmentVariable('NEXT_PUBLIC_API_URL', `${siteUrl}/api`),
    customDomain: getEnvironmentVariable('CUSTOM_DOMAIN') || undefined,
    
    // Feature flags
    features: {
      enableAnalytics: isProduction() || isPreview(),
      enableDebugMode: isDevelopment(),
      enableMockData: isDevelopment() && !getEnvironmentVariable('DISABLE_MOCK_DATA'),
      enableRateLimiting: isProduction() || isPreview(),
    },
    
    // API configurations
    apis: {
      hubspot: {
        apiKey: getEnvironmentVariable('HUBSPOT_API_KEY'),
        portalId: getEnvironmentVariable('HUBSPOT_PORTAL_ID') || undefined,
        publicApiKey: getEnvironmentVariable('NEXT_PUBLIC_HUBSPOT_API_KEY') || undefined,
        publicPortalId: getEnvironmentVariable('NEXT_PUBLIC_HUBSPOT_PORTAL_ID') || undefined,
        baseUrl: getEnvironmentVariable('HUBSPOT_BASE_URL', 'https://app.hubspot.com'),
        webhookSecret: getEnvironmentVariable('HUBSPOT_WEBHOOK_SECRET') || undefined,
        mockMode: !getEnvironmentVariable('HUBSPOT_API_KEY') || isDevelopment(),
      },
      google: {
        placesApiKey: getEnvironmentVariable('NEXT_PUBLIC_GOOGLE_PLACES_API_KEY'),
        serverPlacesApiKey: getEnvironmentVariable('GOOGLE_PLACES_API_KEY'),
        russellRoofingPlaceId: getEnvironmentVariable('RUSSELL_ROOFING_PLACE_ID'),
        analyticsId: getEnvironmentVariable('NEXT_PUBLIC_GA_MEASUREMENT_ID') || undefined,
      },
      instagram: {
        accessToken: getEnvironmentVariable('INSTAGRAM_ACCESS_TOKEN'),
        userId: getEnvironmentVariable('INSTAGRAM_USER_ID'),
        facebookAppId: getEnvironmentVariable('FACEBOOK_APP_ID') || undefined,
        facebookAppSecret: getEnvironmentVariable('FACEBOOK_APP_SECRET') || undefined,
        mockMode: !getEnvironmentVariable('INSTAGRAM_ACCESS_TOKEN') || isDevelopment(),
      },
    },
    
    // Third-party integrations
    integrations: {
      calendlyUrl: getEnvironmentVariable(
        'NEXT_PUBLIC_CALENDLY_URL',
        'https://calendly.com/russell-roofing/estimate-consultation'
      ),
    },
    
    // Notification configuration
    notifications: {
      emergencyPhones: parseCommaSeparatedEnvVar('EMERGENCY_PHONE_NUMBERS'),
      emergencyEmails: parseCommaSeparatedEnvVar('EMERGENCY_EMAIL_LIST'),
      seniorSalesEmails: parseCommaSeparatedEnvVar('SENIOR_SALES_EMAIL_LIST'),
      salesTeamEmails: parseCommaSeparatedEnvVar('SALES_TEAM_EMAIL_LIST'),
    },
    
    // Performance and caching
    cache: {
      reviewsCacheDuration: isProduction() ? 6 * 60 * 60 * 1000 : 5 * 60 * 1000, // 6 hours prod, 5 min dev
      instagramCacheDuration: isProduction() ? 60 * 60 * 1000 : 5 * 60 * 1000, // 1 hour prod, 5 min dev
      rateLimitWindow: isProduction() ? 60 * 1000 : 10 * 1000, // 1 min prod, 10 sec dev
    },
  };
}

// Create singleton instance
let configInstance: AppConfig | null = null;

/**
 * Get cached application configuration
 */
export function getConfig(): AppConfig {
  if (!configInstance) {
    configInstance = getAppConfig();
  }
  return configInstance;
}

/**
 * Reset configuration cache (useful for testing)
 */
export function resetConfig(): void {
  configInstance = null;
}

/**
 * Utility function to check if API is configured for a service
 */
export function isServiceConfigured(service: 'hubspot' | 'google' | 'instagram'): boolean {
  const config = getConfig();
  
  switch (service) {
    case 'hubspot':
      return Boolean(config.apis.hubspot.apiKey);
    case 'google':
      return Boolean(config.apis.google.placesApiKey && config.apis.google.russellRoofingPlaceId);
    case 'instagram':
      return Boolean(config.apis.instagram.accessToken && config.apis.instagram.userId);
    default:
      return false;
  }
}

/**
 * Get service-specific configuration
 */
export function getServiceConfig<T extends 'hubspot' | 'google' | 'instagram'>(
  service: T
): AppConfig['apis'][T] {
  return getConfig().apis[service];
}

/**
 * Log configuration status for debugging
 */
export function logConfigStatus(): void {
  if (!isDevelopment()) return;
  
  const config = getConfig();
  
  console.group('[Config] Application Configuration');
  console.log(`Environment: ${config.environment}`);
  console.log(`Site URL: ${config.siteUrl}`);
  console.log(`API URL: ${config.apiUrl}`);
  
  console.log('\nFeature Flags:');
  Object.entries(config.features).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\nService Status:');
  console.log(`  HubSpot: ${isServiceConfigured('hubspot') ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`  Google Places: ${isServiceConfigured('google') ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`  Instagram: ${isServiceConfigured('instagram') ? '✅ Configured' : '❌ Not configured'}`);
  
  console.groupEnd();
}