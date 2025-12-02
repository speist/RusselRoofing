"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SERVICE_SLUG_TO_TAGS, getGalleryCategory } from "@/lib/companycam/photos";
import type { GalleryPhoto } from "@/lib/companycam/types";

interface ServiceGalleryProps {
  serviceSlug: string;
  serviceTitle: string;
}

// Gallery image structure
interface GalleryImage {
  src: string;
  thumbnail: string;
  alt: string;
  title: string;
  date?: string;
  location?: string;
}

// Static fallback gallery data
const getStaticFallbackImages = (serviceSlug: string): GalleryImage[] => {
  const galleryMapping: Record<string, string> = {
    "roofing": "roofing",
    "siding-and-gutters": "siding",
    "windows": "windows",
    "commercial": "commercial",
    "churches-and-institutions": "churches-and-institutions",
    "historical-restorations": "historical-restoration",
    "masonry": "masonry",
    "skylights": "skylights"
  };

  const category = galleryMapping[serviceSlug] || serviceSlug;

  const fallbackImages: Record<string, GalleryImage[]> = {
    roofing: [
      { src: "/images/gallery/roofing/full/roofing-01.jpg", thumbnail: "/images/gallery/roofing/thumbnails/roofing-01-thumb.jpg", alt: "Roofing project showcase", title: "Professional Roofing Installation" },
      { src: "/images/gallery/roofing/full/roofing-03.jpg", thumbnail: "/images/gallery/roofing/thumbnails/roofing-03-thumb.jpg", alt: "Roofing project showcase", title: "Quality Roof Replacement" },
      { src: "/images/gallery/roofing/full/roofing-04.jpg", thumbnail: "/images/gallery/roofing/thumbnails/roofing-04-thumb.jpg", alt: "Roofing project showcase", title: "Expert Roof Installation" },
    ],
    siding: [
      { src: "/images/gallery/siding/full/siding01.jpg", thumbnail: "/images/gallery/siding/thumbnails/siding01-thumb.jpg", alt: "Siding project showcase", title: "Professional Siding Installation" },
      { src: "/images/gallery/siding/full/siding02.jpg", thumbnail: "/images/gallery/siding/thumbnails/siding02-thumb.jpg", alt: "Siding project showcase", title: "Quality Siding Replacement" },
      { src: "/images/gallery/siding/full/siding03.jpeg", thumbnail: "/images/gallery/siding/thumbnails/siding03-thumb.jpeg", alt: "Siding project showcase", title: "Expert Siding Work" },
    ],
    commercial: [
      { src: "/images/gallery/commercial/full/commercial01.jpeg", thumbnail: "/images/gallery/commercial/thumbnails/commercial01-thumb.jpeg", alt: "Commercial project showcase", title: "Commercial Roofing Project" },
      { src: "/images/gallery/commercial/full/commercial02.jpeg", thumbnail: "/images/gallery/commercial/thumbnails/commercial02-thumb.jpeg", alt: "Commercial project showcase", title: "Large-Scale Commercial Work" },
      { src: "/images/gallery/commercial/full/commercial03.jpeg", thumbnail: "/images/gallery/commercial/thumbnails/commercial03-thumb.jpeg", alt: "Commercial project showcase", title: "Business Property Services" },
    ],
    windows: [
      { src: "/images/gallery/windows/full/windows-01.jpeg", thumbnail: "/images/gallery/windows/thumbnails/windows-01-thumb.jpeg", alt: "Window installation showcase", title: "Professional Window Installation" },
      { src: "/images/gallery/windows/full/windows-02.jpeg", thumbnail: "/images/gallery/windows/thumbnails/windows-02-thumb.jpeg", alt: "Window installation showcase", title: "Quality Window Replacement" },
      { src: "/images/gallery/windows/full/windows-03.jpeg", thumbnail: "/images/gallery/windows/thumbnails/windows-03-thumb.jpeg", alt: "Window installation showcase", title: "Expert Window Services" },
    ],
    "churches-and-institutions": [
      { src: "/images/gallery/churches-and-institutions/full/church-institutions-01.jpeg", thumbnail: "/images/gallery/churches-and-institutions/thumbnails/church-institutions-01-thumb.jpeg", alt: "Church and institutional project", title: "Religious Building Services" },
      { src: "/images/gallery/churches-and-institutions/full/church-institutions-02.jpeg", thumbnail: "/images/gallery/churches-and-institutions/thumbnails/church-institutions-02-thumb.jpeg", alt: "Church and institutional project", title: "Institutional Roofing Work" },
      { src: "/images/gallery/churches-and-institutions/full/church-institutions-03.jpeg", thumbnail: "/images/gallery/churches-and-institutions/thumbnails/church-institutions-03-thumb.jpeg", alt: "Church and institutional project", title: "Historic Church Restoration" },
    ],
    "historical-restoration": [
      { src: "/images/gallery/historical-restoration/full/historical-restoration-01.jpeg", thumbnail: "/images/gallery/historical-restoration/thumbnails/historical-restoration-01-thumb.jpeg", alt: "Historical restoration project", title: "Historic Building Restoration" },
      { src: "/images/gallery/historical-restoration/full/historical-restoration-02.jpeg", thumbnail: "/images/gallery/historical-restoration/thumbnails/historical-restoration-02-thumb.jpeg", alt: "Historical restoration project", title: "Heritage Property Services" },
      { src: "/images/gallery/historical-restoration/full/historical-restoration-03.jpeg", thumbnail: "/images/gallery/historical-restoration/thumbnails/historical-restoration-03-thumb.jpeg", alt: "Historical restoration project", title: "Period Building Restoration" },
    ],
    masonry: [
      { src: "/images/gallery/masonry/full/masonry-01.jpeg", thumbnail: "/images/gallery/masonry/thumbnails/masonry-01-thumb.jpeg", alt: "Masonry project showcase", title: "Professional Masonry Work" },
      { src: "/images/gallery/masonry/full/masonry-02.jpeg", thumbnail: "/images/gallery/masonry/thumbnails/masonry-02-thumb.jpeg", alt: "Masonry project showcase", title: "Expert Brick and Stone Work" },
      { src: "/images/gallery/masonry/full/masonry-03.jpeg", thumbnail: "/images/gallery/masonry/thumbnails/masonry-03-thumb.jpeg", alt: "Masonry project showcase", title: "Chimney and Masonry Services" },
    ],
    skylights: [
      { src: "/images/gallery/skylights/full/windows-skylight-01.jpeg", thumbnail: "/images/gallery/skylights/thumbnails/windows-skylight-01-thumb.jpeg", alt: "Skylight installation showcase", title: "Professional Skylight Installation" },
      { src: "/images/gallery/skylights/full/windows-skylight-02.jpeg", thumbnail: "/images/gallery/skylights/thumbnails/windows-skylight-02-thumb.jpeg", alt: "Skylight installation showcase", title: "Quality Skylight Services" },
      { src: "/images/gallery/skylights/full/windows-skylight-03.jpeg", thumbnail: "/images/gallery/skylights/thumbnails/windows-skylight-03-thumb.jpeg", alt: "Skylight installation showcase", title: "Expert Skylight Work" },
    ]
  };

  return fallbackImages[category] || [];
};

// Transform CompanyCam photo to GalleryImage format
const transformCompanyCamPhoto = (photo: GalleryPhoto, serviceTitle: string): GalleryImage => {
  const category = getGalleryCategory(photo.tags);
  const title = category ? `${category} Project` : `${serviceTitle} Project`;

  // Format date if available
  let date: string | undefined;
  if (photo.capturedAt) {
    const timestamp = parseInt(photo.capturedAt, 10);
    if (!isNaN(timestamp)) {
      const dateObj = new Date(timestamp * 1000);
      date = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
  }

  // Format location
  let location: string | undefined;
  if (photo.location && photo.location.lat !== 0 && photo.location.lon !== 0) {
    location = 'Greater Philadelphia Area';
  }

  return {
    src: photo.url,
    thumbnail: photo.thumbnailUrl || photo.url,
    alt: `${serviceTitle} project by Russell Roofing`,
    title,
    date,
    location,
  };
};

export default function ServiceGallery({ serviceSlug, serviceTitle }: ServiceGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const imagesPerView = 3;

  // Fetch photos from CompanyCam API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the tags for this service
        const serviceTags = SERVICE_SLUG_TO_TAGS[serviceSlug];

        if (!serviceTags || serviceTags.length === 0) {
          // No tag mapping, use fallback
          setImages(getStaticFallbackImages(serviceSlug));
          setIsLoading(false);
          return;
        }

        // Fetch photos filtered by the first tag for this service
        const response = await fetch(`/api/companycam/photos?serviceTag=${encodeURIComponent(serviceTags[0])}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
          // Filter photos that match ANY of the service tags
          const matchingPhotos = data.photos.filter((photo: GalleryPhoto) =>
            photo.tags.some((tag: string) =>
              serviceTags.some((serviceTag: string) =>
                tag.toLowerCase() === serviceTag.toLowerCase()
              )
            )
          );

          if (matchingPhotos.length > 0) {
            // Transform to GalleryImage format
            const transformedImages = matchingPhotos.map((photo: GalleryPhoto) =>
              transformCompanyCamPhoto(photo, serviceTitle)
            );
            setImages(transformedImages);
          } else {
            // No matching photos, use fallback
            setImages(getStaticFallbackImages(serviceSlug));
          }
        } else {
          // No photos from API, use fallback
          setImages(getStaticFallbackImages(serviceSlug));
        }
      } catch (err) {
        console.error('Failed to fetch CompanyCam photos:', err);
        // Use fallback images on error
        setImages(getStaticFallbackImages(serviceSlug));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [serviceSlug, serviceTitle]);

  // Navigation functions
  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(images.length - imagesPerView, prev + 1));
  };

  // Get visible images based on current index
  const visibleImages = images.slice(currentIndex, currentIndex + imagesPerView);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < images.length - imagesPerView;

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Gallery Unavailable</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg animate-pulse" style={{ aspectRatio: '16/12' }}></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our {serviceTitle} Portfolio
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our recent projects to see the quality of our workmanship
          </p>
        </div>

        {/* Gallery Carousel */}
        <div className="relative">
          {/* Previous Arrow */}
          {canGoPrevious && (
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Previous images"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleImages.map((image, index) => (
              <button
                key={currentIndex + index}
                onClick={() => setSelectedImage(image)}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <Image
                    src={image.thumbnail || image.src}
                    alt={image.alt}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                    {image.location && (
                      <p className="text-sm text-gray-200">{image.location}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Next Arrow */}
          {canGoNext && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Next images"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Image Counter */}
        {images.length > imagesPerView && (
          <div className="text-center mt-6 text-gray-600">
            Showing {currentIndex + 1}-{Math.min(currentIndex + imagesPerView, images.length)} of {images.length} images
          </div>
        )}

        {/* View More Button */}
        <div className="mt-12 text-center">
          <a
            href="/gallery"
            className="inline-flex items-center px-6 py-3 border-2 border-primary-burgundy text-primary-burgundy rounded-lg font-semibold hover:bg-primary-burgundy hover:text-white transition-colors duration-200"
          >
            View Full Gallery
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              aria-label="Close lightbox"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/0 p-6 text-white">
              <h3 className="text-2xl font-semibold mb-2">{selectedImage.title}</h3>
              <div className="flex items-center gap-4 text-sm">
                {selectedImage.location && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedImage.location}
                  </span>
                )}
                {selectedImage.date && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {selectedImage.date}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}