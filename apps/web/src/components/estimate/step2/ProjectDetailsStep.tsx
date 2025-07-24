import React, { useState, useEffect } from "react";
import { ServiceSelectionGrid, Service, DEFAULT_SERVICES } from "./ServiceSelectionGrid";
import { DynamicFields, DynamicFieldValues } from "./DynamicFields";
import { RealTimeEstimate } from "./RealTimeEstimate";
import { ProgressDots } from "../ProgressDots";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ProjectDetailsData {
  selectedServices: string[];
  fieldValues: DynamicFieldValues;
  estimateRange: {
    min: number;
    max: number;
  };
}

export interface ProjectDetailsStepProps {
  onNext?: (data: ProjectDetailsData) => void;
  onBack?: () => void;
  initialData?: ProjectDetailsData;
  propertyInfo?: {
    propertyType: string;
    propertySize: string;
    address: string;
  };
  className?: string;
}

const ProjectDetailsStep = React.forwardRef<HTMLDivElement, ProjectDetailsStepProps>(
  ({ onNext, onBack, initialData, propertyInfo, className }, ref) => {
    const [selectedServices, setSelectedServices] = useState<string[]>(
      initialData?.selectedServices || []
    );
    const [fieldValues, setFieldValues] = useState<DynamicFieldValues>(
      initialData?.fieldValues || {}
    );

    // Calculate if we can continue (at least one service selected)
    const canContinue = selectedServices.length > 0;

    // Simplified estimate calculation - the full calculation is done in RealTimeEstimate
    // This is only used for the onNext callback to pass the current estimate
    const calculateCurrentEstimate = () => {
      if (selectedServices.length === 0) {
        return { min: 0, max: 0 };
      }

      // Note: This is a simplified calculation.
      // The full calculation with all modifiers is in RealTimeEstimate component
      let totalMin = 0;
      let totalMax = 0;

      selectedServices.forEach(serviceId => {
        const service = DEFAULT_SERVICES.find(s => s.id === serviceId);
        if (!service) return;
        
        totalMin += service.basePrice.min;
        totalMax += service.basePrice.max;
      });

      return {
        min: Math.round(totalMin),
        max: Math.round(totalMax)
      };
    };

    const handleServiceToggle = (serviceId: string) => {
      setSelectedServices(prev => {
        if (prev.includes(serviceId)) {
          // Remove service and clear related field values
          const newSelected = prev.filter(id => id !== serviceId);
          
          // Clear related fields when service is deselected
          const newFieldValues = { ...fieldValues };
          if (serviceId === 'roofing' || serviceId === 'siding' || serviceId === 'insulation') {
            if (!newSelected.some(id => ['roofing', 'siding', 'insulation'].includes(id))) {
              delete newFieldValues.squareFootage;
            }
          }
          if (serviceId === 'gutters') {
            delete newFieldValues.linearFeet;
          }
          if (serviceId === 'chimney') {
            delete newFieldValues.chimneyCount;
          }
          if (serviceId === 'windows') {
            delete newFieldValues.windowCount;
            delete newFieldValues.windowSize;
          }
          if (serviceId === 'siding') {
            delete newFieldValues.sidingMaterial;
          }
          
          setFieldValues(newFieldValues);
          return newSelected;
        } else {
          return [...prev, serviceId];
        }
      });
    };

    const handleFieldValuesChange = (newValues: DynamicFieldValues) => {
      setFieldValues(newValues);
    };

    const handleNext = () => {
      if (!canContinue || !onNext) return;

      const data: ProjectDetailsData = {
        selectedServices,
        fieldValues,
        estimateRange: calculateCurrentEstimate()
      };

      onNext(data);
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
            currentStep={2} 
            totalSteps={3} 
            className="justify-center"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Project Details
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Tell us about your project so we can provide an accurate estimate.
            Select the services you need and provide project details.
          </p>
        </div>

        {/* Property Summary */}
        {propertyInfo && (
          <div className="mb-8 p-4 bg-neutral-50 rounded-lg border">
            <h3 className="font-semibold text-neutral-900 mb-2">Property Information</h3>
            <div className="text-sm text-neutral-600 space-y-1">
              <p><span className="font-medium">Address:</span> {propertyInfo.address}</p>
              <p><span className="font-medium">Type:</span> {propertyInfo.propertyType}</p>
              <p><span className="font-medium">Size:</span> {propertyInfo.propertySize}</p>
            </div>
          </div>
        )}

        {/* Service Selection */}
        <div className="mb-8">
          <ServiceSelectionGrid
            services={DEFAULT_SERVICES}
            selectedServices={selectedServices}
            onServiceToggle={handleServiceToggle}
          />
        </div>

        {/* Dynamic Fields */}
        {selectedServices.length > 0 && (
          <div className="mb-8">
            <DynamicFields
              selectedServices={selectedServices}
              values={fieldValues}
              onChange={handleFieldValuesChange}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mb-24">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Property Info
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canContinue}
            className="flex items-center gap-2"
          >
            Continue to Contact Info
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>

        {/* Real-time Estimate - Sticky Footer */}
        <RealTimeEstimate
          selectedServices={selectedServices}
          services={DEFAULT_SERVICES}
          fieldValues={fieldValues}
          propertyInfo={propertyInfo}
        />
      </div>
    );
  }
);

ProjectDetailsStep.displayName = "ProjectDetailsStep";

export { ProjectDetailsStep };