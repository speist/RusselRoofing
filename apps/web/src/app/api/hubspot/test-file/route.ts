import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * Diagnostic endpoint to test HubSpot Files API
 * Test with: /api/hubspot/test-file?fileId=199683264377
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get('fileId') || '199683264377'; // Default to Mike Thompson's file

    const apiKey = process.env.HUBSPOT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'HUBSPOT_API_KEY not configured',
          message: 'Please add HUBSPOT_API_KEY to your Vercel environment variables',
          availableEnvVars: Object.keys(process.env).filter(k => k.includes('HUBSPOT')),
        },
        { status: 500 }
      );
    }

    console.log(`[Test File API] Testing file ID: ${fileId}`);
    console.log(`[Test File API] API Key configured: ${!!apiKey}`);
    console.log(`[Test File API] API Key length: ${apiKey.length}`);
    console.log(`[Test File API] API Key starts with: ${apiKey.substring(0, 10)}...`);

    const url = `https://api.hubapi.com/files/v3/files/${fileId}`;
    console.log(`[Test File API] Fetching URL: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`[Test File API] Response status: ${response.status}`);
    console.log(`[Test File API] Response statusText: ${response.statusText}`);
    console.log(`[Test File API] Response headers:`, Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log(`[Test File API] Response body:`, responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = responseText;
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      fileId,
      url,
      response: data,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error: any) {
    console.error('[Test File API] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
