"use client";

import React, { useState, useEffect } from "react";
import { Review } from "@/types/review";
import { ReviewCarousel } from "@/components/social-proof/ReviewCarousel";
import { sampleReviews } from "@/data/reviews";
import { cn } from "@/lib/utils";

// Constants for better maintainability
const DEFAULT_ROTATION_INTERVAL = 5000;
const LOADING_SKELETON_COUNT = 3;

interface ReviewsApiResponse {
  reviews: Review[];
  source: 'live' | 'fallback';
  error?: string;
}

export interface TestimonialsCarouselProps {
  className?: string;
  autoRotate?: boolean;
  rotationInterval?: number;
  pauseOnHover?: boolean;
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  className,
  autoRotate = true,
  rotationInterval = DEFAULT_ROTATION_INTERVAL,
  pauseOnHover = true
}) => {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [dataSource, setDataSource] = useState<'live' | 'fallback' | 'loading'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/reviews', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`);
        }

        const data: ReviewsApiResponse = await response.json();
        
        if (isMounted) {
          setReviews(data.reviews);
          setDataSource(data.source);
          
          if (data.error) {
            setError(data.error);
            console.warn('Reviews API returned error:', data.error);
          }
          
          // Log data source for debugging
          if (data.source === 'live') {
            console.log(`Loaded ${data.reviews.length} live reviews from Google Places API`);
          } else {
            console.log(`Fallback to ${data.reviews.length} sample reviews`, data.error ? `due to: ${data.error}` : '');
          }
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        
        if (isMounted) {
          // Ensure we always have reviews to display
          setReviews(sampleReviews);
          setDataSource('fallback');
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show loading skeleton while fetching data
  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Client Testimonials
          </h2>
          <p className="text-lg text-text-secondary">
            What our customers say about our work
          </p>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: LOADING_SKELETON_COUNT }, (_, index) => (
            <div 
              key={index} 
              className="bg-gray-200 rounded-card animate-pulse h-64"
              aria-label={`Loading review ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <div className="bg-gray-200 animate-pulse h-6 w-32 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Client Testimonials
        </h2>
        <p className="text-lg text-text-secondary">
          {dataSource === 'live' 
            ? "Recent 5-star reviews from our customers"
            : "What our customers say about our work"
          }
        </p>
        
        {/* Data source indicator (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-sm text-text-secondary">
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs",
              dataSource === 'live' 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                dataSource === 'live' ? "bg-green-500" : "bg-yellow-500"
              )} />
              {dataSource === 'live' ? 'Live Google Reviews' : 'Sample Reviews'}
            </span>
            {error && (
              <span className="ml-2 text-red-600 text-xs">
                ({error})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Reviews Carousel */}
      <ReviewCarousel
        reviews={reviews}
        autoRotate={autoRotate}
        rotationInterval={rotationInterval}
        pauseOnHover={pauseOnHover}
        className="w-full"
      />

      {/* Trust indicator for live reviews */}
      {dataSource === 'live' && (
        <div className="text-center mt-6">
          <p className="text-sm text-text-secondary">
            ✓ Reviews verified by Google
          </p>
        </div>
      )}
    </div>
  );
};

export { TestimonialsCarousel };