"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ServiceGalleryProps {
  serviceSlug: string;
  serviceTitle: string;
}

// Gallery image structure based on Story 5.5
interface GalleryImage {
  src: string;
  thumbnail: string;
  alt: string;
  title: string;
  date?: string;
  location?: string;
}

// Temporary gallery data - will be connected to actual gallery structure from Story 5.5
const getServiceGalleryImages = (serviceSlug: string): GalleryImage[] => {
  // Map service slugs to gallery categories
  const galleryMapping: Record<string, string> = {
    "roofing": "roofing",
    "siding": "siding",
    "gutters": "gutters",
    "windows": "windows",
    "chimneys": "chimneys",
    "commercial": "commercial",
    "storm-damage": "roofing", // Storm damage often shows roofing work
    "maintenance": "various"
  };

  const category = galleryMapping[serviceSlug] || serviceSlug;

  // Return sample images for now - to be replaced with actual gallery integration
  const sampleImages: Record<string, GalleryImage[]> = {
    roofing: [
      {
        src: "/images/gallery/roofing/full/roofing-complete-replacement-westfield-2024-01-15.jpg",
        thumbnail: "/images/gallery/roofing/thumbs/roofing-complete-replacement-westfield-2024-01-15-thumb.jpg",
        alt: "Complete roof replacement in Westfield",
        title: "Complete Roof Replacement",
        date: "January 2024",
        location: "Westfield, NJ"
      },
      {
        src: "/images/gallery/roofing/full/roofing-slate-restoration-chatham-2023-10-28.jpg",
        thumbnail: "/images/gallery/roofing/thumbs/roofing-slate-restoration-chatham-2023-10-28-thumb.jpg",
        alt: "Slate roof restoration in Chatham",
        title: "Slate Roof Restoration",
        date: "October 2023",
        location: "Chatham, NJ"
      },
      {
        src: "/images/gallery/roofing/full/roofing-flat-commercial-newark-2023-11-15.jpg",
        thumbnail: "/images/gallery/roofing/thumbs/roofing-flat-commercial-newark-2023-11-15-thumb.jpg",
        alt: "Commercial flat roof installation",
        title: "Commercial Flat Roof",
        date: "November 2023",
        location: "Newark, NJ"
      }
    ],
    siding: [
      {
        src: "/images/gallery/siding/full/siding-colonial-renovation-princeton-2023-12-08.jpg",
        thumbnail: "/images/gallery/siding/thumbs/siding-colonial-renovation-princeton-2023-12-08-thumb.jpg",
        alt: "Colonial home siding renovation",
        title: "Colonial Home Renovation",
        date: "December 2023",
        location: "Princeton, NJ"
      },
      {
        src: "/images/gallery/siding/full/siding-mixed-material-contemporary-short-hills-2024-01-10.jpg",
        thumbnail: "/images/gallery/siding/thumbs/siding-mixed-material-contemporary-short-hills-2024-01-10-thumb.jpg",
        alt: "Mixed material siding on contemporary home",
        title: "Contemporary Mixed Materials",
        date: "January 2024",
        location: "Short Hills, NJ"
      }
    ],
    gutters: [
      {
        src: "/images/gallery/gutters/full/gutters-seamless-installation-summit-2024-01-22.jpg",
        thumbnail: "/images/gallery/gutters/thumbs/gutters-seamless-installation-summit-2024-01-22-thumb.jpg",
        alt: "Seamless gutter installation",
        title: "Seamless Gutter Installation",
        date: "January 2024",
        location: "Summit, NJ"
      }
    ]
  };

  return sampleImages[category] || [];
};

export default function ServiceGallery({ serviceSlug, serviceTitle }: ServiceGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const images = getServiceGalleryImages(serviceSlug);

  // Simulate loading state for gallery initialization
  React.useEffect(() => {
    try {
      // Simulate async operation
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    } catch (err) {
      setError('Failed to load gallery images');
      setIsLoading(false);
    }
  }, [serviceSlug]);

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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <button
              key={index}
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