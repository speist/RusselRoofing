"use client";

import React from "react";
import { ProjectImage } from "@/types/gallery";
import { LazyImage } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface GalleryGridProps {
  images: ProjectImage[];
  onImageClick: (image: ProjectImage) => void;
  className?: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  onImageClick,
  className
}) => {
  return (
    <div
      className={cn(
        // Masonry grid layout per dev notes specifications
        "grid gap-4 auto-rows-[200px]",
        "grid-cols-[repeat(auto-fit,minmax(300px,1fr))]",
        "[grid-auto-flow:dense]",
        // Responsive breakpoints with proper gaps
        "md:gap-6 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))]",
        className
      )}
    >
      {images.map((image, index) => {
        // Calculate grid row span based on aspect ratio for masonry effect
        const getRowSpan = (aspectRatio: number) => {
          // Taller images get more rows for better masonry layout
          if (aspectRatio > 1.8) return "row-span-1"; // Very wide images
          if (aspectRatio > 1.3) return "row-span-1"; // Wide images  
          if (aspectRatio > 0.8) return "row-span-2"; // Square-ish images
          return "row-span-3"; // Tall/portrait images
        };

        const rowSpan = getRowSpan(image.aspectRatio);

        return (
          <div
            key={image.id}
            className={cn(
              "group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
              "bg-white rounded-lg overflow-hidden",
              rowSpan
            )}
            onClick={() => onImageClick(image)}
          >
            <div className="relative h-full">
              <LazyImage
                src={image.src}
                alt={image.alt}
                thumbnailSrc={image.thumbnailSrc}
                blurDataUrl={image.blurDataUrl}
                aspectRatio={image.aspectRatio}
                className="h-full"
              />
              
              {/* Overlay - Dark overlay as per dev notes (rgba(0,0,0,0.7)) */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300">
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-semibold text-sm mb-1 truncate">
                    {image.projectTitle}
                  </h3>
                  <p className="text-white text-xs opacity-90 mb-2 line-clamp-2">
                    {image.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {image.serviceTypes.map((service) => (
                      <span
                        key={service}
                        className="px-2 py-1 bg-primary-burgundy text-white text-xs rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white bg-opacity-90 rounded-full p-2">
                  <svg
                    className="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { GalleryGrid };