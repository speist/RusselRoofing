import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import { CompanyCamGallery } from "@/components/gallery";
import { sampleProjects } from "@/data/gallery";
import { SERVICE_AREAS, getServiceAreaBySlug } from "@/lib/service-areas";
import type { LocationArea } from "@/lib/service-areas";
import Link from "next/link";
import { ServicesSlider } from "@/components/services/ServicesSlider";

interface ServiceAreaPageProps {
  params: { slug: string };
}

// Generate static params for all service areas
export async function generateStaticParams() {
  return SERVICE_AREAS.map((area) => ({
    slug: area.slug,
  }));
}

// Generate metadata for each service area
export async function generateMetadata({ params }: ServiceAreaPageProps): Promise<Metadata> {
  const area = getServiceAreaBySlug(params.slug);

  if (!area) {
    return {
      title: "Service Area Not Found | Russell Roofing",
    };
  }

  return {
    title: `${area.name} Roofing & Exteriors | Russell Roofing`,
    description: `Professional roofing, siding, windows, and home improvement services in ${area.name}. View our completed projects and get a free estimate from Russell Roofing.`,
    keywords: `roofing ${area.name}, siding ${area.name}, home improvement ${area.name}, Russell Roofing ${area.name}`,
    openGraph: {
      title: `${area.name} Roofing & Exteriors | Russell Roofing`,
      description: `Professional roofing and exterior services in ${area.name}. 30+ years of quality craftsmanship.`,
      type: "website",
    },
  };
}

export default function ServiceAreaPage({ params }: ServiceAreaPageProps) {
  const area = getServiceAreaBySlug(params.slug);

  if (!area) {
    notFound();
  }

  // Cast area.name to LocationArea for the gallery filter
  const locationArea = area.name as LocationArea;

  return (
    <FloatingPageLayout>
      {/* Hero Section - All White Text */}
      <div className="bg-gradient-to-br from-primary-burgundy to-primary-burgundy-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-2">
              Service Area
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {area.name}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-6">
              {area.description}
            </p>
            {area.counties && area.counties.length > 0 && (
              <p className="text-white/70 text-sm">
                Serving: {area.counties.join(", ")} {area.counties.length === 1 ? "County" : "Counties"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Services Slider */}
      <ServicesSlider title={`Our Services in ${area.name}`} className="bg-gray-50" />

      {/* Gallery Section - Pre-filtered to this area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Work in {area.name}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our completed projects in {area.name}. Each project showcases our commitment
            to quality craftsmanship and customer satisfaction.
          </p>
        </div>

        <CompanyCamGallery
          showFilter={true}
          showLocationFilter={false}
          initialLocation={locationArea}
          className="w-full"
          fallbackImages={sampleProjects}
        />
      </div>

      {/* CTA Section */}
      <div className="bg-primary-burgundy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Project in {area.name}?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get a free estimate for your roofing, siding, or home improvement project.
              We&apos;ve been serving {area.name} for over 30 years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/estimate"
                className="bg-white text-primary-burgundy px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Get Free Estimate
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-burgundy transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Other Service Areas */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Other Areas We Serve
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {SERVICE_AREAS.filter((a) => a.slug !== params.slug).map((otherArea) => (
              <Link
                key={otherArea.slug}
                href={`/service-areas/${otherArea.slug}`}
                className="px-4 py-2 bg-white rounded-full text-gray-700 hover:bg-accent-trust-blue hover:text-white transition-colors shadow-sm"
              >
                {otherArea.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </FloatingPageLayout>
  );
}
