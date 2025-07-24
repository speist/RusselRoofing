import React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  className?: string;
  error?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ options, value, onChange, name, className, error }, ref) => {
    return (
      <div ref={ref} className={className}>
        <div className="flex gap-3" role="radiogroup">
          {options.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex-1 cursor-pointer rounded-lg border-2 p-3 transition-all duration-200",
                "hover:border-primary-burgundy/50",
                value === option.value
                  ? "border-primary-burgundy bg-primary-burgundy/5"
                  : "border-neutral-200 bg-white"
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center justify-center gap-2">
                {option.icon && (
                  <span className={cn(
                    "transition-colors",
                    value === option.value ? "text-primary-burgundy" : "text-neutral-600"
                  )}>
                    {option.icon}
                  </span>
                )}
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  value === option.value ? "text-primary-burgundy" : "text-neutral-700"
                )}>
                  {option.label}
                </span>
              </div>
            </label>
          ))}
        </div>
        {error && (
          <p className="mt-1 text-xs text-functional-error-red">{error}</p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup };