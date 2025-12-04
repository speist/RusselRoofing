import React from "react";
import { Metadata } from "next";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import { SERVICE_AREAS } from "@/lib/service-areas";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Service Areas | Russell Roofing & Exteriors",
  description: "Russell Roofing serves the Greater Philadelphia area including Montgomery County, Bucks County, Delaware County, South Jersey, and Central Jersey. Find roofing services near you.",
  keywords: "roofing Philadelphia, roofing Montgomery County, roofing Bucks County, roofing South Jersey, Russell Roofing service areas",
};

export default function ServiceAreasPage() {
  return (
    <FloatingPageLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-burgundy to-primary-burgundy-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Service Areas
            </h1>
            <p className="text-xl text-burgundy-100 max-w-3xl mx-auto">
              Russell Roofing & Exteriors proudly serves the Greater Philadelphia region
              and surrounding areas. With over 30 years of experience, we bring quality
              craftsmanship to every community we serve.
            </p>
          </div>
        </div>
      </div>

      {/* Service Areas Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_AREAS.map((area) => (
            <Link
              key={area.slug}
              href={`/service-areas/${area.slug}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-trust-blue/10 rounded-lg flex items-center justify-center group-hover:bg-accent-trust-blue transition-colors">
                    <MapPin className="w-6 h-6 text-accent-trust-blue group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-burgundy transition-colors mb-2">
                      {area.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3">
                      {area.description}
                    </p>
                    {area.counties && area.counties.length > 0 && (
                      <p className="text-gray-500 text-xs">
                        {area.counties.join(", ")} {area.counties.length === 1 ? "County" : "Counties"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-primary-burgundy font-medium text-sm group-hover:underline">
                    View projects in this area &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Map Section Placeholder */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              50-Mile Service Radius
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Based in Oreland, PA, we serve communities within a 50-mile radius.
              If you&apos;re unsure whether we service your area, please contact us.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 mb-6">
              Our headquarters: 1200 Pennsylvania Ave, Oreland, PA 19075
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-burgundy-dark transition-colors"
            >
              Contact Us About Your Location
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-burgundy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-burgundy-100 mb-8 max-w-2xl mx-auto">
              No matter which area you&apos;re in, our team is ready to help with your
              roofing, siding, and home improvement needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/estimate"
                className="bg-white text-primary-burgundy px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Get Free Estimate
              </Link>
              <a
                href="tel:1-888-567-7663"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-burgundy transition-colors duration-200"
              >
                Call 1-888-567-7663
              </a>
            </div>
          </div>
        </div>
      </div>
    </FloatingPageLayout>
  );
}
