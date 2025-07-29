/**
 * Development Gallery Utilities
 * 
 * Development-only utilities for gallery management and debugging.
 * These functions provide runtime validation and error handling.
 */

import { ProjectImage } from "../types/gallery";
import { validateGalleryData, validateProjectImage, logValidationResults, createFallbackImage } from "./gallery-validation";

/**
 * Development flag to enable validation warnings
 */
const DEV_MODE = process.env.NODE_ENV === 'development';

/**
 * Enhanced gallery data loader with validation
 */
export function loadGalleryWithValidation(images: ProjectImage[]): ProjectImage[] {
  if (!DEV_MODE) {
    return images;
  }
  
  console.log('🖼️ Gallery validation starting...');
  
  const validationResult = validateGalleryData(images, {
    validateNaming: true,
    requireThumbnails: true,
    validateBlurData: true
  });
  
  logValidationResults(validationResult, 'Gallery Data');
  
  // In development, show detailed information
  if (!validationResult.isValid) {
    console.group('📋 Validation Details:');
    validationResult.errors.forEach(error => console.error(`❌ ${error}`));
    validationResult.warnings.forEach(warning => console.warn(`⚠️ ${warning}`));
    console.groupEnd();
  }
  
  return images;
}

/**
 * Runtime image loader with fallback handling
 */
export function loadImageWithFallback(image: ProjectImage): ProjectImage {
  if (!DEV_MODE) {
    return image;
  }
  
  const validation = validateProjectImage(image);
  
  if (!validation.isValid) {
    console.warn(`⚠️ Image validation failed for ID ${image.id}:`, validation.errors);
    
    // Log the issue but return the original image for now
    // In production, you might want to return a fallback image
  }
  
  return image;
}

/**
 * Development warning system for missing images
 */
export function warnMissingImage(imagePath: string): void {
  if (DEV_MODE) {
    console.warn(`🚨 Missing image detected: ${imagePath}`);
    console.warn('   This image should be added to the gallery folder structure');
    console.warn('   Or update the gallery.ts file to reference the correct path');
  }
}

/**
 * Development utility to check image loading
 */
export function checkImageLoad(src: string): Promise<boolean> {
  if (!DEV_MODE) {
    return Promise.resolve(true);
  }
  
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      console.log(`✅ Image loaded successfully: ${src}`);
      resolve(true);
    };
    
    img.onerror = () => {
      console.error(`❌ Failed to load image: ${src}`);
      warnMissingImage(src);
      resolve(false);
    };
    
    img.src = src;
  });
}

/**
 * Development utility to validate gallery on component mount
 */
export function validateGalleryOnMount(images: ProjectImage[]): void {
  if (!DEV_MODE) {
    return;
  }
  
  console.log('🔍 Running gallery mount validation...');
  
  // Check for common issues
  const duplicateIds = new Set();
  const seenIds = new Set();
  
  images.forEach(image => {
    if (seenIds.has(image.id)) {
      duplicateIds.add(image.id);
    }
    seenIds.add(image.id);
  });
  
  if (duplicateIds.size > 0) {
    console.error('❌ Duplicate image IDs found:', Array.from(duplicateIds));
  }
  
  // Validate aspect ratios are reasonable
  const badAspectRatios = images.filter(img => 
    typeof img.aspectRatio !== 'number' || 
    img.aspectRatio < 0.1 || 
    img.aspectRatio > 10
  );
  
  if (badAspectRatios.length > 0) {
    console.warn('⚠️ Images with unusual aspect ratios:', 
      badAspectRatios.map(img => `${img.id}: ${img.aspectRatio}`)
    );
  }
  
  // Check for missing alt text
  const missingAlt = images.filter(img => !img.alt || img.alt.length < 5);
  
  if (missingAlt.length > 0) {
    console.warn('⚠️ Images with poor alt text:', 
      missingAlt.map(img => img.id)
    );
  }
  
  console.log(`✅ Gallery validation complete. ${images.length} images processed.`);
}

/**
 * Development utility to log gallery statistics
 */
export function logGalleryStats(images: ProjectImage[]): void {
  if (!DEV_MODE) {
    return;
  }
  
  console.group('📊 Gallery Statistics:');
  
  console.log(`Total images: ${images.length}`);
  
  // Service type breakdown
  const serviceStats: Record<string, number> = {};
  images.forEach(image => {
    image.serviceTypes.forEach(service => {
      serviceStats[service] = (serviceStats[service] || 0) + 1;
    });
  });
  
  console.log('Service breakdown:', serviceStats);
  
  // Aspect ratio stats
  const aspectRatios = images.map(img => img.aspectRatio);
  const avgAspectRatio = aspectRatios.reduce((a, b) => a + b, 0) / aspectRatios.length;
  
  console.log(`Average aspect ratio: ${avgAspectRatio.toFixed(2)}`);
  
  // Date range
  const dates = images
    .map(img => img.completedDate)
    .filter(Boolean)
    .sort();
  
  if (dates.length > 0) {
    console.log(`Date range: ${dates[0]} to ${dates[dates.length - 1]}`);
  }
  
  console.groupEnd();
}

/**
 * Development error boundary for gallery components
 */
export function handleGalleryError(error: Error, imageId?: string): void {
  if (DEV_MODE) {
    console.group('🚨 Gallery Error:');
    console.error('Error:', error.message);
    if (imageId) {
      console.error('Image ID:', imageId);
    }
    console.error('Stack:', error.stack);
    console.groupEnd();
  }
}

/**
 * Development utility to simulate image loading delays
 */
export function simulateImageLoading(): Promise<void> {
  if (!DEV_MODE) {
    return Promise.resolve();
  }
  
  // Simulate network delay in development
  const delay = Math.random() * 100 + 50; // 50-150ms
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Development utility to validate image paths match folder structure
 */
export function validateImagePaths(images: ProjectImage[]): void {
  if (!DEV_MODE) {
    return;
  }
  
  console.log('🔍 Validating image paths...');
  
  const pathIssues: string[] = [];
  
  images.forEach(image => {
    const { src, thumbnailSrc, serviceTypes } = image;
    
    // Check if path matches service type
    const primaryService = serviceTypes[0]?.toLowerCase();
    if (primaryService && !src.includes(`/gallery/${primaryService}/`)) {
      pathIssues.push(`${image.id}: path doesn't match service type ${primaryService}`);
    }
    
    // Check thumbnail path consistency
    const expectedThumbPath = src.replace('/full/', '/thumbnails/').replace('.jpg', '-thumb.jpg');
    if (thumbnailSrc !== expectedThumbPath) {
      pathIssues.push(`${image.id}: thumbnail path inconsistent`);
    }
  });
  
  if (pathIssues.length > 0) {
    console.warn('⚠️ Path validation issues:');
    pathIssues.forEach(issue => console.warn(`  • ${issue}`));
  } else {
    console.log('✅ All image paths are valid');
  }
}