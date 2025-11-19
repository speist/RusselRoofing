'use client';

import React from 'react';
import { companyInfo } from '@/data/about';

export default function CompanyHistory() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-[#960120]">Journey</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            From humble beginnings to becoming one of New Jersey&apos;s most trusted roofing companies
          </p>
        </div>

        {/* Desktop: Horizontal Scrollable Timeline */}
        <div className="hidden md:block relative">
          {/* Horizontal timeline line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-[#960120]"></div>

          {/* Timeline items - Horizontal Grid */}
          <div className="grid grid-cols-3 gap-8">
            {companyInfo.milestones.map((milestone, index) => (
              <div key={milestone.year} className="relative pt-16">
                {/* Timeline dot */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-[#960120] rounded-full border-4 border-white shadow-lg z-10"></div>

                {/* Content Card */}
                <div className="bg-[#F5F3F0] p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="mb-3">
                    <span className="inline-block bg-[#960120] text-white px-3 py-1 rounded-full text-sm font-bold">
                      {milestone.year}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {milestone.title}
                  </h3>

                  <p className="text-sm text-gray-700 line-clamp-3">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Compact Vertical Timeline */}
        <div className="md:hidden relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#960120]"></div>

          {/* Timeline items */}
          <div className="space-y-6">
            {companyInfo.milestones.map((milestone) => (
              <div key={milestone.year} className="relative pl-12">
                {/* Timeline dot */}
                <div className="absolute left-2.5 top-6 w-3 h-3 bg-[#960120] rounded-full border-2 border-white shadow z-10"></div>

                {/* Content Card */}
                <div className="bg-[#F5F3F0] p-4 rounded-lg border border-gray-200">
                  <div className="mb-2">
                    <span className="inline-block bg-[#960120] text-white px-2 py-1 rounded-full text-xs font-bold">
                      {milestone.year}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>

                  <p className="text-sm text-gray-700">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}