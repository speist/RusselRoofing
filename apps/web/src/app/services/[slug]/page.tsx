import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { services } from "@/data/services";
import { getServiceDetailsBySlug } from "@/data/service-details";
import Link from "next/link";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import ServiceDetailTemplate from "@/components/services/ServiceDetailTemplate";
import ServiceGallery from "@/components/services/ServiceGallery";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import ServiceTestimonials from "@/components/services/ServiceTestimonials";

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

export default function ServiceDetailPage({ params }: ServicePageProps) {
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

      {/* Testimonials Section */}
      {serviceDetail.testimonials && serviceDetail.testimonials.length > 0 && (
        <ServiceTestimonials testimonialIds={serviceDetail.testimonials} serviceTitle={service.title} />
      )}

      {/* FAQ Section */}
      {serviceDetail.faqs && serviceDetail.faqs.length > 0 && (
        <ServiceFAQ faqs={serviceDetail.faqs} serviceTitle={service.title} />
      )}

      {/* Related Services Section */}
      {serviceDetail.relatedServices && serviceDetail.relatedServices.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">
              Related Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serviceDetail.relatedServices.map((relatedSlug) => {
                const relatedService = services.find(s => s.slug === relatedSlug);
                if (!relatedService) return null;
                
                return (
                  <Link
                    key={relatedService.id}
                    href={`/services/${relatedService.slug}`}
                    className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <Image
                        src={relatedService.image}
                        alt={relatedService.title}
                        width={300}
                        height={192}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary-burgundy transition-colors">
                        {relatedService.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{relatedService.shortDescription}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </FloatingPageLayout>
  );
}