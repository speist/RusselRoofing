import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  rating: number; // 1-5
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showStaggerAnimation?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = "md",
  showStaggerAnimation = false,
  className
}) => {
  const renderStars = useMemo(() => {
    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4", 
      lg: "w-5 h-5"
    };
    return Array.from({ length: maxRating }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= rating;
      const isPartial = starNumber === Math.ceil(rating) && rating % 1 !== 0;
      
      return (
        <div
          key={index}
          className={cn(
            "relative",
            showStaggerAnimation && `animate-fade-in`,
            showStaggerAnimation && `delay-[${index * 200}ms]`
          )}
          style={{
            animationDelay: showStaggerAnimation ? `${index * 200}ms` : undefined
          }}
        >
          {/* Background star (empty) */}
          <svg
            className={cn(
              sizeClasses[size],
              "text-gray-200 transition-colors duration-200"
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.602-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          
          {/* Filled star */}
          {(isFilled || isPartial) && (
            <svg
              className={cn(
                sizeClasses[size],
                "absolute top-0 left-0 text-accent-alert-gold transition-colors duration-200"
              )}
              style={{
                clipPath: isPartial 
                  ? `inset(0 ${100 - (rating % 1) * 100}% 0 0)` 
                  : undefined
              }}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.602-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
        </div>
      );
    });
  }, [maxRating, rating, showStaggerAnimation, size]);

  return (
    <div className={cn("flex items-center gap-1", className)} role="img" aria-label={`${rating} out of ${maxRating} stars`}>
      {renderStars}
    </div>
  );
};

export { StarRating };