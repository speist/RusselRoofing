import React from "react";
import { cn } from "@/lib/utils";

export interface EmergencyBannerProps {
  isVisible: boolean;
  className?: string;
}

const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ isVisible, className }) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "bg-accent-alert-gold/10 border-2 border-accent-alert-gold rounded-lg p-4",
        "animate-in slide-in-from-top-2 fade-in-0 duration-300",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-accent-alert-gold"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-neutral-900">
            Emergency Request - Priority Processing
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Your request will be flagged for expedited processing. Our emergency response team 
            will contact you within 2 hours during business hours or first thing the next business day.
          </p>
        </div>
      </div>
    </div>
  );
};

export { EmergencyBanner };