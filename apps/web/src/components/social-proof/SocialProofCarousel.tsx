"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ReviewCarousel } from "./ReviewCarousel";
import { TrustBadges } from "./TrustBadges";
import { sampleReviews, trustBadges } from "@/data/reviews";

export interface SocialProofCarouselProps {
  title?: string;
  subtitle?: string;
  showTrustBadges?: boolean;
  autoRotate?: boolean;
  className?: string;
}

const SocialProofCarousel: React.FC<SocialProofCarouselProps> = ({
  title = "What Our Customers Say",
  subtitle = "Trusted by hundreds of satisfied homeowners",
  showTrustBadges = true,
  autoRotate = true,
  className
}) => {
  return (
    <section 
      className={cn("py-16 bg-background-light", className)}
      aria-label="Customer testimonials and social proof"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-h2 font-semibold text-text-primary mb-4">
            {title}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Review Carousel */}
        <div className="mb-12">
          <ReviewCarousel 
            reviews={sampleReviews}
            autoRotate={autoRotate}
            rotationInterval={5000}
            pauseOnHover={true}
          />
        </div>

        {/* Trust Badges */}
        {showTrustBadges && (
          <div className="border-t border-gray-200 pt-12">
            <div className="text-center mb-8">
              <h3 className="text-h4 font-semibold text-text-primary mb-2">
                Certified Excellence
              </h3>
              <p className="text-text-secondary">
                Recognized by industry leaders for our commitment to quality
              </p>
            </div>
            
            <div className="flex justify-center">
              <TrustBadges 
                badges={trustBadges}
                showOnScroll={false}
                showTooltips={true}
                className="justify-center"
              />
            </div>
          </div>
        )}

        {/* Call-to-Action */}
        <div className="text-center mt-12">
          <p className="text-text-secondary mb-4">
            Ready to join our satisfied customers?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/estimate"
              className={cn(
                "inline-flex items-center justify-center",
                "px-6 py-3 bg-primary-burgundy text-white",
                "rounded-lg font-medium transition-colors",
                "hover:bg-primary-charcoal focus:outline-none",
                "focus:ring-2 focus:ring-primary-burgundy focus:ring-offset-2"
              )}
            >
              Get Your Free Estimate
            </a>
            <a
              href="tel:+15551234567"
              className={cn(
                "inline-flex items-center justify-center",
                "px-6 py-3 border-2 border-primary-burgundy text-primary-burgundy",
                "rounded-lg font-medium transition-colors",
                "hover:bg-primary-burgundy hover:text-white focus:outline-none",
                "focus:ring-2 focus:ring-primary-burgundy focus:ring-offset-2"
              )}
            >
              Call Now: (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { SocialProofCarousel };