import React, { useState, useEffect } from "react";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { RadioGroup, RadioOption } from "@/components/ui/RadioGroup";
import { Select, SelectOption } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { EmergencyBanner } from "./EmergencyBanner";
import { cn } from "@/lib/utils";

export interface ContactFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  preferredContact: 'phone' | 'email' | 'text';
  timePreference: string;
  isEmergency: boolean;
}

export interface ContactFormProps {
  initialData?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => void;
  isSubmitting?: boolean;
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

const ContactForm = React.forwardRef<HTMLFormElement, ContactFormProps>(
  ({ initialData, onSubmit, isSubmitting, className }, ref) => {
    const [formData, setFormData] = useState<ContactFormData>({
      email: initialData?.email || '',
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      phone: initialData?.phone || '',
      preferredContact: initialData?.preferredContact || 'phone',
      timePreference: initialData?.timePreference || '',
      isEmergency: initialData?.isEmergency || false
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
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

      if (!formData.timePreference) {
        newErrors.timePreference = 'Please select a preferred contact time';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        onSubmit(formData);
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

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn("space-y-6", className)}
        noValidate
      >
        {/* Emergency Banner */}
        <EmergencyBanner isVisible={formData.isEmergency} />

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

        {/* Email */}
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

        {/* Phone */}
        <PhoneInput
          id="phone"
          label="Phone Number"
          value={formData.phone}
          onChange={(value) => updateField('phone', value)}
          error={errors.phone}
          required
        />

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

        {/* Privacy Notice */}
        <p className="text-xs text-neutral-500">
          By submitting this form, you agree to our{' '}
          <a href="/privacy" className="text-primary-burgundy hover:underline">
            Privacy Policy
          </a>{' '}
          and consent to receive communications from Russell Roofing.
        </p>
      </form>
    );
  }
);

ContactForm.displayName = "ContactForm";

export { ContactForm };