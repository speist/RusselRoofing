import React from "react";

interface ServiceTestimonialsProps {
  testimonialIds: string[];
  serviceTitle: string;
}

// Temporary testimonial data structure - will be connected to actual testimonials system
interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  serviceType: string;
  date: string;
}

// Sample testimonials - to be replaced with actual data
const testimonials: Record<string, Testimonial> = {
  "roofing-1": {
    id: "roofing-1",
    name: "Sarah Johnson",
    location: "Westfield, NJ",
    rating: 5,
    text: "Russell Roofing did an exceptional job replacing our roof. The crew was professional, clean, and completed the work ahead of schedule. Our new roof looks amazing and we couldn't be happier!",
    serviceType: "Roof Replacement",
    date: "January 2024"
  },
  "roofing-2": {
    id: "roofing-2",
    name: "Michael Chen",
    location: "Princeton, NJ",
    rating: 5,
    text: "After storm damage, Russell Roofing responded immediately. They handled everything from the insurance claim to the final inspection. Outstanding service and quality work!",
    serviceType: "Storm Damage Repair",
    date: "December 2023"
  },
  "roofing-3": {
    id: "roofing-3",
    name: "Robert Williams",
    location: "Summit, NJ",
    rating: 5,
    text: "We've used Russell Roofing for both our home and business properties. They're reliable, honest, and do excellent work. Highly recommend!",
    serviceType: "Commercial Roofing",
    date: "November 2023"
  },
  "siding-1": {
    id: "siding-1",
    name: "Emily Davis",
    location: "Short Hills, NJ",
    rating: 5,
    text: "The transformation of our home is incredible! Russell Roofing helped us choose the perfect siding and the installation was flawless. Great attention to detail.",
    serviceType: "Siding Installation",
    date: "January 2024"
  },
  "siding-2": {
    id: "siding-2",
    name: "James Thompson",
    location: "Chatham, NJ",
    rating: 5,
    text: "Professional from start to finish. The crew was respectful of our property and the new James Hardie siding looks fantastic. Worth every penny!",
    serviceType: "Fiber Cement Siding",
    date: "December 2023"
  },
  "siding-3": {
    id: "siding-3",
    name: "Patricia Lee",
    location: "Madison, NJ",
    rating: 5,
    text: "Russell Roofing repaired damaged sections of our siding perfectly. You can't even tell where the repairs were made. Excellent color matching and craftsmanship.",
    serviceType: "Siding Repair",
    date: "October 2023"
  }
};

export default function ServiceTestimonials({ testimonialIds, serviceTitle }: ServiceTestimonialsProps) {
  const serviceTestimonials = testimonialIds
    .map(id => testimonials[id])
    .filter(testimonial => testimonial !== undefined)
    .slice(0, 3); // Show max 3 testimonials

  if (serviceTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real reviews from satisfied {serviceTitle.toLowerCase()} customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Rating Stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-600 mb-6 leading-relaxed italic">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.location}</p>
                <p className="text-sm text-primary-burgundy font-medium mt-1">
                  {testimonial.serviceType}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View More Reviews CTA */}
        <div className="mt-12 text-center">
          <a
            href="/testimonials"
            className="inline-flex items-center text-primary-burgundy font-semibold hover:text-primary-burgundy/80 transition-colors"
          >
            Read More Customer Reviews
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}