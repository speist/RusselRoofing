import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { services } from "@/data/services";
import { getServiceDetailsBySlug } from "@/data/service-details";
import Link from "next/link";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import ServiceDetailTemplate from "@/components/services/ServiceDetailTemplate";
import ServiceGallery from "@/components/services/ServiceGallery";
import ServiceFAQ from "@/components/services/ServiceFAQ";

interface ServicePageProps {
  params: { slug: string };
}

// Static generation for all service pages
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

// Dynamic metadata generation
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const serviceDetail = getServiceDetailsBySlug(params.slug);
  const service = services.find(s => s.slug === params.slug);
  
  if (!service || !serviceDetail) {
    return {
      title: "Service Not Found | Russell Roofing",
      description: "The service you're looking for could not be found.",
    };
  }

  return {
    title: `${service.title} | Russell Roofing - Professional ${service.category} Services`,
    description: service.description,
    keywords: `${service.title.toLowerCase()}, ${service.category.toLowerCase()}, ${service.features.join(', ').toLowerCase()}, Russell Roofing`,
    openGraph: {
      title: `${service.title} | Russell Roofing`,
      description: service.description,
      type: "website",
      url: `/services/${service.slug}`,
      images: [
        {
          url: serviceDetail.hero.backgroundImage,
          width: 1200,
          height: 630,
          alt: `${service.title} - ${service.shortDescription}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | Russell Roofing`,
      description: service.description,
      images: [serviceDetail.hero.backgroundImage],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const serviceDetail = getServiceDetailsBySlug(params.slug);
  const service = services.find(s => s.slug === params.slug);

  // Handle invalid service slugs
  if (!service || !serviceDetail) {
    notFound();
  }

  return (
    <FloatingPageLayout>
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-primary-burgundy transition-colors"
            >
              Home
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link
              href="/services"
              className="text-gray-500 hover:text-primary-burgundy transition-colors"
            >
              Services
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Service Detail Template */}
      <ServiceDetailTemplate service={serviceDetail} />

      {/* Image Gallery Section */}
      <ServiceGallery serviceSlug={params.slug} serviceTitle={service.title} />

      {/* FAQ Section - Now dynamically fetched from HubSpot */}
      <ServiceFAQ serviceArea={params.slug} serviceTitle={service.title} />

    </FloatingPageLayout>
  );
}