import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-button text-button font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-primary-burgundy text-white hover:bg-primary-burgundy/90 focus-visible:ring-primary-burgundy/20 dark:bg-dark-burgundy dark:hover:bg-dark-burgundy/90",
      secondary: "border-2 border-primary-burgundy text-primary-burgundy bg-transparent hover:bg-primary-burgundy hover:text-white focus-visible:ring-primary-burgundy/20 dark:border-dark-burgundy dark:text-dark-burgundy dark:hover:bg-dark-burgundy dark:hover:text-white",
      outline: "border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 focus-visible:ring-neutral-300/20 dark:border-neutral-600 dark:text-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700",
      ghost: "text-primary-burgundy hover:bg-primary-burgundy/10 focus-visible:ring-primary-burgundy/20 dark:text-dark-burgundy dark:hover:bg-dark-burgundy/10"
    };
    
    const sizes = {
      default: "h-button px-6 py-3",
      sm: "h-9 px-4 py-2 text-sm",
      lg: "h-14 px-8 py-4 text-lg"
    };

    if (asChild) {
      return (
        <div
          className={cn(baseClasses, variants[variant], sizes[size], className)}
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        />
      );
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };