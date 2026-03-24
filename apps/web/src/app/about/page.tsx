import React from 'react';
import { Metadata } from 'next';
import FloatingPageLayout from '@/components/layout/FloatingPageLayout';
import { EstimateLink } from '@/components/ui/EstimateLink';
import AboutHero from '@/components/about/AboutHero';
import MissionSection from '@/components/about/MissionSection';
import AboutGallery from '@/components/about/AboutGallery';
import CertificationsSection from '@/components/about/CertificationsSection';

export const metadata: Metadata = {
  title: 'About Us - Russell Roofing | Expert Roofing Services in New Jersey',
  description: 'Learn about Russell Roofing\'s history, experienced team, and commitment to quality roofing services. Serving New Jersey homeowners with trust and expertise since our founding.',
  keywords: 'Russell Roofing about, New Jersey roofing company, roofing contractors, company history, roofing team',
  openGraph: {
    title: 'About Russell Roofing - Your Trusted New Jersey Roofing Experts',
    description: 'Discover our company\'s story, meet our experienced team, and learn why homeowners trust Russell Roofing for their roofing needs.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <FloatingPageLayout>
      <AboutHero />
      <MissionSection />
      <AboutGallery />
      {/* Call to Action */}
      <section className="pt-4 pb-16 md:pt-6 md:pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-[#F5F3F0] p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Work with Our Team?
              </h3>
              <p className="text-gray-700 mb-6">
                Get in touch today to schedule your free consultation and experience
                the Russell Roofing difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <EstimateLink
                  className="bg-[#960120] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#7a0f1a] transition-colors items-center justify-center"
                >
                  Get Free Estimate
                </EstimateLink>
                <a
                  href="/contact"
                  className="border border-[#960120] text-[#960120] px-8 py-3 rounded-lg font-semibold hover:bg-[#960120] hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CertificationsSection />
    </FloatingPageLayout>
  );
}