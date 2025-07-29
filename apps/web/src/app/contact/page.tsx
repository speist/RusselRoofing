import React from 'react';
import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo, BusinessHours } from '@/components/contact/ContactInfo';
import { ServiceAreaMap } from '@/components/contact/ServiceAreaMap';

export const metadata: Metadata = {
  title: 'Contact Us - Russell Roofing | Get In Touch for Expert Roofing Services',
  description: 'Contact Russell Roofing for expert roofing services in New Jersey. Call us, send a message, or visit our location. Emergency services available 24/7.',
  keywords: 'Russell Roofing contact, New Jersey roofing contractor, emergency roofing services, roofing estimate, get in touch',
  openGraph: {
    title: 'Contact Russell Roofing - Your Trusted New Jersey Roofing Experts',
    description: 'Get in touch with Russell Roofing for all your roofing needs. Emergency services available 24/7.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      <main className="pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#960120] to-[#7a0118] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
                Get In Touch
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Ready to start your roofing project? We&apos;re here to help with expert advice and reliable service.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <p className="text-sm opacity-90">Available 24/7 for emergencies</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm opacity-90">Get a response within 24 hours</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Visit Us</h3>
                  <p className="text-sm opacity-90">See our work in your area</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section - Placeholder for now */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                  Send Us a Message
                </h2>
                <p className="text-lg text-gray-600">
                  Fill out the form below and we&apos;ll get back to you within 24 hours
                </p>
              </div>
              
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Contact Information Section - Placeholder for now */}
        <section className="py-16 bg-[#F5F3F0]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                  Contact Information
                </h2>
                <p className="text-lg text-gray-600">
                  Multiple ways to reach us for all your roofing needs
                </p>
              </div>
              
              <ContactInfo />
              <BusinessHours />
            </div>
          </div>
        </section>

        {/* Service Area Map Section - Placeholder for now */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                  Our Service Area
                </h2>
                <p className="text-lg text-gray-600">
                  See where we&apos;ve completed projects and our service coverage
                </p>
              </div>
              
              <ServiceAreaMap />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}