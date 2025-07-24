import React from "react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatServicesDisplay } from "@/lib/estimate-utils";

export interface EstimateDisplayProps {
  estimateRange: {
    min: number;
    max: number;
  };
  services: string[];
  propertyType: string;
  address: string;
  className?: string;
}

const EstimateDisplay: React.FC<EstimateDisplayProps> = ({
  estimateRange,
  services,
  propertyType,
  address,
  className
}) => {

  return (
    <div className={cn("bg-white rounded-xl shadow-lg border border-neutral-200 p-8", className)}>
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-success-green/10 rounded-full mb-4">
          <svg className="w-8 h-8 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Your Estimate is Ready!
        </h1>
        <p className="text-lg text-neutral-600">
          Thank you for choosing Russell Roofing. Here&apos;s your personalized estimate.
        </p>
      </div>

      {/* Estimate Range */}
      <div className="bg-primary-burgundy/5 rounded-lg p-6 mb-6 text-center">
        <p className="text-sm font-medium text-neutral-600 mb-2">Your Estimate</p>
        <div className="text-4xl font-bold text-primary-burgundy mb-2">
          {formatCurrency(estimateRange.min)} - {formatCurrency(estimateRange.max)}
        </div>
        <p className="text-sm text-neutral-500">
          *Final pricing subject to on-site inspection
        </p>
      </div>

      {/* Project Summary */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-neutral-100">
          <span className="text-sm font-medium text-neutral-600">Project</span>
          <span className="text-sm text-neutral-900">{formatServicesDisplay(services)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-neutral-100">
          <span className="text-sm font-medium text-neutral-600">Property</span>
          <span className="text-sm text-neutral-900">{propertyType}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-neutral-600">Address</span>
          <span className="text-sm text-neutral-900 text-right max-w-xs truncate">{address}</span>
        </div>
      </div>
    </div>
  );
};

export { EstimateDisplay };