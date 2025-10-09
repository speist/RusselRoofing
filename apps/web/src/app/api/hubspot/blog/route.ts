import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    // If slug is provided, get single post by slug
    if (slug) {
      const result = await hubspotService.getBlogPostBySlug(slug);

      if (result.success && result.data) {
        return NextResponse.json({
          success: true,
          data: result.data,
        });
      } else if (result.success && !result.data) {
        return NextResponse.json(
          {
            success: false,
            error: 'Blog post not found',
          },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            error: result.error?.message || 'Failed to fetch blog post',
          },
          { status: 500 }
        );
      }
    }

    // If ID is provided, get single post by ID
    if (id) {
      const result = await hubspotService.getBlogPostById(id);

      if (result.success && result.data) {
        return NextResponse.json({
          success: true,
          data: result.data,
        });
      } else if (result.success && !result.data) {
        return NextResponse.json(
          {
            success: false,
            error: 'Blog post not found',
          },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            error: result.error?.message || 'Failed to fetch blog post',
          },
          { status: 500 }
        );
      }
    }

    // Otherwise, get list of blog posts
    const result = await hubspotService.getBlogPosts({
      limit,
      offset,
      state: 'PUBLISHED',
    });

    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    } else {
      console.error('[Blog API] Failed to fetch blog posts:', result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error?.message || 'Failed to fetch blog posts',
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Blog API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
