"use client";

import React from "react";
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
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-charcoal mb-4">
            Quality Materials
            <br />
            <span className="text-primary-burgundy">Plus Quality Craftsmanship</span>
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-4xl mx-auto">
            Russell Roofing & Exteriors are commercial and home exterior contractors that have made a
            commitment to using only the highest quality products and materials, professionally installed
            and backed by the industry&rsquo;s best warranties.
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button className="materials-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-md">
            <ChevronLeft className="w-6 h-6 text-primary-charcoal" />
          </button>
          <button className="materials-next absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-md">
            <ChevronRight className="w-6 h-6 text-primary-charcoal" />
          </button>

          {/* Materials Swiper */}
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: ".materials-prev",
              nextEl: ".materials-next",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={30}
            slidesPerView={2}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 40,
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
                  <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary-burgundy hover:shadow-lg transition-all duration-300 h-32 flex items-center justify-center">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      width={150}
                      height={75}
                      className="max-w-full max-h-full object-contain"
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
