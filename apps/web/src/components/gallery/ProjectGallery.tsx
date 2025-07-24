"use client";

import React, { useState, useMemo } from "react";
import { ProjectImage, ServiceCategory } from "@/types/gallery";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryFilter } from "./GalleryFilter";
import { GalleryLightbox } from "./GalleryLightbox";
import { cn } from "@/lib/utils";

export interface ProjectGalleryProps {
  images: ProjectImage[];
  initialCategory?: ServiceCategory;
  className?: string;
  showFilter?: boolean;
  gridClassName?: string;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  images,
  initialCategory = "All",
  className,
  showFilter = true,
  gridClassName
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(initialCategory);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter images based on selected category
  const filteredImages = useMemo(() => {
    if (activeCategory === "All") {
      return images;
    }
    return images.filter(image => 
      image.serviceTypes.includes(activeCategory)
    );
  }, [images, activeCategory]);

  // Calculate project counts for each category
  const projectCounts = useMemo(() => {
    const counts: Record<string, number> = { "All": images.length };
    
    images.forEach(image => {
      image.serviceTypes.forEach(serviceType => {
        counts[serviceType] = (counts[serviceType] || 0) + 1;
      });
    });
    
    return counts;
  }, [images]);

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

  return (
    <div className={cn("w-full", className)}>
      {/* Filter */}
      {showFilter && (
        <GalleryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          projectCounts={projectCounts}
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
      {filteredImages.length === 0 && (
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

export { ProjectGallery };