"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  scrollThreshold?: number;
}

export function Header({ scrollThreshold = 100 }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger scroll when user scrolls past hero section
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-primary-burgundy shadow-lg" // Solid red background when scrolled
            : "bg-transparent" // Transparent initially
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <div className={cn(
                "font-display font-bold text-xl md:text-2xl transition-colors duration-300",
                isScrolled
                  ? "text-text-inverse" // White text when scrolled
                  : "text-text-inverse" // White text on transparent header too
              )}>
                Russell Roofing
              </div>
              <div className={cn(
                "hidden sm:block text-sm transition-colors duration-300",
                isScrolled
                  ? "text-text-inverse/80" // Slightly transparent white
                  : "text-text-inverse/80"
              )}>
                & Exteriors
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 rounded-sm px-2 py-1",
                    isScrolled
                      ? "text-text-inverse hover:text-white/80" // White text on red bg
                      : "text-text-inverse hover:text-white/80" // White text on transparent
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <Button
                  variant={isScrolled ? "secondary" : "primary"}
                  size="default"
                  className={cn(
                    "whitespace-nowrap transition-all duration-300",
                    !isScrolled && "bg-white text-primary-burgundy hover:bg-white/90"
                  )}
                >
                  Get Instant Estimate
                </Button>
              </div>
              
              <ThemeToggle className={cn(
                isScrolled ? "text-text-inverse hover:bg-white/10" : "text-text-inverse hover:bg-white/10"
              )} />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "md:hidden p-2 rounded-lg transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2",
                  isScrolled
                    ? "text-text-inverse hover:bg-white/10" // White icon on red bg
                    : "text-text-inverse hover:bg-white/10" // White icon on transparent
                )}
                aria-label="Open mobile menu"
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
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
      />
    </>
  );
}