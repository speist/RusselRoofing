/**
 * CompanyCam API Client
 * Handles authentication and API requests to CompanyCam
 *
 * Filtering Strategy:
 * 1. Master Tag: "RR Website" must be present on ALL photos
 * 2. Service Tags: At least ONE must be present from the SERVICE_TAGS list
 * 3. Case-insensitive matching for all tags
 * 4. Optional: Before/After tags for transformation showcases
 */

import type {
  CompanyCamPhoto,
  CompanyCamPhotoListResponse,
  CompanyCamTag,
  CompanyCamTagListResponse,
  PhotoFilterOptions,
  GalleryPhoto,
} from './types';

import {
  MASTER_TAG,
  MASTER_TAG_ID,
  SERVICE_TAGS,
  BEFORE_TAG,
  AFTER_TAG,
  BEFORE_TAG_ID,
  AFTER_TAG_ID,
} from './types';

const COMPANYCAM_API_BASE = 'https://api.companycam.com/v2';
const DEFAULT_PER_PAGE = 50;

export class CompanyCamClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.COMPANYCAM_API_KEY || '';
    this.baseUrl = COMPANYCAM_API_BASE;

    if (!this.apiKey) {
      throw new Error('CompanyCam API key is required');
    }
  }

  /**
   * Get authorization headers for API requests
   */
  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  /**
   * Helper: Check if tags array contains a specific tag (case-insensitive)
   */
  private hasTag(tags: string[], targetTag: string): boolean {
    return tags.some(tag => tag.toLowerCase() === targetTag.toLowerCase());
  }

  /**
   * Helper: Check if photo has the master tag ("RR Website")
   */
  private hasMasterTag(tags: string[]): boolean {
    return this.hasTag(tags, MASTER_TAG);
  }

  /**
   * Helper: Get matched service tags from photo tags
   * Returns array of matched service tags
   */
  private getMatchedServiceTags(tags: string[]): string[] {
    return SERVICE_TAGS.filter(serviceTag =>
      this.hasTag(tags, serviceTag)
    );
  }

  /**
   * Helper: Check if photo has Before or After tag (by ID or name)
   */
  private hasBeforeOrAfterTag(tags: string[], tagIds: string[]): boolean {
    const hasByIds = tagIds.includes(BEFORE_TAG_ID) || tagIds.includes(AFTER_TAG_ID);
    const hasByNames = this.hasTag(tags, BEFORE_TAG) || this.hasTag(tags, AFTER_TAG);
    return hasByIds || hasByNames;
  }

  /**
   * Helper: Check if photo passes the two-tier filter
   * 1. Must have master tag ("RR Website")
   * 2. Must have at least one service tag OR a Before/After tag
   */
  private passesFilter(tags: string[], tagIds: string[] = []): boolean {
    const hasMaster = this.hasMasterTag(tags);
    const matchedServiceTags = this.getMatchedServiceTags(tags);
    const hasBeforeAfter = this.hasBeforeOrAfterTag(tags, tagIds);
    return hasMaster && (matchedServiceTags.length > 0 || hasBeforeAfter);
  }

  /**
   * Make a GET request to the CompanyCam API
   * Public for debugging purposes
   */
  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`CompanyCam API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CompanyCam API request failed:', error);
      throw error;
    }
  }

  /**
   * Get all photos from CompanyCam
   */
  async getPhotos(options?: PhotoFilterOptions): Promise<CompanyCamPhoto[]> {
    const page = options?.page || 1;
    const perPage = options?.perPage || DEFAULT_PER_PAGE;

    const endpoint = `/photos?page=${page}&per_page=${perPage}`;
    const response = await this.get<CompanyCamPhotoListResponse>(endpoint);

    return response.data || [];
  }

  /**
   * Get photos from a specific project
   */
  async getProjectPhotos(projectId: string, options?: PhotoFilterOptions): Promise<CompanyCamPhoto[]> {
    const page = options?.page || 1;
    const perPage = options?.perPage || DEFAULT_PER_PAGE;

    const endpoint = `/projects/${projectId}/photos?page=${page}&per_page=${perPage}`;
    const response = await this.get<CompanyCamPhotoListResponse>(endpoint);

    return response.data || [];
  }

  /**
   * Get tags for a specific photo
   */
  async getPhotoTags(photoId: string): Promise<CompanyCamTag[]> {
    const endpoint = `/photos/${photoId}/tags`;
    const response = await this.get<any>(endpoint);

    // The response IS the array directly, not wrapped in { data: [...] }
    return Array.isArray(response) ? response : (response.data || []);
  }

  /**
   * Get photos filtered by user's requirements
   *
   * Implements two-tier filtering:
   * 1. Master tag: "RRWebsite" (required) - fetched efficiently using tag_ids parameter
   * 2. Service tags: At least ONE service tag must be present
   * 3. Optional: Additional filter by specific service tag
   * 4. Optional: Filter by before/after tags
   */
  async getPhotosByTags(additionalFilters?: {
    serviceTag?: string;
    beforeAfter?: 'before' | 'after' | 'both';
  }, options?: PhotoFilterOptions): Promise<GalleryPhoto[]> {
    // EFFICIENT APPROACH: Fetch ONLY photos with the RRWebsite master tag using tag_ids parameter
    // This drastically reduces API calls from hundreds to ~36 photos
    const perPage = options?.perPage || 100;
    const page = options?.page || 1;

    // Fetch photos that already have the master tag (RRWebsite)
    const endpoint = `/photos?tag_ids=${MASTER_TAG_ID}&page=${page}&per_page=${perPage}`;
    const response = await this.get<any>(endpoint);
    const photos = Array.isArray(response) ? response : (response.data || []);

    if (photos.length === 0) {
      return [];
    }

    // Fetch tags for each photo to check for service tags
    // Since we're only fetching ~36 photos max, rate limiting is not an issue
    const batchSize = 20;
    const delayBetweenBatches = 3000; // 3 seconds between batches (conservative)
    const photosWithTags: ({ photo: CompanyCamPhoto; tags: string[]; tagIds: string[] } | null)[] = [];

    for (let i = 0; i < photos.length; i += batchSize) {
      const batch = photos.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (photo: CompanyCamPhoto) => {
          try {
            const photoTags = await this.getPhotoTags(photo.id);
            const tagNames = photoTags.map(tag => tag.display_value || tag.value || tag.name || '');
            const tagIds = photoTags.map(tag => tag.id);

            return {
              photo,
              tags: tagNames,
              tagIds,
            };
          } catch (error) {
            console.error(`Failed to fetch tags for photo ${photo.id}:`, error);
            return null;
          }
        })
      );

      photosWithTags.push(...batchResults);

      // Delay between batches (except for the last batch)
      if (i + batchSize < photos.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }

    // Apply two-tier filter
    const filteredPhotos = photosWithTags.filter(item => {
      if (!item) return false;

      // Apply master + service tag filter (or Before/After tags)
      if (!this.passesFilter(item.tags, item.tagIds)) {
        return false;
      }

      // Apply optional service tag filter
      if (additionalFilters?.serviceTag) {
        if (!this.hasTag(item.tags, additionalFilters.serviceTag)) {
          return false;
        }
      }

      // Apply optional before/after filter (check by tag ID for reliability)
      if (additionalFilters?.beforeAfter) {
        const isBeforePhoto = item.tagIds.includes(BEFORE_TAG_ID) || this.hasTag(item.tags, BEFORE_TAG);
        const isAfterPhoto = item.tagIds.includes(AFTER_TAG_ID) || this.hasTag(item.tags, AFTER_TAG);

        if (additionalFilters.beforeAfter === 'before' && !isBeforePhoto) return false;
        if (additionalFilters.beforeAfter === 'after' && !isAfterPhoto) return false;
        if (additionalFilters.beforeAfter === 'both' && (!isBeforePhoto || !isAfterPhoto)) return false;
      }

      return true;
    });

    // Transform to GalleryPhoto format
    return filteredPhotos
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .map(item => this.transformToGalleryPhoto(item.photo, item.tags, item.tagIds));
  }

  /**
   * Get all gallery photos (filtered by master tag + service tags)
   */
  async getAllGalleryPhotos(options?: PhotoFilterOptions): Promise<GalleryPhoto[]> {
    return this.getPhotosByTags(undefined, options);
  }

  /**
   * Get gallery photos by specific service category
   */
  async getGalleryPhotosByService(service: string, options?: PhotoFilterOptions): Promise<GalleryPhoto[]> {
    return this.getPhotosByTags({ serviceTag: service }, options);
  }

  /**
   * Get before/after photos
   * Optionally filtered by service category
   */
  async getBeforeAfterPhotos(service?: string, options?: PhotoFilterOptions): Promise<{
    before: GalleryPhoto[];
    after: GalleryPhoto[];
  }> {
    const beforePhotos = await this.getPhotosByTags({
      serviceTag: service,
      beforeAfter: 'before',
    }, options);

    const afterPhotos = await this.getPhotosByTags({
      serviceTag: service,
      beforeAfter: 'after',
    }, options);

    return {
      before: beforePhotos,
      after: afterPhotos,
    };
  }

  /**
   * Helper: Get URI from photo by type
   * CompanyCam returns uris as an array of {type, uri, url} objects
   */
  private getPhotoUri(photo: CompanyCamPhoto, type: string): string | undefined {
    if (!photo.uris || !Array.isArray(photo.uris)) {
      return photo.uri;
    }
    const found = photo.uris.find(u => u.type === type);
    return found?.uri || found?.url;
  }

  /**
   * Transform CompanyCam photo to GalleryPhoto format
   */
  private transformToGalleryPhoto(photo: CompanyCamPhoto, tags: string[], tagIds: string[] = []): GalleryPhoto {
    const matchedServiceTags = this.getMatchedServiceTags(tags);

    // Get URLs from the uris array
    // Use 'web' for main display (400x400) and 'thumbnail' for thumbnails (250x250)
    // Fall back to 'original' if others not available
    const mainUrl = this.getPhotoUri(photo, 'web') || this.getPhotoUri(photo, 'original') || photo.uri;
    const thumbnailUrl = this.getPhotoUri(photo, 'thumbnail') || mainUrl;

    // Check by tag ID first (more reliable), fallback to tag name
    const isBeforePhoto = tagIds.includes(BEFORE_TAG_ID) || this.hasTag(tags, BEFORE_TAG);
    const isAfterPhoto = tagIds.includes(AFTER_TAG_ID) || this.hasTag(tags, AFTER_TAG);

    return {
      id: photo.id,
      url: mainUrl || '',
      thumbnailUrl: thumbnailUrl || '',
      capturedAt: photo.captured_at ? String(photo.captured_at) : photo.created_at,
      tags,
      location: photo.coordinates,
      category: matchedServiceTags[0]?.toLowerCase(), // Use first matched service tag
      isBeforePhoto,
      isAfterPhoto,
    };
  }

  /**
   * Extract service category from tags (legacy support)
   * Now uses SERVICE_TAGS constant from types
   */
  private extractCategory(tags: string[]): string | undefined {
    const matchedTags = this.getMatchedServiceTags(tags);
    return matchedTags[0]?.toLowerCase();
  }
}

/**
 * Get a singleton instance of the CompanyCam client
 */
let companyCamClient: CompanyCamClient | null = null;

export function getCompanyCamClient(): CompanyCamClient {
  if (!companyCamClient) {
    companyCamClient = new CompanyCamClient();
  }
  return companyCamClient;
}
