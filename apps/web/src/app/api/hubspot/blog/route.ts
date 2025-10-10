import { NextRequest, NextResponse } from 'next/server';
import { hubspotService } from '@/lib/hubspot/api';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    // If slug is provided, get single post by slug
    if (slug) {
      console.log('[Blog API] Fetching post by slug:', slug);
      const result = await hubspotService.getBlogPostBySlug(slug);

      if (result.success && result.data) {
        console.log('[Blog API] Post found:', {
          id: result.data.id,
          name: result.data.name,
          slug: result.data.slug,
          featuredImage: result.data.featuredImage,
          hasFeaturedImage: !!result.data.featuredImage,
          featuredImageLength: result.data.featuredImage?.length,
        });
        return NextResponse.json({
          success: true,
          data: result.data,
        });
      } else if (result.success && !result.data) {
        console.log('[Blog API] Post not found for slug:', slug);
        return NextResponse.json(
          {
            success: false,
            error: 'Blog post not found',
          },
          { status: 404 }
        );
      } else {
        console.error('[Blog API] Error fetching post by slug:', result.error);
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
      // Log sample of what we're returning to help debug image and slug issues
      console.log('[Blog API] Returning blog posts:', {
        total: result.data.total,
        count: result.data.results.length,
        sample: result.data.results.slice(0, 2).map(post => ({
          id: post.id,
          name: post.name,
          slug: post.slug,
          featuredImage: post.featuredImage,
          hasFeaturedImage: !!post.featuredImage,
          postSummaryLength: post.postSummary?.length,
        })),
      });
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
