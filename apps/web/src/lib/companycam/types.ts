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
 * Service tag IDs from CompanyCam
 * Each service category maps to a single CompanyCam tag ID
 * Photos only need ONE of these tags to appear on the website
 *
 * Tag IDs:
 * - Roofing: 24460658
 * - Siding: 24460533
 * - Commercial: 24475643
 * - Specialty: 24475737
 * - Gutters: 24472896
 * - Windows: 24478730
 * - Skylights: 24473059
 * - Flat: 24460541
 */
export const SERVICE_TAG_IDS: Record<string, string> = {
  'Roofing': '24460658',
  'Siding': '24460533',
  'Commercial': '24475643',
  'Specialty': '24475737',
  'Gutters': '24472896',
  'Windows': '24478730',
  'Skylights': '24473059',
  'Flat': '24460541',
};

/** Reverse mapping: tag ID -> category display name */
export const TAG_ID_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(SERVICE_TAG_IDS).map(([category, id]) => [id, category])
);

/** All service tag IDs for fetching gallery photos */
export const ALL_SERVICE_TAG_IDS = Object.values(SERVICE_TAG_IDS);

/** Service tag category names (for backward compatibility) */
export const SERVICE_TAGS = Object.keys(SERVICE_TAG_IDS);

export type ServiceTag = keyof typeof SERVICE_TAG_IDS;

/**
 * Before/After tags for transformation showcases
 * Tag IDs are used for reliable filtering regardless of display name
 */
export const BEFORE_TAG = 'Before';
export const AFTER_TAG = 'After';
export const BEFORE_TAG_ID = '23885608';
export const AFTER_TAG_ID = '23885636';

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
