'use client';

import React from 'react';
import { companyInfo } from '@/data/about';

const valueIcons = {
  'Quality Craftsmanship': '🏗️',
  'Customer Trust': '🤝',
  'Community Service': '❤️',
  'Professional Excellence': '⭐',
  'Environmental Responsibility': '🌱',
  'Continuous Innovation': '💡'
};

const valueDescriptions = {
  'Quality Craftsmanship': 'We take pride in every project, using only the finest materials and proven techniques to ensure lasting results.',
  'Customer Trust': 'Building relationships based on transparency, honesty, and delivering on our promises every time.',
  'Community Service': 'Giving back to the communities we serve through volunteer work and charitable contributions.',
  'Professional Excellence': 'Maintaining the highest standards in our work, certifications, and customer service.',
  'Environmental Responsibility': 'Using sustainable practices and eco-friendly materials whenever possible.',
  'Continuous Innovation': 'Staying current with the latest roofing technologies and industry best practices.'
};

export default function ValuesSection() {
  return (
    <section className="py-16 md:py-24 bg-[#F5F3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our <span className="text-[#960120]">Values</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            These core values guide everything we do and shape how we serve our customers 
            and contribute to our community.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {companyInfo.coreValues.map((value, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">
                {valueIcons[value as keyof typeof valueIcons] || '🏠'}
              </div>

              {/* Value Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {value}
              </h3>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">
                {valueDescriptions[value as keyof typeof valueDescriptions] || 
                 'This value is fundamental to how we operate and serve our customers.'}
              </p>
            </div>
          ))}
        </div>

        {/* Values in Action */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Values in <span className="text-[#960120]">Action</span>
            </h3>
            <p className="text-lg text-gray-700">
              Here&apos;s how our values translate into real benefits for our customers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#960120] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Transparent Communication
                  </h4>
                  <p className="text-gray-700">
                    You&apos;ll always know what we&apos;re doing, why we&apos;re doing it, and what to expect next.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#960120] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Premium Materials Only
                  </h4>
                  <p className="text-gray-700">
                    We use only the best materials from trusted manufacturers like GAF and CertainTeed.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#960120] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Community Investment
                  </h4>
                  <p className="text-gray-700">
                    We&apos;re not just your contractor - we&apos;re your neighbors, invested in our shared community.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#960120] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Ongoing Education
                  </h4>
                  <p className="text-gray-700">
                    Our team stays current with the latest techniques and industry standards.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#960120] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Environmental Stewardship
                  </h4>
                  <p className="text-gray-700">
                    We properly dispose of materials and recommend energy-efficient roofing solutions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#960120] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Long-term Relationships
                  </h4>
                  <p className="text-gray-700">
                    Our goal is to be your roofing partner for life, not just for one project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}