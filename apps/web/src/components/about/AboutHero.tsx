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
            
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {companyInfo.companyStory}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
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

            {/* Mission Statement */}
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#960120]">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-700 italic">
                &ldquo;{companyInfo.missionStatement}&rdquo;
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/about/company-hero.jpg.placeholder"
                alt="Russell Roofing team and facility"
                className="w-full h-full object-cover"
                width={600}
                height={450}
                priority
              />
            </div>
            
            {/* Floating certification badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border">
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/certifications/gaf-master-elite.jpg.placeholder"
                  alt="GAF Master Elite Contractor"
                  className="w-12 h-12 object-contain"
                  width={48}
                  height={48}
                />
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    GAF Master Elite
                  </div>
                  <div className="text-xs text-gray-600">
                    Top 3% of Contractors
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}