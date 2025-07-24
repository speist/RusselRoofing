import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const ProgressDots = React.forwardRef<HTMLDivElement, ProgressDotsProps>(
  ({ currentStep, totalSteps, className }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("flex items-center justify-center space-x-4", className)}
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div
              key={stepNumber}
              className={cn(
                "rounded-full transition-all duration-300 ease-out",
                "flex items-center justify-center",
                isActive && "animate-pulse",
                {
                  // Active step - Primary Burgundy with scale animation
                  "w-4 h-4 bg-primary-burgundy dark:bg-dark-burgundy transform scale-125": isActive,
                  // Completed step - Primary Burgundy normal size
                  "w-3 h-3 bg-primary-burgundy dark:bg-dark-burgundy": isCompleted,
                  // Inactive step - Gray smaller size
                  "w-3 h-3 bg-secondary-warm-gray dark:bg-functional-disabled-gray": !isActive && !isCompleted,
                }
              )}
              aria-label={`Step ${stepNumber}${isActive ? ' (current)' : isCompleted ? ' (completed)' : ''}`}
            >
              {/* Inner content for accessibility */}
              <span className="sr-only">
                {isActive ? `Current step ${stepNumber}` : 
                 isCompleted ? `Completed step ${stepNumber}` : 
                 `Step ${stepNumber}`}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);

ProgressDots.displayName = "ProgressDots";

export { ProgressDots };