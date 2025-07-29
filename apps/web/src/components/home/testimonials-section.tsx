"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Springfield",
    rating: 5,
    text: "Russell Roofing did an amazing job on our roof replacement. Professional, timely, and the quality is outstanding. Highly recommend!",
    service: "Roof Replacement"
  },
  {
    name: "Mike Chen",
    location: "Downtown",
    rating: 5,
    text: "Fast response time for our emergency roof repair after the storm. They saved us from major water damage. Thank you!",
    service: "Emergency Repair"
  },
  {
    name: "Jennifer Martinez",
    location: "Riverside",
    rating: 5,
    text: "From quote to completion, everything was handled professionally. Our new roof looks fantastic and we got the GAF warranty.",
    service: "New Installation"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. See what our satisfied customers have to say about our roofing services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-display font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.location} • {testimonial.service}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <span>⭐ 4.9/5 rating based on 200+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}