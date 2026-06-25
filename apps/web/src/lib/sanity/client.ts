import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Public, read-only Sanity config. The `production` dataset is public, so no
// token is needed for reads. Project ID is not secret (it ships in any client
// that reads from Sanity). Overridable via env for safety/portability.
export const SANITY_PROJECT_ID =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r0bebr2k';
export const SANITY_DATASET =
  process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true, // cached, fast reads for published content
});

const builder = imageUrlBuilder(sanityClient);

// Build a CDN URL for a Sanity image reference (returns '' if missing).
export function urlForImage(source: unknown): string {
  if (!source) return '';
  try {
    return builder.image(source as any).url();
  } catch {
    return '';
  }
}
