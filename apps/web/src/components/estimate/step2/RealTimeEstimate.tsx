import React from "react";
import { cn } from "@/lib/utils";
import { Service } from "./ServiceSelectionGrid";
import { DynamicFieldValues } from "./DynamicFields";

export interface EstimateRange {
  min: number;
  max: number;
}

export interface RealTimeEstimateProps {
  selectedServices: string[];
  services: Service[];
  fieldValues: DynamicFieldValues;
  propertyInfo?: {
    propertyType: string;
    propertySize: string;
  };
  className?: string;
}

const RealTimeEstimate = React.forwardRef<HTMLDivElement, RealTimeEstimateProps>(
  ({ selectedServices, services, fieldValues, propertyInfo, className }, ref) => {
    const calculateEstimate = (): EstimateRange => {
      if (selectedServices.length === 0) {
        return { min: 0, max: 0 };
      }

      let totalMin = 0;
      let totalMax = 0;

      selectedServices.forEach(serviceId => {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;

        let serviceMin = service.basePrice.min;
        let serviceMax = service.basePrice.max;

        // Apply modifiers based on field values
        if (service.priceModifiers?.perSquareFoot && fieldValues.squareFootage) {
          const sqftMultiplier = fieldValues.squareFootage / 1000; // Base price per 1000 sq ft
          serviceMin *= sqftMultiplier;
          serviceMax *= sqftMultiplier;
        }

        if (service.priceModifiers?.perLinearFoot && fieldValues.linearFeet) {
          const linearMultiplier = fieldValues.linearFeet / 100; // Base price per 100 linear ft
          serviceMin *= linearMultiplier;
          serviceMax *= linearMultiplier;
        }

        if (service.priceModifiers?.perUnit) {
          let unitCount = 1;
          if (serviceId === 'chimney' && fieldValues.chimneyCount) {
            unitCount = fieldValues.chimneyCount;
          } else if (serviceId === 'windows' && fieldValues.windowCount) {
            unitCount = fieldValues.windowCount;
            // Apply size multiplier
            if (fieldValues.windowSize === 'large') {
              serviceMin *= 1.5;
              serviceMax *= 1.5;
            } else if (fieldValues.windowSize === 'custom') {
              serviceMin *= 2;
              serviceMax *= 2;
            }
          }
          serviceMin *= unitCount;
          serviceMax *= unitCount;
        }

        // Apply property type modifiers
        if (propertyInfo?.propertyType) {
          const complexityMultiplier = getComplexityMultiplier(propertyInfo.propertyType);
          serviceMin *= complexityMultiplier;
          serviceMax *= complexityMultiplier;
        }

        // Apply material modifiers for siding
        if (serviceId === 'siding' && fieldValues.sidingMaterial) {
          const materialMultiplier = getMaterialMultiplier(fieldValues.sidingMaterial);
          serviceMin *= materialMultiplier;
          serviceMax *= materialMultiplier;
        }

        totalMin += serviceMin;
        totalMax += serviceMax;
      });

      return {
        min: Math.round(totalMin),
        max: Math.round(totalMax)
      };
    };

    const getComplexityMultiplier = (propertyType: string): number => {
      switch (propertyType) {
        case 'single-family':
          return 1.0;
        case 'multi-family':
          return 1.3;
        case 'commercial':
          return 1.5;
        case 'historic':
          return 1.4;
        default:
          return 1.0;
      }
    };

    const getMaterialMultiplier = (material: string): number => {
      switch (material) {
        case 'vinyl':
          return 1.0;
        case 'fiber-cement':
          return 1.4;
        case 'wood':
          return 1.8;
        default:
          return 1.0;
      }
    };

    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const estimate = calculateEstimate();

    if (selectedServices.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "sticky bottom-0 left-0 right-0 z-10",
          "bg-white border-t border-neutral-200 shadow-lg",
          "px-6 py-4",
          className
        )}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary-burgundy rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-neutral-700">
                  Estimated Project Cost
                </span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold text-primary-burgundy">
                  {formatCurrency(estimate.min)} - {formatCurrency(estimate.max)}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Estimate updates in real-time based on your selections
              </p>
            </div>

            {/* Service breakdown indicator */}
            <div className="text-right">
              <div className="text-sm text-neutral-600">
                {selectedServices.length} service{selectedServices.length === 1 ? '' : 's'} selected
              </div>
              <div className="text-xs text-neutral-500">
                {fieldValues.squareFootage && `${fieldValues.squareFootage.toLocaleString()} sq ft`}
                {fieldValues.linearFeet && ` • ${fieldValues.linearFeet} linear ft`}
                {fieldValues.chimneyCount && ` • ${fieldValues.chimneyCount} chimney${fieldValues.chimneyCount === 1 ? '' : 's'}`}
                {fieldValues.windowCount && ` • ${fieldValues.windowCount} window${fieldValues.windowCount === 1 ? '' : 's'}`}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <p className="text-xs text-neutral-500 text-center">
              This is a preliminary estimate. Final pricing may vary based on site conditions, 
              material choices, and project complexity. A detailed quote will be provided after consultation.
            </p>
          </div>
        </div>
      </div>
    );
  }
);

RealTimeEstimate.displayName = "RealTimeEstimate";

export { RealTimeEstimate };