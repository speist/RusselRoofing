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

interface MaterialPartner {
  name: string;
  image: string;
  link: string;
}

const materialPartners: MaterialPartner[] = [
  {
    name: "Air Vent Inc",
    image: "/images/about/qualitymaterialsslider/airvent-300x150-1.png",
    link: "https://www.airvent.com/",
  },
  {
    name: "Owens Corning AttiCat",
    image: "/images/about/qualitymaterialsslider/atticat-300x150-1.png",
    link: "https://www.owenscorning.com/",
  },
  {
    name: "CertainTeed",
    image: "/images/about/qualitymaterialsslider/certainteed-400x200-300x150-1.png",
    link: "https://www.certainteed.com/",
  },
  {
    name: "DaVinci Roofscapes",
    image: "/images/about/qualitymaterialsslider/Davinci-logo.png",
    link: "https://www.davinciroofscapes.com/",
  },
  {
    name: "GAF",
    image: "/images/about/qualitymaterialsslider/gaf-300x150-1.png",
    link: "https://www.gaf.com/",
  },
  {
    name: "GAF Master Elite",
    image: "/images/about/qualitymaterialsslider/gafmasterelite-400x200-300x150-1.png",
    link: "https://www.gaf.com/",
  },
  {
    name: "James Hardie",
    image: "/images/about/qualitymaterialsslider/JamesHardie_Logo.jpg",
    link: "https://www.jameshardie.com/",
  },
  {
    name: "Owens Corning",
    image: "/images/about/qualitymaterialsslider/owenscorning-300x150-1.png",
    link: "https://www.owenscorning.com/",
  },
  {
    name: "Pella",
    image: "/images/about/qualitymaterialsslider/pella-400x200-300x150-1.png",
    link: "https://www.pella.com/",
  },
  {
    name: "Revere Copper",
    image: "/images/about/qualitymaterialsslider/Revere-copper-logo.png",
    link: "https://www.reverecopper.com/",
  },
  {
    name: "GAF Select Shingle",
    image: "/images/about/qualitymaterialsslider/selectshingle-400x200-300x150-1.png",
    link: "https://www.gaf.com/",
  },
  {
    name: "Velux",
    image: "/images/about/qualitymaterialsslider/Velux-logo.png",
    link: "https://www.veluxusa.com/",
  },
  {
    name: "Versico",
    image: "/images/about/qualitymaterialsslider/Versico_Logo.png",
    link: "https://www.versico.com/",
  },
  {
    name: "Viwinco",
    image: "/images/about/qualitymaterialsslider/Viwinco-logo.png",
    link: "https://www.viwinco.com/",
  },
  {
    name: "Zambelli Gutters",
    image: "/images/about/qualitymaterialsslider/Zambelli-Gutters-logo.jpg",
    link: "https://www.zambelligutters.com/",
  },
];

export default function QualityMaterialsSlider() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="pt-4 pb-12 md:pt-6 md:pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-charcoal mb-4">
            Quality Materials
            <br />
            <span className="text-primary-burgundy">Plus Quality Craftsmanship</span>
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-4xl mx-auto">
            Russell Roofing and Exteriors is a factory-certified installer for the best manufacturers in the industry. To gain factory certification from a roofing manufacturer or maker of other building components, certified roofing contractors must demonstrate superior product knowledge, financial stability, proven commitment to staff training and education, and a high level of customer service. Being a factory-certified installer allows us to provide our customers with a material and workmanship warranty through the manufacturer.
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-md"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-primary-charcoal" />
          </button>
          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-md"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-primary-charcoal" />
          </button>

          {/* Materials Swiper */}
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
            slidesPerView={3}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 4,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 20,
              },
            }}
            className="materials-swiper py-8"
          >
            {materialPartners.map((partner, index) => (
              <SwiperSlide key={index}>
                <Link
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary-burgundy hover:shadow-lg transition-all duration-300 aspect-square flex items-center justify-center">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-contain p-2"
                      unoptimized
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
