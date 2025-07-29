import React from 'react';
import { contactConfig } from '@/config/contact';

export function ContactInfo() {
  const formatHours = (day: string, hours: string) => {
    return (
      <div key={day} className="flex justify-between items-center py-1">
        <span className="capitalize font-medium">{day}:</span>
        <span className="text-neutral-600">{hours}</span>
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Main Contact */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center mb-4">
          <div className="bg-[#960120] rounded-full p-3 mr-3">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Call Us</h3>
            <p className="text-sm text-neutral-600">Talk to an expert today</p>
          </div>
        </div>
        <div className="space-y-2">
          <a
            href={contactConfig.phone.href}
            className="block text-lg font-semibold text-[#960120] hover:text-[#7a0118] transition-colors"
          >
            {contactConfig.phone.display}
          </a>
          <p className="text-sm text-neutral-600">
            Available {contactConfig.hours.monday}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center mb-4">
          <div className="bg-[#960120] rounded-full p-3 mr-3">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Email Us</h3>
            <p className="text-sm text-neutral-600">24-hour response</p>
          </div>
        </div>
        <div className="space-y-2">
          <a
            href={contactConfig.email.href}
            className="block text-[#960120] hover:text-[#7a0118] transition-colors break-all"
          >
            {contactConfig.email.display}
          </a>
          <p className="text-sm text-neutral-600">
            Response within 24 hours
          </p>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center mb-4">
          <div className="bg-[#960120] rounded-full p-3 mr-3">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Visit Us</h3>
            <p className="text-sm text-neutral-600">Our service area</p>
          </div>
        </div>
        <div className="space-y-2">
          <address className="text-neutral-700 not-italic">
            {contactConfig.address.street}<br />
            {contactConfig.address.city}, {contactConfig.address.state} {contactConfig.address.zip}
          </address>
          <p className="text-sm text-neutral-600">
            Serving New Jersey
          </p>
        </div>
      </div>

      {/* Emergency Contact */}
      {contactConfig.emergency.available && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-600 rounded-full p-3 mr-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-red-800">Emergency</h3>
              <p className="text-sm text-red-600">24/7 storm damage</p>
            </div>
          </div>
          <div className="space-y-2">
            <a
              href={contactConfig.emergency.phone.href}
              className="block text-lg font-semibold text-red-600 hover:text-red-800 transition-colors"
            >
              {contactConfig.emergency.phone.display}
            </a>
            <p className="text-sm text-red-600">
              Available 24/7 for emergencies
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function BusinessHours() {
  const formatHours = (day: string, hours: string) => {
    return (
      <div key={day} className="flex justify-between items-center py-1">
        <span className="capitalize font-medium">{day}:</span>
        <span className="text-neutral-600">{hours}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 mt-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-[#960120]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Business Hours
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          {formatHours('monday', contactConfig.hours.monday)}
          {formatHours('tuesday', contactConfig.hours.tuesday)}
          {formatHours('wednesday', contactConfig.hours.wednesday)}
          {formatHours('thursday', contactConfig.hours.thursday)}
        </div>
        <div className="space-y-1">
          {formatHours('friday', contactConfig.hours.friday)}
          {formatHours('saturday', contactConfig.hours.saturday)}
          {formatHours('sunday', contactConfig.hours.sunday)}
        </div>
      </div>
      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          <strong>Emergency services available 24/7</strong> - Call our emergency line for storm damage, leaks, or urgent repairs.
        </p>
      </div>
    </div>
  );
}