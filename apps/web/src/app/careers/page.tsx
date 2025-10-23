import type { Metadata } from "next";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import JobListings from "@/components/careers/JobListings";
import { Mail, Phone } from "lucide-react";
import { hubspotService } from "@/lib/hubspot/api";

export const metadata: Metadata = {
  title: "Careers | Russell Roofing & Exteriors",
  description: "Join the Russell Roofing team! Explore career opportunities with a leading roofing contractor. We offer competitive benefits, growth opportunities, and a supportive work environment.",
  keywords: "roofing jobs, construction careers, foreman jobs, roofing laborer, superintendent positions, Pennsylvania jobs",
};

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function CareersPage() {
  // Fetch careers on the server
  const careersResponse = await hubspotService.getCareers({ liveOnly: true });
  const initialJobs = careersResponse.success && careersResponse.data ? careersResponse.data.results : [];
  return (
    <FloatingPageLayout>
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/images/careers/careers-hero.jpeg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Join Our Team
          </h1>
          <p className="font-body text-lg md:text-xl text-white max-w-3xl mx-auto mb-8">
            Build your career with a leading roofing contractor. We offer competitive benefits, growth opportunities, and a supportive work environment where your skills can flourish.
          </p>
          <a
            href="#open-positions"
            className="inline-flex items-center bg-white text-primary-burgundy px-8 py-3 rounded-lg font-body font-medium hover:bg-gray-100 transition-colors"
          >
            View Open Positions
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Job Listings from HubSpot */}
      <JobListings initialJobs={initialJobs} />

      {/* Application Process */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-6">
            How to Apply
          </h2>
          <p className="font-body text-text-secondary mb-8">
            Ready to join our team? We&rsquo;d love to hear from you! Send us your resume and a brief cover letter explaining why you&rsquo;d be a great fit for Russell Roofing & Exteriors.
          </p>
          
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <Mail className="w-12 h-12 text-primary-burgundy mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                  Email Your Resume
                </h3>
                <p className="font-body text-text-secondary mb-4">
                  Send your application materials to:
                </p>
                <a
                  href="mailto:info@russellroofing.com?subject=Job Application"
                  className="font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors"
                >
                  info@russellroofing.com
                </a>
              </div>
              
              <div className="text-center">
                <Phone className="w-12 h-12 text-primary-burgundy mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                  Call Us
                </h3>
                <p className="font-body text-text-secondary mb-4">
                  Have questions? Give us a call:
                </p>
                <a
                  href="tel:+18885677663"
                  className="font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors"
                >
                  1-888-567-7663
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 text-left bg-secondary-light-warm-gray rounded-lg p-6">
            <h3 className="font-display text-lg font-semibold text-text-primary mb-3">
              Application Tips:
            </h3>
            <ul className="font-body text-text-secondary space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Include relevant work experience and certifications
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Mention the specific position you&rsquo;re applying for
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Highlight any safety training or certifications
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Be sure to include your contact information and availability
              </li>
            </ul>
          </div>
        </div>
      </section>
    </FloatingPageLayout>
  );
}