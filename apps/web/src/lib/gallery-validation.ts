/**
 * Gallery Data Validation System
 * 
 * Provides validation functions for gallery images and data integrity.
 * Used in development and testing to ensure all gallery references are valid.
 */

import { ProjectImage, ServiceCategory, serviceCategories } from "../types/gallery";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImageValidationOptions {
  checkFileExists?: boolean;
  validateNaming?: boolean;
  requireThumbnails?: boolean;
  validateBlurData?: boolean;
}

/**
 * Validates a single ProjectImage entry
 */
export function validateProjectImage(
  image: ProjectImage, 
  options: ImageValidationOptions = {}
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const {
    checkFileExists = false,
    validateNaming = true,
    requireThumbnails = true,
    validateBlurData = true
  } = options;
  
  // Required field validation
  if (!image.id || typeof image.id !== 'string') {
    errors.push('Missing or invalid id field');
  }
  
  if (!image.src || typeof image.src !== 'string') {
    errors.push('Missing or invalid src field');
  } else {
    // Validate image path format
    if (!image.src.startsWith('/images/gallery/')) {
      errors.push('Image src must start with /images/gallery/');
    }
    
    if (validateNaming) {
      const namingIssues = validateImageNaming(image.src);
      errors.push(...namingIssues);
    }
  }
  
  if (!image.alt || typeof image.alt !== 'string') {
    errors.push('Missing or invalid alt text');
  } else if (image.alt.length < 10) {
    warnings.push('Alt text should be more descriptive (minimum 10 characters)');
  }
  
  if (!image.thumbnailSrc || typeof image.thumbnailSrc !== 'string') {
    errors.push('Missing or invalid thumbnailSrc field');
  } else if (requireThumbnails) {
    // Check thumbnail naming convention
    const expectedThumb = image.src.replace('/full/', '/thumbnails/').replace('.jpg', '-thumb.jpg');
    if (image.thumbnailSrc !== expectedThumb) {
      errors.push(`Thumbnail path doesn't match expected convention: ${expectedThumb}`);
    }
  }
  
  if (validateBlurData) {
    if (!image.blurDataUrl || typeof image.blurDataUrl !== 'string') {
      errors.push('Missing or invalid blurDataUrl field');
    } else if (!image.blurDataUrl.startsWith('data:image/')) {
      errors.push('blurDataUrl must be a valid data URI');
    }
  }
  
  if (!Array.isArray(image.serviceTypes) || image.serviceTypes.length === 0) {
    errors.push('Missing or empty serviceTypes array');
  } else {
    // Validate service types
    const invalidServices = image.serviceTypes.filter(
      service => !serviceCategories.includes(service as ServiceCategory)
    );
    if (invalidServices.length > 0) {
      errors.push(`Invalid service types: ${invalidServices.join(', ')}`);
    }
  }
  
  if (!image.projectTitle || typeof image.projectTitle !== 'string') {
    errors.push('Missing or invalid projectTitle field');
  }
  
  if (!image.description || typeof image.description !== 'string') {
    errors.push('Missing or invalid description field');
  } else if (image.description.length < 20) {
    warnings.push('Description should be more detailed (minimum 20 characters)');
  }
  
  if (typeof image.aspectRatio !== 'number' || image.aspectRatio <= 0) {
    errors.push('Missing or invalid aspectRatio field');
  } else if (image.aspectRatio < 0.5 || image.aspectRatio > 3) {
    warnings.push('Unusual aspect ratio detected - verify image dimensions');
  }
  
  // Optional field validation
  if (image.location && typeof image.location !== 'string') {
    errors.push('Invalid location field (must be string)');
  }
  
  if (image.completedDate) {
    if (typeof image.completedDate !== 'string') {
      errors.push('Invalid completedDate field (must be string)');
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(image.completedDate)) {
      errors.push('completedDate must be in YYYY-MM-DD format');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates image naming convention
 */
export function validateImageNaming(imagePath: string): string[] {
  const errors: string[] = [];
  const filename = imagePath.split('/').pop() || '';
  
  // Extract service from path
  const pathParts = imagePath.split('/');
  const serviceIndex = pathParts.findIndex(part => part === 'gallery') + 1;
  
  if (serviceIndex === 0 || serviceIndex >= pathParts.length) {
    errors.push('Invalid gallery path structure');
    return errors;
  }
  
  const serviceFromPath = pathParts[serviceIndex];
  const nameWithoutExt = filename.replace(/\.(jpg|png|webp)$/i, '');
  
  // Check if it's a thumbnail
  const isThumb = nameWithoutExt.endsWith('-thumb');
  const baseName = isThumb ? nameWithoutExt.replace('-thumb', '') : nameWithoutExt;
  
  // Expected format: {service}-{project-type}-{location}-{date}
  const namingPattern = /^(roofing|siding|gutters|windows|chimneys|commercial)-[\w-]+-([\w-]+)-(\d{4}-\d{2}-\d{2})$/;
  
  if (!namingPattern.test(baseName)) {
    errors.push(`Filename doesn't follow naming convention: {service}-{project-type}-{location}-{date}.jpg`);
    return errors;
  }
  
  const matches = baseName.match(namingPattern);
  if (matches) {
    const [, serviceFromName] = matches;
    
    if (serviceFromName !== serviceFromPath) {
      errors.push(`Service in filename (${serviceFromName}) doesn't match path (${serviceFromPath})`);
    }
  }
  
  return errors;
}

/**
 * Validates an array of ProjectImage entries
 */
export function validateGalleryData(
  images: ProjectImage[], 
  options: ImageValidationOptions = {}
): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  
  // Check for duplicate IDs
  const ids = images.map(img => img.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    const uniqueDuplicates = Array.from(new Set(duplicateIds));
    allErrors.push(`Duplicate image IDs found: ${uniqueDuplicates.join(', ')}`);
  }
  
  // Validate each image
  images.forEach((image, index) => {
    const result = validateProjectImage(image, options);
    
    if (!result.isValid) {
      result.errors.forEach(error => {
        allErrors.push(`Image ${index + 1} (ID: ${image.id}): ${error}`);
      });
    }
    
    result.warnings.forEach(warning => {
      allWarnings.push(`Image ${index + 1} (ID: ${image.id}): ${warning}`);
    });
  });
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}

/**
 * Development-only function to check if image files exist
 * Note: This only works in Node.js environment, not in browser
 */
export function validateImageFilesExist(images: ProjectImage[]): Promise<ValidationResult> {
  // This would need to be implemented server-side or in a build script
  // For now, return a placeholder implementation
  return Promise.resolve({
    isValid: true,
    errors: [],
    warnings: ['File existence checking not implemented in browser environment']
  });
}

/**
 * Validates folder structure exists for a service category
 */
export function validateServiceFolderStructure(service: ServiceCategory): string[] {
  const errors: string[] = [];
  const requiredSubdirs = ['full', 'thumbnails', 'before-after'];
  
  // This would need filesystem access to properly validate
  // For now, return basic validation
  if (!serviceCategories.includes(service)) {
    errors.push(`Invalid service category: ${service}`);
  }
  
  return errors;
}

/**
 * Creates a fallback image object for missing images
 */
export function createFallbackImage(service: ServiceCategory, id: string): ProjectImage {
  return {
    id,
    src: `/images/gallery/${service.toLowerCase()}/full/placeholder-${id}.jpg`,
    alt: `Placeholder image for ${service} project`,
    thumbnailSrc: `/images/gallery/${service.toLowerCase()}/thumbnails/placeholder-${id}-thumb.jpg`,
    blurDataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ',
    serviceTypes: [service],
    projectTitle: `${service} Project Placeholder`,
    description: `Placeholder for ${service.toLowerCase()} project. Replace with actual project details.`,
    location: 'Location TBD',
    completedDate: new Date().toISOString().split('T')[0],
    aspectRatio: 1.5
  };
}

/**
 * Utility function to log validation results in a readable format
 */
export function logValidationResults(result: ValidationResult, context: string = ''): void {
  const prefix = context ? `[${context}] ` : '';
  
  if (result.isValid) {
    console.log(`${prefix}✅ Validation passed`);
  } else {
    console.error(`${prefix}❌ Validation failed:`);
    result.errors.forEach(error => console.error(`  • ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.warn(`${prefix}⚠️ Warnings:`);
    result.warnings.forEach(warning => console.warn(`  • ${warning}`));
  }
}