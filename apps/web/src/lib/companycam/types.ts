/**
 * CompanyCam API Types
 * Based on CompanyCam API v2 documentation
 * @see https://docs.companycam.com/reference/api-v2-overview
 */

/**
 * URI object in CompanyCam photo response
 * The API returns an array of these with different types
 */
export interface CompanyCamPhotoUri {
  type: 'original' | 'web' | 'thumbnail' | 'original_annotation' | 'web_annotation' | 'thumbnail_annotation';
  uri: string;
  url: string;
}

export interface CompanyCamPhoto {
  id: string;
  uri?: string;
  uris: CompanyCamPhotoUri[];
  thumbnail_uri?: string; // Legacy support
  created_at: string;
  captured_at: number; // Unix timestamp
  processing_status?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  description?: string;
  internal: boolean;
  project_id: string;
  tags?: CompanyCamTag[];
  updated_at?: string;
}

export interface CompanyCamTag {
  id: string;
  display_value?: string;
  value?: string;
  name?: string;
  tag_type?: string;
  company_id?: string;
  created_at: string | number;
  updated_at?: string | number;
  color?: string;
}

/**
 * Service tags from CompanyCam (using exact display_value from API)
 * Photos must have RRWebsite tag AND at least one of these service tags
 * Case-insensitive matching is used in filtering logic
 *
 * Tag IDs from CompanyCam API (for reference):
 * - Churches: 23436542
 * - Commercial: 7050239
 * - Gutters: 7768825
 * - Historical: 23436581
 * - Institutions: 23436574
 * - Masonry: 10427799
 * - Restoration: 23436584
 * - roofing: 23436538 (lowercase in CompanyCam)
 * - Siding: 23436509
 * - Skylight: 15568699
 * - Windows: 7757712
 */
export const SERVICE_TAGS = [
  'Churches',
  'Commercial',
  'Gutters',
  'Historical',
  'Institutions',
  'Masonry',
  'Restoration',
  'roofing',       // lowercase in CompanyCam
  'Siding',
  'Skylight',
  'Windows',
] as const;

export type ServiceTag = typeof SERVICE_TAGS[number];

/**
 * Master tag that must be present on ALL photos to be displayed
 */
export const MASTER_TAG = 'RRWebsite';

/**
 * Tag ID for the master tag (RRWebsite) - used for efficient API filtering
 * This allows us to use CompanyCam's tag_ids parameter to fetch only tagged photos
 */
export const MASTER_TAG_ID = '23361102';

/**
 * Before/After tags for transformation showcases
 * Note: User mentioned no photos currently have these tags yet
 */
export const BEFORE_TAG = 'Before';
export const AFTER_TAG = 'After';

export interface CompanyCamProject {
  id: string;
  name: string;
  address?: {
    street_address_1?: string;
    street_address_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  coordinates?: {
    lat: number;
    lon: number;
  };
  created_at: string;
}

export interface CompanyCamPhotoListResponse {
  data: CompanyCamPhoto[];
  meta?: {
    total_count?: number;
    page?: number;
    per_page?: number;
  };
}

export interface CompanyCamTagListResponse {
  data: CompanyCamTag[];
}

/**
 * Photo filter options for querying CompanyCam API
 */
export interface PhotoFilterOptions {
  serviceTag?: ServiceTag | string;
  beforeAfter?: 'before' | 'after' | 'both';
  projectId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  perPage?: number;
  limit?: number;
}

/**
 * Filtered photo with metadata about matched tags and categories
 */
export interface FilteredPhoto extends CompanyCamPhoto {
  matchedTags: string[];
  serviceCategory?: string;
  isBeforePhoto?: boolean;
  isAfterPhoto?: boolean;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  capturedAt: string;
  tags: string[];
  location?: {
    lat: number;
    lon: number;
  };
  category?: string;
  isBeforePhoto?: boolean;
  isAfterPhoto?: boolean;
}

/**
 * API Response wrapper for standardized responses
 */
export interface CompanyCamApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    status: number;
    message: string;
    code?: string;
  };
}

/**
 * Photos list response with pagination
 */
export interface PhotosListResponse {
  photos: FilteredPhoto[];
  total: number;
  page?: number;
  pageSize?: number;
}

/**
 * Projects list response
 */
export interface ProjectsListResponse {
  projects: CompanyCamProject[];
  total: number;
}

/**
 * Error codes for CompanyCam API operations
 */
export enum CompanyCamErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  INVALID_TOKEN = 'INVALID_TOKEN',
  NO_MATCHING_PHOTOS = 'NO_MATCHING_PHOTOS',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
