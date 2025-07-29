"use client";

import React, { useState } from "react";
import { FAQ } from "@/data/service-details";
import { contactConfig } from "@/config/contact";

interface ServiceFAQProps {
  faqs: FAQ[];
  serviceTitle: string;
}

export default function ServiceFAQ({ faqs, serviceTitle }: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Common questions about our {serviceTitle.toLowerCase()}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                aria-expanded={openIndex === index}
              >
                <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 text-primary-burgundy transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                } overflow-hidden`}
              >
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-primary-burgundy/5 rounded-lg p-8 text-center">
          <h3 className="font-semibold text-xl text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our experts are ready to help. Contact us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/estimate"
              className="bg-primary-burgundy text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-burgundy/90 transition-colors duration-200 inline-flex items-center justify-center"
            >
              Get Free Estimate
            </a>
            <a
              href={contactConfig.phone.href}
              className="border-2 border-primary-burgundy text-primary-burgundy px-6 py-3 rounded-lg font-semibold hover:bg-primary-burgundy hover:text-white transition-colors duration-200 inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}