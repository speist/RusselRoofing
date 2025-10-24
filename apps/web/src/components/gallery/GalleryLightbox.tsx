"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ProjectImage } from "@/types/gallery";
import { Modal } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface GalleryLightboxProps {
  images: ProjectImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onImageChange: (index: number) => void;
}

const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onImageChange
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentImage = images[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          onPrevious();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, onNext, onPrevious, onClose]);

  // Reset image loaded state when image changes
  useEffect(() => {
    setIsImageLoaded(false);
  }, [currentIndex]);

  // Touch gesture handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrevious();
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  if (!currentImage) return null;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Close lightbox"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-30"
              disabled={currentIndex === 0}
              aria-label="Previous image"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-30"
              disabled={currentIndex === images.length - 1}
              aria-label="Next image"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Loading spinner */}
        {!isImageLoaded && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
          </div>
        )}

        {/* Main image */}
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className={cn(
            "w-full h-auto max-h-[80vh] object-contain transition-opacity duration-300",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleImageLoad}
        />

        {/* Image info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 p-6 text-white">
          <h3 className="text-2xl font-semibold mb-2">{currentImage.projectTitle}</h3>
          <p className="text-gray-300 mb-3">{currentImage.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {currentImage.location && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {currentImage.location}
              </span>
            )}

            {currentImage.completedDate && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(currentImage.completedDate).toLocaleDateString()}
              </span>
            )}

            {images.length > 1 && (
              <span className="ml-auto">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            {currentImage.serviceTypes.map((service) => (
              <span
                key={service}
                className="px-3 py-1 bg-primary-burgundy text-white text-xs rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { GalleryLightbox };