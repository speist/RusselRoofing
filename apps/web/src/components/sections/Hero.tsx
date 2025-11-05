"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] flex items-center justify-center overflow-hidden">
      {/* Hero Background with Dark Overlay */}
      <div className="absolute inset-0">
        {/* Background Image Placeholder - Replace with actual image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-white px-8 sm:px-12 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left Side: Headline and Subheadline */}
          <div className="flex-1 text-center md:text-left">
            {/* Main Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Russell Roofing & Exteriors
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto md:mx-0">
              Trusted, Hassle-Free Property Solutions Tailored For You.
            </p>
          </div>

          {/* Right Side: CTA Button */}
          <div className="flex-shrink-0 text-center md:text-right">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
            >
              Request Estimate →
            </Button>
          </div>
        </div>

        {/* Trust Indicators - Below Content */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-300 mt-12">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Licensed & Insured</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            <span>GAF Master Elite</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>20+ Years Experience</span>
          </div>
        </div>
      </div>
    </section>
  );
}