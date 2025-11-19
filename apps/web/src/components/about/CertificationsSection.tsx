'use client';

import React from 'react';
import { Award } from 'lucide-react';
import { companyInfo } from '@/data/about';

export default function CertificationsSection() {
  return (
    <section className="pt-4 pb-16 md:pt-6 md:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Professional <span className="text-[#960120]">Awards</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our awards demonstrate our commitment to excellence,
            quality workmanship, and customer satisfaction.
          </p>
        </div>

        {/* Awards Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          {companyInfo.awards.map((award) => (
            <div
              key={award.id}
              className="flex flex-col items-center justify-center text-center w-[200px]"
            >
              {/* Award Ribbon Icon */}
              <div className="mb-4">
                <Award className="w-12 h-12 text-[#960120]" strokeWidth={2} />
              </div>

              {/* Award Title */}
              <h4 className="text-sm font-bold text-gray-900 leading-tight text-center">
                {award.name}
              </h4>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}