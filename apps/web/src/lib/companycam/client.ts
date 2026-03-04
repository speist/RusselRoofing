/**
 * CompanyCam API Client
 * Handles authentication and API requests to CompanyCam
 *
 * Filtering Strategy:
 * Photos need a single service tag (by ID) to appear on the website.
 * Optional: Before/After tags for transformation showcases.
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
  SERVICE_TAG_IDS,
  TAG_ID_TO_CATEGORY,
  ALL_SERVICE_TAG_IDS,
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
   * Helper: Get matched service categories from photo tag IDs
   * Returns array of category names that match our SERVICE_TAG_IDS
   */
  private getMatchedCategories(tagIds: string[]): string[] {
    return tagIds
      .map(id => TAG_ID_TO_CATEGORY[id])
      .filter(Boolean);
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
   * Helper: Check if photo passes the service tag filter
   * Must have at least one service tag ID OR a Before/After tag
   */
  private passesFilter(tags: string[], tagIds: string[] = []): boolean {
    const hasServiceTag = tagIds.some(id => TAG_ID_TO_CATEGORY[id]);
    const hasBeforeAfter = this.hasBeforeOrAfterTag(tags, tagIds);
    return hasServiceTag || hasBeforeAfter;
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
   * Fetches photos by service tag IDs and applies optional filters.
   * Each photo only needs a single service tag to be included.
   */
  async getPhotosByTags(additionalFilters?: {
    serviceTag?: string;
    beforeAfter?: 'before' | 'after' | 'both';
  }, options?: PhotoFilterOptions): Promise<GalleryPhoto[]> {
    const perPage = 100; // Max per page for CompanyCam API
    const MAX_PAGES = 20; // Safety limit

    // Fetch photos by service tag IDs
    // If filtering for a specific service, use just that tag ID for efficiency
    let fetchTagIds: string;
    if (additionalFilters?.serviceTag && SERVICE_TAG_IDS[additionalFilters.serviceTag]) {
      fetchTagIds = SERVICE_TAG_IDS[additionalFilters.serviceTag];
    } else {
      fetchTagIds = ALL_SERVICE_TAG_IDS.join(',');
    }

    // Paginate through all results
    let allPhotos: CompanyCamPhoto[] = [];
    let currentPage = 1;

    while (currentPage <= MAX_PAGES) {
      const endpoint = `/photos?tag_ids=${fetchTagIds}&page=${currentPage}&per_page=${perPage}`;
      const response = await this.get<any>(endpoint);
      const photos = Array.isArray(response) ? response : (response.data || []);

      if (photos.length === 0) break;

      allPhotos = [...allPhotos, ...photos];

      // If we got fewer than perPage, we've reached the last page
      if (photos.length < perPage) break;

      currentPage++;
    }

    if (allPhotos.length === 0) {
      return [];
    }

    console.log(`[CompanyCam] Fetched ${allPhotos.length} photos across ${currentPage} page(s)`);

    // Fetch tags for each photo to determine service categories
    const batchSize = 20;
    const delayBetweenBatches = 1000; // 1 second between batches
    const photosWithTags: ({ photo: CompanyCamPhoto; tags: string[]; tagIds: string[] } | null)[] = [];

    for (let i = 0; i < allPhotos.length; i += batchSize) {
      const batch = allPhotos.slice(i, i + batchSize);

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
      if (i + batchSize < allPhotos.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }

    // Apply service tag filter
    const filteredPhotos = photosWithTags.filter(item => {
      if (!item) return false;

      // Check for service tag ID or Before/After tag
      if (!this.passesFilter(item.tags, item.tagIds)) {
        return false;
      }

      // Apply optional service category filter
      if (additionalFilters?.serviceTag) {
        const matchedCategories = this.getMatchedCategories(item.tagIds);
        if (!matchedCategories.some(cat => cat.toLowerCase() === additionalFilters.serviceTag!.toLowerCase())) {
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
    // Map tag IDs to our category display names
    const matchedCategories = this.getMatchedCategories(tagIds);

    // Build display tags from matched categories + Before/After
    const displayTags: string[] = [...matchedCategories];

    const isBeforePhoto = tagIds.includes(BEFORE_TAG_ID) || this.hasTag(tags, BEFORE_TAG);
    const isAfterPhoto = tagIds.includes(AFTER_TAG_ID) || this.hasTag(tags, AFTER_TAG);

    if (isBeforePhoto) displayTags.push(BEFORE_TAG);
    if (isAfterPhoto) displayTags.push(AFTER_TAG);

    // Get URLs from the uris array
    const mainUrl = this.getPhotoUri(photo, 'original') || this.getPhotoUri(photo, 'web') || photo.uri;
    const thumbnailUrl = this.getPhotoUri(photo, 'web') || this.getPhotoUri(photo, 'thumbnail') || mainUrl;

    return {
      id: photo.id,
      url: mainUrl || '',
      thumbnailUrl: thumbnailUrl || '',
      capturedAt: photo.captured_at ? String(photo.captured_at) : photo.created_at,
      tags: displayTags,
      location: photo.coordinates,
      category: matchedCategories[0]?.toLowerCase(),
      isBeforePhoto,
      isAfterPhoto,
    };
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
