import React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface NextStepsProps {
  isEmergency?: boolean;
  className?: string;
}

const NextSteps: React.FC<NextStepsProps> = ({ isEmergency, className }) => {
  const handleCall = () => {
    window.location.href = 'tel:+15551234567';
  };

  const handleEmail = () => {
    window.location.href = 'mailto:info@russellroofing.com?subject=Estimate Follow-up';
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-lg border border-neutral-200 p-6", className)}>
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">
        What Happens Next?
      </h2>

      {/* Emergency Notice */}
      {isEmergency && (
        <div className="mb-6 p-4 bg-accent-alert-gold/10 border-2 border-accent-alert-gold rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-accent-alert-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Emergency Priority</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Our emergency response team will contact you within 2 hours during business hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Steps */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-burgundy text-white rounded-full flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <div>
            <h3 className="font-medium text-neutral-900">Schedule Your Consultation</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Book a convenient time for our expert to visit your property and provide a detailed assessment.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-burgundy text-white rounded-full flex items-center justify-center text-sm font-semibold">
            2
          </div>
          <div>
            <h3 className="font-medium text-neutral-900">Free On-Site Inspection</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Our certified professionals will assess your property and provide a comprehensive evaluation.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-burgundy text-white rounded-full flex items-center justify-center text-sm font-semibold">
            3
          </div>
          <div>
            <h3 className="font-medium text-neutral-900">Detailed Quote & Timeline</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Receive your final quote with project timeline and material specifications.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-burgundy text-white rounded-full flex items-center justify-center text-sm font-semibold">
            4
          </div>
          <div>
            <h3 className="font-medium text-neutral-900">Project Completion</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Professional installation with quality assurance and warranty protection.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">
          Need Immediate Assistance?
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button 
            onClick={handleCall}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Now
          </Button>
          
          <Button 
            onClick={handleEmail}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Us
          </Button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-center gap-6 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Licensed & Insured
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            GAF Master Elite
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            A+ BBB Rating
          </div>
        </div>
      </div>
    </div>
  );
};

export { NextSteps };