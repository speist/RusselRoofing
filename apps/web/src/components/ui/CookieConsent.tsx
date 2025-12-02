"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

const COOKIE_CONSENT_KEY = "russell-roofing-cookie-consent";

export type CookieConsentValue = "accepted" | "declined" | null;

interface CookieConsentProps {
  onConsentChange?: (consent: CookieConsentValue) => void;
}

export function getCookieConsent(): CookieConsentValue {
  if (typeof window === "undefined") return null;
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (consent === "accepted" || consent === "declined") {
    return consent;
  }
  return null;
}

export function CookieConsent({ onConsentChange }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = getCookieConsent();
    if (consent === null) {
      // Small delay to allow page to load first
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Trigger animation after mount
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (value: "accepted" | "declined") => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setIsAnimating(false);
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
      onConsentChange?.(value);
      // Reload page to apply consent (load/unload tracking scripts)
      if (value === "accepted") {
        window.location.reload();
      }
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
        isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Text Content */}
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                We use cookies to enhance your browsing experience and analyze site traffic.
                By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies.
                <Link
                  href="/privacy-policy"
                  className="text-primary-burgundy hover:underline ml-1 font-medium"
                >
                  Learn more in our Privacy Policy
                </Link>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConsent("declined")}
                className="min-w-[100px]"
              >
                Decline
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleConsent("accepted")}
                className="min-w-[100px]"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
