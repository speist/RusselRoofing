"use client";

import React, { useEffect, useState } from "react";
import { CookieConsent, getCookieConsent, CookieConsentValue } from "./ui/CookieConsent";

export function TrackingScripts() {
  const [consent, setConsent] = useState<CookieConsentValue>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setConsent(getCookieConsent());
  }, []);

  const handleConsentChange = (newConsent: CookieConsentValue) => {
    setConsent(newConsent);
  };

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <CookieConsent onConsentChange={handleConsentChange} />

    </>
  );
}
