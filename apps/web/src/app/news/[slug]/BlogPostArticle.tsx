"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import type { BlogPost } from "@/lib/sanity/blog";

// Remove body <img> tags (the featured image is shown separately) and any
// resulting empty paragraphs. Body HTML is produced server-side from Sanity
// Portable Text, so this is presentational cleanup only.
function cleanPostBody(html: string): string {
  if (!html) return "";
  let cleaned = html.replace(/<img[^>]*>/gi, "");
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, "");
  return cleaned.trim();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
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
                <span
                  key={tag}
                  className="inline-block bg-primary-burgundy text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6">
            {post.name}
          </h1>

          {/* Featured Image - between title and meta */}
          {post.featuredImage &&
            post.featuredImage !== "/placeholder.svg?height=600&width=1200" && (
              <div
                className="mb-6 rounded-lg overflow-hidden relative w-full"
                style={{ aspectRatio: "2/1" }}
              >
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAltText || post.name}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
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

        {/* FAQ Section — visibly rendered so it matches the FAQPage JSON-LD */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="border-t border-gray-200 pt-8 mb-12">
            <h2 className="font-display text-3xl font-bold text-text-primary mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {post.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                    {faq.question}
                  </h3>
                  <p className="font-body text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Article Footer */}
        <footer className="border-t border-gray-200 pt-8">
          <Link
            href="/news"
            className="inline-flex items-center font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
        </footer>
      </div>
    </article>
  );
}
