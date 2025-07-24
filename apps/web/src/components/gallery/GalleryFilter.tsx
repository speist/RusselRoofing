"use client";

import React from "react";
import { ServiceCategory, serviceCategories } from "@/types/gallery";
import { cn } from "@/lib/utils";

export interface GalleryFilterProps {
  activeCategory: ServiceCategory;
  onCategoryChange: (category: ServiceCategory) => void;
  projectCounts?: Record<string, number>;
  className?: string;
}

const GalleryFilter: React.FC<GalleryFilterProps> = ({
  activeCategory,
  onCategoryChange,
  projectCounts = {},
  className
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2 mb-6", className)}>
      {serviceCategories.map((category) => {
        const count = projectCounts[category] || 0;
        const isActive = activeCategory === category;
        
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              "border-2 hover:scale-105 active:scale-95",
              isActive
                ? "bg-primary-burgundy text-white border-primary-burgundy shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-primary-burgundy hover:text-primary-burgundy"
            )}
          >
            {category}
            {count > 0 && (
              <span className={cn(
                "ml-2 px-2 py-0.5 rounded-full text-xs",
                isActive
                  ? "bg-white bg-opacity-20 text-white"
                  : "bg-gray-100 text-gray-600"
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

export { GalleryFilter };