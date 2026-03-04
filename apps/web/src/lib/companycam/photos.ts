import {
  CompanyCamPhoto,
  CompanyCamProject,
  CompanyCamApiResponse,
  PhotosListResponse,
  PhotoFilterOptions,
  FilteredPhoto,
  CompanyCamErrorCode,
  SERVICE_TAGS,
  SERVICE_TAG_IDS,
  TAG_ID_TO_CATEGORY,
  ALL_SERVICE_TAG_IDS,
  BEFORE_TAG,
  AFTER_TAG,
  ServiceTag,
  GalleryPhoto,
} from './types';
import type { ProjectImage, ServiceCategory } from '@/types/gallery';
import { getLocationAreaName, type LocationArea, LOCATION_AREAS } from '@/lib/service-areas';

/**
 * CompanyCam Photos Service
 *
 * Handles photo fetching and filtering from CompanyCam API
 * Photos need a single service tag (by ID) to appear on the website.
 */
class CompanyCamPhotosService {
  private apiKey: string;
  private readonly BASE_URL = 'https://api.companycam.com/v2';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('CompanyCam API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Helper function for case-insensitive tag matching
   */
  private hasTag(tags: string[], targetTag: string): boolean {
    return tags.some(tag => tag.toLowerCase() === targetTag.toLowerCase());
  }

  /**
   * Check if photo has at least one service tag
   * Returns the matched service tag names
   */
  private getMatchedServiceTags(tags: string[]): string[] {
    return SERVICE_TAGS.filter(serviceTag =>
      this.hasTag(tags, serviceTag)
    );
  }

  /**
   * Check if photo passes the service tag filter
   * Must have at least one recognized service tag
   */
  private passesFilter(tags: string[]): boolean {
    const matchedServiceTags = this.getMatchedServiceTags(tags);
    return matchedServiceTags.length > 0;
  }

  /**
   * Get all projects from CompanyCam
   */
  async getProjects(): Promise<CompanyCamApiResponse<CompanyCamProject[]>> {
    try {
      const response = await fetch(`${this.BASE_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `CompanyCam API error: ${response.status} - ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || [],
      };
    } catch (error: any) {
      console.error('[CompanyCam] Error fetching projects:', error);
      return {
        success: false,
        error: {
          status: error.status || 500,
          message: error.message || 'Failed to fetch projects from CompanyCam',
          code: CompanyCamErrorCode.UNKNOWN_ERROR,
        },
      };
    }
  }

  /**
   * Get photos from a specific project
   */
  async getProjectPhotos(projectId: string): Promise<CompanyCamApiResponse<CompanyCamPhoto[]>> {
    try {
      const response = await fetch(`${this.BASE_URL}/projects/${projectId}/photos`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: true,
            data: [],
          };
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `CompanyCam API error: ${response.status} - ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || [],
      };
    } catch (error: any) {
      console.error(`[CompanyCam] Error fetching photos for project ${projectId}:`, error);
      return {
        success: false,
        error: {
          status: error.status || 500,
          message: error.message || `Failed to fetch photos for project ${projectId}`,
          code: CompanyCamErrorCode.UNKNOWN_ERROR,
        },
      };
    }
  }

  /**
   * Get tags for a specific photo
   */
  async getPhotoTags(photoId: string): Promise<CompanyCamApiResponse<string[]>> {
    try {
      const response = await fetch(`${this.BASE_URL}/photos/${photoId}/tags`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: true,
            data: [],
          };
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `CompanyCam API error: ${response.status} - ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();
      const tags = (data.data || []).map((tag: any) => tag.name);
      return {
        success: true,
        data: tags,
      };
    } catch (error: any) {
      console.error(`[CompanyCam] Error fetching tags for photo ${photoId}:`, error);
      return {
        success: false,
        error: {
          status: error.status || 500,
          message: error.message || `Failed to fetch tags for photo ${photoId}`,
          code: CompanyCamErrorCode.UNKNOWN_ERROR,
        },
      };
    }
  }

  /**
   * Get all photos from all projects with filtering
   *
   * Filters by service tags and optional additional criteria.
   */
  async getFilteredPhotos(
    options: PhotoFilterOptions = {}
  ): Promise<CompanyCamApiResponse<PhotosListResponse>> {
    try {
      // Get all projects first
      const projectsResponse = await this.getProjects();
      if (!projectsResponse.success || !projectsResponse.data) {
        return {
          success: false,
          error: projectsResponse.error,
        };
      }

      const projects = projectsResponse.data;
      const allFilteredPhotos: FilteredPhoto[] = [];

      // Fetch photos from each project
      for (const project of projects) {
        const photosResponse = await this.getProjectPhotos(project.id);
        if (!photosResponse.success || !photosResponse.data) {
          console.warn(`[CompanyCam] Failed to fetch photos for project ${project.id}`);
          continue;
        }

        // Process each photo
        for (const photo of photosResponse.data) {
          // Get tags for this photo
          const tagsResponse = await this.getPhotoTags(photo.id);
          if (!tagsResponse.success || !tagsResponse.data) {
            console.warn(`[CompanyCam] Failed to fetch tags for photo ${photo.id}`);
            continue;
          }

          const tags = tagsResponse.data;

          // Apply two-tier filter
          if (!this.passesFilter(tags)) {
            continue; // Skip photos that don't pass the master + service tag filter
          }

          const matchedServiceTags = this.getMatchedServiceTags(tags);

          // Apply optional service tag filter
          if (options.serviceTag) {
            const hasRequestedServiceTag = this.hasTag(tags, options.serviceTag);
            if (!hasRequestedServiceTag) {
              continue;
            }
          }

          // Check for before/after tags
          const isBeforePhoto = this.hasTag(tags, BEFORE_TAG);
          const isAfterPhoto = this.hasTag(tags, AFTER_TAG);

          // Apply optional before/after filter
          if (options.beforeAfter) {
            if (options.beforeAfter === 'before' && !isBeforePhoto) continue;
            if (options.beforeAfter === 'after' && !isAfterPhoto) continue;
            if (options.beforeAfter === 'both' && (!isBeforePhoto || !isAfterPhoto)) continue;
          }

          // Create filtered photo with metadata
          const filteredPhoto: FilteredPhoto = {
            ...photo,
            matchedTags: matchedServiceTags,
            serviceCategory: matchedServiceTags[0], // Use first matched tag as primary category
            isBeforePhoto,
            isAfterPhoto,
          };

          allFilteredPhotos.push(filteredPhoto);
        }
      }

      // Apply pagination if specified
      const page = options.page || 1;
      const pageSize = options.perPage || options.limit || 50;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedPhotos = allFilteredPhotos.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          photos: paginatedPhotos,
          total: allFilteredPhotos.length,
          page,
          pageSize,
        },
      };
    } catch (error: any) {
      console.error('[CompanyCam] Error fetching filtered photos:', error);
      return {
        success: false,
        error: {
          status: error.status || 500,
          message: error.message || 'Failed to fetch filtered photos from CompanyCam',
          code: CompanyCamErrorCode.UNKNOWN_ERROR,
        },
      };
    }
  }
}

export default CompanyCamPhotosService;

// =============================================================================
// Photo Transformation Utilities
// =============================================================================

/**
 * Tags to hide from display (internal tags)
 */
const HIDDEN_TAGS: string[] = [];

/**
 * Mapping from tag display names to Gallery display categories
 * These are the category names populated by the client from tag IDs
 */
const TAG_TO_CATEGORY: Record<string, ServiceCategory> = {
  'Roofing': 'Roofing',
  'Siding': 'Siding',
  'Commercial': 'Commercial',
  'Specialty': 'Specialty',
  'Gutters': 'Gutters',
  'Windows': 'Windows',
  'Skylights': 'Skylights',
  'Flat': 'Flat',
};

/**
 * Service page slug to tag category names mapping
 * Used to fetch relevant photos for each service page
 */
export const SERVICE_SLUG_TO_TAGS: Record<string, string[]> = {
  'roofing': ['Roofing'],
  'siding-and-gutters': ['Siding'],
  'commercial': ['Commercial'],
  'historical-restorations': ['Specialty'],
  'gutters': ['Gutters'],
  'windows': ['Windows'],
  'skylights': ['Skylights'],
};

/**
 * Format a tag for display
 * - Hides any internal tags
 * - Returns the tag as-is (categories are already properly named)
 */
export function formatTagForDisplay(tag: string): string | null {
  if (HIDDEN_TAGS.includes(tag)) {
    return null;
  }
  return tag;
}

/**
 * Filter and format tags for display
 * Removes hidden tags and normalizes display format
 */
export function formatTagsForDisplay(tags: string[]): string[] {
  return tags
    .map(formatTagForDisplay)
    .filter((tag): tag is string => tag !== null);
}

/**
 * Get the primary gallery category from CompanyCam tags
 * Returns the first matching category, prioritizing service-specific tags
 */
export function getGalleryCategory(tags: string[]): ServiceCategory | undefined {
  // Priority order for category assignment
  const priorityOrder: ServiceCategory[] = [
    'Roofing',
    'Siding',
    'Windows',
    'Skylights',
    'Gutters',
    'Commercial',
    'Specialty',
    'Flat',
  ];

  // Find all matching categories
  const matchedCategories = new Set<ServiceCategory>();
  for (const tag of tags) {
    const category = TAG_TO_CATEGORY[tag];
    if (category) {
      matchedCategories.add(category);
    }
  }

  // Return highest priority match
  for (const category of priorityOrder) {
    if (matchedCategories.has(category)) {
      return category;
    }
  }

  return undefined;
}

/**
 * Get all matching gallery categories from CompanyCam tags
 * A photo may belong to multiple categories
 */
export function getAllGalleryCategories(tags: string[]): ServiceCategory[] {
  const categories = new Set<ServiceCategory>();

  for (const tag of tags) {
    const category = TAG_TO_CATEGORY[tag];
    if (category) {
      categories.add(category);
    }
  }

  return Array.from(categories);
}

/**
 * Transform a CompanyCam GalleryPhoto to the gallery's ProjectImage format
 */
export function transformToProjectImage(photo: GalleryPhoto): ProjectImage {
  const displayTags = formatTagsForDisplay(photo.tags);
  const categories = getAllGalleryCategories(photo.tags);
  const primaryCategory = getGalleryCategory(photo.tags);

  // Generate alt text from category
  const altText = primaryCategory
    ? `${primaryCategory} project by Russell Roofing`
    : 'Home improvement project by Russell Roofing';

  // Generate project title from category
  const projectTitle = primaryCategory
    ? `${primaryCategory} Project`
    : 'Home Improvement Project';

  // Format captured date
  let completedDate: string | undefined;
  if (photo.capturedAt) {
    const timestamp = parseInt(photo.capturedAt, 10);
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp * 1000);
      completedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });
    }
  }

  // Determine location area from coordinates
  let location: string | undefined;
  let locationArea: LocationArea | undefined;
  let coordinates: { lat: number; lon: number } | undefined;

  if (photo.location && photo.location.lat !== 0 && photo.location.lon !== 0) {
    coordinates = { lat: photo.location.lat, lon: photo.location.lon };
    locationArea = getLocationAreaName(photo.location.lat, photo.location.lon);
    location = locationArea !== 'All Areas' ? locationArea : 'Greater Philadelphia Area';
  }

  return {
    id: photo.id,
    src: photo.url,
    alt: altText,
    thumbnailSrc: photo.thumbnailUrl || photo.url,
    blurDataUrl: '', // CompanyCam doesn't provide blur data, use empty string
    serviceTypes: categories.length > 0 ? categories : ['Roofing'], // Default to Roofing if no match
    projectTitle,
    description: `Quality ${primaryCategory?.toLowerCase() || 'home improvement'} work by Russell Roofing & Exteriors.`,
    location,
    locationArea,
    coordinates,
    completedDate,
    aspectRatio: 1.5, // Default aspect ratio, CompanyCam doesn't provide this
  };
}

/**
 * Transform multiple CompanyCam photos to ProjectImage format
 */
export function transformPhotosToProjectImages(photos: GalleryPhoto[]): ProjectImage[] {
  return photos.map(transformToProjectImage);
}

/**
 * Filter photos by service page slug
 * Returns photos that have any of the matching tags for that service
 */
export function filterPhotosByServiceSlug(
  photos: GalleryPhoto[],
  serviceSlug: string
): GalleryPhoto[] {
  const tags = SERVICE_SLUG_TO_TAGS[serviceSlug];
  if (!tags || tags.length === 0) {
    return [];
  }

  return photos.filter(photo =>
    photo.tags.some(photoTag =>
      tags.some(serviceTag =>
        photoTag.toLowerCase() === serviceTag.toLowerCase()
      )
    )
  );
}

/**
 * Get photos for a service page (limited to a specific count)
 */
export function getServicePagePhotos(
  photos: GalleryPhoto[],
  serviceSlug: string,
  limit: number = 3
): GalleryPhoto[] {
  const filtered = filterPhotosByServiceSlug(photos, serviceSlug);
  return filtered.slice(0, limit);
}

/**
 * Calculate photo counts by category for the gallery filter
 */
export function calculateCategoryCounts(photos: GalleryPhoto[]): Record<string, number> {
  const counts: Record<string, number> = { 'All': photos.length };

  for (const photo of photos) {
    const categories = getAllGalleryCategories(photo.tags);
    for (const category of categories) {
      counts[category] = (counts[category] || 0) + 1;
    }
  }

  return counts;
}

/**
 * Calculate photo counts by location area for the gallery location filter
 */
export function calculateLocationCounts(photos: GalleryPhoto[]): Record<string, number> {
  const counts: Record<string, number> = { 'All Areas': photos.length };

  for (const photo of photos) {
    if (photo.location && photo.location.lat !== 0 && photo.location.lon !== 0) {
      const locationArea = getLocationAreaName(photo.location.lat, photo.location.lon);
      if (locationArea && locationArea !== 'All Areas') {
        counts[locationArea] = (counts[locationArea] || 0) + 1;
      }
    }
  }

  return counts;
}
