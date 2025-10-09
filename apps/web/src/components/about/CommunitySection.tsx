'use client';

import React from 'react';
import Image from 'next/image';
import { companyInfo } from '@/data/about';

export default function CommunitySection() {
  return (
    <section className="py-16 md:py-24 bg-[#F5F3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Community <span className="text-[#960120]">Involvement</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We believe in giving back to the communities that have supported us. 
            Here&apos;s how we&apos;re making a positive impact beyond roofing.
          </p>
        </div>

        {/* Community Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {companyInfo.communityInvolvement.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
            >
              {/* Activity Image */}
              {activity.image && (
                <div className="aspect-[16/9] bg-gray-200 overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                    width={400}
                    height={225}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {activity.name}
                  </h3>
                  <span className="bg-[#960120] text-white px-2 py-1 rounded text-sm font-semibold">
                    {activity.year}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {activity.description}
                </p>

                {/* Impact */}
                <div className="bg-[#F5F3F0] p-4 rounded-lg border-l-4 border-[#960120]">
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    Impact
                  </div>
                  <div className="text-sm text-gray-700">
                    {activity.impact}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}