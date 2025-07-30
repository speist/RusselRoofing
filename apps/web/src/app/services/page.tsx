import React from "react";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import { ServicesGrid } from "@/components/services";
import { services } from "@/data/services";

export default function ServicesPage() {
  return (
    <FloatingPageLayout>
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From complete roof replacements to minor repairs, Russell Roofing provides 
              comprehensive exterior home services with unmatched quality and reliability. 
              Discover how we can enhance and protect your most valuable investment.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Complete Home Exterior Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive range of services covers every aspect of your home&apos;s exterior, 
            ensuring both beauty and protection for years to come.
          </p>
        </div>
        
        <ServicesGrid services={services} />
      </div>

      {/* CTA Section */}
      <div className="bg-primary-burgundy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-burgundy-100 mb-8 max-w-2xl mx-auto">
              Contact us today for a free consultation and estimate. Our expert team 
              is ready to help you protect and enhance your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/estimate"
                className="bg-white text-primary-burgundy px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center"
              >
                Get Free Estimate
              </a>
              <a
                href="/gallery"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-burgundy transition-colors duration-200 inline-flex items-center justify-center"
              >
                View Our Work
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Why Choose Russell Roofing?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-burgundy rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                Licensed & Insured
              </h3>
              <p className="text-gray-600">
                Fully licensed and insured for your peace of mind and protection.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-burgundy rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                Fast Response
              </h3>
              <p className="text-gray-600">
                Quick response times for estimates and emergency repairs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-burgundy rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                Quality Guarantee
              </h3>
              <p className="text-gray-600">
                We stand behind our work with comprehensive warranties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FloatingPageLayout>
  );
}

export const metadata = {
  title: "Home Exterior Services | Russell Roofing - Roofing, Siding & More",
  description: "Complete home exterior services including roofing, siding, gutters, windows, and chimney services. Licensed and insured with quality guarantees.",
  keywords: "home exterior services, roofing services, siding installation, gutter services, window replacement, chimney repair, Russell Roofing",
  openGraph: {
    title: "Professional Home Exterior Services | Russell Roofing",
    description: "Comprehensive exterior home services from roofing to siding, gutters, and more. Licensed, insured, and committed to quality.",
    type: "website",
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Home Exterior Services | Russell Roofing",
    description: "Comprehensive exterior home services from roofing to siding, gutters, and more. Licensed, insured, and committed to quality.",
  },
};