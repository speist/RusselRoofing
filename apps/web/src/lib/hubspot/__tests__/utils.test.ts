import {
  extractKnownFields,
  mapContactInputToProperties,
  mapDealInputToProperties,
  calculateBackoffDelay,
  isValidEmail,
  validateContactInput,
  validateDealInput,
} from '../utils';
import { Contact, ContactInput, DealInput } from '../types';

describe('HubSpot Utils', () => {
  describe('extractKnownFields', () => {
    it('should extract all known fields from contact', () => {
      const contact: Contact = {
        id: 'test-id',
        properties: {
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
          phone: '555-0123',
          address: '123 Main St',
          property_type: 'single_family',
          preferred_contact_method: 'phone',
          lead_source: 'instant_estimate',
          createdate: '2023-01-01',
          lastmodifieddate: '2023-01-01',
        },
      };

      const result = extractKnownFields(contact);

      expect(result).toEqual({
        firstname: 'John',
        lastname: 'Doe',
        phone: '555-0123',
        address: '123 Main St',
        property_type: 'single_family',
        preferred_contact_method: 'phone',
      });
    });

    it('should handle partial contact data', () => {
      const contact: Contact = {
        id: 'test-id',
        properties: {
          email: 'test@example.com',
          firstname: 'John',
          lastname: '',
          phone: '',
          address: '',
          property_type: '',
          preferred_contact_method: '',
          lead_source: 'instant_estimate',
          createdate: '2023-01-01',
          lastmodifieddate: '2023-01-01',
        },
      };

      const result = extractKnownFields(contact);

      expect(result).toEqual({
        firstname: 'John',
      });
    });
  });

  describe('mapContactInputToProperties', () => {
    it('should map contact input to HubSpot properties format', () => {
      const input: ContactInput = {
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        phone: '555-0123',
        address: '123 Main St',
        property_type: 'single_family',
        preferred_contact_method: 'phone',
        lead_source: 'instant_estimate',
      };

      const result = mapContactInputToProperties(input);

      expect(result).toEqual({
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        phone: '555-0123',
        address: '123 Main St',
        property_type: 'single_family',
        preferred_contact_method: 'phone',
        lead_source: 'instant_estimate',
      });
    });
  });

  describe('mapDealInputToProperties', () => {
    it('should map deal input to HubSpot properties format with all fields', () => {
      const input: DealInput = {
        dealname: 'Test Deal',
        amount: '5000',
        dealstage: 'estimate_submitted',
        services_requested: 'roof_repair',
        property_square_footage: 2000,
        estimate_min: 4500,
        estimate_max: 5500,
        is_emergency: true,
        project_timeline: '2-3 weeks',
      };

      const result = mapDealInputToProperties(input);

      expect(result).toEqual({
        dealname: 'Test Deal',
        amount: '5000',
        dealstage: 'estimate_submitted',
        services_requested: 'roof_repair',
        property_square_footage: '2000',
        estimate_min: '4500',
        estimate_max: '5500',
        is_emergency: 'true',
        project_timeline: '2-3 weeks',
      });
    });

    it('should map deal input without optional fields', () => {
      const input: DealInput = {
        dealname: 'Test Deal',
        amount: '5000',
        dealstage: 'estimate_submitted',
        services_requested: 'roof_repair',
        estimate_min: 4500,
        estimate_max: 5500,
        is_emergency: false,
      };

      const result = mapDealInputToProperties(input);

      expect(result).toEqual({
        dealname: 'Test Deal',
        amount: '5000',
        dealstage: 'estimate_submitted',
        services_requested: 'roof_repair',
        estimate_min: '4500',
        estimate_max: '5500',
        is_emergency: 'false',
      });
    });
  });

  describe('calculateBackoffDelay', () => {
    it('should calculate exponential backoff delay', () => {
      expect(calculateBackoffDelay(0)).toBe(1000);
      expect(calculateBackoffDelay(1)).toBe(2000);
      expect(calculateBackoffDelay(2)).toBe(4000);
      expect(calculateBackoffDelay(3)).toBe(8000);
    });

    it('should cap delay at maximum', () => {
      expect(calculateBackoffDelay(10)).toBe(30000);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('validateContactInput', () => {
    it('should validate and normalize valid contact input', () => {
      const input = {
        email: 'TEST@EXAMPLE.COM',
        firstname: '  John  ',
        lastname: '  Doe  ',
        phone: '  555-0123  ',
        address: '  123 Main St  ',
        property_type: 'single_family' as const,
        preferred_contact_method: 'phone' as const,
        lead_source: 'instant_estimate' as const,
      };

      const result = validateContactInput(input);

      expect(result).toEqual({
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        phone: '555-0123',
        address: '123 Main St',
        property_type: 'single_family',
        preferred_contact_method: 'phone',
        lead_source: 'instant_estimate',
      });
    });

    it('should return null for invalid input', () => {
      expect(validateContactInput({})).toBe(null);
      expect(validateContactInput({ email: 'invalid-email' })).toBe(null);
      expect(validateContactInput({ email: 'test@example.com' })).toBe(null);
      expect(validateContactInput({ 
        email: 'test@example.com', 
        firstname: 'John' 
      })).toBe(null);
    });

    it('should apply defaults for optional fields', () => {
      const input = {
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
      };

      const result = validateContactInput(input);

      expect(result).toEqual({
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        phone: '',
        address: '',
        property_type: 'single_family',
        preferred_contact_method: 'email',
        lead_source: 'instant_estimate',
      });
    });
  });

  describe('validateDealInput', () => {
    it('should validate valid deal input', () => {
      const input = {
        dealname: '  Test Deal  ',
        amount: '  5000  ',
        dealstage: 'estimate_submitted',
        services_requested: '  roof_repair  ',
        estimate_min: 4500,
        estimate_max: 5500,
        is_emergency: true,
      };

      const result = validateDealInput(input);

      expect(result).toEqual({
        dealname: 'Test Deal',
        amount: '5000',
        dealstage: 'estimate_submitted',
        services_requested: 'roof_repair',
        estimate_min: 4500,
        estimate_max: 5500,
        is_emergency: true,
      });
    });

    it('should return null for invalid input', () => {
      expect(validateDealInput({})).toBe(null);
      expect(validateDealInput({ dealname: 'Test' })).toBe(null);
      expect(validateDealInput({ 
        dealname: 'Test', 
        amount: '5000' 
      })).toBe(null);
      expect(validateDealInput({ 
        dealname: 'Test', 
        amount: '5000',
        services_requested: 'repair'
      })).toBe(null);
    });

    it('should apply default dealstage', () => {
      const input = {
        dealname: 'Test Deal',
        amount: '5000',
        services_requested: 'roof_repair',
        estimate_min: 4500,
        estimate_max: 5500,
      };

      const result = validateDealInput(input);

      expect(result?.dealstage).toBe('estimate_submitted');
      expect(result?.is_emergency).toBe(false);
    });
  });
});