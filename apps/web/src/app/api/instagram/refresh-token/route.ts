import { NextRequest, NextResponse } from 'next/server';

interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get environment variables
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.error('Instagram access token missing');
      return NextResponse.json(
        { error: 'Instagram access token not configured' },
        { status: 500 }
      );
    }

    // Instagram Basic Display API endpoint for token refresh
    const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`;

    // Make request to refresh token
    const response = await fetch(refreshUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token refresh error:', response.status, errorText);
      
      let errorMessage = 'Failed to refresh Instagram token';
      if (response.status === 401) {
        errorMessage = 'Current Instagram access token is invalid';
      } else if (response.status === 400) {
        errorMessage = 'Invalid token refresh request';
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data: TokenRefreshResponse = await response.json();

    // Note: In a production environment, you would save the new token
    // to your secure storage (database, AWS Secrets Manager, etc.)
    console.log('Token refreshed successfully. New token expires in:', data.expires_in, 'seconds');
    console.log('⚠️  IMPORTANT: Update your INSTAGRAM_ACCESS_TOKEN environment variable with:', data.access_token);

    return NextResponse.json({ 
      message: 'Token refreshed successfully',
      expires_in: data.expires_in,
      // Note: We don't return the actual token in the response for security
      token_updated: true
    }, { status: 200 });

  } catch (error) {
    console.error('Token refresh route error:', error);
    return NextResponse.json(
      { error: 'Internal server error while refreshing token' },
      { status: 500 }
    );
  }
}