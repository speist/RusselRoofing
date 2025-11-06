/**
 * CompanyCam API Client
 * Handles authentication and API requests to CompanyCam
 */

import type {
  CompanyCamPhoto,
  CompanyCamPhotoListResponse,
  CompanyCamTag,
  CompanyCamTagListResponse,
  PhotoFilterOptions,
  GalleryPhoto,
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
   * Make a GET request to the CompanyCam API
   */
  private async get<T>(endpoint: string): Promise<T> {
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
    const response = await this.get<CompanyCamTagListResponse>(endpoint);

    return response.data || [];
  }

  /**
   * Get photos filtered by tags
   * This method fetches all photos and filters them by tags on the client side
   * since CompanyCam API doesn't support tag filtering in the list endpoint
   */
  async getPhotosByTags(tags: string[], options?: PhotoFilterOptions): Promise<GalleryPhoto[]> {
    // Fetch all photos
    const photos = await this.getPhotos(options);

    // Fetch tags for each photo and filter
    const photosWithTags = await Promise.all(
      photos.map(async (photo) => {
        try {
          const photoTags = await this.getPhotoTags(photo.id);
          const tagNames = photoTags.map(tag => tag.name.toLowerCase());

          return {
            photo,
            tags: tagNames,
          };
        } catch (error) {
          console.error(`Failed to fetch tags for photo ${photo.id}:`, error);
          return null;
        }
      })
    );

    // Filter photos that have all the required tags
    const filteredPhotos = photosWithTags.filter(item => {
      if (!item) return false;

      const normalizedTags = tags.map(tag => tag.toLowerCase().replace('#', ''));
      return normalizedTags.every(requiredTag =>
        item.tags.includes(requiredTag)
      );
    });

    // Transform to GalleryPhoto format
    return filteredPhotos
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .map(item => this.transformToGalleryPhoto(item.photo, item.tags));
  }

  /**
   * Get gallery photos by service category
   */
  async getGalleryPhotosByService(service: string): Promise<GalleryPhoto[]> {
    const tags = ['#gallery', `#${service.toLowerCase()}`];
    return this.getPhotosByTags(tags);
  }

  /**
   * Get before/after photos
   */
  async getBeforeAfterPhotos(service?: string): Promise<{
    before: GalleryPhoto[];
    after: GalleryPhoto[];
  }> {
    const baseTags = ['#gallery'];
    if (service) {
      baseTags.push(`#${service.toLowerCase()}`);
    }

    const beforePhotos = await this.getPhotosByTags([...baseTags, '#before']);
    const afterPhotos = await this.getPhotosByTags([...baseTags, '#after']);

    return {
      before: beforePhotos,
      after: afterPhotos,
    };
  }

  /**
   * Transform CompanyCam photo to GalleryPhoto format
   */
  private transformToGalleryPhoto(photo: CompanyCamPhoto, tags: string[]): GalleryPhoto {
    return {
      id: photo.id,
      url: photo.uri,
      thumbnailUrl: photo.thumbnail_uri || photo.uri,
      capturedAt: photo.captured_at || photo.created_at,
      tags,
      location: photo.coordinates,
      category: this.extractCategory(tags),
      isBeforePhoto: tags.includes('before'),
      isAfterPhoto: tags.includes('after'),
    };
  }

  /**
   * Extract service category from tags
   */
  private extractCategory(tags: string[]): string | undefined {
    const serviceCategories = [
      'roofing',
      'siding',
      'gutters',
      'windows',
      'chimneys',
      'commercial',
      'historical',
      'masonry',
      'skylights',
    ];

    return serviceCategories.find(category =>
      tags.includes(category)
    );
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
