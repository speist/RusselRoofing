import React from "react";
import { cn } from "@/lib/utils";

export interface NavigationControlsProps {
  currentIndex: number;
  totalItems: number;
  onNavigate: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentIndex,
  totalItems,
  onNavigate,
  onPrevious,
  onNext,
  showDots = true,
  showArrows = true,
  className
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Previous Arrow */}
      {showArrows && (
        <button
          onClick={onPrevious}
          className={cn(
            "p-2 rounded-full bg-white shadow-md hover:shadow-lg",
            "text-primary-burgundy hover:text-primary-charcoal",
            "transition-all duration-200 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-primary-burgundy focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label="Previous review"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Dots Indicator */}
      {showDots && (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalItems }, (_, index) => (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 ease-in-out",
                "focus:outline-none focus:ring-2 focus:ring-primary-burgundy focus:ring-offset-2",
                index === currentIndex
                  ? "bg-primary-burgundy w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to review ${index + 1}`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      )}

      {/* Next Arrow */}
      {showArrows && (
        <button
          onClick={onNext}
          className={cn(
            "p-2 rounded-full bg-white shadow-md hover:shadow-lg",
            "text-primary-burgundy hover:text-primary-charcoal",
            "transition-all duration-200 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-primary-burgundy focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label="Next review"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export { NavigationControls };