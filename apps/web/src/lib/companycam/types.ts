/**
 * CompanyCam API Types
 * Based on CompanyCam API documentation
 */

export interface CompanyCamPhoto {
  id: string;
  uri: string;
  thumbnail_uri?: string;
  created_at: string;
  captured_at?: string;
  processing_status?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  project_id?: string;
  tags?: CompanyCamTag[];
}

export interface CompanyCamTag {
  id: string;
  name: string;
  created_at: string;
}

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

export interface PhotoFilterOptions {
  tags?: string[];
  projectId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  perPage?: number;
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
