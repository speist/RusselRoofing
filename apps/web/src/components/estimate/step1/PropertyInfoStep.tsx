"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { PropertyTypeCard, PropertyType } from "../PropertyTypeCard";
import { ProgressDots } from "../ProgressDots";
import { AddressInput } from "../AddressInput";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Property type definitions with icons
const propertyTypes: PropertyType[] = [
  {
    id: "single-family",
    label: "Single Family",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18"/>
        <path d="M5 21V7l8-4v18"/>
        <path d="M19 21V11l-6-4"/>
        <path d="M9 9v.01"/>
        <path d="M9 12v.01"/>
        <path d="M9 15v.01"/>
        <path d="M9 18v.01"/>
      </svg>
    )
  },
  {
    id: "multi-family",
    label: "Multi-Family",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18"/>
        <path d="M4 21V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13"/>
        <path d="M8 12h.01"/>
        <path d="M12 12h.01"/>
        <path d="M16 12h.01"/>
        <path d="M8 16h.01"/>
        <path d="M12 16h.01"/>
        <path d="M16 16h.01"/>
        <path d="M8 8h.01"/>
        <path d="M12 8h.01"/>
        <path d="M16 8h.01"/>
      </svg>
    )
  },
  {
    id: "commercial",
    label: "Commercial",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18"/>
        <path d="M4 21V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v17"/>
        <path d="M8 7h.01"/>
        <path d="M12 7h.01"/>
        <path d="M16 7h.01"/>
        <path d="M8 11h.01"/>
        <path d="M12 11h.01"/>
        <path d="M16 11h.01"/>
        <path d="M8 15h.01"/>
        <path d="M12 15h.01"/>
        <path d="M16 15h.01"/>
      </svg>
    )
  }
];

export interface PropertyInfoData {
  propertyType: string;
  address: string;
  placeDetails?: google.maps.places.PlaceResult;
}

export interface PropertyInfoStepProps {
  onNext: (data: PropertyInfoData) => void;
  initialData?: Partial<PropertyInfoData>;
  className?: string;
}

const PropertyInfoStep = React.forwardRef<HTMLDivElement, PropertyInfoStepProps>(
  ({ onNext, initialData, className }, ref) => {
    const { control, handleSubmit, watch, formState: { isValid } } = useForm<PropertyInfoData>({
      mode: "onChange",
      defaultValues: {
        propertyType: initialData?.propertyType || "",
        address: initialData?.address || "",
        placeDetails: initialData?.placeDetails
      }
    });

    const selectedPropertyType = watch("propertyType");

    const onSubmit = (data: PropertyInfoData) => {
      onNext(data);
    };

    return (
      <div ref={ref} className={cn("w-full max-w-4xl mx-auto", className)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Progress Indicator */}
          <div className="flex justify-center">
            <ProgressDots currentStep={1} totalSteps={3} />
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-display-md font-display text-primary-charcoal dark:text-white">
              Property Information
            </h1>
            <p className="text-body text-secondary-warm-gray dark:text-functional-disabled-gray">
              Tell us about your property to get started with your estimate
            </p>
          </div>

          {/* Property Type Selection */}
          <div className="space-y-4">
            <h2 className="text-heading-sm font-heading text-primary-charcoal dark:text-white">
              What type of property is this?
            </h2>
            
            <Controller
              name="propertyType"
              control={control}
              rules={{ required: "Please select a property type" }}
              render={({ field }) => (
                <div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  role="radiogroup"
                  aria-labelledby="property-type-heading"
                >
                  {propertyTypes.map((type) => (
                    <PropertyTypeCard
                      key={type.id}
                      propertyType={type}
                      selected={field.value === type.id}
                      onSelect={(id) => field.onChange(id)}
                    />
                  ))}
                </div>
              )}
            />
          </div>

          {/* Address Input - Only show when property type is selected */}
          {selectedPropertyType && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-250">
              <h2 className="text-heading-sm font-heading text-primary-charcoal dark:text-white">
                What&apos;s the property address?
              </h2>
              
              <Controller
                name="address"
                control={control}
                rules={{ required: "Please enter a valid address" }}
                render={({ field }) => (
                  <AddressInput
                    value={field.value}
                    onChange={(address, placeDetails) => {
                      field.onChange(address);
                      // Also update placeDetails if available
                      if (placeDetails) {
                        // This is a bit of a hack, but we need to store placeDetails somehow
                        // In a real app, you might want to use a separate form field or context
                      }
                    }}
                    placeholder="Start typing your address..."
                  />
                )}
              />
            </div>
          )}

          {/* Continue Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={!isValid || !selectedPropertyType}
              className={cn(
                "min-w-[160px]",
                !isValid || !selectedPropertyType
                  ? "bg-functional-disabled-gray hover:bg-functional-disabled-gray cursor-not-allowed"
                  : ""
              )}
            >
              Continue to Project Details
            </Button>
          </div>
        </form>
      </div>
    );
  }
);

PropertyInfoStep.displayName = "PropertyInfoStep";

export { PropertyInfoStep };