"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface NavigationItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
}

export function MobileMenu({ isOpen, onClose, navigationItems }: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background-white dark:bg-background-dark",
          "transform transition-transform duration-250 ease-out shadow-2xl",
          "flex flex-col"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-light-warm-gray dark:border-secondary-warm-gray">
          <div className="font-display font-bold text-lg text-primary-charcoal dark:text-text-primary">
            Russell Roofing
          </div>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary-burgundy/20 focus:ring-offset-2",
              "hover:bg-primary-burgundy/10 text-text-primary"
            )}
            aria-label="Close mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-8">
          <ul className="space-y-6">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "block py-3 px-4 text-lg font-medium transition-colors rounded-lg",
                    "text-text-primary hover:text-primary-burgundy hover:bg-primary-burgundy/5",
                    "focus:outline-none focus:ring-2 focus:ring-primary-burgundy/20 focus:ring-offset-2",
                    "touch-manipulation min-h-[44px] flex items-center"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Button */}
        <div className="p-6 border-t border-secondary-light-warm-gray dark:border-secondary-warm-gray">
          <Link href="/contact">
            <Button
              variant="primary"
              size="lg"
              className="w-full touch-manipulation min-h-[44px]"
              onClick={onClose}
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}