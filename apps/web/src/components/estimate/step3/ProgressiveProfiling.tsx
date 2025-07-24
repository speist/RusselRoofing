import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface HubSpotContact {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
}

export interface ProgressiveProfilingProps {
  email: string;
  onContactFound?: (contact: HubSpotContact) => void;
  className?: string;
}

const ProgressiveProfiling: React.FC<ProgressiveProfilingProps> = ({
  email,
  onContactFound,
  className
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);

  useEffect(() => {
    const checkExistingContact = async () => {
      if (!email || !email.includes('@')) return;

      setIsChecking(true);
      
      try {
        // In a real implementation, this would call the HubSpot API
        // For now, we'll simulate the API call
        const response = await fetch(`/api/hubspot/contact/${encodeURIComponent(email)}`);
        
        if (response.ok) {
          const contact = await response.json();
          setIsReturningVisitor(true);
          onContactFound?.(contact);
        }
      } catch (error) {
        // Silently fail - progressive profiling should not break the form
        console.error('Progressive profiling error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(checkExistingContact, 500);
    return () => clearTimeout(timeoutId);
  }, [email, onContactFound]);

  if (!isReturningVisitor || isChecking) return null;

  return (
    <div
      className={cn(
        "bg-accent-success-green/10 border border-accent-success-green/30 rounded-lg p-3",
        "animate-in fade-in-0 slide-in-from-top-2 duration-300",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-accent-success-green flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm font-medium text-accent-success-green">
          Welcome back! We&apos;ve pre-filled your information.
        </p>
      </div>
    </div>
  );
};

export { ProgressiveProfiling };