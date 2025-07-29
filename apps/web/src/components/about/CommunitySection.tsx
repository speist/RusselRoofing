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

        {/* Community Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Community Impact
            </h3>
            <p className="text-lg text-gray-700">
              Numbers that reflect our commitment to giving back
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#960120] mb-2">
                50+
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">
                Emergency Repairs
              </div>
              <div className="text-xs text-gray-500 mt-1">
                At no cost to families in need
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-[#960120] mb-2">
                25+
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">
                Students Supported
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Through education scholarships
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-[#960120] mb-2">
                12+
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">
                Habitat Homes
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Roofed for families in need
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-[#960120] mb-2">
                5+
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">
                Years of Service
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Continuous community involvement
              </div>
            </div>
          </div>
        </div>

        {/* Local Commitment */}
        <div className="bg-gradient-to-r from-[#960120] to-[#7a0f1a] text-white rounded-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Proudly Serving New Jersey
              </h3>
              <p className="text-white text-opacity-90 mb-6 leading-relaxed">
                As a local business, we understand the unique challenges of New Jersey weather 
                and building codes. We&apos;re not just your roofing contractor – we&apos;re your neighbors, 
                and we&apos;re invested in the long-term success of our community.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏠</span>
                  <span>Local family-owned business</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🤝</span>
                  <span>Building lasting community relationships</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💙</span>
                  <span>Supporting local causes and organizations</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="inline-block bg-white bg-opacity-10 p-8 rounded-lg">
                <div className="text-4xl mb-4">📍</div>
                <h4 className="text-xl font-bold mb-2">Service Areas</h4>
                <div className="text-white text-opacity-80 space-y-1">
                  <p>Newark & Surrounding Areas</p>
                  <p>Essex County</p>
                  <p>Morris County</p>
                  <p>Union County</p>
                  <p>Somerset County</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Work with a Company That Cares?
          </h3>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            When you choose Russell Roofing, you&apos;re not just getting excellent roofing services – 
            you&apos;re supporting a business that gives back to the community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/estimate"
              className="bg-[#960120] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#7a0f1a] transition-colors"
            >
              Get Your Free Estimate
            </a>
            <a
              href="/contact"
              className="border border-[#960120] text-[#960120] px-8 py-3 rounded-lg font-semibold hover:bg-[#960120] hover:text-white transition-colors"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}