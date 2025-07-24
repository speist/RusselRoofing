import React, { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface CalendlyIntegrationProps {
  customerName?: string;
  estimateRange?: {
    min: number;
    max: number;
  };
  services?: string[];
  className?: string;
}

declare global {
  interface Window {
    Calendly: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, any>;
        utm?: Record<string, any>;
      }) => void;
    };
  }
}

const CalendlyIntegration: React.FC<CalendlyIntegrationProps> = ({
  customerName,
  estimateRange,
  services,
  className
}) => {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/russell-roofing/estimate-consultation';

  const initializeCalendlyWidget = useCallback(() => {
    const calendlyDiv = document.getElementById('calendly-inline-widget');
    if (calendlyDiv && window.Calendly) {
      const prefillData: Record<string, any> = {};
      
      if (customerName) {
        prefillData.name = customerName;
      }
      
      // Add estimate context as custom questions
      if (estimateRange) {
        prefillData.a1 = `$${estimateRange.min.toLocaleString()} - $${estimateRange.max.toLocaleString()}`;
      }
      
      if (services && services.length > 0) {
        prefillData.a2 = services.join(', ');
      }

      window.Calendly.initInlineWidget({
        url: calendlyUrl,
        parentElement: calendlyDiv,
        prefill: prefillData,
        utm: {
          utmSource: 'estimate_form',
          utmMedium: 'web',
          utmCampaign: 'estimate_completion'
        }
      });
    }
  }, [calendlyUrl, customerName, estimateRange, services]);

  useEffect(() => {
    // Check if Calendly script is already loaded
    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    
    if (existingScript) {
      // Script already exists, initialize widget directly
      initializeCalendlyWidget();
      return;
    }

    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = initializeCalendlyWidget;
    
    document.head.appendChild(script);

    return () => {
      // Cleanup widget content on unmount
      const calendlyDiv = document.getElementById('calendly-inline-widget');
      if (calendlyDiv) {
        calendlyDiv.innerHTML = `
          <div class="flex items-center justify-center h-full bg-neutral-50 rounded-lg">
            <div class="text-center">
              <div class="animate-spin w-8 h-8 border-4 border-primary-burgundy border-t-transparent rounded-full mx-auto mb-3"></div>
              <p class="text-sm text-neutral-600">Loading scheduling calendar...</p>
            </div>
          </div>
        `;
      }
    };
  }, [initializeCalendlyWidget]);

  return (
    <div className={cn("bg-white rounded-xl shadow-lg border border-neutral-200 p-6", className)}>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Schedule Your Free Consultation
        </h2>
        <p className="text-neutral-600">
          Book a convenient time for our expert to visit your property and provide a detailed quote.
        </p>
      </div>

      {/* Calendly Widget Container */}
      <div 
        id="calendly-inline-widget" 
        className="min-h-[500px] rounded-lg overflow-hidden"
        style={{ height: '500px' }}
      >
        {/* Loading state */}
        <div className="flex items-center justify-center h-full bg-neutral-50 rounded-lg">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-burgundy border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-sm text-neutral-600">Loading scheduling calendar...</p>
          </div>
        </div>
      </div>

      {/* Trust Elements */}
      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-neutral-500">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          No obligation
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Free consultation
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Expert advice
        </div>
      </div>
    </div>
  );
};

export { CalendlyIntegration };