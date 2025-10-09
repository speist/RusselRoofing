'use client';

import React from 'react';
import Image from 'next/image';
import { companyInfo } from '@/data/about';

export default function AboutHero() {
  const yearsInBusiness = new Date().getFullYear() - companyInfo.foundedYear;

  return (
    <section
      className="relative py-16 md:py-24"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/about/company-hero.jpeg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered 33 Years Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/about/RR-33-years-on-transparent-white.png"
            alt="Russell Roofing - 33 Years of Excellence"
            width={200}
            height={200}
            priority
            className="w-auto h-32 md:h-40"
          />
        </div>

        {/* Content */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            About{' '}
            <span className="text-white">Russell Roofing</span>
          </h1>

          <div className="text-lg text-white mb-8 leading-relaxed space-y-4">
            {companyInfo.companyStory.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {yearsInBusiness}+
              </div>
              <div className="text-sm text-white uppercase tracking-wide">
                Years of Experience
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {companyInfo.team.length}
              </div>
              <div className="text-sm text-white uppercase tracking-wide">
                Expert Team Members
              </div>
            </div>

            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-white mb-2">
                1000+
              </div>
              <div className="text-sm text-white uppercase tracking-wide">
                Homes Protected
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}