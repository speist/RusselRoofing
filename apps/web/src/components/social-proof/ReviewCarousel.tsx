"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Review } from "@/types/review";
import { ReviewCard } from "./ReviewCard";
import { NavigationControls } from "./NavigationControls";
import { ReviewModal } from "./ReviewModal";

export interface ReviewCarouselProps {
  reviews: Review[];
  autoRotate?: boolean;
  rotationInterval?: number;
  pauseOnHover?: boolean;
  className?: string;
}

const ReviewCarousel: React.FC<ReviewCarouselProps> = ({
  reviews,
  autoRotate = true,
  rotationInterval = 5000,
  pauseOnHover = true,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityRef = useRef<NodeJS.Timeout | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-rotation logic
  const startRotation = useCallback(() => {
    if (autoRotate && !isPaused && !isHovered && reviews.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % reviews.length;
          
          // Handle mobile scroll during auto-rotation
          if (mobileScrollRef.current) {
            const cardWidth = mobileScrollRef.current.children[0]?.clientWidth || 0;
            const gap = 16; // 1rem gap
            mobileScrollRef.current.scrollTo({
              left: nextIndex * (cardWidth + gap),
              behavior: 'smooth'
            });
          }
          
          return nextIndex;
        });
      }, rotationInterval);
    }
  }, [autoRotate, isPaused, isHovered, reviews.length, rotationInterval]);

  const stopRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityRef.current) {
      clearTimeout(inactivityRef.current);
    }
    
    setIsPaused(true);
    inactivityRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  }, []);

  // Navigation handlers
  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % reviews.length;
    setCurrentIndex(nextIndex);
    
    // Handle mobile scroll
    if (mobileScrollRef.current) {
      const cardWidth = mobileScrollRef.current.children[0]?.clientWidth || 0;
      const gap = 16; // 1rem gap
      mobileScrollRef.current.scrollTo({
        left: nextIndex * (cardWidth + gap),
        behavior: 'smooth'
      });
    }
    
    resetInactivityTimer();
  }, [currentIndex, reviews.length, resetInactivityTimer]);

  const goToPrevious = useCallback(() => {
    const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    setCurrentIndex(prevIndex);
    
    // Handle mobile scroll
    if (mobileScrollRef.current) {
      const cardWidth = mobileScrollRef.current.children[0]?.clientWidth || 0;
      const gap = 16; // 1rem gap
      mobileScrollRef.current.scrollTo({
        left: prevIndex * (cardWidth + gap),
        behavior: 'smooth'
      });
    }
    
    resetInactivityTimer();
  }, [currentIndex, reviews.length, resetInactivityTimer]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    
    // Handle mobile scroll
    if (mobileScrollRef.current) {
      const cardWidth = mobileScrollRef.current.children[0]?.clientWidth || 0;
      const gap = 16; // 1rem gap
      mobileScrollRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: 'smooth'
      });
    }
    
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Modal handlers
  const handleReadMore = useCallback((review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedReview(null);
  }, []);

  // Hover handlers
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsHovered(true);
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsHovered(false);
    }
  }, [pauseOnHover]);

  // Effect for auto-rotation
  useEffect(() => {
    startRotation();
    return () => {
      stopRotation();
      if (inactivityRef.current) {
        clearTimeout(inactivityRef.current);
      }
    };
  }, [startRotation, stopRotation]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (!reviews.length) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No reviews available</p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main carousel container */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="region"
        aria-label="Customer reviews carousel"
      >
        {/* Review cards container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Desktop: Show 3 cards */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 3 }, (_, index) => {
              const reviewIndex = (currentIndex + index) % reviews.length;
              const review = reviews[reviewIndex];
              return (
                <ReviewCard
                  key={`${review.id}-${reviewIndex}`}
                  review={review}
                  onReadMore={handleReadMore}
                  showStaggerAnimation={index === 0}
                  className="w-full"
                />
              );
            })}
          </div>

          {/* Tablet: Show 2 cards */}
          <div className="hidden md:grid md:grid-cols-2 lg:hidden md:gap-6">
            {Array.from({ length: 2 }, (_, index) => {
              const reviewIndex = (currentIndex + index) % reviews.length;
              const review = reviews[reviewIndex];
              return (
                <ReviewCard
                  key={`${review.id}-${reviewIndex}`}
                  review={review}
                  onReadMore={handleReadMore}
                  showStaggerAnimation={index === 0}
                  className="w-full"
                />
              );
            })}
          </div>

          {/* Mobile: Show 1 card with 1.2 visible */}
          <div className="md:hidden">
            <div 
              ref={mobileScrollRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-[85%] snap-center"
                >
                  <ReviewCard
                    review={review}
                    onReadMore={handleReadMore}
                    showStaggerAnimation={index === currentIndex}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading skeleton for SSR */}
        <div className="hidden" aria-hidden="true">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="bg-gray-200 rounded-card animate-pulse h-64" />
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-8">
        <NavigationControls
          currentIndex={currentIndex}
          totalItems={reviews.length}
          onNavigate={goToIndex}
          onPrevious={goToPrevious}
          onNext={goToNext}
          showDots={true}
          showArrows={reviews.length > 1}
          className="justify-center"
        />
      </div>

      {/* Review Modal */}
      <ReviewModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Auto-rotation indicator */}
      {autoRotate && !isPaused && !isHovered && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-text-secondary">
          <div className="w-2 h-2 bg-accent-success-green rounded-full animate-pulse" />
          Auto-rotate
        </div>
      )}
    </div>
  );
};

export { ReviewCarousel };