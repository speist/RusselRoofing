"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

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
    name: "Main Line Chamber of Commerce",
    image: "/images/associations/main-line-chamber-logo.png",
    link: "https://www.mlcc.org/",
  },
  {
    name: "Montgomery County Chamber of Commerce",
    image: "/images/associations/montgomery-county-chamber-logo.png",
    link: "https://www.montgomerycountychamber.org/",
  },
  {
    name: "BNI - Business Networking International (Jenkintown)",
    image: "/images/associations/bni-logo.png",
    link: "https://www.bni.com/",
  },
  {
    name: "Philadelphia Historical Society",
    image: "/images/associations/philadelphia-historical-society-logo.png",
    link: "https://www.philahistory.org/",
  },
  {
    name: "Preservation Alliance of Greater Philadelphia",
    image: "/images/associations/preservation-alliance-logo.png",
    link: "https://www.preservationalliance.com/",
  },
  {
    name: "Rock Ministry",
    image: "/images/associations/rock-ministry-logo.png",
    link: "https://www.rockministries.org/",
  },
];

export default function AssociationsSlider() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

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

        {/* Slider */}
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

          {/* Associations Swiper */}
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
              1024: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}
            className="associations-swiper py-8"
          >
            {associations.map((association, index) => (
              <SwiperSlide key={index}>
                <Link
                  href={association.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary-red hover:shadow-lg transition-all duration-300 aspect-square flex items-center justify-center">
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
