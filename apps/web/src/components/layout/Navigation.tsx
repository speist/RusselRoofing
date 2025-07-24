"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  label: string;
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  textColor?: "light" | "dark";
}

export function Navigation({ items, className, textColor = "dark" }: NavigationProps) {
  return (
    <nav className={cn("flex items-center space-x-8", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary-burgundy",
            "focus:outline-none focus:ring-2 focus:ring-primary-burgundy/20 focus:ring-offset-2 rounded-sm px-2 py-1",
            textColor === "light" 
              ? "text-text-inverse hover:text-white" 
              : "text-text-primary hover:text-primary-burgundy"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}