import React from "react";
import { EstimateDisplay } from "./EstimateDisplay";
import { ProjectSummary } from "./ProjectSummary";
import { CalendlyIntegration } from "./CalendlyIntegration";
import { PDFGenerator, PDFEstimateData } from "./PDFGenerator";
import { NextSteps } from "./NextSteps";
import { cn } from "@/lib/utils";

interface EstimateSuccessData {
  property: {
    propertyType: string;
    address: string;
  };
  project: {
    selectedServices: string[];
    fieldValues: Record<string, any>;
    estimateRange: {
      min: number;
      max: number;
    };
  };
  contact: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    preferredContact: 'phone' | 'email' | 'text';
    timePreference: string;
    isEmergency: boolean;
  };
}

export interface EstimateSuccessProps {
  estimateData: EstimateSuccessData;
  className?: string;
}

const EstimateSuccess: React.FC<EstimateSuccessProps> = ({ estimateData, className }) => {
  // Prepare PDF data
  const pdfData: PDFEstimateData = {
    customerInfo: {
      name: `${estimateData.contact.firstName} ${estimateData.contact.lastName}`,
      email: estimateData.contact.email,
      phone: estimateData.contact.phone,
      address: estimateData.property.address,
    },
    projectDetails: {
      propertyType: estimateData.property.propertyType,
      services: estimateData.project.selectedServices,
      estimateRange: estimateData.project.estimateRange,
      squareFootage: estimateData.project.fieldValues.squareFootage,
      fieldValues: estimateData.project.fieldValues,
    },
    additionalNotes: estimateData.contact.isEmergency 
      ? 'Emergency repair request - Priority processing required' 
      : undefined,
  };

  // Prepare Calendly data
  const customerName = `${estimateData.contact.firstName} ${estimateData.contact.lastName}`;

  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 py-8", className)}>
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-success-green/10 rounded-full mb-4">
          <svg className="w-10 h-10 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Thank You for Choosing Russell Roofing!
        </h1>
        <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
          Your estimate has been successfully generated. Review the details below and schedule your 
          free consultation to move forward with your project.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Estimate & Project Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estimate Display */}
          <EstimateDisplay
            estimateRange={estimateData.project.estimateRange}
            services={estimateData.project.selectedServices}
            propertyType={estimateData.property.propertyType}
            address={estimateData.property.address}
          />

          {/* Project Summary */}
          <ProjectSummary
            services={estimateData.project.selectedServices}
            fieldValues={estimateData.project.fieldValues}
            propertyType={estimateData.property.propertyType}
          />

          {/* Calendly Integration */}
          <CalendlyIntegration
            customerName={customerName}
            estimateRange={estimateData.project.estimateRange}
            services={estimateData.project.selectedServices}
          />
        </div>

        {/* Right Column - Actions & Next Steps */}
        <div className="space-y-6">
          {/* PDF Generator */}
          <PDFGenerator estimateData={pdfData} />

          {/* Next Steps */}
          <NextSteps isEmergency={estimateData.contact.isEmergency} />

          {/* Customer Testimonial */}
          <div className="bg-accent-warm-beige/10 rounded-xl p-6 border border-accent-warm-beige/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-accent-warm-beige" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <blockquote className="text-sm text-neutral-700 mb-3">
                  &quot;Russell Roofing exceeded our expectations. From the initial estimate to project 
                  completion, their team was professional, efficient, and delivered exceptional quality.&quot;
                </blockquote>
                <div className="text-xs text-neutral-500">
                  <p className="font-medium">Sarah M.</p>
                  <p>Verified Customer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-primary-burgundy text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Questions About Your Estimate?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(555) 123-ROOF</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@russellroofing.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Monday - Friday: 7AM - 6PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-12 text-center">
        <p className="text-neutral-500 text-sm">
          This estimate is valid for 30 days. Ready to get started?{' '}
          <button 
            onClick={() => document.getElementById('calendly-inline-widget')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-primary-burgundy hover:underline font-medium"
          >
            Schedule your consultation now
          </button>
        </p>
      </div>
    </div>
  );
};

export { EstimateSuccess };
export type { EstimateSuccessData };