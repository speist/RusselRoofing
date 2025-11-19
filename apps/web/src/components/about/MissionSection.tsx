'use client';

import React from 'react';

export default function MissionSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#960120]">Mission</span>
            </h2>
          </div>

          {/* Mission Content */}
          <div className="bg-[#F5F3F0] p-8 md:p-12 rounded-lg shadow-lg border border-gray-100">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Our company slogan, &ldquo;If It&apos;s Russell, It&apos;s Right, Guaranteed!&rdquo; is more than just words.
                It represents how we run our business with a &apos;can do&apos; attitude. Our goal is to make your roofing
                or exterior remodeling experience as comfortable as possible by providing the highest quality warranties,
                workers, and communication.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Referrals are the core of our business, and we aim to make our customers 100% satisfied. We are a
                safety-first company that is fully licensed and insured, with liability and full workers&apos; compensation coverage.
              </p>
            </div>

            {/* Signature Tagline */}
            <div className="mt-8 pt-8 border-t border-gray-300">
              <p className="text-2xl font-bold text-[#960120] text-center italic">
                &ldquo;If It&apos;s Russell, It&apos;s Right, Guaranteed!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
