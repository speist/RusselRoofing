"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const services = [
  {
    title: "Roof Installation",
    description: "Complete new roof installation with premium materials and expert craftsmanship.",
    icon: "🏠",
    features: ["GAF System Plus Warranty", "Premium Materials", "Expert Installation"]
  },
  {
    title: "Roof Repair",
    description: "Professional roof repair services to extend the life of your existing roof.",
    icon: "🔧",
    features: ["Emergency Repairs", "Storm Damage", "Leak Detection"]
  },
  {
    title: "Roof Replacement",
    description: "Full roof replacement when repair isn't enough, using top-quality materials.",
    icon: "🆕",
    features: ["Free Inspections", "Insurance Assistance", "Quality Guarantee"]
  },
  {
    title: "Gutters & Siding",
    description: "Complete exterior services including gutters, siding, and window installation.",
    icon: "🌧️",
    features: ["Seamless Gutters", "Vinyl Siding", "Window Replacement"]
  }
];

export function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From roof installation to complete exterior renovations, we provide comprehensive services to protect and enhance your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-display text-2xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <ul className="text-sm text-gray-500 mb-6 space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="primary" size="lg" className="px-8 py-4">
            Get Free Estimate
          </Button>
        </div>
      </div>
    </section>
  );
}