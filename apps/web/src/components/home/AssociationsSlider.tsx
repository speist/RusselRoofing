"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Association {
  name: string;
  image: string;
  link: string;
}

const associations: Association[] = [
  {
    name: "NRCA - National Roofing Contractors Association",
    image: "/images/associations/nrca-logo.png",
    link: "https://www.nrca.net/",
  },
  {
    name: "GAF President's Club",
    image: "/images/associations/gaf-presidents-club-logo.png",
    link: "https://www.gaf.com/",
  },
  {
    name: "Certainteed Advisory Council",
    image: "/images/associations/certainteed-advisory-council-logo.png",
    link: "https://www.certainteed.com/",
  },
  {
    name: "Montgomery County Chamber of Commerce",
    image: "/images/associations/montgomery-county-chamber-logo.png",
    link: "https://www.montgomerycountychamber.org/",
  },
];

export default function AssociationsSlider() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey mb-4">
            Our <span className="text-primary-red">Associations</span>
          </h2>
          <p className="font-inter text-lg text-gray-600 max-w-4xl mx-auto">
            We&apos;re proud members of leading industry organizations and community groups,
            committed to excellence, professional standards, and giving back to the communities we serve.
          </p>
        </div>

        {/* Centered Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {associations.map((association, index) => (
            <Link
              key={index}
              href={association.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary-red hover:shadow-lg transition-all duration-300 w-36 h-36 md:w-44 md:h-44 flex items-center justify-center">
                <Image
                  src={association.image}
                  alt={association.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                  onError={(e) => {
                    // Fallback to placeholder if image not found
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg?height=200&width=200';
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
