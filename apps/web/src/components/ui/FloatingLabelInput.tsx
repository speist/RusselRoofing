import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, success, className, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setHasValue(!!e.target.value);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const isFloating = focused || hasValue || !!props.value;

    return (
      <div className="relative">
        <input
          ref={ref}
          {...props}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "w-full px-3 pt-6 pb-2 text-neutral-900 bg-white border rounded-lg",
            "focus:outline-none focus:ring-2 transition-all duration-200",
            error
              ? "border-functional-error-red focus:ring-functional-error-red/20 focus:border-functional-error-red"
              : success
              ? "border-accent-success-green focus:ring-accent-success-green/20 focus:border-accent-success-green"
              : "border-neutral-200 focus:ring-primary-burgundy/20 focus:border-primary-burgundy",
            className
          )}
          placeholder=" "
        />
        <label
          htmlFor={props.id}
          className={cn(
            "absolute left-3 transition-all duration-200 pointer-events-none",
            isFloating
              ? "top-1.5 text-xs"
              : "top-4 text-base",
            focused
              ? "text-primary-burgundy"
              : error
              ? "text-functional-error-red"
              : success
              ? "text-accent-success-green"
              : "text-neutral-500"
          )}
        >
          {label}
        </label>
        {success && (
          <div className="absolute right-3 top-4">
            <svg className="w-5 h-5 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-functional-error-red">{error}</p>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };