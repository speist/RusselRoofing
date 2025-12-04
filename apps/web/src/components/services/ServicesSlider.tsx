"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

const services = [
  "Roofing",
  "Siding and Gutters",
  "Commercial",
  "Churches & Institutions",
  "Historical Restoration",
  "Masonry",
  "Windows",
  "Skylights",
];

const serviceSlugMap: Record<string, string> = {
  "Roofing": "roofing",
  "Siding and Gutters": "siding-and-gutters",
  "Commercial": "commercial",
  "Churches & Institutions": "churches-institutions",
  "Historical Restoration": "historical-restoration",
  "Masonry": "masonry",
  "Windows": "windows",
  "Skylights": "skylights",
};

const serviceImageMap: Record<string, string> = {
  "Roofing": "/images/services/service cards/roofing-card.jpg",
  "Siding and Gutters": "/images/services/service cards/siding-gutters-card.jpg",
  "Commercial": "/images/services/service cards/commercial-card.jpg",
  "Churches & Institutions": "/images/services/service cards/church-institutions-card.jpg",
  "Historical Restoration": "/images/services/service cards/historical-restoration-card.jpg",
  "Masonry": "/images/services/service cards/masonry-card.jpg",
  "Windows": "/images/services/service cards/windows-card.jpg",
  "Skylights": "/images/services/service cards/skylight-card.jpg",
};

interface ServicesSliderProps {
  title?: string;
  className?: string;
}

export function ServicesSlider({ title = "Our Services", className = "" }: ServicesSliderProps) {
  return (
    <section className={`py-12 md:py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey text-center mb-8 md:mb-12">
            {title}
          </h2>
        )}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            className="services-slider-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-light-grey hover:bg-gray-300 transition-colors shadow-md"
            aria-label="Previous service"
          >
            <ChevronLeft className="w-6 h-6 text-dark-grey" />
          </button>
          <button
            className="services-slider-next absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-light-grey hover:bg-gray-300 transition-colors shadow-md"
            aria-label="Next service"
          >
            <ChevronRight className="w-6 h-6 text-dark-grey" />
          </button>

          {/* Services Swiper */}
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".services-slider-prev",
              nextEl: ".services-slider-next",
            }}
            spaceBetween={20}
            slidesPerView={1.5}
            centeredSlides={true}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            className="services-swiper px-8"
          >
            {services.map((service) => (
              <SwiperSlide key={service}>
                {({ isActive }) => (
                  <div
                    className={`text-center transition-transform duration-300 ${
                      isActive ? "transform scale-110" : "transform scale-100"
                    }`}
                  >
                    <Link href={`/services/${serviceSlugMap[service]}`}>
                      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                        <Image
                          src={serviceImageMap[service]}
                          alt={`${service} services`}
                          width={200}
                          height={150}
                          className="rounded-lg mb-4 mx-auto w-full h-32 object-cover"
                        />
                        <h3 className="font-inter font-semibold text-dark-grey text-lg">{service}</h3>
                      </div>
                    </Link>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
