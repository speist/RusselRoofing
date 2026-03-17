"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const galleryImages = [
  {
    src: "/images/gallery/roofing/thumbnails/roofing-01-thumb.jpg",
    fullSrc: "/images/gallery/roofing/full/roofing-01.jpg",
    alt: "Professional residential roofing project by Russell Roofing",
    title: "Residential Roofing",
  },
  {
    src: "/images/gallery/historical-restoration/thumbnails/historical-restoration-01-thumb.jpeg",
    fullSrc: "/images/gallery/historical-restoration/full/historical-restoration-01.jpeg",
    alt: "Historic building restoration by Russell Roofing",
    title: "Historic Restoration",
  },
  {
    src: "/images/gallery/commercial/thumbnails/commercial01-thumb.jpeg",
    fullSrc: "/images/gallery/commercial/full/commercial01.jpeg",
    alt: "Commercial roofing project by Russell Roofing",
    title: "Commercial Roofing",
  },
];

export default function AboutGallery() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Work Speaks for Itself
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            With over 34 years of experience, we take pride in every project — from residential homes to historic landmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <Link
              key={index}
              href="/gallery"
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="h-[250px] w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300">
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-semibold text-sm">
                    {image.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center px-6 py-3 border-2 border-primary-burgundy text-primary-burgundy rounded-lg font-semibold hover:bg-primary-burgundy hover:text-white transition-colors duration-200"
          >
            View Full Gallery
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
