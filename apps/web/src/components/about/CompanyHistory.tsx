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
            Three decades of excellence, award-winning craftsmanship, and dedicated service to our community
          </p>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block relative py-12">
          {/* Horizontal timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#960120] transform -translate-y-1/2"></div>

          {/* Timeline items - Alternating above/below */}
          <div className="relative flex justify-between items-center min-h-[400px]">
            {companyInfo.milestones.map((milestone, index) => {
              const isTop = index % 2 === 0;

              return (
                <div key={milestone.year} className="relative flex flex-col items-center" style={{ width: '16%' }}>
                  {/* Content - Above or Below */}
                  <div className={`absolute ${isTop ? 'bottom-1/2 mb-8' : 'top-1/2 mt-8'} w-full`}>
                    {/* Year Badge */}
                    <div className={`flex justify-center mb-3 ${!isTop && 'mt-3 order-last'}`}>
                      <div className="relative bg-[#960120] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                        {milestone.year}
                        {/* Speech bubble pointer */}
                        <div
                          className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 ${
                            isTop
                              ? 'bottom-[-6px] border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#960120]'
                              : 'top-[-6px] border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#960120]'
                          }`}
                        ></div>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                      <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight">
                        {milestone.title}
                      </h3>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#960120] rounded-full border-4 border-white shadow-lg z-10"></div>
                </div>
              );
            })}
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