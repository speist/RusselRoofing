import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={className}>
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              {...props}
              className="sr-only"
            />
            <div
              className={cn(
                "w-5 h-5 rounded border-2 transition-all duration-200",
                "flex items-center justify-center",
                props.checked
                  ? "bg-primary-burgundy border-primary-burgundy"
                  : "bg-white border-neutral-300 hover:border-primary-burgundy"
              )}
            >
              {props.checked && (
                <svg
                  className="w-3 h-3 text-white animate-in fade-in-0 zoom-in-50 duration-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
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
          {label && (
            <span className="text-sm text-neutral-700 leading-relaxed">
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1 ml-8 text-xs text-functional-error-red">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };