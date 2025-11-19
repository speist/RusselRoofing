# HubSpot FAQ Integration Setup Guide

This guide will walk you through setting up the HubSpot FAQ integration for the Russell Roofing website.

## Overview

The FAQ system fetches questions and answers dynamically from HubSpot custom objects. This allows you to manage FAQs directly in HubSpot without needing code changes.

## Files Created

1. **`/hubspot-faqs-import.csv`** - CSV file containing all 32 FAQs for import
2. **`/apps/web/src/lib/hubspot/faqs.ts`** - FAQ service for HubSpot API
3. **`/apps/web/src/lib/hubspot/types.ts`** - Updated with FAQ types
4. **`/apps/web/src/lib/hubspot/api.ts`** - Updated with FAQ methods
5. **`/apps/web/src/app/api/hubspot/faqs/route.ts`** - API endpoint for FAQ fetching
6. **`/apps/web/src/components/services/ServiceFAQ.tsx`** - Updated to fetch from API

## Step 1: Create Custom Object in HubSpot

1. Go to **Settings** → **Data Management** → **Objects**
2. Click **"Create custom object"**
3. Set up the object:
   - **Singular name**: FAQ
   - **Plural name**: FAQs
   - **Object name** (internal): `p_faqs` or similar
4. Add the following properties:

### Required Properties

| Property Name | Field Type | Description |
|--------------|------------|-------------|
| `service_area` | Multi-select dropdown | Service areas (see values below) |
| `question` | Single-line text | The FAQ question |
| `answer` | Multi-line text | The FAQ answer |
| `live` | Single select | Display status (true/false) |

### Multi-select Options for `service_area`

Add these values (user can select multiple):
- `roofing`
- `siding-and-gutters`
- `windows`
- `commercial`
- `historical-restorations`
- `skylights`
- `churches-and-institutions`
- `masonry`

## Step 2: Get the Custom Object Type ID

After creating the custom object:

1. Go to **Settings** → **Data Management** → **Objects**
2. Click on your **FAQs** object
3. Look at the URL - it will contain the Object Type ID
   - Example URL: `https://app.hubspot.com/settings/PORTAL_ID/objects/2-12345678`
   - The Object Type ID is: `2-12345678`
4. Copy this ID - you'll need it in the next step

## Step 3: Update the Code with Object Type ID

Open `/apps/web/src/lib/hubspot/faqs.ts` and update line 6:

```typescript
// Before:
private readonly FAQ_OBJECT_TYPE_ID = 'p_faqs'; // Placeholder

// After:
private readonly FAQ_OBJECT_TYPE_ID = '2-12345678'; // Your actual ID from HubSpot
```

## Step 4: Import FAQ Data

### Option A: Using HubSpot UI

1. Go to **CRM** → **FAQs** (your custom object)
2. Click **"Import"** at the top right
3. Select **"Start an import"**
4. Choose **"Import file from computer"**
5. Upload `/hubspot-faqs-import.csv`
6. Map the columns:
   - `service_area` → Service Area property
   - `question` → Question property
   - `answer` → Answer property
7. Complete the import

### Option B: Using HubSpot API (Advanced)

If you prefer to import via API, use the HubSpot Custom Objects API:

```bash
curl -X POST \
  https://api.hubapi.com/crm/v3/objects/[OBJECT_TYPE_ID] \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {
      "service_area": "roofing",
      "question": "How often should I have my roof inspected?",
      "answer": "We recommend annual roof inspections...",
      "live": "true"
    }
  }'
```

## Step 5: Verify the Integration

### Test in Development

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Visit a service page:
   - http://localhost:3000/services/roofing
   - http://localhost:3000/services/windows
   - etc.

3. Check that FAQs are loading from HubSpot

### Check API Endpoint Directly

Test the API endpoint:

```bash
# Get all FAQs
curl http://localhost:3000/api/hubspot/faqs

# Get FAQs for specific service area
curl http://localhost:3000/api/hubspot/faqs?serviceArea=roofing

# Get specific FAQ by ID
curl http://localhost:3000/api/hubspot/faqs?id=FAQ_RECORD_ID
```

## Architecture

### Data Flow

```
Service Page → ServiceFAQ Component → /api/hubspot/faqs
    → HubSpot Service → HubSpot Custom Objects API
```

### Caching Strategy

- API responses are cached for 1 hour (3600 seconds)
- Only "live" FAQs are displayed (where `live = "true"`)
- FAQs are filtered by `service_area` to show relevant questions

### Error Handling

The component gracefully handles errors:
- **Loading state**: Shows "Loading FAQs..." while fetching
- **Error state**: Shows contact information if API fails
- **Empty state**: Shows message if no FAQs exist for service area
- **Network issues**: Logs errors and provides fallback UI

## FAQ Management in HubSpot

### Adding New FAQs

1. Go to **CRM** → **FAQs**
2. Click **"Create FAQ"**
3. Fill in:
   - Service Area (select one or more)
   - Question
   - Answer
   - Live: `true`
4. Save

### Editing FAQs

1. Go to **CRM** → **FAQs**
2. Find and click the FAQ record
3. Edit any field
4. Changes appear on website within 1 hour (due to caching)

### Hiding FAQs

To temporarily hide an FAQ without deleting:
1. Edit the FAQ record
2. Change **Live** to `false`
3. It will no longer appear on the website

### Multi-Service FAQs

If an FAQ applies to multiple services:
1. Select multiple values in the **Service Area** field
2. The FAQ will appear on all selected service pages

Example: "Do you offer financing?" could apply to:
- Roofing
- Siding and Gutters
- Windows
- Commercial

## CSV File Structure

The provided `hubspot-faqs-import.csv` contains:
- **Total FAQs**: 32
- **Service Areas**: 8
- **Format**: service_area, question, answer

### FAQs by Service Area:
- Roofing: 4 FAQs
- Siding and Gutters: 4 FAQs
- Windows: 4 FAQs
- Commercial: 4 FAQs
- Historical Restoration: 4 FAQs
- Skylights: 4 FAQs
- Churches & Institutions: 4 FAQs
- Masonry: 4 FAQs

## Troubleshooting

### FAQs Not Showing Up

1. **Check Object Type ID**: Verify the ID in `/apps/web/src/lib/hubspot/faqs.ts`
2. **Check Live Status**: Ensure FAQs have `live = "true"` in HubSpot
3. **Check Service Area**: Verify `service_area` matches the page slug exactly
4. **Check API Key**: Ensure `HUBSPOT_ACCESS_TOKEN` is set in `.env.local`
5. **Check Console**: Look for errors in browser console and server logs

### API Errors

If you see API errors:
1. Verify HubSpot API key has access to custom objects
2. Check that the custom object exists and has correct properties
3. Verify the Object Type ID is correct
4. Check HubSpot API rate limits

### Cache Issues

If changes aren't appearing:
1. Wait up to 1 hour for cache to expire
2. Or restart the development server
3. Or clear Next.js cache: `rm -rf .next`

## Mock Mode

If HubSpot is not configured, the system runs in mock mode:
- Shows 3 sample FAQs
- Useful for local development without API access
- To enable real data, add `HUBSPOT_ACCESS_TOKEN` to `.env.local`

## Next Steps

After setup is complete:
1. Train team members on FAQ management in HubSpot
2. Create a FAQ content strategy
3. Monitor FAQ performance (add analytics if desired)
4. Consider adding search functionality to FAQs
5. Add FAQ schema markup for SEO (future enhancement)

## Support

For issues or questions:
1. Check server logs: `pnpm dev` output
2. Check browser console for frontend errors
3. Review HubSpot API logs in HubSpot settings
4. Contact development team if needed
