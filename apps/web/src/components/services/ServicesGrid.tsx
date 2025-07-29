"use client";

import React from "react";
import { ServiceCard } from "./ServiceCard";
import { Service } from "@/data/services";

interface ServicesGridProps {
  services: Service[];
  className?: string;
}

export function ServicesGrid({ services, className = "" }: ServicesGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          className="h-full"
        />
      ))}
    </div>
  );
}