/**
 * Environment Variable Validation Utility
 * Validates that all required environment variables are present and properly configured
 */

interface EnvConfig {
  name: string;
  required: boolean;
  clientSide: boolean;
  description: string;
  category: 'hubspot' | 'google' | 'instagram' | 'companycam' | 'app' | 'notification' | 'optional';
  setupUrl?: string;
  format?: 'url' | 'token' | 'email' | 'id' | 'phone';
}

// Define all environment variables used in the application
const ENV_VARIABLES: EnvConfig[] = [
  // HubSpot Configuration
  {
    name: 'HUBSPOT_API_KEY',
    required: true,
    clientSide: false,
    description: 'HubSpot Private App Token for server-side API operations',
    category: 'hubspot',
    format: 'token',
    setupUrl: 'https://developers.hubspot.com/docs/api/private-apps'
  },
  {
    name: 'HUBSPOT_PORTAL_ID',
    required: false,
    clientSide: false,
    description: 'HubSpot Portal ID for API requests and dashboard links',
    category: 'hubspot'
  },
  {
    name: 'NEXT_PUBLIC_HUBSPOT_API_KEY',
    required: false,
    clientSide: true,
    description: 'HubSpot Public API Key for client-side forms (if needed)',
    category: 'hubspot'
  },
  {
    name: 'NEXT_PUBLIC_HUBSPOT_PORTAL_ID',
    required: false,
    clientSide: true,
    description: 'HubSpot Public Portal ID for client-side forms',
    category: 'hubspot'
  },
  {
    name: 'HUBSPOT_BASE_URL',
    required: false,
    clientSide: false,
    description: 'HubSpot Base URL for generating dashboard links',
    category: 'hubspot'
  },

  // Google Services
  {
    name: 'NEXT_PUBLIC_GOOGLE_PLACES_API_KEY',
    required: false,
    clientSide: true,
    description: 'Google Places API Key for maps and places autocomplete',
    category: 'google',
    format: 'token',
    setupUrl: 'https://developers.google.com/maps/documentation/places/web-service/get-api-key'
  },
  {
    name: 'GOOGLE_PLACES_API_KEY',
    required: false,
    clientSide: false,
    description: 'Google Places API Key for server-side reviews API',
    category: 'google',
    format: 'token',
    setupUrl: 'https://developers.google.com/maps/documentation/places/web-service/get-api-key'
  },
  {
    name: 'RUSSELL_ROOFING_PLACE_ID',
    required: false,
    clientSide: false,
    description: 'Russell Roofing Business Place ID from Google My Business',
    category: 'google',
    format: 'id',
    setupUrl: 'https://developers.google.com/maps/documentation/places/web-service/place-id'
  },

  // Instagram Integration
  {
    name: 'INSTAGRAM_ACCESS_TOKEN',
    required: false,
    clientSide: false,
    description: 'Instagram Long-Lived Access Token for Basic Display API',
    category: 'instagram',
    format: 'token',
    setupUrl: 'https://developers.facebook.com/docs/instagram-basic-display-api/getting-started'
  },
  {
    name: 'INSTAGRAM_USER_ID',
    required: false,
    clientSide: false,
    description: 'Instagram User ID for Russell Roofing Company account',
    category: 'instagram',
    format: 'id',
    setupUrl: 'https://developers.facebook.com/docs/instagram-basic-display-api/getting-started'
  },
  {
    name: 'FACEBOOK_APP_ID',
    required: false,
    clientSide: false,
    description: 'Facebook App ID for Instagram Basic Display API',
    category: 'instagram'
  },
  {
    name: 'FACEBOOK_APP_SECRET',
    required: false,
    clientSide: false,
    description: 'Facebook App Secret for token refresh',
    category: 'instagram'
  },

  // CompanyCam Integration
  {
    name: 'COMPANYCAM_API_KEY',
    required: false,
    clientSide: false,
    description: 'CompanyCam API Key for fetching tagged construction photos',
    category: 'companycam',
    format: 'token',
    setupUrl: 'https://companycam.com/developers'
  },

  // Application Configuration
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    required: false,
    clientSide: true,
    description: 'Application Base URL for redirects and canonical URLs',
    category: 'app'
  },
  {
    name: 'NEXT_PUBLIC_API_URL',
    required: false,
    clientSide: true,
    description: 'API Base URL for internal API calls',
    category: 'app'
  },
  {
    name: 'NEXT_PUBLIC_CALENDLY_URL',
    required: false,
    clientSide: true,
    description: 'Calendly Integration URL for scheduling widget',
    category: 'app'
  },

  // Notification System
  {
    name: 'EMERGENCY_PHONE_NUMBERS',
    required: false,
    clientSide: false,
    description: 'Emergency Contact Phone Numbers (comma-separated)',
    category: 'notification'
  },
  {
    name: 'EMERGENCY_EMAIL_LIST',
    required: false,
    clientSide: false,
    description: 'Emergency Email List (comma-separated)',
    category: 'notification'
  },
  {
    name: 'SENIOR_SALES_EMAIL_LIST',
    required: false,
    clientSide: false,
    description: 'Senior Sales Team Email List (comma-separated)',
    category: 'notification'
  },
  {
    name: 'SALES_TEAM_EMAIL_LIST',
    required: false,
    clientSide: false,
    description: 'Sales Team Email List (comma-separated)',
    category: 'notification'
  },

  // Optional Configuration
  {
    name: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    required: false,
    clientSide: true,
    description: 'Google Analytics Measurement ID for tracking',
    category: 'optional'
  },
  {
    name: 'CUSTOM_DOMAIN',
    required: false,
    clientSide: false,
    description: 'Custom Domain override for domain configurations',
    category: 'optional'
  }
];

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missing: string[];
  configured: string[];
  summary: {
    total: number;
    required: number;
    configured: number;
    missing: number;
  };
}

/**
 * Validate all environment variables
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missing: string[] = [];
  const configured: string[] = [];

  // Debug: Log the HUBSPOT_API_KEY specifically
  console.log('[DEBUG] HUBSPOT_API_KEY value:', process.env.HUBSPOT_API_KEY ? '✅ FOUND' : '❌ MISSING');
  console.log('[DEBUG] All process.env keys:', Object.keys(process.env).filter(k => k.includes('HUBSPOT') || k.includes('NODE') || k.includes('VERCEL')).join(', '));

  ENV_VARIABLES.forEach(envVar => {
    const value = process.env[envVar.name];
    const hasValue = value && value.trim() !== '';

    if (hasValue) {
      configured.push(envVar.name);
      
      // Additional validation for specific variable types
      if (envVar.name.includes('EMAIL') && value) {
        const emails = value.split(',').map(e => e.trim());
        const invalidEmails = emails.filter(email => !isValidEmail(email));
        if (invalidEmails.length > 0) {
          warnings.push(`${envVar.name} contains invalid email addresses: ${invalidEmails.join(', ')}`);
        }
      }
      
      if (envVar.name.includes('PHONE') && value) {
        const phones = value.split(',').map(p => p.trim());
        const invalidPhones = phones.filter(phone => !isValidPhone(phone));
        if (invalidPhones.length > 0) {
          warnings.push(`${envVar.name} contains invalid phone numbers: ${invalidPhones.join(', ')}`);
        }
      }
      
      if (envVar.name.includes('URL') && value && !isValidUrl(value)) {
        warnings.push(`${envVar.name} appears to be an invalid URL: ${value}`);
      }
    } else {
      missing.push(envVar.name);
      
      if (envVar.required) {
        errors.push(`Required environment variable ${envVar.name} is missing or empty`);
      } else {
        warnings.push(`Optional environment variable ${envVar.name} is not configured`);
      }
    }
  });

  const requiredCount = ENV_VARIABLES.filter(v => v.required).length;
  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    missing,
    configured,
    summary: {
      total: ENV_VARIABLES.length,
      required: requiredCount,
      configured: configured.length,
      missing: missing.length
    }
  };
}

/**
 * Validate environment variables and throw if critical errors exist
 */
export function validateEnvironmentOrThrow(): void {
  const result = validateEnvironment();
  
  if (!result.isValid) {
    // Group missing variables by category for better error organization
    const missingByCategory: Record<string, EnvConfig[]> = {};
    
    result.missing.forEach(varName => {
      const config = ENV_VARIABLES.find(v => v.name === varName && v.required);
      if (config) {
        if (!missingByCategory[config.category]) {
          missingByCategory[config.category] = [];
        }
        missingByCategory[config.category].push(config);
      }
    });
    
    const errorLines = ['❌ Environment Configuration Error\n'];
    errorLines.push('Missing required environment variables:\n');
    
    // Create detailed error messages with setup instructions
    Object.entries(missingByCategory).forEach(([category, configs]) => {
      errorLines.push(`${category.toUpperCase()} Configuration:`);
      configs.forEach(config => {
        errorLines.push(`  • ${config.name} (${config.description})`);
        if (config.setupUrl) {
          errorLines.push(`    📖 Setup: ${config.setupUrl}`);
        }
        errorLines.push('');
      });
    });
    
    errorLines.push('💡 Create a .env.local file with these variables');
    errorLines.push('📋 See .env.example for the complete list');
    errorLines.push('');
    errorLines.push('Application startup aborted.');
    
    throw new Error(errorLines.join('\n'));
  }
  
  // Log warnings if any
  if (result.warnings.length > 0) {
    console.warn('[Environment] Validation warnings:');
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  console.log(`[Environment] Validation passed: ${result.summary.configured}/${result.summary.total} variables configured`);
}

/**
 * Get environment configuration by category
 */
export function getEnvironmentConfig(category?: string): EnvConfig[] {
  if (!category) return ENV_VARIABLES;
  return ENV_VARIABLES.filter(env => env.category === category);
}

/**
 * Check if a specific environment variable is configured
 */
export function isEnvironmentVariableConfigured(name: string): boolean {
  const value = process.env[name];
  return Boolean(value && value.trim() !== '');
}

/**
 * Get environment variable with fallback
 */
export function getEnvironmentVariable(name: string, fallback: string = ''): string {
  return process.env[name] || fallback;
}

/**
 * Get environment variables for a specific service
 */
export function getServiceEnvironmentVariables(service: 'hubspot' | 'google' | 'instagram' | 'companycam'): Record<string, string | undefined> {
  const serviceVars = ENV_VARIABLES.filter(env => env.category === service);
  const result: Record<string, string | undefined> = {};
  
  serviceVars.forEach(envVar => {
    result[envVar.name] = process.env[envVar.name];
  });
  
  return result;
}

// Utility validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Simple phone validation - accepts various formats
  const phoneRegex = /^[\+]?[(]?[\d\s\-\.\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Development utility to log environment status
 */
export function logEnvironmentStatus(): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const result = validateEnvironment();
  
  console.group('[Environment] Configuration Status');
  console.log(`Total variables: ${result.summary.total}`);
  console.log(`Required variables: ${result.summary.required}`);
  console.log(`Configured variables: ${result.summary.configured}`);
  console.log(`Missing variables: ${result.summary.missing}`);
  
  if (result.configured.length > 0) {
    console.log('\nConfigured variables:');
    result.configured.forEach(name => {
      const config = ENV_VARIABLES.find(v => v.name === name);
      const isRequired = config?.required ? '(required)' : '(optional)';
      console.log(`  ✅ ${name} ${isRequired}`);
    });
  }
  
  if (result.missing.length > 0) {
    console.log('\nMissing variables:');
    result.missing.forEach(name => {
      const config = ENV_VARIABLES.find(v => v.name === name);
      const isRequired = config?.required ? '(required)' : '(optional)';
      const icon = config?.required ? '❌' : '⚠️';
      console.log(`  ${icon} ${name} ${isRequired}`);
    });
  }
  
  console.groupEnd();
}