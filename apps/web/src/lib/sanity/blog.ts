import { toHTML } from '@portabletext/to-html';
import { sanityClient, urlForImage } from './client';

// Shape returned to the /news pages — intentionally mirrors the previous
// HubSpot BlogPost shape so the page components need no structural changes.
export interface BlogPost {
  id: string;
  name: string;
  slug: string;
  featuredImage: string;
  featuredImageAltText?: string;
  postBody: string; // HTML (converted from Portable Text)
  postSummary: string;
  metaDescription?: string;
  htmlTitle?: string;
  publishDate: string;
  updatedAt?: string;
  authorName?: string;
  tags?: string[];
  faqs?: { question: string; answer: string }[];
  url: string;
}

export interface BlogListResponse {
  total: number;
  results: BlogPost[];
}

// Portable Text -> HTML. Images become <img> (the detail page hides body images,
// matching prior behavior); links and standard blocks render normally.
const portableTextComponents = {
  types: {
    image: ({ value }: { value: unknown }) => {
      const src = urlForImage(value);
      return src ? `<img src="${src}" alt="" loading="lazy" />` : '';
    },
  },
};

function bodyToHtml(body: unknown): string {
  if (!body || !Array.isArray(body)) return '';
  try {
    return toHTML(body as any, { components: portableTextComponents });
  } catch {
    return '';
  }
}

const POST_PROJECTION = `{
  "id": _id,
  "name": title,
  "slug": slug.current,
  "featuredImage": mainImage,
  "featuredImageAltText": featuredImageAlt,
  "postSummary": excerpt,
  "metaDescription": metaDescription,
  "htmlTitle": seoTitle,
  "publishDate": publishedAt,
  "updatedAt": _updatedAt,
  "authorName": authorName,
  "tags": tags,
  "faqs": faqs[]{question, answer},
  "originalUrl": originalUrl,
  body
}`;

type RawPost = {
  id: string;
  name: string;
  slug: string;
  featuredImage?: unknown;
  featuredImageAltText?: string;
  postSummary?: string;
  metaDescription?: string;
  htmlTitle?: string;
  publishDate: string;
  updatedAt?: string;
  authorName?: string;
  tags?: string[];
  faqs?: { question: string; answer: string }[];
  originalUrl?: string;
  body?: unknown;
};

function mapPost(raw: RawPost): BlogPost {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    featuredImage: urlForImage(raw.featuredImage),
    featuredImageAltText: raw.featuredImageAltText,
    postBody: bodyToHtml(raw.body),
    postSummary: raw.postSummary || '',
    metaDescription: raw.metaDescription,
    htmlTitle: raw.htmlTitle,
    publishDate: raw.publishDate,
    updatedAt: raw.updatedAt,
    authorName: raw.authorName,
    tags: raw.tags || [],
    faqs: raw.faqs || [],
    url: raw.originalUrl || `/news/${raw.slug}`,
  };
}

export async function getBlogPosts(limit = 50): Promise<BlogListResponse> {
  const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...$limit] ${POST_PROJECTION}`;
  const results = await sanityClient.fetch<RawPost[]>(query, { limit });
  const total = await sanityClient.fetch<number>(
    `count(*[_type == "post" && defined(slug.current)])`
  );
  return { total, results: results.map(mapPost) };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = `*[_type == "post" && slug.current == $slug][0] ${POST_PROJECTION}`;
  const raw = await sanityClient.fetch<RawPost | null>(query, { slug });
  return raw ? mapPost(raw) : null;
}
