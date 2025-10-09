import { Client } from '@hubspot/api-client';
import { BlogPost, BlogListResponse, BlogPostParams, HubSpotApiResponse } from './types';
import { calculateBackoffDelay } from './utils';

class BlogService {
  private client: Client;
  private maxRetries = 3;

  constructor(apiKey: string) {
    this.client = new Client({ accessToken: apiKey });
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

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        // HubSpot Blog Posts API v3
        // Note: Using type assertion due to SDK typing limitations
        const response = await (this.client.cms.blogs.blogPosts as any).getPage(
          limit,
          undefined, // after (for pagination cursor)
          undefined, // archived
          undefined, // property list to return
          undefined, // name filter
          undefined, // slug filter
          state, // state filter
          undefined, // before
          undefined // language filter
        );

        console.log(`[HubSpot] Retrieved ${response.results.length} blog posts`, {
          total: response.total,
          limit,
          timestamp: new Date().toISOString(),
        });

        // Transform HubSpot blog post format to our format
        const results: BlogPost[] = response.results.map((post: any) => ({
          id: post.id,
          name: post.name,
          slug: post.slug,
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
          authorName: post.authorName,
          blogAuthorId: post.blogAuthorId,
          category: post.category,
          tagIds: post.tagIds,
          url: post.url,
        }));

        return {
          success: true,
          data: {
            total: response.total || 0,
            results,
          },
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
        // Get blog posts filtered by slug
        // Note: Using type assertion due to SDK typing limitations
        const response = await (this.client.cms.blogs.blogPosts as any).getPage(
          1, // limit - we only need one
          undefined, // after
          undefined, // archived
          undefined, // properties
          undefined, // name
          slug, // slug filter
          'PUBLISHED', // state
          undefined, // before
          undefined // language
        );

        if (response.results && response.results.length > 0) {
          const post = response.results[0];

          console.log(`[HubSpot] Retrieved blog post by slug: ${slug}`, {
            postId: post.id,
            timestamp: new Date().toISOString(),
          });

          const blogPost: BlogPost = {
            id: post.id,
            name: post.name,
            slug: post.slug,
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
            authorName: post.authorName,
            blogAuthorId: post.blogAuthorId,
            category: post.category,
            tagIds: post.tagIds,
            url: post.url,
          };

          return {
            success: true,
            data: blogPost,
          };
        }

        // No post found with this slug
        console.log(`[HubSpot] No blog post found with slug: ${slug}`);
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
        // Note: Using type assertion due to SDK typing limitations
        const response = await (this.client.cms.blogs.blogPosts as any).getById(id);

        console.log(`[HubSpot] Retrieved blog post by ID: ${id}`, {
          postName: response.name,
          timestamp: new Date().toISOString(),
        });

        const blogPost: BlogPost = {
          id: response.id,
          name: response.name,
          slug: response.slug,
          state: response.state,
          featuredImage: response.featuredImage || '/placeholder.svg?height=600&width=1200',
          featuredImageAltText: response.featuredImageAltText,
          postBody: response.postBody,
          postSummary: response.postSummary || '',
          metaDescription: response.metaDescription,
          htmlTitle: response.htmlTitle || response.name,
          publishDate: response.publishDate,
          created: response.created,
          updated: response.updated,
          authorName: response.authorName,
          blogAuthorId: response.blogAuthorId,
          category: response.category,
          tagIds: response.tagIds,
          url: response.url,
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
