import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/sanity/blog';

// Force dynamic rendering for Vercel compatibility (matches other API routes).
export const dynamic = 'force-dynamic';

// Blog content now comes from Sanity. Response shape mirrors the former
// /api/hubspot/blog route so the /news pages consume it unchanged.
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;

    if (slug) {
      const post = await getBlogPostBySlug(slug);
      if (!post) {
        return NextResponse.json(
          { success: false, error: 'Blog post not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: post });
    }

    const data = await getBlogPosts(limit);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[Blog API] Error fetching from Sanity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load blog content' },
      { status: 500 }
    );
  }
}
