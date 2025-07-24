"use client";

import React, { useState } from "react";
import { PropertyInfoStep, PropertyInfoData } from "./step1/PropertyInfoStep";
import { ProjectDetailsStep, ProjectDetailsData } from "./step2/ProjectDetailsStep";
import { ContactInfoStep, ContactFormData } from "./step3/ContactInfoStep";

export interface EstimateFormData {
  step1: PropertyInfoData;
  step2: ProjectDetailsData;
  step3: ContactFormData;
}

export interface EstimateFormProps {
  onComplete?: (data: EstimateFormData) => void;
  className?: string;
}

const EstimateForm = React.forwardRef<HTMLDivElement, EstimateFormProps>(
  ({ onComplete, className }, ref) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<EstimateFormData>>({});

    const handleStep1Next = (data: PropertyInfoData) => {
      setFormData(prev => ({ ...prev, step1: data }));
      setCurrentStep(2);
    };

    const handleStep2Next = (data: ProjectDetailsData) => {
      setFormData(prev => ({ ...prev, step2: data }));
      setCurrentStep(3);
    };

    const handleStep2Back = () => {
      setCurrentStep(1);
    };

    const handleStep3Next = (data: ContactFormData) => {
      const completeData = { ...formData, step3: data } as EstimateFormData;
      setFormData(completeData);
      
      // Call onComplete if provided
      if (onComplete) {
        onComplete(completeData);
      }
    };

    const handleStep3Back = () => {
      setCurrentStep(2);
    };

    const renderCurrentStep = () => {
      switch (currentStep) {
        case 1:
          return (
            <PropertyInfoStep
              onNext={handleStep1Next}
              initialData={formData.step1}
            />
          );
        case 2:
          return (
            <ProjectDetailsStep
              onNext={handleStep2Next}
              onBack={handleStep2Back}
              initialData={formData.step2}
              propertyInfo={formData.step1 ? {
                propertyType: formData.step1.propertyType,
                propertySize: "Medium", // This could be determined from property type or other factors
                address: formData.step1.address
              } : undefined}
            />
          );
        case 3:
          return (
            <ContactInfoStep
              onNext={handleStep3Next}
              onBack={handleStep3Back}
              initialData={formData.step3}
              propertyInfo={formData.step1}
              projectDetails={formData.step2}
            />
          );
        default:
          return (
            <PropertyInfoStep
              onNext={handleStep1Next}
              initialData={formData.step1}
            />
          );
      }
    };

    return (
      <div ref={ref} className={className}>
        {renderCurrentStep()}
      </div>
    );
  }
);

EstimateForm.displayName = "EstimateForm";

export { EstimateForm };