"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryPhoto } from "@/lib/companycam/types";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

interface PhotosApiResponse {
  photos: GalleryPhoto[];
  total: number;
  page: number;
  pageSize: number;
  error?: string;
}

export default function ProjectOfTheMonth() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

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
          // Filter for Before/After photos only, then sort with Before photos first
          const beforeAfterPhotos = data.photos
            .filter(photo => photo.isBeforePhoto || photo.isAfterPhoto)
            .sort((a, b) => {
              // Before photos come first
              if (a.isBeforePhoto && !b.isBeforePhoto) return -1;
              if (!a.isBeforePhoto && b.isBeforePhoto) return 1;
              return 0;
            });
          setPhotos(beforeAfterPhotos);
        }
      } catch (err) {
        console.error('Failed to fetch Project of the Month photos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load photos');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxClose = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const handleLightboxNext = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev < photos.length - 1 ? prev + 1 : 0
    );
  }, [photos.length]);

  const handleLightboxPrevious = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : photos.length - 1
    );
  }, [photos.length]);

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      if (e.key === 'Escape') {
        handleLightboxClose();
      } else if (e.key === 'ArrowRight') {
        handleLightboxNext();
      } else if (e.key === 'ArrowLeft') {
        handleLightboxPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handleLightboxClose, handleLightboxNext, handleLightboxPrevious]);

  // Loading state
  if (loading) {
    return (
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey mb-4">
              Project of the <span className="text-primary-red">Month</span>
            </h2>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-red"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state or no photos
  if (error || photos.length === 0) {
    return (
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey mb-4">
              Project of the <span className="text-primary-red">Month</span>
            </h2>
            <p className="font-inter text-lg text-gray-600 max-w-4xl mx-auto">
              Check back soon for our featured before and after transformations.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Determine if we need a slider (more than 4 photos)
  const useSlider = photos.length > 4;

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey mb-4">
            Project of the <span className="text-primary-red">Month</span>
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-4xl mx-auto">
            See the dramatic transformations we deliver for our clients with our before and after project showcase.
          </p>
        </div>

        {useSlider ? (
          /* Slider for more than 4 photos */
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              ref={prevRef}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-light-grey hover:bg-gray-300 transition-colors shadow-md"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-dark-grey" />
            </button>
            <button
              ref={nextRef}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-light-grey hover:bg-gray-300 transition-colors shadow-md"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-dark-grey" />
            </button>

            {/* Photos Swiper */}
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper: any) => {
                if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              spaceBetween={15}
              slidesPerView={2}
              loop={true}
              breakpoints={{
                640: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
              }}
              className="project-of-month-swiper py-8"
            >
              {photos.map((photo, index) => (
                <SwiperSlide key={photo.id}>
                  <button
                    onClick={() => handleImageClick(index)}
                    className="block w-full group cursor-pointer"
                  >
                    <div className="relative bg-white rounded-lg border border-gray-200 hover:border-primary-red hover:shadow-lg transition-all duration-300 overflow-hidden aspect-square">
                      <Image
                        src={photo.url}
                        alt={photo.isBeforePhoto ? "Before transformation" : "After transformation"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                      {/* Before/After Badge */}
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold text-white ${
                        photo.isBeforePhoto ? 'bg-gray-700' : 'bg-primary-red'
                      }`}>
                        {photo.isBeforePhoto ? 'Before' : 'After'}
                      </div>
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          /* Centered Grid for 4 or fewer photos */
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => handleImageClick(index)}
                className="block group cursor-pointer"
              >
                <div className="relative bg-white rounded-lg border border-gray-200 hover:border-primary-red hover:shadow-lg transition-all duration-300 overflow-hidden w-40 h-40 md:w-52 md:h-52">
                  <Image
                    src={photo.url}
                    alt={photo.isBeforePhoto ? "Before transformation" : "After transformation"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 160px, 208px"
                  />
                  {/* Before/After Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold text-white ${
                    photo.isBeforePhoto ? 'bg-gray-700' : 'bg-primary-red'
                  }`}>
                    {photo.isBeforePhoto ? 'Before' : 'After'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && photos[currentImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={handleLightboxClose}
        >
          {/* Close button */}
          <button
            onClick={handleLightboxClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLightboxPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLightboxNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[currentImageIndex].url}
              alt={photos[currentImageIndex].isBeforePhoto ? "Before transformation" : "After transformation"}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Before/After Badge in Lightbox */}
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-semibold text-white ${
            photos[currentImageIndex].isBeforePhoto ? 'bg-gray-700' : 'bg-primary-red'
          }`}>
            {photos[currentImageIndex].isBeforePhoto ? 'Before' : 'After'}
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 text-white/70 text-sm">
            {currentImageIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </section>
  );
}
