"use client";

import React, { useState, useEffect } from "react";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { RadioGroup, RadioOption } from "@/components/ui/RadioGroup";
import { Select, SelectOption } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { AddressInput } from "@/components/estimate/AddressInput";
import { cn } from "@/lib/utils";

export interface ContactFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  message: string;
  preferredContact: 'phone' | 'email' | 'text';
  timePreference: string;
  isEmergency: boolean;
}

export interface ContactFormProps {
  className?: string;
}

const contactMethodOptions: RadioOption[] = [
  {
    value: 'phone',
    label: 'Phone',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )
  },
  {
    value: 'email',
    label: 'Email',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    value: 'text',
    label: 'Text',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )
  }
];

const timeOptions: SelectOption[] = [
  { value: 'morning', label: 'Morning (8AM - 12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
  { value: 'evening', label: 'Evening (5PM - 8PM)' },
  { value: 'anytime', label: 'Anytime' }
];

export function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    message: '',
    preferredContact: 'phone',
    timePreference: '',
    isEmergency: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(formData.email));
  }, [formData.email]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailValid) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.message) {
      newErrors.message = 'Message is required';
    }

    if (!formData.timePreference) {
      newErrors.timePreference = 'Please select a preferred contact time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Integrate with HubSpot API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstname: formData.firstName,
          lastname: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          message: formData.message,
          preferredContact: formData.preferredContact,
          timePreference: formData.timePreference,
          isEmergency: formData.isEmergency,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          address: '',
          message: '',
          preferredContact: 'phone',
          timePreference: '',
          isEmergency: false
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof ContactFormData>(
    field: K,
    value: ContactFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className={cn("bg-green-50 border border-green-200 rounded-lg p-8 text-center", className)}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
        <p className="text-green-700 mb-4">
          Thank you for contacting us. We&apos;ll get back to you within 24 hours.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-6", className)}
      noValidate
    >
      {/* Emergency Banner */}
      {formData.isEmergency && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 font-medium">
              Emergency Request - We&apos;ll prioritize your message and respond ASAP
            </span>
          </div>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabelInput
          id="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
          error={errors.firstName}
          required
        />
        <FloatingLabelInput
          id="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
          error={errors.lastName}
          required
        />
      </div>

      {/* Email and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabelInput
          id="email"
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          error={errors.email}
          success={emailValid && !errors.email}
          required
        />
        <PhoneInput
          id="phone"
          label="Phone Number"
          value={formData.phone}
          onChange={(value) => updateField('phone', value)}
          error={errors.phone}
          required
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-2">
          Property Address
        </label>
        <AddressInput
          value={formData.address}
          onChange={(address) => updateField('address', address)}
          placeholder="Enter your property address"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={4}
          className={cn(
            "w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#960120] focus:border-transparent resize-none transition-colors",
            errors.message && "border-red-500 focus:ring-red-500"
          )}
          placeholder="Tell us more about your project or question..."
          value={formData.message}
          onChange={(e) => updateField('message', e.target.value)}
          required
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Preferred Contact Method
        </label>
        <RadioGroup
          name="preferredContact"
          options={contactMethodOptions}
          value={formData.preferredContact}
          onChange={(value) => updateField('preferredContact', value as ContactFormData['preferredContact'])}
        />
      </div>

      {/* Time Preference */}
      <Select
        id="timePreference"
        label="Best Time to Contact"
        options={timeOptions}
        placeholder="Select a time"
        value={formData.timePreference}
        onChange={(e) => updateField('timePreference', e.target.value)}
        error={errors.timePreference}
        required
      />

      {/* Emergency Checkbox */}
      <Checkbox
        id="isEmergency"
        label="This is an emergency repair request"
        checked={formData.isEmergency}
        onChange={(e) => updateField('isEmergency', e.target.checked)}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending Message...' : 'Send Message'}
      </Button>

      {/* Privacy Notice */}
      <p className="text-xs text-neutral-500 text-center">
        By submitting this form, you agree to our{' '}
        <a href="/privacy" className="text-[#960120] hover:underline">
          Privacy Policy
        </a>{' '}
        and consent to receive communications from Russell Roofing.
      </p>
    </form>
  );
}