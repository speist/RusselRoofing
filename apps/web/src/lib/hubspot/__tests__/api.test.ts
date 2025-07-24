import { hubspotService } from '../api';
import { ContactInput, DealInput } from '../types';

// Mock the environment to test both configured and unconfigured states
describe('HubSpot API Service', () => {
  const mockContactInput: ContactInput = {
    email: 'test@example.com',
    firstname: 'John',
    lastname: 'Doe',
    phone: '555-0123',
    address: '123 Main St',
    property_type: 'single_family',
    preferred_contact_method: 'phone',
    lead_source: 'instant_estimate',
  };

  const mockDealInput: DealInput = {
    dealname: 'Test Estimate',
    amount: '5000',
    dealstage: 'estimate_submitted',
    services_requested: 'roof_repair',
    estimate_min: 4500,
    estimate_max: 5500,
    is_emergency: false,
  };

  describe('Mock Mode (No API Key)', () => {
    beforeEach(() => {
      // Ensure we're in mock mode by not setting HUBSPOT_API_KEY
      delete process.env.HUBSPOT_API_KEY;
    });

    it('should create contact in mock mode', async () => {
      const result = await hubspotService.createContact(mockContactInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.properties.email).toBe(mockContactInput.email);
    });

    it('should create deal in mock mode', async () => {
      const result = await hubspotService.createDeal(mockDealInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.properties.dealname).toBe(mockDealInput.dealname);
    });

    it('should find contact by email in mock mode', async () => {
      // Test with email that should return existing contact
      const result = await hubspotService.findContactByEmail('existing@example.com');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.properties.email).toBe('existing@example.com');
    });

    it('should return null for new contact in mock mode', async () => {
      const result = await hubspotService.findContactByEmail('new@example.com');

      expect(result.success).toBe(true);
      expect(result.data).toBe(null);
    });

    it('should associate contact with deal in mock mode', async () => {
      const result = await hubspotService.associateContactToDeal('contact-123', 'deal-456');

      expect(result.success).toBe(true);
    });

    it('should handle progressive profiling for existing contact', async () => {
      const profile = await hubspotService.getContactProfile('existing@example.com');

      expect(profile.isReturning).toBe(true);
      expect(profile.welcomeMessage).toContain('Welcome back');
      expect(profile.knownFields).toBeDefined();
    });

    it('should handle progressive profiling for new contact', async () => {
      const profile = await hubspotService.getContactProfile('new@example.com');

      expect(profile.isReturning).toBe(false);
      expect(profile.welcomeMessage).toBeUndefined();
      expect(profile.knownFields).toBeUndefined();
    });

    it('should create or update existing contact', async () => {
      const result = await hubspotService.createOrUpdateContact({
        ...mockContactInput,
        email: 'existing@example.com',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should create new contact when none exists', async () => {
      const result = await hubspotService.createOrUpdateContact({
        ...mockContactInput,
        email: 'new@example.com',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('should reject invalid contact data', async () => {
      const invalidContact = {
        email: 'invalid-email',
        firstname: '',
        lastname: '',
      } as ContactInput;

      const result = await hubspotService.createContact(invalidContact);

      expect(result.success).toBe(false);
      expect(result.error?.status).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid deal data', async () => {
      const invalidDeal = {
        dealname: '',
        amount: '',
        services_requested: '',
        estimate_min: 'invalid' as any,
        estimate_max: 'invalid' as any,
      } as DealInput;

      const result = await hubspotService.createDeal(invalidDeal);

      expect(result.success).toBe(false);
      expect(result.error?.status).toBe('VALIDATION_ERROR');
    });
  });
});