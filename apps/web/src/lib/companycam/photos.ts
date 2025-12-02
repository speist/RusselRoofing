import {
  CompanyCamPhoto,
  CompanyCamProject,
  CompanyCamApiResponse,
  PhotosListResponse,
  PhotoFilterOptions,
  FilteredPhoto,
  CompanyCamErrorCode,
  MASTER_TAG,
  SERVICE_TAGS,
  BEFORE_TAG,
  AFTER_TAG,
  ServiceTag,
} from './types';

/**
 * CompanyCam Photos Service
 *
 * Handles photo fetching and filtering from CompanyCam API
 * Implements two-tier filtering:
 * 1. Master tag filter: "RR Website" (required on ALL photos)
 * 2. Service tag filter: At least ONE service tag must be present
 * 3. Case-insensitive tag matching
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
   * Check if photo has the master tag ("RR Website")
   */
  private hasMasterTag(tags: string[]): boolean {
    return this.hasTag(tags, MASTER_TAG);
  }

  /**
   * Check if photo has at least one service tag
   * Returns the matched service tags
   */
  private getMatchedServiceTags(tags: string[]): string[] {
    return SERVICE_TAGS.filter(serviceTag =>
      this.hasTag(tags, serviceTag)
    );
  }

  /**
   * Check if photo passes the two-tier filter:
   * 1. Must have master tag ("RR Website")
   * 2. Must have at least one service tag
   */
  private passesFilter(tags: string[]): boolean {
    const hasMaster = this.hasMasterTag(tags);
    const matchedServiceTags = this.getMatchedServiceTags(tags);
    return hasMaster && matchedServiceTags.length > 0;
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
   * Implements two-tier filtering:
   * 1. Master tag: "RR Website" (required)
   * 2. Service tags: At least one from SERVICE_TAGS (required)
   * 3. Optional: Filter by specific service tag
   * 4. Optional: Filter by before/after tags
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
