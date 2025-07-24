import React from "react";
import { FloatingLabelInput, FloatingLabelInputProps } from "./FloatingLabelInput";

export interface PhoneInputProps extends Omit<FloatingLabelInputProps, 'type' | 'onChange'> {
  onChange?: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onChange, ...props }, ref) => {
    const formatPhoneNumber = (value: string) => {
      // Remove all non-digit characters
      const phoneNumber = value.replace(/\D/g, '');
      
      // Format the number
      if (phoneNumber.length <= 3) {
        return phoneNumber;
      } else if (phoneNumber.length <= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      } else if (phoneNumber.length <= 10) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
      } else {
        // Don't allow more than 10 digits
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      e.target.value = formatted;
      onChange?.(formatted);
    };

    return (
      <FloatingLabelInput
        ref={ref}
        {...props}
        type="tel"
        onChange={handleChange}
        placeholder="(___) ___-____"
        maxLength={14}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };