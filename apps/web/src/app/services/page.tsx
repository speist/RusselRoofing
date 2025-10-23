import React from "react";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import { ServicesGrid } from "@/components/services";
import { services } from "@/data/services";

export default function ServicesPage() {
  return (
    <FloatingPageLayout>
      {/* Hero Section */}
      <section
        className="relative py-16 md:py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/images/services/services-hero.jpeg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Our Services
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
              From complete roof replacements to minor repairs, Russell Roofing provides
              comprehensive exterior home services with unmatched quality and reliability.
              Discover how we can enhance and protect your most valuable investment.
            </p>
          </div>
        </div>
      </section>

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