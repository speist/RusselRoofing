'use client';

import React from 'react';
import Image from 'next/image';
import { companyInfo } from '@/data/about';

export default function AboutHero() {
  const yearsInBusiness = new Date().getFullYear() - companyInfo.foundedYear;

  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About{' '}
              <span className="text-[#960120]">Russell Roofing</span>
            </h1>

            <div className="text-lg text-gray-700 mb-8 leading-relaxed space-y-4">
              {companyInfo.companyStory.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#960120] mb-2">
                  {yearsInBusiness}+
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  Years of Experience
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-[#960120] mb-2">
                  {companyInfo.team.length}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  Expert Team Members
                </div>
              </div>

              <div className="text-center col-span-2 md:col-span-1">
                <div className="text-3xl font-bold text-[#960120] mb-2">
                  1000+
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  Homes Protected
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image with 33 Years Logo Overlay */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden shadow-xl relative">
              <Image
                src="/images/about/company-hero.jpeg"
                alt="Russell Roofing team and facility"
                className="w-full h-full object-cover"
                width={600}
                height={450}
                priority
              />
              {/* 33 Years Logo Overlay - Centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/about/RR-33-years-on-transparent-white.png"
                  alt="Russell Roofing - 33 Years of Excellence"
                  width={200}
                  height={200}
                  className="w-auto h-32 md:h-40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}