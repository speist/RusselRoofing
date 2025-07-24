import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: "default" | "error" | "success";
  helperText?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", state = "default", helperText, label, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseClasses = "flex h-input w-full rounded-input border px-4 py-3 text-body font-body bg-background-white transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary-warm-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-surface dark:placeholder:text-functional-disabled-gray";
    
    const states = {
      default: "border-secondary-light-warm-gray focus-visible:ring-accent-trust-blue/20 focus-visible:border-accent-trust-blue dark:border-secondary-warm-gray/30 dark:focus-visible:border-accent-trust-blue",
      error: "border-functional-error-red focus-visible:ring-functional-error-red/20 focus-visible:border-functional-error-red",
      success: "border-accent-success-green focus-visible:ring-accent-success-green/20 focus-visible:border-accent-success-green"
    };
    
    const helperTextClasses = {
      default: "text-secondary-warm-gray dark:text-functional-disabled-gray",
      error: "text-functional-error-red",
      success: "text-accent-success-green"
    };

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-label font-medium text-primary-charcoal dark:text-white mb-2"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(baseClasses, states[state], className)}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={cn("mt-2 text-body-sm", helperTextClasses[state])}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };