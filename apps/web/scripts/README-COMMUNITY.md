# Community Involvement HubSpot Integration Setup

This guide explains how to set up the Community Involvement custom object in HubSpot and populate it with data.

## Overview

The Community Involvement integration allows you to manage community activities dynamically through HubSpot, similar to the Careers integration.

## Prerequisites

- HubSpot Private App access token with appropriate permissions
- `HUBSPOT_API_KEY` set in your `.env.local` file

## Setup Steps

### 1. Create the Custom Object in HubSpot

Run the setup script to create the Community Involvement custom object:

```bash
cd apps/web
node scripts/setup-community-hubspot.js
```

This will:
- Create a new custom object called "Community Involvement"
- Add all required properties (name, description, year, impact, image_url, live)
- Return an Object Type ID (e.g., `2-12345678`)

**Important:** Save the Object Type ID from the output!

### 2. Update the Community Service

Open `src/lib/hubspot/community.ts` and update the `COMMUNITY_OBJECT_TYPE_ID`:

```typescript
private readonly COMMUNITY_OBJECT_TYPE_ID = '2-12345678'; // Replace with your Object Type ID
```

### 3. Populate Test Data

Update the Object Type ID in `scripts/populate-community-data.js`:

```javascript
const COMMUNITY_OBJECT_TYPE_ID = '2-12345678'; // Replace with your Object Type ID
```

Then run the population script:

```bash
node scripts/populate-community-data.js
```

This will create three sample community activities:
1. Habitat for Humanity Partnership (2018)
2. Local Schools Support Program (2019)
3. Emergency Storm Relief (2020)

### 4. Verify the Integration

Visit http://localhost:3000/community to see the community activities displayed on your website!

## Custom Object Properties

The Community Involvement custom object includes:

| Property | Type | Description |
|----------|------|-------------|
| `name` | text | Activity name (required, primary display) |
| `description` | textarea | Detailed description of the activity |
| `year` | number | Year the activity started or took place |
| `impact` | textarea | Measurable impact (e.g., "Helped roof 12+ homes") |
| `image_url` | text | URL to activity image (optional) |
| `live` | boolean | Whether to display on website |

## Managing Community Activities

### In HubSpot

1. Go to **CRM** → **Custom Objects** → **Community Activities**
2. Click **Create activity** to add new entries
3. Set `live` to "Yes" to make it visible on the website
4. Activities are automatically sorted by year (most recent first)

### Via API

The following endpoints are available:

- `GET /api/hubspot/community` - Get all activities
- `GET /api/hubspot/community?id=123` - Get specific activity
- `GET /api/hubspot/community?liveOnly=true` - Get only live activities (default)

## Page Caching

The community page uses Incremental Static Regeneration (ISR) with a 5-minute revalidation period. Changes in HubSpot will appear on the website within 5 minutes.

## Mock Mode

If HubSpot is not configured, the system automatically uses mock data with the three sample activities. This allows development without HubSpot access.

## Troubleshooting

### "Object Type ID not found"
- Make sure you ran `setup-community-hubspot.js` successfully
- Verify the Object Type ID is correctly set in `src/lib/hubspot/community.ts`

### "No activities showing on website"
- Check that `live` is set to "Yes" in HubSpot
- Verify the HubSpot API key has read permissions for custom objects
- Check browser console and server logs for errors

### "Mock data still showing after HubSpot setup"
- Clear Next.js cache: `rm -rf apps/web/.next && pnpm dev`
- Verify `HUBSPOT_API_KEY` is set in `.env.local`
- Check that HubSpot service is properly configured

## Files Created

- `scripts/setup-community-hubspot.js` - Custom object creation
- `scripts/populate-community-data.js` - Test data population
- `src/lib/hubspot/community.ts` - Community service
- `src/app/api/hubspot/community/route.ts` - API endpoint
- `src/components/community/CommunityHero.tsx` - Hero section
- `src/components/community/CommunityActivities.tsx` - Activities display
- `src/app/community/page.tsx` - Community page with SSR
