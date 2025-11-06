/**
 * CompanyCam Integration Module
 *
 * Provides access to CompanyCam API for fetching construction photos
 * with tag-based filtering and location data.
 */

export { CompanyCamClient, getCompanyCamClient } from './client';
export type {
  CompanyCamPhoto,
  CompanyCamTag,
  CompanyCamProject,
  CompanyCamPhotoListResponse,
  CompanyCamTagListResponse,
  PhotoFilterOptions,
  GalleryPhoto,
} from './types';
