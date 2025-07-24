import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  previewImage: string;
  isSelected: boolean;
  onToggle: (serviceId: string) => void;
  className?: string;
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({ id, title, description, previewImage, isSelected, onToggle, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative cursor-pointer group",
          "border-2 rounded-lg overflow-hidden",
          "transition-all duration-350 ease-out",
          "hover:scale-105 hover:shadow-lg",
          isSelected 
            ? "border-primary-burgundy bg-primary-burgundy/5" 
            : "border-neutral-200 hover:border-primary-burgundy/30",
          className
        )}
        onClick={() => onToggle(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle(id);
          }
        }}
        aria-pressed={isSelected}
        aria-label={`Select ${title} service`}
      >
        {/* Checkbox overlay */}
        <div className="absolute top-3 right-3 z-10">
          <div
            className={cn(
              "w-6 h-6 rounded border-2 transition-all duration-200",
              "flex items-center justify-center",
              isSelected
                ? "bg-primary-burgundy border-primary-burgundy"
                : "bg-white border-neutral-300 group-hover:border-primary-burgundy"
            )}
          >
            {isSelected && (
              <svg
                className="w-4 h-4 text-white animate-in fade-in-0 zoom-in-50 duration-200"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Preview image */}
        <div className="relative h-48 overflow-hidden bg-neutral-100">
          <Image
            src={previewImage}
            alt={`${title} service preview`}
            fill
            className="object-cover transition-transform duration-350 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              // Fallback to a placeholder color if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {/* Fallback icon when image fails to load */}
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className={cn(
            "text-lg font-semibold mb-2 transition-colors",
            isSelected ? "text-primary-burgundy" : "text-neutral-900"
          )}>
            {title}
          </h3>
          <p className="text-neutral-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Selection indicator overlay */}
        {isSelected && (
          <div className="absolute inset-0 ring-2 ring-primary-burgundy ring-inset rounded-lg pointer-events-none" />
        )}
      </div>
    );
  }
);

ServiceCard.displayName = "ServiceCard";

export { ServiceCard };