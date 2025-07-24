import React from "react";
import { ServiceCard } from "./ServiceCard";
import { cn } from "@/lib/utils";

export interface Service {
  id: string;
  title: string;
  description: string;
  previewImage: string;
  basePrice: {
    min: number;
    max: number;
  };
  priceModifiers?: {
    perSquareFoot?: boolean;
    perLinearFoot?: boolean;
    perUnit?: boolean;
  };
}

export interface ServiceSelectionGridProps {
  services: Service[];
  selectedServices: string[];
  onServiceToggle: (serviceId: string) => void;
  className?: string;
}

// Default services data
const DEFAULT_SERVICES: Service[] = [
  {
    id: "roofing",
    title: "Roofing",
    description: "Complete roof replacement, repair, and maintenance services",
    previewImage: "/images/services/roofing-preview.jpg",
    basePrice: { min: 8000, max: 25000 },
    priceModifiers: { perSquareFoot: true }
  },
  {
    id: "siding",
    title: "Siding",
    description: "Vinyl, fiber cement, and wood siding installation and repair",
    previewImage: "/images/services/siding-preview.jpg",
    basePrice: { min: 5000, max: 18000 },
    priceModifiers: { perSquareFoot: true }
  },
  {
    id: "gutters",
    title: "Gutters",
    description: "Seamless gutter installation, repair, and gutter guard systems",
    previewImage: "/images/services/gutters-preview.jpg",
    basePrice: { min: 1200, max: 4500 },
    priceModifiers: { perLinearFoot: true }
  },
  {
    id: "windows",
    title: "Windows",
    description: "Energy-efficient window replacement and storm window installation",
    previewImage: "/images/services/windows-preview.jpg",
    basePrice: { min: 300, max: 1200 },
    priceModifiers: { perUnit: true }
  },
  {
    id: "chimney",
    title: "Chimney Services",
    description: "Chimney repair, cleaning, cap installation, and waterproofing",
    previewImage: "/images/services/chimney-preview.jpg",
    basePrice: { min: 500, max: 3000 },
    priceModifiers: { perUnit: true }
  },
  {
    id: "insulation",
    title: "Insulation",
    description: "Attic insulation, wall insulation, and energy efficiency upgrades",
    previewImage: "/images/services/insulation-preview.jpg",
    basePrice: { min: 1500, max: 5000 },
    priceModifiers: { perSquareFoot: true }
  }
];

const ServiceSelectionGrid = React.forwardRef<HTMLDivElement, ServiceSelectionGridProps>(
  ({ services = DEFAULT_SERVICES, selectedServices, onServiceToggle, className }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)}>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Select Services
          </h2>
          <p className="text-neutral-600">
            Choose the services you need for your project. You can select multiple services.
          </p>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              previewImage={service.previewImage}
              isSelected={selectedServices.includes(service.id)}
              onToggle={onServiceToggle}
            />
          ))}
        </div>

        {/* Selection Summary */}
        {selectedServices.length > 0 && (
          <div className="mt-6 p-4 bg-primary-burgundy/5 rounded-lg border border-primary-burgundy/20">
            <p className="text-sm text-neutral-700">
              <span className="font-semibold">{selectedServices.length}</span> service
              {selectedServices.length === 1 ? '' : 's'} selected: {' '}
              <span className="font-medium text-primary-burgundy">
                {services
                  .filter(service => selectedServices.includes(service.id))
                  .map(service => service.title)
                  .join(', ')}
              </span>
            </p>
          </div>
        )}
      </div>
    );
  }
);

ServiceSelectionGrid.displayName = "ServiceSelectionGrid";

export { ServiceSelectionGrid, DEFAULT_SERVICES };