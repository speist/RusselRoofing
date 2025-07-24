"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { TrustBadge } from "@/types/review";

export interface TrustBadgesProps {
  badges: TrustBadge[];
  showOnScroll?: boolean;
  scrollThreshold?: number;
  showTooltips?: boolean;
  className?: string;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({
  badges,
  showOnScroll = true,
  scrollThreshold = 100,
  showTooltips = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(!showOnScroll);
  const [selectedBadge, setSelectedBadge] = useState<TrustBadge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  // Handle scroll visibility
  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showOnScroll, scrollThreshold]);

  const handleBadgeClick = (badge: TrustBadge) => {
    if (badge.verificationUrl) {
      window.open(badge.verificationUrl, "_blank", "noopener,noreferrer");
    } else {
      setSelectedBadge(badge);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBadge(null);
  };

  if (!badges.length) return null;

  return (
    <>
      <div
        className={cn(
          "flex flex-wrap items-center gap-4",
          showOnScroll && "transition-all duration-500 ease-in-out",
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-4 pointer-events-none",
          className
        )}
      >
        {badges.map((badge, index) => (
          <div
            key={badge.id}
            className="relative"
            onMouseEnter={() => setHoveredBadge(badge.id)}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <button
              onClick={() => handleBadgeClick(badge)}
              className={cn(
                "flex items-center gap-3 p-3 bg-white rounded-lg shadow-md",
                "hover:shadow-lg transition-all duration-300 ease-in-out",
                "border border-gray-200 hover:border-primary-burgundy/20",
                "focus:outline-none focus:ring-2 focus:ring-primary-burgundy focus:ring-offset-2",
                "animate-in slide-in-from-right-5 fade-in-0",
                "group"
              )}
              style={{
                animationDelay: showOnScroll ? `${index * 200}ms` : '0ms',
                animationDuration: '600ms'
              }}
              aria-label={`${badge.name} - ${badge.description}`}
            >
              {/* Badge Image Placeholder */}
              <div className="w-8 h-8 bg-gradient-to-r from-primary-burgundy to-accent-trust-blue rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {badge.name.charAt(0)}
                </span>
              </div>
              
              {/* Badge Info */}
              <div className="text-left">
                <p className="text-sm font-semibold text-text-primary group-hover:text-primary-burgundy transition-colors">
                  {badge.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {badge.description}
                </p>
              </div>

              {/* Verification Icon */}
              <svg 
                className="w-4 h-4 text-accent-success-green" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Tooltip */}
            {showTooltips && hoveredBadge === badge.id && (
              <div
                className={cn(
                  "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2",
                  "bg-gray-900 text-white text-xs rounded-lg py-2 px-3",
                  "max-w-xs text-center z-10",
                  "animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
                )}
              >
                {badge.credibilityInfo}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Badge Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedBadge?.name}
        size="md"
      >
        {selectedBadge && (
          <div className="space-y-4">
            {/* Badge Header */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-burgundy to-accent-trust-blue rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {selectedBadge.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {selectedBadge.name}
                </h3>
                <Badge variant="success" size="sm">
                  Verified Certification
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-text-primary mb-2">About This Certification</h4>
              <p className="text-text-primary leading-relaxed">
                {selectedBadge.credibilityInfo}
              </p>
            </div>

            {/* Verification Link */}
            {selectedBadge.verificationUrl && (
              <div className="pt-4 border-t">
                <a
                  href={selectedBadge.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 text-primary-burgundy",
                    "hover:text-primary-charcoal transition-colors",
                    "focus:outline-none focus:underline"
                  )}
                >
                  Verify this certification
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export { TrustBadges };