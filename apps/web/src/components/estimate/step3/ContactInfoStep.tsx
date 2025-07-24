import React, { useState, useRef, useEffect } from "react";
import { ContactForm, ContactFormData } from "./ContactForm";
import { ProgressiveProfiling, HubSpotContact } from "./ProgressiveProfiling";
import { SubmissionHandler, EstimateSubmissionData } from "./SubmissionHandler";
import { ProgressDots } from "../ProgressDots";
import { Button } from "@/components/ui/Button";
import { PropertyInfoData } from "../step1/PropertyInfoStep";
import { ProjectDetailsData } from "../step2/ProjectDetailsStep";
import { cn } from "@/lib/utils";

export interface ContactInfoStepProps {
  onNext?: (data: ContactFormData) => void;
  onBack?: () => void;
  onSubmit?: (data: EstimateSubmissionData) => void;
  initialData?: Partial<ContactFormData>;
  propertyInfo?: PropertyInfoData;
  projectDetails?: ProjectDetailsData;
  className?: string;
}

const ContactInfoStep = React.forwardRef<HTMLDivElement, ContactInfoStepProps>(
  ({ onNext, onBack, onSubmit, initialData, propertyInfo, projectDetails, className }, ref) => {
    const [formData, setFormData] = useState<Partial<ContactFormData>>(initialData || {});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const submissionHandler = useRef(new SubmissionHandler());

    // Save form data to localStorage on change
    useEffect(() => {
      const saveFormData = () => {
        try {
          const existingData = localStorage.getItem('estimate_form_data');
          const parsedData = existingData ? JSON.parse(existingData) : {};
          
          localStorage.setItem('estimate_form_data', JSON.stringify({
            ...parsedData,
            step3: formData
          }));
        } catch (error) {
          console.error('Error saving form data:', error);
        }
      };

      const debounceTimer = setTimeout(saveFormData, 500);
      return () => clearTimeout(debounceTimer);
    }, [formData]);

    const handleContactFound = (contact: HubSpotContact) => {
      setFormData(prev => ({
        ...prev,
        email: contact.email,
        firstName: contact.firstname || prev.firstName || '',
        lastName: contact.lastname || prev.lastName || '',
        phone: contact.phone || prev.phone || '',
      }));
    };

    const handleSubmit = async (data: ContactFormData) => {
      if (!propertyInfo || !projectDetails) {
        setSubmissionError('Missing required information. Please go back and complete all steps.');
        return;
      }

      setIsSubmitting(true);
      setSubmissionError(null);

      const submissionData: EstimateSubmissionData = {
        property: propertyInfo,
        project: projectDetails,
        contact: data
      };

      try {
        const result = await submissionHandler.current.submitEstimate(submissionData);
        
        if (result.success) {
          // Clear local storage on successful submission
          submissionHandler.current.clearLocalStorage();
          
          // Call the onSubmit callback if provided
          onSubmit?.(submissionData);
          
          // Or call onNext to proceed to success page
          onNext?.(data);
        } else {
          setSubmissionError(result.error || 'Failed to submit estimate request. Please try again.');
        }
      } catch (error) {
        setSubmissionError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleBack = () => {
      if (onBack) {
        onBack();
      }
    };

    return (
      <div ref={ref} className={cn("w-full max-w-4xl mx-auto", className)}>
        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressDots 
            currentStep={3} 
            totalSteps={3} 
            className="justify-center"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Contact Information
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Almost done! Please provide your contact information so we can send you 
            your personalized estimate and follow up with you.
          </p>
        </div>

        {/* Progressive Profiling Message */}
        <ProgressiveProfiling
          email={formData.email || ''}
          onContactFound={handleContactFound}
          className="mb-6"
        />

        {/* Contact Form */}
        <ContactForm
          ref={formRef}
          initialData={formData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          className="mb-8"
        />

        {/* Error Message */}
        {submissionError && (
          <div className="mb-6 p-4 bg-functional-error-red/10 border border-functional-error-red/30 rounded-lg">
            <p className="text-sm text-functional-error-red">{submissionError}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Project Details
          </Button>

          <Button
            onClick={() => formRef.current?.requestSubmit()}
            disabled={isSubmitting}
            className="flex items-center gap-2 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Get My Estimate
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }
);

ContactInfoStep.displayName = "ContactInfoStep";

export { ContactInfoStep };
export type { ContactFormData };