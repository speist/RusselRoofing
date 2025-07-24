import React from "react";
import { cn } from "@/lib/utils";

export interface PropertyType {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface PropertyTypeCardProps {
  propertyType: PropertyType;
  selected: boolean;
  onSelect: (id: string) => void;
}

const PropertyTypeCard = React.forwardRef<HTMLButtonElement, PropertyTypeCardProps>(
  ({ propertyType, selected, onSelect }, ref) => {
    return (
      <button
        ref={ref}
        onClick={() => onSelect(propertyType.id)}
        className={cn(
          // Base styles
          "group relative flex flex-col items-center justify-center",
          "h-[200px] w-full rounded-lg border-2",
          "bg-background-white dark:bg-dark-surface",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-burgundy/20",
          
          // Hover states
          "hover:transform hover:-translate-y-1 hover:shadow-lg",
          
          // Selected state
          selected
            ? "border-primary-burgundy bg-primary-burgundy/5 dark:bg-dark-burgundy/10"
            : "border-secondary-light-warm-gray dark:border-secondary-warm-gray/30 hover:border-primary-burgundy/50",
          
          // Mobile responsive
          "md:w-auto"
        )}
        type="button"
        role="radio"
        aria-checked={selected}
        aria-labelledby={`property-type-${propertyType.id}-label`}
      >
        {/* Icon container */}
        <div className={cn(
          "mb-4 p-3 rounded-full transition-colors duration-200",
          "border-2",
          selected 
            ? "border-primary-burgundy bg-primary-burgundy text-white"
            : "border-primary-burgundy text-primary-burgundy group-hover:bg-primary-burgundy/10"
        )}>
          <div className="w-12 h-12 flex items-center justify-center">
            {propertyType.icon}
          </div>
        </div>
        
        {/* Label */}
        <span 
          id={`property-type-${propertyType.id}-label`}
          className={cn(
            "text-label font-medium transition-colors duration-200",
            selected 
              ? "text-primary-burgundy dark:text-dark-burgundy" 
              : "text-primary-charcoal dark:text-white group-hover:text-primary-burgundy"
          )}
        >
          {propertyType.label}
        </span>

        {/* Selection indicator */}
        {selected && (
          <div className="absolute top-2 right-2">
            <div className="w-5 h-5 bg-primary-burgundy rounded-full flex items-center justify-center">
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path 
                  d="M10 3L4.5 8.5L2 6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
      </button>
    );
  }
);

PropertyTypeCard.displayName = "PropertyTypeCard";

export { PropertyTypeCard };