import { notFound } from "next/navigation";
import { Metadata } from "next";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import { ArticleSchema, FAQSchema } from "@/components/StructuredData";
import { getBlogPostBySlug } from "@/lib/sanity/blog";
import BlogPostArticle from "./BlogPostArticle";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://russellroofing.com";

interface BlogPostPageProps {
  params: { slug: string };
}

// Re-fetch from Sanity periodically so new/edited posts appear without a redeploy,
// while still serving pre-rendered HTML (with meta tags + JSON-LD) to crawlers
// and AI-search bots on the initial request.
export const revalidate = 60;

// Per-post <head>: title, description, canonical, Open Graph (article) and
// Twitter card. Sanity SEO fields win, with sensible fallbacks to the post
// title/excerpt. Without this, every post inherited the generic /news metadata.
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The article you're looking for could not be found.",
    };
  }

  const title = post.htmlTitle || post.name;
  const description = post.metaDescription || post.postSummary || undefined;
  const canonical = `/news/${post.slug}`;
  const images = post.featuredImage
    ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.featuredImageAltText || post.name,
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      publishedTime: post.publishDate,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
      ...(post.authorName && { authors: [post.authorName] }),
      ...(post.tags && post.tags.length > 0 && { tags: post.tags }),
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(post.featuredImage && { images: [post.featuredImage] }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <FloatingPageLayout>
      {/* BlogPosting structured data — server-rendered into the initial HTML */}
      <ArticleSchema
        title={post.htmlTitle || post.name}
        description={post.metaDescription || post.postSummary || post.name}
        image={post.featuredImage || undefined}
        url={`${BASE_URL}/news/${post.slug}`}
        datePublished={post.publishDate}
        dateModified={post.updatedAt}
        authorName={post.authorName}
      />

      {/* FAQPage structured data — only when the post actually shows an FAQ */}
      {post.faqs && post.faqs.length > 0 && <FAQSchema faqs={post.faqs} />}

      <BlogPostArticle post={post} />
    </FloatingPageLayout>
  );
}
