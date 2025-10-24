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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="!p-0 !max-w-none !w-screen !h-screen !m-0 !rounded-none bg-black !overflow-hidden"
    >
      <div className="relative w-full h-full flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 disabled:opacity-30"
              disabled={currentIndex === 0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200 disabled:opacity-30"
              disabled={currentIndex === images.length - 1}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Main image - centered with proper spacing for bottom UI */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 pb-48">
          <div
            className="relative max-w-[95vw] max-h-[calc(100vh-250px)] flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Loading spinner */}
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
              </div>
            )}

            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className={cn(
                "max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300",
                isImageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={handleImageLoad}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        </div>

        {/* Image info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <div className="max-w-4xl mx-auto text-white">
            <h3 className="text-xl font-semibold mb-2">{currentImage.projectTitle}</h3>
            <p className="text-gray-300 mb-3">{currentImage.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {currentImage.location && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{currentImage.location}</span>
                </div>
              )}
              
              {currentImage.completedDate && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(currentImage.completedDate).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="flex gap-2">
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

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-24 left-0 right-0 px-6">
            <div className="flex gap-2 justify-center overflow-x-auto max-w-full">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => onImageChange(index)}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
                    index === currentIndex
                      ? "border-white scale-110"
                      : "border-transparent opacity-60 hover:opacity-80"
                  )}
                >
                  <img
                    src={image.thumbnailSrc}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export { GalleryLightbox };