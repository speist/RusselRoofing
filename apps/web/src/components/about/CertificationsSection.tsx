'use client';

import React from 'react';
import Image from 'next/image';
import { companyInfo } from '@/data/about';

export default function CertificationsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Professional <span className="text-[#960120]">Credentials</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our certifications and awards demonstrate our commitment to excellence, 
            quality workmanship, and customer satisfaction.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Industry Certifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {companyInfo.certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-[#F5F3F0] p-8 rounded-lg border border-gray-200 text-center hover:shadow-lg transition-shadow"
              >
                {/* Certification Badge */}
                <div className="mb-6">
                  <Image
                    src={cert.image}
                    alt={`${cert.name} certification badge`}
                    className="w-24 h-24 object-contain mx-auto"
                    width={96}
                    height={96}
                  />
                </div>

                {/* Certification Details */}
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {cert.name}
                </h4>
                
                <p className="text-[#960120] font-semibold mb-2">
                  {cert.issuer}
                </p>
                
                <p className="text-sm text-gray-600 mb-4">
                  Certified since {cert.year}
                </p>

                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {cert.description}
                </p>

                {cert.verificationUrl && (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#960120] text-sm font-semibold hover:underline"
                  >
                    Verify Certification →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Awards & Recognition
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {companyInfo.awards.map((award) => (
              <div
                key={award.id}
                className="bg-gradient-to-br from-[#960120] to-[#7a0f1a] text-white p-8 rounded-lg shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold mb-2">
                      {award.name}
                    </h4>
                    
                    <p className="text-white text-opacity-90 font-semibold mb-2">
                      {award.issuer} • {award.year}
                    </p>
                    
                    <p className="text-white text-opacity-80 leading-relaxed">
                      {award.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-[#F5F3F0] rounded-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why These Credentials Matter
            </h3>
            <p className="text-lg text-gray-700">
              Our certifications aren&apos;t just badges – they&apos;re your assurance of quality and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#960120] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🛡️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Fully Insured
              </h4>
              <p className="text-sm text-gray-700">
                Comprehensive liability and workers&apos; compensation coverage
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#960120] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📋</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Licensed Contractor
              </h4>
              <p className="text-sm text-gray-700">
                State licensed and bonded for all residential roofing work
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#960120] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⭐</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                A+ BBB Rating
              </h4>
              <p className="text-sm text-gray-700">
                Maintaining the highest standards of business ethics
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#960120] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🏠</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Extended Warranties
              </h4>
              <p className="text-sm text-gray-700">
                Up to 50-year manufacturer warranties on select systems
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}