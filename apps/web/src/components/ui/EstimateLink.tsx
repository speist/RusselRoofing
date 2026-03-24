"use client";

import Link from "next/link";
import React from "react";

interface EstimateLinkProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Renders a phone link on mobile and a /contact page link on desktop.
 * Uses CSS to show/hide the correct element so there's no layout shift.
 */
export function EstimateLink({ children, className }: EstimateLinkProps) {
  return (
    <>
      {/* Mobile: phone call */}
      <a
        href="tel:+12158877800"
        className={`${className || ''} md:hidden`}
      >
        {children}
      </a>
      {/* Desktop: contact page */}
      <Link
        href="/contact"
        className={`${className || ''} hidden md:inline-flex`}
      >
        {children}
      </Link>
    </>
  );
}
