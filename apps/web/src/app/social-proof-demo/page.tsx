import React from "react";
import { SocialProofCarousel } from "@/components/social-proof";

export default function SocialProofDemoPage() {
  return (
    <div className="min-h-screen bg-background-white">
      {/* Page Header */}
      <div className="bg-primary-burgundy text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-h1 font-bold mb-2">Social Proof Demo</h1>
          <p className="text-lg opacity-90">
            Testing the dynamic social proof carousel components
          </p>
        </div>
      </div>

      {/* Social Proof Carousel */}
      <SocialProofCarousel 
        title="What Our Customers Say"
        subtitle="Real reviews from real customers who trust Russell Roofing"
        showTrustBadges={true}
        autoRotate={true}
      />

      {/* Additional Test Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-h2 font-semibold text-text-primary mb-4">
            Component Features Tested
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-primary-burgundy mb-2">
                ✅ Responsive Carousel
              </h3>
              <p className="text-sm text-text-secondary">
                3 cards on desktop, 2 on tablet, 1.2 on mobile
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-primary-burgundy mb-2">
                ✅ Auto-rotation
              </h3>
              <p className="text-sm text-text-secondary">
                Pauses on hover, resumes after 5 seconds
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-primary-burgundy mb-2">
                ✅ Read More Modal
              </h3>
              <p className="text-sm text-text-secondary">
                Click &ldquo;Read more&rdquo; to see full reviews
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-primary-burgundy mb-2">
                ✅ Trust Badges
              </h3>
              <p className="text-sm text-text-secondary">
                GAF Master Elite and other certifications
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-primary-burgundy mb-2">
                ✅ Navigation
              </h3>
              <p className="text-sm text-text-secondary">
                Arrows, dots, and keyboard navigation
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-primary-burgundy mb-2">
                ✅ Accessibility
              </h3>
              <p className="text-sm text-text-secondary">
                ARIA labels, keyboard support, screen readers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}