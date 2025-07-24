"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            ? "bg-background-white/95 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="font-display font-bold text-xl md:text-2xl text-primary-charcoal dark:text-text-primary">
                Russell Roofing
              </div>
              <div className="hidden sm:block text-sm text-secondary-warm-gray">
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
                    "text-sm font-medium transition-colors hover:text-primary-burgundy",
                    "focus:outline-none focus:ring-2 focus:ring-primary-burgundy/20 focus:ring-offset-2 rounded-sm px-2 py-1",
                    isScrolled
                      ? "text-text-primary"
                      : "text-text-inverse"
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
                  variant="primary"
                  size="default"
                  className="whitespace-nowrap"
                >
                  Get Instant Estimate
                </Button>
              </div>
              
              <ThemeToggle />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "md:hidden p-2 rounded-lg transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary-burgundy/20 focus:ring-offset-2",
                  "hover:bg-primary-burgundy/10",
                  isScrolled
                    ? "text-text-primary"
                    : "text-text-inverse"
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