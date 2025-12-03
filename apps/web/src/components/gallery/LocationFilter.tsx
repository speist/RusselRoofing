"use client";

import React from "react";
import { LOCATION_AREAS, type LocationArea } from "@/lib/service-areas";
import { cn } from "@/lib/utils";

export interface LocationFilterProps {
  activeLocation: LocationArea;
  onLocationChange: (location: LocationArea) => void;
  locationCounts?: Record<string, number>;
  className?: string;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  activeLocation,
  onLocationChange,
  locationCounts = {},
  className
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <span className="flex items-center text-sm font-medium text-gray-600 mr-2">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Location:
      </span>
      {LOCATION_AREAS.map((location) => {
        const count = locationCounts[location] || 0;
        const isActive = activeLocation === location;

        return (
          <button
            key={location}
            onClick={() => onLocationChange(location)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              "border hover:scale-105 active:scale-95",
              isActive
                ? "bg-accent-trust-blue text-white border-accent-trust-blue shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-accent-trust-blue hover:text-accent-trust-blue"
            )}
          >
            {location}
            {count > 0 && (
              <span className={cn(
                "ml-1.5 px-1.5 py-0.5 rounded-full text-xs",
                isActive
                  ? "bg-white bg-opacity-20 text-white"
                  : "bg-gray-100 text-gray-500"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export { LocationFilter };
