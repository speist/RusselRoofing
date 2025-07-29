# Environment Configuration Guide

This guide explains how to configure environment variables for Russell Roofing Company's web application.

## Overview

The application uses environment variables for API keys, configuration settings, and feature flags. Different environments (development, production, preview) have different configuration requirements.

## Quick Setup

### 1. Copy the Environment Template

```bash
cp .env.example .env.local
```

### 2. Configure Required Variables

Edit `.env.local` and set the required environment variables:

```bash
# Required for core functionality
HUBSPOT_API_KEY=your_hubspot_private_app_token
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key  
RUSSELL_ROOFING_PLACE_ID=your_google_places_business_id
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_USER_ID=your_instagram_user_id
```

### 3. Start Development Server

```bash
npm run dev
```

## Environment Variables Reference

### Required Variables

These variables are required for the application to function properly:

| Variable | Environment | Description | Where to Get |
|----------|-------------|-------------|--------------|
| `HUBSPOT_API_KEY` | Server | HubSpot Private App Token | HubSpot Developer Account → Private Apps |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | Client | Google Places API Key (client-side) | Google Cloud Console → APIs & Services |
| `GOOGLE_PLACES_API_KEY` | Server | Google Places API Key (server-side) | Google Cloud Console → APIs & Services |
| `RUSSELL_ROOFING_PLACE_ID` | Server | Google My Business Place ID | Google My Business |
| `INSTAGRAM_ACCESS_TOKEN` | Server | Instagram Long-Lived Access Token | Facebook Developer Console |
| `INSTAGRAM_USER_ID` | Server | Instagram User ID | Facebook Developer Console |

### Optional Variables

These variables provide additional functionality but are not required:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` (dev), `https://russellroofing.com` (prod) | Application base URL |
| `NEXT_PUBLIC_CALENDLY_URL` | Default Calendly URL | Scheduling integration |
| `EMERGENCY_EMAIL_LIST` | Empty | Comma-separated emergency contact emails |
| `SALES_TEAM_EMAIL_LIST` | Empty | Comma-separated sales team emails |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Empty | Google Analytics tracking ID |

## Environment-Specific Configuration

### Development Environment

- **File**: `.env.local`
- **Features**: Debug mode enabled, mock data, reduced cache times
- **API Keys**: Use test/development keys when available

```bash
# Development configuration
NODE_ENV=development
HUBSPOT_API_KEY=your_dev_hubspot_key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_dev_google_key
# ... other variables
```

### Production Environment

- **Platform**: Vercel Dashboard → Environment Variables
- **Features**: Analytics enabled, production caching, rate limiting
- **API Keys**: Use live production keys

**Vercel Setup Steps:**

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable for Production environment
4. Deploy your changes

### Preview Environment (Staging)

- **Platform**: Vercel (automatically detected)
- **Features**: Production-like settings with staging data
- **API Keys**: Use staging keys when available, otherwise production keys

## API Integration Details

### HubSpot Integration

**Required Variables:**
- `HUBSPOT_API_KEY`: Private app token from HubSpot

**Setup Steps:**
1. Log into HubSpot Developer Account
2. Create a Private App
3. Configure required scopes: `crm.objects.contacts.write`, `crm.objects.deals.write`
4. Copy the generated token

**Mock Mode:** Automatically enabled when API key is missing in development

### Google Places API

**Required Variables:**
- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`: For client-side maps/autocomplete
- `GOOGLE_PLACES_API_KEY`: For server-side reviews API
- `RUSSELL_ROOFING_PLACE_ID`: Business location identifier

**Setup Steps:**
1. Go to Google Cloud Console
2. Enable Places API
3. Create API credentials
4. Restrict keys appropriately (HTTP referrers for client-side, IP addresses for server-side)

**Note:** You can use the same API key for both variables, but it's recommended to use separate keys with different restrictions for security.

### Instagram Integration

**Required Variables:**
- `INSTAGRAM_ACCESS_TOKEN`: Long-lived access token
- `INSTAGRAM_USER_ID`: Instagram account user ID

**Setup Steps:**
1. Create Facebook App
2. Add Instagram Basic Display product
3. Generate long-lived access token
4. Set up token refresh automation (recommended)

## Security Best Practices

### 1. Environment File Security

```bash
# Never commit these files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 2. API Key Restrictions

- **Client-side keys** (`NEXT_PUBLIC_*`): Restrict by HTTP referrer
- **Server-side keys**: Restrict by IP address in production
- **Instagram tokens**: Set up automatic refresh

### 3. Production Deployment

- Use Vercel environment variables (encrypted at rest)
- Different keys for different environments
- Regular key rotation schedule
- Monitor usage and set up alerts

## Validation and Troubleshooting

### Environment Validation

The application includes automatic environment validation:

```typescript
import { validateEnvironmentOrThrow } from '@/lib/env-validation';

// Validates all required variables
validateEnvironmentOrThrow();
```

### Common Issues

**1. "Environment validation failed"**
- Check that all required variables are set
- Verify variable names match exactly (case-sensitive)
- Ensure no extra spaces or quotes

**2. "API not configured or running in mock mode"**
- Verify API keys are correct and not expired
- Check API key restrictions and permissions
- Ensure correct environment is selected

**3. "Rate limit exceeded"**
- API quotas may be exceeded
- Check usage in respective API consoles
- Consider upgrading API plans if needed

### Debug Mode

Enable debug logging in development:

```bash
# Add to .env.local
NODE_ENV=development
```

This will log configuration status and API usage patterns.

## Testing Configuration

### Unit Tests

Run environment validation tests:

```bash
npm test src/lib/__tests__/env-validation.test.ts
npm test src/lib/__tests__/config.test.ts
```

### Integration Tests

Test API integrations with your configuration:

```bash
npm test src/app/api/reviews/__tests__/route.test.ts
npm test src/app/api/instagram/__tests__/route.test.ts
```

### Manual Testing

1. **Development**: Start `npm run dev` and check console for configuration status
2. **API Endpoints**: Test API routes directly:
   - `http://localhost:3000/api/reviews`
   - `http://localhost:3000/api/instagram`

## Deployment Checklist

### Before Production Deployment

- [ ] All required environment variables configured in Vercel
- [ ] API keys are production-ready (not test keys)
- [ ] API key restrictions are properly configured
- [ ] Environment validation passes
- [ ] All API integrations tested with production keys
- [ ] Monitoring and alerting configured
- [ ] Backup/rotation plan for API keys established

### Vercel Configuration

```bash
# Set these in Vercel Dashboard for Production environment
HUBSPOT_API_KEY=prod_key_here
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=prod_google_key
GOOGLE_PLACES_API_KEY=prod_google_server_key
RUSSELL_ROOFING_PLACE_ID=google_place_id
INSTAGRAM_ACCESS_TOKEN=long_lived_token
INSTAGRAM_USER_ID=instagram_user_id
NEXT_PUBLIC_SITE_URL=https://russellroofing.com
```

## Support

For issues with environment configuration:

1. Check this documentation
2. Review error messages in browser console/server logs
3. Verify API key permissions in respective developer consoles
4. Test individual API endpoints manually

## Configuration Schema

The application uses TypeScript interfaces to ensure type safety:

```typescript
// See src/lib/config.ts for complete configuration schema
export interface AppConfig {
  environment: Environment;
  apis: {
    hubspot: HubSpotConfig;
    google: GoogleConfig;
    instagram: InstagramConfig;
  };
  features: FeatureFlags;
  // ... more configuration
}
```

This ensures all configuration is typed and validated at runtime.