"use client";

import { useEffect, useCallback } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

let scriptLoaded = false;
let scriptLoading = false;

function loadRecaptchaScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (!SITE_KEY) return Promise.resolve();

  if (scriptLoading) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (scriptLoaded) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  scriptLoading = true;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
    };
    script.onerror = () => {
      scriptLoading = false;
      reject(new Error("Failed to load reCAPTCHA script"));
    };
    document.head.appendChild(script);
  });
}

export function useRecaptcha() {
  useEffect(() => {
    loadRecaptchaScript();
  }, []);

  const getToken = useCallback(async (action: string): Promise<string | null> => {
    if (!SITE_KEY) {
      console.warn("[reCAPTCHA] Site key not configured, skipping");
      return null;
    }

    try {
      await loadRecaptchaScript();
      const token = await window.grecaptcha.execute(SITE_KEY, { action });
      return token;
    } catch (error) {
      console.error("[reCAPTCHA] Error getting token:", error);
      return null;
    }
  }, []);

  return { getToken };
}
