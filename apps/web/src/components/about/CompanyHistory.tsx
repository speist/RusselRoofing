'use client';

import React from 'react';
import { companyInfo } from '@/data/about';

export default function CompanyHistory() {
  return (
    <section className="py-16 md:py-24 bg-[#F5F3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our <span className="text-[#960120]">Journey</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            From humble beginnings to becoming one of New Jersey&apos;s most trusted roofing companies, 
            here&apos;s how we&apos;ve grown while staying true to our values.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-[#960120]"></div>

          {/* Timeline items */}
          <div className="space-y-12">
            {companyInfo.milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#960120] rounded-full border-4 border-white shadow-lg z-10"></div>

                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="bg-[#960120] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {milestone.year}
                      </div>
                      <div className="md:hidden ml-4 w-3 h-3 bg-[#960120] rounded-full"></div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {milestone.title}
                    </h3>
                    
                    <p className="text-gray-700">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Spacer for desktop */}
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our company slogan, &ldquo;If It&apos;s Russell, It&apos;s Right, Guaranteed!&rdquo; is more than just words.
              It represents how we run our business with a &apos;can do&apos; attitude. Our goal is to make your roofing
              or exterior remodeling experience as comfortable as possible by providing the highest quality warranties,
              workers, and communication.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Referrals are the core of our business, and we aim to make our customers 100% satisfied. We are a
              safety-first company that is fully licensed and insured, with liability and full workers&apos; compensation coverage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}