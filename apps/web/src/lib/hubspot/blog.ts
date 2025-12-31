import { Client } from '@hubspot/api-client';
import { BlogPost, BlogListResponse, BlogPostParams, HubSpotApiResponse } from './types';
import { calculateBackoffDelay } from './utils';

// Module-level cache for blog posts during build (SSG)
// This prevents multiple API calls when generating static pages
let blogPostsCache: { data: BlogListResponse; timestamp: number } | null = null;
const CACHE_TTL = 60000; // 1 minute TTL for build caching

class BlogService {
  private client: Client;
  private maxRetries = 3;
  private tagsCache: Map<string, string> = new Map(); // Cache tag ID -> name mapping
  private authorsCache: Map<string, string> = new Map(); // Cache author ID -> name mapping

  constructor(apiKey: string) {
    this.client = new Client({ accessToken: apiKey });
  }

  /**
   * Fetch all blog tags from HubSpot and cache them
   */
  private async fetchBlogTags(): Promise<Map<string, string>> {
    if (this.tagsCache.size > 0) {
      return this.tagsCache;
    }

    try {
      const response = await this.client.apiRequest({
        method: 'GET',
        path: '/cms/v3/blogs/tags',
      });

      const data = await response.json() as any;

      // Build tag ID -> name mapping
      (data.results || []).forEach((tag: any) => {
        this.tagsCache.set(tag.id.toString(), tag.name);
      });

      console.log(`[HubSpot] Cached ${this.tagsCache.size} blog tags`);
    } catch (error: any) {
      console.error('[HubSpot] Failed to fetch blog tags:', error.message);
    }

    return this.tagsCache;
  }

  /**
   * Fetch all blog authors from HubSpot and cache them
   */
  private async fetchBlogAuthors(): Promise<Map<string, string>> {
    if (this.authorsCache.size > 0) {
      return this.authorsCache;
    }

    try {
      const response = await this.client.apiRequest({
        method: 'GET',
        path: '/cms/v3/blogs/authors',
      });

      const data = await response.json() as any;

      // Build author ID -> full name mapping
      (data.results || []).forEach((author: any) => {
        this.authorsCache.set(author.id.toString(), author.fullName || author.displayName || 'Unknown Author');
      });

      console.log(`[HubSpot] Cached ${this.authorsCache.size} blog authors`);
    } catch (error: any) {
      console.error('[HubSpot] Failed to fetch blog authors:', error.message);
    }

    return this.authorsCache;
  }

  /**
   * Convert tag IDs to tag names
   */
  private async resolveTagNames(tagIds?: string[]): Promise<string[]> {
    if (!tagIds || tagIds.length === 0) {
      return [];
    }

    await this.fetchBlogTags();

    return tagIds
      .map(id => this.tagsCache.get(id.toString()))
      .filter((name): name is string => name !== undefined);
  }

  /**
   * Get blog author name from author ID
   */
  private async resolveAuthorName(blogAuthorId?: string): Promise<string | undefined> {
    if (!blogAuthorId) {
      return undefined;
    }

    await this.fetchBlogAuthors();

    return this.authorsCache.get(blogAuthorId.toString());
  }

  /**
   * Get a list of blog posts
   */
  async getBlogPosts(params: BlogPostParams = {}): Promise<HubSpotApiResponse<BlogListResponse>> {
    let lastError: any;

    const {
      limit = 10,
      offset = 0,
      state = 'PUBLISHED',
    } = params;

    // Check module-level cache for SSG optimization
    // Use cache if: same or smaller limit requested, cache is fresh, and we have enough data
    if (blogPostsCache &&
        Date.now() - blogPostsCache.timestamp < CACHE_TTL &&
        blogPostsCache.data.results.length >= limit) {
      console.log(`[HubSpot] Using cached blog posts (${blogPostsCache.data.results.length} posts, cache age: ${Date.now() - blogPostsCache.timestamp}ms)`);
      return {
        success: true,
        data: {
          total: blogPostsCache.data.total,
          results: blogPostsCache.data.results.slice(0, limit),
        },
      };
    }

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        // Use direct API request since SDK doesn't have cms.blogs.blogPosts
        const queryParams = new URLSearchParams({
          limit: limit.toString(),
          ...(state && { state }),
        });

        const response = await this.client.apiRequest({
          method: 'GET',
          path: `/cms/v3/blogs/posts?${queryParams.toString()}`,
        });

        const data = await response.json() as any;

        console.log(`[HubSpot] Retrieved ${data.results?.length || 0} blog posts from API`, {
          total: data.total,
          limit,
          timestamp: new Date().toISOString(),
        });

        // Transform HubSpot blog post format to our format
        const results: BlogPost[] = await Promise.all(
          (data.results || []).map(async (post: any) => ({
            id: post.id,
            name: post.name,
            slug: this.normalizeSlug(post.slug),
            state: post.state,
            featuredImage: post.featuredImage || '/placeholder.svg?height=300&width=400',
            featuredImageAltText: post.featuredImageAltText,
            postBody: post.postBody,
            postSummary: post.postSummary || '',
            metaDescription: post.metaDescription,
            htmlTitle: post.htmlTitle || post.name,
            publishDate: post.publishDate,
            created: post.created,
            updated: post.updated,
            authorName: await this.resolveAuthorName(post.blogAuthorId),
            blogAuthorId: post.blogAuthorId,
            category: post.category,
            tagIds: post.tagIds,
            tags: await this.resolveTagNames(post.tagIds),
            url: post.url,
          }))
        );

        // Populate module-level cache for SSG optimization
        const responseData: BlogListResponse = {
          total: data.total || 0,
          results,
        };
        blogPostsCache = {
          data: responseData,
          timestamp: Date.now(),
        };
        console.log(`[HubSpot] Cached ${results.length} blog posts for SSG optimization`);

        return {
          success: true,
          data: responseData,
        };
      } catch (error: any) {
        lastError = error;

        // Log the error
        console.error(`[HubSpot] Blog posts retrieval attempt ${attempt + 1} failed:`, {
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying blog posts retrieval in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        break;
      }
    }

    return {
      success: false,
      error: {
        status: lastError?.code || 'UNKNOWN_ERROR',
        message: lastError?.message || 'Failed to retrieve blog posts',
        correlationId: lastError?.correlationId,
        category: lastError?.category,
      },
    };
  }

  /**
   * Get a single blog post by slug
   */
  async getBlogPostBySlug(slug: string): Promise<HubSpotApiResponse<BlogPost | null>> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        // HubSpot stores slugs with blog prefix (e.g., "russell-roofing-blog/post-title")
        // If the slug doesn't contain a slash, add the prefix
        const hubspotSlug = slug.includes('/') ? slug : `russell-roofing-blog/${slug}`;

        console.log(`[HubSpot] Searching for blog post with slug: ${slug} (HubSpot slug: ${hubspotSlug})`);

        // Use direct API request with slug filter
        const queryParams = new URLSearchParams({
          limit: '1',
          slug: hubspotSlug,
          state: 'PUBLISHED',
        });

        const response = await this.client.apiRequest({
          method: 'GET',
          path: `/cms/v3/blogs/posts?${queryParams.toString()}`,
        });

        const data = await response.json() as any;

        if (data.results && data.results.length > 0) {
          const post = data.results[0];

          console.log(`[HubSpot] Retrieved blog post by slug: ${slug}`, {
            postId: post.id,
            originalSlug: post.slug,
            normalizedSlug: this.normalizeSlug(post.slug),
            timestamp: new Date().toISOString(),
          });

          const blogPost: BlogPost = {
            id: post.id,
            name: post.name,
            slug: this.normalizeSlug(post.slug),
            state: post.state,
            featuredImage: post.featuredImage || '/placeholder.svg?height=600&width=1200',
            featuredImageAltText: post.featuredImageAltText,
            postBody: post.postBody,
            postSummary: post.postSummary || '',
            metaDescription: post.metaDescription,
            htmlTitle: post.htmlTitle || post.name,
            publishDate: post.publishDate,
            created: post.created,
            updated: post.updated,
            authorName: await this.resolveAuthorName(post.blogAuthorId),
            blogAuthorId: post.blogAuthorId,
            category: post.category,
            tagIds: post.tagIds,
            tags: await this.resolveTagNames(post.tagIds),
            url: post.url,
          };

          return {
            success: true,
            data: blogPost,
          };
        }

        // No post found with this slug
        console.log(`[HubSpot] No blog post found with slug: ${slug} (searched HubSpot with: ${hubspotSlug})`);
        return {
          success: true,
          data: null,
        };
      } catch (error: any) {
        lastError = error;

        // Log the error
        console.error(`[HubSpot] Blog post retrieval attempt ${attempt + 1} failed:`, {
          slug,
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying blog post retrieval in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        break;
      }
    }

    return {
      success: false,
      error: {
        status: lastError?.code || 'UNKNOWN_ERROR',
        message: lastError?.message || 'Failed to retrieve blog post',
        correlationId: lastError?.correlationId,
        category: lastError?.category,
      },
    };
  }

  /**
   * Get a single blog post by ID
   */
  async getBlogPostById(id: string): Promise<HubSpotApiResponse<BlogPost | null>> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        // Use direct API request to get blog post by ID
        const response = await this.client.apiRequest({
          method: 'GET',
          path: `/cms/v3/blogs/posts/${id}`,
        });

        const post = await response.json() as any;

        console.log(`[HubSpot] Retrieved blog post by ID: ${id}`, {
          postName: post.name,
          timestamp: new Date().toISOString(),
        });

        const blogPost: BlogPost = {
          id: post.id,
          name: post.name,
          slug: this.normalizeSlug(post.slug),
          state: post.state,
          featuredImage: post.featuredImage || '/placeholder.svg?height=600&width=1200',
          featuredImageAltText: post.featuredImageAltText,
          postBody: post.postBody,
          postSummary: post.postSummary || '',
          metaDescription: post.metaDescription,
          htmlTitle: post.htmlTitle || post.name,
          publishDate: post.publishDate,
          created: post.created,
          updated: post.updated,
          authorName: await this.resolveAuthorName(post.blogAuthorId),
          blogAuthorId: post.blogAuthorId,
          category: post.category,
          tagIds: post.tagIds,
          tags: await this.resolveTagNames(post.tagIds),
          url: post.url,
        };

        return {
          success: true,
          data: blogPost,
        };
      } catch (error: any) {
        lastError = error;

        // Log the error
        console.error(`[HubSpot] Blog post retrieval attempt ${attempt + 1} failed:`, {
          id,
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying blog post retrieval in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        break;
      }
    }

    return {
      success: false,
      error: {
        status: lastError?.code || 'UNKNOWN_ERROR',
        message: lastError?.message || 'Failed to retrieve blog post',
        correlationId: lastError?.correlationId,
        category: lastError?.category,
      },
    };
  }

  /**
   * Normalize blog post slug by removing the blog prefix
   * HubSpot returns slugs like: "russell-roofing-blog/post-title"
   * We need just: "post-title"
   */
  private normalizeSlug(slug: string): string {
    if (!slug) return slug;

    // Remove blog prefix (e.g., "russell-roofing-blog/")
    const parts = slug.split('/');
    return parts.length > 1 ? parts.slice(1).join('/') : slug;
  }

  /**
   * Determine if an error is retryable
   */
  private shouldRetry(error: any): boolean {
    // Retry on rate limiting (429) and server errors (5xx)
    const retryableCodes = [429, 500, 502, 503, 504];

    if (error.code && retryableCodes.includes(error.code)) {
      return true;
    }

    // Retry on network errors
    if (error.message && (
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('ETIMEDOUT')
    )) {
      return true;
    }

    return false;
  }
}

export default BlogService;
