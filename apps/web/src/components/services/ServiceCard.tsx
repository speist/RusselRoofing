"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Service } from "@/data/services";
import { Card } from "@/components/ui/Card";

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export function ServiceCard({ service, className = "" }: ServiceCardProps) {
  return (
    <Card className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${className}`}>
      <Link href={`/services/${service.slug}`} className="block h-full">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image
                src={service.icon}
                alt={`${service.title} icon`}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-semibold text-gray-900 group-hover:text-primary-burgundy transition-colors duration-200">
                {service.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-primary-burgundy font-semibold text-sm group-hover:underline">
              Learn More
            </span>
            <svg
              className="w-4 h-4 text-primary-burgundy transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </Card>
  );
}