"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ProjectImage, ServiceCategory, serviceCategories } from "@/types/gallery";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryFilter } from "./GalleryFilter";
import { LocationFilter } from "./LocationFilter";
import { GalleryLightbox } from "./GalleryLightbox";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/lib/companycam/types";
import {
  transformPhotosToProjectImages,
  calculateCategoryCounts,
  calculateLocationCounts,
} from "@/lib/companycam/photos";
import { type LocationArea } from "@/lib/service-areas";

export interface CompanyCamGalleryProps {
  initialCategory?: ServiceCategory;
  initialLocation?: LocationArea;
  className?: string;
  showFilter?: boolean;
  showLocationFilter?: boolean;
  gridClassName?: string;
  /** Optional fallback images if API fails */
  fallbackImages?: ProjectImage[];
}

interface PhotosApiResponse {
  photos: GalleryPhoto[];
  total: number;
  page: number;
  pageSize: number;
}

const CompanyCamGallery: React.FC<CompanyCamGalleryProps> = ({
  initialCategory = "All",
  initialLocation = "All Areas",
  className,
  showFilter = true,
  showLocationFilter = true,
  gridClassName,
  fallbackImages = [],
}) => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(initialCategory);
  const [activeLocation, setActiveLocation] = useState<LocationArea>(initialLocation);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rawPhotos, setRawPhotos] = useState<GalleryPhoto[]>([]);

  // Fetch photos from CompanyCam API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/companycam/photos');

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: PhotosApiResponse = await response.json();

        if (data.photos && data.photos.length > 0) {
          setRawPhotos(data.photos);
          const transformedImages = transformPhotosToProjectImages(data.photos);
          setImages(transformedImages);
        } else {
          // No photos from API, use fallback
          setImages(fallbackImages);
        }
      } catch (err) {
        console.error('Failed to fetch CompanyCam photos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load photos');
        // Use fallback images on error
        setImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [fallbackImages]);

  // Filter images based on selected category and location
  const filteredImages = useMemo(() => {
    let filtered = images;

    // Filter by service category
    if (activeCategory !== "All") {
      filtered = filtered.filter(image =>
        image.serviceTypes.includes(activeCategory)
      );
    }

    // Filter by location area
    if (activeLocation !== "All Areas") {
      filtered = filtered.filter(image =>
        image.locationArea === activeLocation
      );
    }

    return filtered;
  }, [images, activeCategory, activeLocation]);

  // Calculate project counts for each category from raw photos
  const projectCounts = useMemo(() => {
    if (rawPhotos.length > 0) {
      return calculateCategoryCounts(rawPhotos);
    }

    // Fallback calculation from transformed images
    const counts: Record<string, number> = { "All": images.length };

    images.forEach(image => {
      image.serviceTypes.forEach(serviceType => {
        counts[serviceType] = (counts[serviceType] || 0) + 1;
      });
    });

    return counts;
  }, [rawPhotos, images]);

  // Calculate location counts from raw photos
  const locationCounts = useMemo(() => {
    if (rawPhotos.length > 0) {
      return calculateLocationCounts(rawPhotos);
    }

    // Fallback calculation from transformed images
    const counts: Record<string, number> = { "All Areas": images.length };

    images.forEach(image => {
      if (image.locationArea && image.locationArea !== "All Areas") {
        counts[image.locationArea] = (counts[image.locationArea] || 0) + 1;
      }
    });

    return counts;
  }, [rawPhotos, images]);

  const handleImageClick = (image: ProjectImage) => {
    const index = filteredImages.findIndex(img => img.id === image.id);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxNext = () => {
    setCurrentImageIndex((prev) =>
      prev < filteredImages.length - 1 ? prev + 1 : prev
    );
  };

  const handleLightboxPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : prev
    );
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-burgundy mx-auto mb-4"></div>
            <p className="text-gray-600">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with fallback
  if (error && images.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg
              className="w-16 h-16 mx-auto text-red-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Unable to load gallery
            </h3>
            <p className="text-gray-600">
              {error}. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Service Type Filter */}
      {showFilter && (
        <GalleryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          projectCounts={projectCounts}
          className="mb-4"
        />
      )}

      {/* Location Filter */}
      {showLocationFilter && (
        <LocationFilter
          activeLocation={activeLocation}
          onLocationChange={setActiveLocation}
          locationCounts={locationCounts}
          className="mb-8"
        />
      )}

      {/* Grid */}
      <GalleryGrid
        images={filteredImages}
        onImageClick={handleImageClick}
        className={gridClassName}
      />

      {/* Lightbox */}
      <GalleryLightbox
        images={filteredImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={handleLightboxClose}
        onNext={handleLightboxNext}
        onPrevious={handleLightboxPrevious}
        onImageChange={handleImageChange}
      />

      {/* No results message */}
      {filteredImages.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600">
              No projects match the selected category. Try selecting a different filter.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export { CompanyCamGallery };
