"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface AddressInputProps {
  value?: string;
  onChange: (address: string, placeDetails?: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const AddressInput = React.forwardRef<HTMLInputElement, AddressInputProps>(
  ({ value = "", onChange, placeholder = "Enter your address", className, disabled }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      // Check if Google Maps is loaded
      if (typeof window === 'undefined' || !window.google?.maps?.places) {
        setError("Google Maps API not loaded");
        return;
      }

      const input = inputRef.current;
      if (!input) return;

      try {
        // Initialize Google Places Autocomplete
        autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
          types: ['address'],
          componentRestrictions: { country: 'us' }, // Restrict to US addresses
          fields: ['formatted_address', 'geometry', 'address_components', 'place_id']
        });

        // Handle place selection
        const handlePlaceChanged = () => {
          const place = autocompleteRef.current?.getPlace();
          
          if (place?.formatted_address) {
            onChange(place.formatted_address, place);
            setError(null);
          } else {
            setError("Please select a valid address from the dropdown");
          }
        };

        autocompleteRef.current.addListener('place_changed', handlePlaceChanged);

        // Cleanup
        return () => {
          if (autocompleteRef.current) {
            window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
          }
        };
      } catch (err) {
        setError("Failed to initialize address autocomplete");
        // TODO: Implement proper error reporting service for production
      }
    }, [onChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      
      // Clear error when user starts typing
      if (error) {
        setError(null);
      }
    };

    const combinedRef = (node: HTMLInputElement) => {
      // Update inputRef
      if (inputRef.current !== node) {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
      
      // Update external ref
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={combinedRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={cn(
              // Base styles from Input component
              "flex h-input w-full rounded-input border px-4 py-3 text-body font-body bg-background-white transition-all duration-250 ease-out",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-secondary-warm-gray",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:bg-dark-surface dark:placeholder:text-functional-disabled-gray",
              
              // State-specific styles
              error
                ? "border-functional-error-red focus-visible:ring-functional-error-red/20 focus-visible:border-functional-error-red"
                : "border-secondary-light-warm-gray focus-visible:ring-accent-trust-blue/20 focus-visible:border-accent-trust-blue dark:border-secondary-warm-gray/30 dark:focus-visible:border-accent-trust-blue",
              
              className
            )}
            autoComplete="off"
            role="combobox"
            aria-expanded="false"
            aria-haspopup="listbox"
            aria-controls="address-autocomplete-list"
            aria-label="Address autocomplete"
          />
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-burgundy"></div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-2 text-body-sm text-functional-error-red">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AddressInput.displayName = "AddressInput";

export { AddressInput };