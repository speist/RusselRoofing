import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  className
}) => {
  const variantClasses = {
    primary: "bg-primary-burgundy text-white",
    secondary: "bg-secondary-warm-gray text-white",
    success: "bg-accent-success-green text-white",
    warning: "bg-functional-warning-orange text-white",
    error: "bg-functional-error-red text-white",
    info: "bg-functional-info-blue text-white"
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        "transition-colors duration-200",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export { Badge };