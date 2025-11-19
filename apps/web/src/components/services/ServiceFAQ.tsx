"use client";

import React, { useState, useEffect } from "react";
import { contactConfig } from "@/config/contact";

interface FAQ {
  id: string;
  properties: {
    service_area: string;
    question: string;
    answer: string;
  };
}

interface ServiceFAQProps {
  serviceArea: string;
  serviceTitle: string;
}

export default function ServiceFAQ({ serviceArea, serviceTitle }: ServiceFAQProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

  // Fetch FAQs from API
  useEffect(() => {
    async function fetchFAQs() {
      try {
        setLoading(true);
        const response = await fetch(`/api/hubspot/faqs?serviceArea=${serviceArea}`);
        const data = await response.json();

        if (data.success && data.data) {
          setFaqs(data.data.results);
          setError(null);
        } else {
          setError(data.error || 'Failed to load FAQs');
        }
      } catch (err) {
        console.error('[ServiceFAQ] Error fetching FAQs:', err);
        setError('Failed to load FAQs');
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, [serviceArea]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Show loading state
  if (loading) {
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
          <div className="text-center text-gray-500">
            Loading FAQs...
          </div>
        </div>
      </section>
    );
  }

  // Show error state (but don't break the page)
  if (error) {
    console.error('[ServiceFAQ] Display error:', error);
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
          <div className="text-center text-gray-500">
            <p className="mb-4">FAQs are temporarily unavailable. Please contact us directly for answers to your questions.</p>
            <a
              href={contactConfig.phone.href}
              className="text-primary-burgundy hover:underline font-semibold"
            >
              Call {contactConfig.phone.display}
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no FAQs
  if (faqs.length === 0) {
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
          <div className="text-center text-gray-500">
            No FAQs available at this time. Please contact us for more information.
          </div>
        </div>
      </section>
    );
  }

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
              key={faq.id}
              className="bg-gray-50 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                aria-expanded={openIndex === index}
              >
                <h3 className="font-semibold text-gray-900 pr-4">{faq.properties.question}</h3>
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
                  <p className="text-gray-600 leading-relaxed">{faq.properties.answer}</p>
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