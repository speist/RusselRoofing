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
    { href: "/community", label: "Community" },
    { href: "/careers", label: "Careers" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          "bg-primary-burgundy shadow-lg" // Always red background
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="font-display font-bold text-xl md:text-2xl text-text-inverse">
                Russell Roofing
              </div>
              <div className="hidden sm:block text-sm text-text-inverse/80">
                & Exteriors
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-text-inverse hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 rounded-sm px-2 py-1"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <Link href="/contact">
                  <Button
                    variant="secondary"
                    size="default"
                    className="whitespace-nowrap bg-white text-primary-burgundy hover:bg-white/90"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
              
              <ThemeToggle className="text-text-inverse hover:bg-white/10" />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-text-inverse hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2"
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