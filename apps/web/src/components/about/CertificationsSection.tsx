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

      </div>
    </section>
  );
}