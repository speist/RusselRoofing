"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

interface BlogPost {
  id: string;
  name: string;
  slug: string;
  state: string;
  featuredImage: string;
  featuredImageAltText?: string;
  postBody: string;
  postSummary: string;
  metaDescription?: string;
  htmlTitle?: string;
  publishDate: string;
  created: string;
  updated: string;
  authorName?: string;
  blogAuthorId?: string;
  category?: {
    id: string;
    name: string;
  };
  tagIds?: string[];
  tags?: string[];
  url: string;
}

// Utility function to strip HTML tags and decode entities
const stripHtml = (html: string): string => {
  if (!html) return '';
  // Remove HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, '');
  // Decode common HTML entities
  const decoded = withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return decoded.trim();
};

// Utility function to clean post body by removing duplicate content
const cleanPostBody = (html: string): string => {
  if (!html) return '';

  // Remove all <img> tags since we display the featured image separately
  let cleaned = html.replace(/<img[^>]*>/gi, '');

  // Remove any empty paragraphs
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');

  // Remove any leading/trailing whitespace
  return cleaned.trim();
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/hubspot/blog?slug=${slug}`);
        const data = await response.json();

        if (data.success && data.data) {
          setPost(data.data);
        } else {
          setError(data.error || 'Blog post not found');
        }
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <FloatingPageLayout>
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-8"></div>
              <div className="w-full h-96 bg-gray-300 rounded-lg mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </section>
      </FloatingPageLayout>
    );
  }

  if (error || !post) {
    return (
      <FloatingPageLayout>
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {error || 'Blog post not found'}
            </h1>
            <p className="font-body text-text-secondary mb-8">
              The article you&rsquo;re looking for doesn&rsquo;t exist or has been removed.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </div>
        </section>
      </FloatingPageLayout>
    );
  }

  return (
    <FloatingPageLayout>
      <article className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/news"
            className="inline-flex items-center font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="inline-block bg-primary-burgundy text-white px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {post.name}
            </h1>

            {/* Featured Image - Moved here, between title and meta */}
            {post.featuredImage && post.featuredImage !== '/placeholder.svg?height=600&width=1200' && (
              <div className="mb-6 rounded-lg overflow-hidden relative w-full" style={{ aspectRatio: '2/1' }}>
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAltText || post.name}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary border-t border-b border-gray-200 py-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(post.publishDate)}</span>
              </div>

              {post.authorName && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{post.authorName}</span>
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-display prose-headings:text-text-primary prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
              prose-p:font-body prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary-burgundy prose-a:no-underline hover:prose-a:underline
              prose-strong:text-text-primary prose-strong:font-semibold
              prose-ul:font-body prose-ul:my-6 prose-ul:space-y-2
              prose-ol:font-body prose-ol:my-6 prose-ol:space-y-2
              prose-li:text-text-secondary
              prose-img:hidden
              mb-12"
            dangerouslySetInnerHTML={{ __html: cleanPostBody(post.postBody) }}
          />

          {/* Article Footer */}
          <footer className="border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center">
              <Link
                href="/news"
                className="inline-flex items-center font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </Link>

              {post.category && (
                <Link
                  href="/news"
                  className="inline-flex items-center font-body text-text-secondary hover:text-primary-burgundy transition-colors"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  More in {post.category.name}
                </Link>
              )}
            </div>
          </footer>
        </div>
      </article>
    </FloatingPageLayout>
  );
}
