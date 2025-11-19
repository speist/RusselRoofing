'use client';

import React from 'react';

export default function MissionSection() {
  return (
    <section className="pt-4 pb-8 md:pt-6 md:pb-12 bg-[#F5F3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Section Header */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our <span className="text-[#960120]">Mission</span>
          </h2>

          {/* Mission Content */}
          <div className="space-y-4">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Our company slogan, &ldquo;If It&apos;s Russell, It&apos;s Right, Guaranteed!&rdquo; is more than just words.
              It represents how we run our business with a &apos;can do&apos; attitude. Our goal is to make your roofing
              or exterior remodeling experience as comfortable as possible by providing the highest quality warranties,
              workers, and communication.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Referrals are the core of our business, and we aim to make our customers 100% satisfied. We are a
              safety-first company that is fully licensed and insured, with liability and full workers&apos; compensation coverage.
            </p>
          </div>

          {/* Signature Tagline */}
          <div className="mt-6">
            <p className="text-xl md:text-2xl font-bold text-[#960120] italic">
              &ldquo;If It&apos;s Russell, It&apos;s Right, Guaranteed!&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
