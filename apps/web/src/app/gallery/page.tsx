import React from "react";
import { ProjectGallery } from "@/components/gallery";
import { sampleProjects } from "@/data/gallery";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Project Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our portfolio of completed roofing, siding, and home improvement projects. 
              Each project represents our commitment to quality craftsmanship and customer satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProjectGallery
          images={sampleProjects}
          showFilter={true}
          className="w-full"
        />
      </div>

      {/* CTA Section */}
      <div className="bg-primary-burgundy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-burgundy-100 mb-8 max-w-2xl mx-auto">
              Let us help you transform your home with the same quality and attention to detail 
              you see in our gallery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-primary-burgundy px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Get Free Estimate
              </a>
              <a
                href="/services"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-burgundy transition-colors duration-200"
              >
                View Our Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Project Gallery | Russell Roofing - Quality Home Improvement",
  description: "Browse our portfolio of completed roofing, siding, gutters, windows, and chimney projects. See the quality craftsmanship that Russell Roofing delivers.",
  keywords: "roofing projects, siding gallery, home improvement portfolio, Russell Roofing work, before after photos",
};