import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  aspectRatio?: number;
  variant?: "default" | "card" | "text" | "circle";
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  aspectRatio,
  variant = "default"
}) => {
  const baseClasses = "animate-pulse bg-gray-200 rounded-lg";

  const variantClasses = {
    default: "",
    card: "rounded-lg",
    text: "h-4 rounded",
    circle: "rounded-full"
  };

  const style = aspectRatio 
    ? { paddingTop: `${(1 / aspectRatio) * 100}%` }
    : undefined;

  if (variant === "text") {
    return (
      <div
        className={cn(baseClasses, variantClasses[variant], className)}
      />
    );
  }

  if (variant === "circle") {
    return (
      <div
        className={cn(baseClasses, variantClasses[variant], "w-full h-full", className)}
      />
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={style}
    >
      <div className={cn(
        aspectRatio ? "absolute inset-0" : "w-full h-full",
        baseClasses,
        variantClasses[variant]
      )} />
    </div>
  );
};

export { Skeleton };