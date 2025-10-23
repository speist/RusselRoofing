"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ServiceDetail } from "@/data/service-details";

interface ServiceDetailTemplateProps {
  service: ServiceDetail;
}

export default function ServiceDetailTemplate({ service }: ServiceDetailTemplateProps) {
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling past hero section
      const scrollPosition = window.scrollY;
      setShowFloatingCTA(scrollPosition > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative h-[50vh] min-h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${service.hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 text-white">
            {service.hero.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white">
            {service.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Service Overview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About Our {service.title}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {service.overview}
              </p>
              <div className="prose prose-lg text-gray-600 max-w-none">
                {service.detailedDescription.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="relative">
              <Image
                src={service.image}
                alt={`${service.title} service`}
                width={600}
                height={400}
                className="w-full h-full object-cover rounded-lg shadow-xl"
                priority
              />
              {service.emergencyAvailable && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-semibold flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  24/7 Emergency Service
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits Section */}
      {service.featureDetails && service.featureDetails.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Features & Benefits
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Why choose Russell Roofing for your {service.title.toLowerCase()} needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.featureDetails.map((feature, index) => (
                <div 
                  key={index} 
                  className={`p-6 rounded-lg ${feature.highlight ? 'bg-primary-burgundy text-white' : 'bg-gray-50'}`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    feature.highlight ? 'bg-white/20' : 'bg-primary-burgundy/10'
                  }`}>
                    <Image 
                      src={feature.icon} 
                      alt={feature.title}
                      width={32}
                      height={32}
                      className={`w-8 h-8 ${feature.highlight ? 'filter brightness-0 invert' : ''}`}
                    />
                  </div>
                  <h3 className={`font-semibold text-xl mb-2 ${
                    feature.highlight ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={feature.highlight ? 'text-burgundy-100' : 'text-gray-600'}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating CTA Button */}
      <div 
        className={`fixed bottom-8 right-8 z-40 transition-all duration-300 ${
          showFloatingCTA ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
        }`}
      >
        <Link
          href="/estimate"
          className="bg-primary-burgundy text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-primary-burgundy/90 transition-colors duration-200 flex items-center group"
        >
          <span className="mr-2">Get Free Estimate</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Social Sharing */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:block">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
            className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label={`Share ${service.title} service on Facebook`}
            title="Share on Facebook"
          >
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button
            onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out ${service.title} services from Russell Roofing`, '_blank')}
            className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label={`Share ${service.title} service on Twitter`}
            title="Share on Twitter"
          >
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}