import React from "react";
import { cn } from "@/lib/utils";
import { capitalizeString } from "@/lib/estimate-utils";

export interface ProjectSummaryProps {
  services: string[];
  fieldValues: Record<string, any>;
  propertyType: string;
  className?: string;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  services,
  fieldValues,
  propertyType,
  className
}) => {
  const getServiceDetails = (serviceId: string) => {
    const details: string[] = [];
    
    switch (serviceId) {
      case 'roofing':
        if (fieldValues.squareFootage) {
          details.push(`${fieldValues.squareFootage} sq ft`);
        }
        break;
      case 'gutters':
        if (fieldValues.linearFeet) {
          details.push(`${fieldValues.linearFeet} linear feet`);
        }
        break;
      case 'siding':
        if (fieldValues.sidingMaterial) {
          details.push(`${fieldValues.sidingMaterial} material`);
        }
        if (fieldValues.squareFootage) {
          details.push(`${fieldValues.squareFootage} sq ft`);
        }
        break;
      case 'windows':
        if (fieldValues.windowCount) {
          details.push(`${fieldValues.windowCount} windows`);
        }
        if (fieldValues.windowSize) {
          details.push(`${fieldValues.windowSize} size`);
        }
        break;
      case 'chimney':
        if (fieldValues.chimneyCount) {
          details.push(`${fieldValues.chimneyCount} chimney${fieldValues.chimneyCount > 1 ? 's' : ''}`);
        }
        break;
      case 'insulation':
        if (fieldValues.squareFootage) {
          details.push(`${fieldValues.squareFootage} sq ft`);
        }
        break;
    }
    
    return details;
  };

  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case 'roofing':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v2z" />
          </svg>
        );
      case 'gutters':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      case 'siding':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        );
      case 'windows':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'chimney':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        );
      case 'insulation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };


  return (
    <div className={cn("bg-white rounded-xl shadow-lg border border-neutral-200 p-6", className)}>
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">Project Summary</h2>
      
      {/* Property Type */}
      <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
        <p className="text-sm font-medium text-neutral-600 mb-1">Property Type</p>
        <p className="text-lg font-semibold text-neutral-900">{propertyType}</p>
      </div>

      {/* Selected Services */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-neutral-900 mb-3">Selected Services</h3>
        {services.map((serviceId) => {
          const details = getServiceDetails(serviceId);
          return (
            <div key={serviceId} className="flex items-start gap-3 p-3 border border-neutral-100 rounded-lg">
              <div className="flex-shrink-0 p-2 bg-primary-burgundy/10 rounded-lg text-primary-burgundy">
                {getServiceIcon(serviceId)}
              </div>
              <div className="flex-1">
                <h4 className="text-base font-medium text-neutral-900 mb-1">
                  {capitalizeString(serviceId)}
                </h4>
                {details.length > 0 && (
                  <p className="text-sm text-neutral-600">
                    {details.join(' • ')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Notes */}
      <div className="mt-6 p-4 bg-accent-warm-beige/10 rounded-lg">
        <p className="text-sm text-neutral-600">
          <strong>Note:</strong> This estimate is based on the information provided and standard pricing. 
          A final quote will be prepared after our on-site inspection.
        </p>
      </div>
    </div>
  );
};

export { ProjectSummary };