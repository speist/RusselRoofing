import ContactsService from './contacts';
import DealsService from './deals';
import { ContactInput, DealInput, Contact, Deal, ContactProfile, HubSpotApiResponse, HUBSPOT_ERROR_CODES } from './types';
import { extractKnownFields, validateContactInput, validateDealInput } from './utils';
import { getServiceConfig, isServiceConfigured } from '../config';

interface HubSpotService {
  // Contact operations
  createContact(contactData: ContactInput): Promise<HubSpotApiResponse<Contact>>;
  updateContact(contactId: string, updates: Partial<ContactInput>): Promise<HubSpotApiResponse<Contact>>;
  findContactByEmail(email: string): Promise<HubSpotApiResponse<Contact | null>>;
  
  // Deal operations
  createDeal(dealData: DealInput): Promise<HubSpotApiResponse<Deal>>;
  associateContactToDeal(contactId: string, dealId: string): Promise<HubSpotApiResponse<void>>;
  
  // Progressive profiling
  getContactProfile(email: string): Promise<ContactProfile>;
}

class HubSpotApiService implements HubSpotService {
  private contactsService: ContactsService;
  private dealsService: DealsService;
  private isConfigured: boolean;

  constructor() {
    const hubspotConfig = getServiceConfig('hubspot');
    
    if (!isServiceConfigured('hubspot') || hubspotConfig.mockMode) {
      console.warn('[HubSpot] API not configured or running in mock mode. Service will operate in mock mode.');
      this.isConfigured = false;
      this.contactsService = null as any;
      this.dealsService = null as any;
      return;
    }

    this.isConfigured = true;
    this.contactsService = new ContactsService(hubspotConfig.apiKey);
    this.dealsService = new DealsService(hubspotConfig.apiKey);
    
    console.log('[HubSpot] Service initialized successfully with production configuration');
  }

  /**
   * Create a new contact
   */
  async createContact(contactData: ContactInput): Promise<HubSpotApiResponse<Contact>> {
    // Validate input first
    const validatedData = validateContactInput(contactData);
    if (!validatedData) {
      return {
        success: false,
        error: {
          status: HUBSPOT_ERROR_CODES.VALIDATION_ERROR,
          message: 'Invalid contact data provided',
        },
      };
    }

    if (!this.isConfigured) {
      return this.mockCreateContact(validatedData);
    }

    return await this.contactsService.createContact(validatedData);
  }

  /**
   * Update an existing contact
   */
  async updateContact(
    contactId: string,
    updates: Partial<ContactInput>
  ): Promise<HubSpotApiResponse<Contact>> {
    if (!this.isConfigured) {
      return this.mockUpdateContact(contactId, updates);
    }

    return await this.contactsService.updateContact(contactId, updates);
  }

  /**
   * Find a contact by email
   */
  async findContactByEmail(email: string): Promise<HubSpotApiResponse<Contact | null>> {
    if (!this.isConfigured) {
      return this.mockFindContactByEmail(email);
    }

    return await this.contactsService.findContactByEmail(email);
  }

  /**
   * Create a new deal
   */
  async createDeal(dealData: DealInput): Promise<HubSpotApiResponse<Deal>> {
    // Validate input
    const validatedData = validateDealInput(dealData);
    if (!validatedData) {
      return {
        success: false,
        error: {
          status: HUBSPOT_ERROR_CODES.VALIDATION_ERROR,
          message: 'Invalid deal data provided',
        },
      };
    }

    if (!this.isConfigured) {
      return this.mockCreateDeal(validatedData);
    }

    return await this.dealsService.createDeal(validatedData);
  }

  /**
   * Update an existing deal
   */
  async updateDeal(
    dealId: string,
    updates: Partial<DealInput>
  ): Promise<HubSpotApiResponse<Deal>> {
    if (!this.isConfigured) {
      return this.mockUpdateDeal(dealId, updates);
    }

    return await this.dealsService.updateDeal(dealId, updates);
  }

  /**
   * Associate a contact with a deal
   */
  async associateContactToDeal(
    contactId: string,
    dealId: string
  ): Promise<HubSpotApiResponse<void>> {
    if (!this.isConfigured) {
      return this.mockAssociateContactToDeal(contactId, dealId);
    }

    return await this.dealsService.associateContactToDeal(contactId, dealId);
  }

  /**
   * Get contact profile for progressive profiling
   */
  async getContactProfile(email: string): Promise<ContactProfile> {
    try {
      const result = await this.findContactByEmail(email);
      
      if (result.success && result.data) {
        const knownFields = extractKnownFields(result.data);
        return {
          isReturning: true,
          knownFields,
          welcomeMessage: `Welcome back, ${result.data.properties.firstname || 'there'}!`,
        };
      }
      
      return { isReturning: false };
    } catch (error) {
      // Fail silently for progressive profiling
      console.warn('[HubSpot] Progressive profiling failed, showing regular form:', error);
      return { isReturning: false };
    }
  }

  /**
   * Create or update contact with smart deduplication
   */
  async createOrUpdateContact(contactData: ContactInput): Promise<HubSpotApiResponse<Contact>> {
    try {
      // First, try to find existing contact
      const existingContactResult = await this.findContactByEmail(contactData.email);
      
      if (existingContactResult.success && existingContactResult.data) {
        // Update existing contact
        const contactId = existingContactResult.data.id;
        console.log(`[HubSpot] Updating existing contact: ${contactId}`);
        return await this.updateContact(contactId, contactData);
      } else {
        // Create new contact
        console.log(`[HubSpot] Creating new contact for: ${contactData.email}`);
        return await this.createContact(contactData);
      }
    } catch (error: any) {
      console.error('[HubSpot] Error in createOrUpdateContact:', error);
      return {
        success: false,
        error: {
          status: HUBSPOT_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Failed to create or update contact',
        },
      };
    }
  }

  // Mock implementations for when API is not configured
  private async mockCreateContact(contactData: ContactInput): Promise<HubSpotApiResponse<Contact>> {
    console.log('[HubSpot Mock] Creating contact:', contactData.email);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockContact: Contact = {
      id: Math.random().toString(36).substring(2, 11),
      properties: {
        ...contactData,
        createdate: new Date().toISOString(),
        lastmodifieddate: new Date().toISOString(),
      },
    };

    return {
      success: true,
      data: mockContact,
    };
  }

  private async mockUpdateContact(
    contactId: string,
    updates: Partial<ContactInput>
  ): Promise<HubSpotApiResponse<Contact>> {
    console.log('[HubSpot Mock] Updating contact:', contactId);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockContact: Contact = {
      id: contactId,
      properties: {
        email: updates.email || 'mock@example.com',
        firstname: updates.firstname || 'Mock',
        lastname: updates.lastname || 'User',
        phone: updates.phone || '',
        address: updates.address || '',
        property_type: updates.property_type || 'single_family',
        preferred_contact_method: updates.preferred_contact_method || 'email',
        lead_source: 'instant_estimate',
        createdate: new Date(Date.now() - 86400000).toISOString(),
        lastmodifieddate: new Date().toISOString(),
      },
    };

    return {
      success: true,
      data: mockContact,
    };
  }

  private async mockFindContactByEmail(email: string): Promise<HubSpotApiResponse<Contact | null>> {
    console.log('[HubSpot Mock] Finding contact by email:', email);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock: return null for new emails, existing contact for known emails
    if (email.includes('existing')) {
      const mockContact: Contact = {
        id: 'mock-existing-contact',
        properties: {
          email,
          firstname: 'John',
          lastname: 'Doe',
          phone: '555-0123',
          address: '123 Main St',
          property_type: 'single_family',
          preferred_contact_method: 'phone',
          lead_source: 'instant_estimate',
          createdate: new Date(Date.now() - 86400000).toISOString(),
          lastmodifieddate: new Date().toISOString(),
        },
      };

      return {
        success: true,
        data: mockContact,
      };
    }

    return {
      success: true,
      data: null,
    };
  }

  private async mockCreateDeal(dealData: DealInput): Promise<HubSpotApiResponse<Deal>> {
    console.log('[HubSpot Mock] Creating deal:', dealData.dealname);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockDeal: Deal = {
      id: Math.random().toString(36).substring(2, 11),
      properties: {
        dealname: dealData.dealname,
        amount: dealData.amount,
        dealstage: dealData.dealstage,
        services_requested: dealData.services_requested,
        property_square_footage: dealData.property_square_footage?.toString(),
        estimate_min: dealData.estimate_min?.toString(),
        estimate_max: dealData.estimate_max?.toString(),
        is_emergency: dealData.is_emergency?.toString() ?? 'false',
        project_timeline: dealData.project_timeline,
        createdate: new Date().toISOString(),
        // New lead routing properties
        lead_priority: dealData.lead_priority,
        lead_score: dealData.lead_score?.toString(),
        services_count: dealData.services_count?.toString(),
        assigned_sales_rep: dealData.assigned_sales_rep,
        notification_sent: dealData.notification_sent?.toString(),
        project_description: dealData.project_description,
        property_type: dealData.property_type,
        location: dealData.location,
      },
    };

    return {
      success: true,
      data: mockDeal,
    };
  }

  private async mockUpdateDeal(
    dealId: string,
    updates: Partial<DealInput>
  ): Promise<HubSpotApiResponse<Deal>> {
    console.log('[HubSpot Mock] Updating deal:', dealId);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockDeal: Deal = {
      id: dealId,
      properties: {
        dealname: updates.dealname || 'Updated Deal',
        amount: updates.amount || '1000',
        dealstage: updates.dealstage || 'estimate_submitted',
        services_requested: updates.services_requested || 'roof_repair',
        property_square_footage: updates.property_square_footage?.toString(),
        estimate_min: updates.estimate_min?.toString() || '500',
        estimate_max: updates.estimate_max?.toString() || '1500',
        is_emergency: updates.is_emergency?.toString() || 'false',
        project_timeline: updates.project_timeline,
        createdate: new Date(Date.now() - 86400000).toISOString(),
        // New lead routing properties
        lead_priority: updates.lead_priority,
        lead_score: updates.lead_score?.toString(),
        services_count: updates.services_count?.toString(),
        assigned_sales_rep: updates.assigned_sales_rep,
        notification_sent: updates.notification_sent?.toString(),
        project_description: updates.project_description,
        property_type: updates.property_type,
        location: updates.location,
      },
    };

    return {
      success: true,
      data: mockDeal,
    };
  }

  private async mockAssociateContactToDeal(
    contactId: string,
    dealId: string
  ): Promise<HubSpotApiResponse<void>> {
    console.log('[HubSpot Mock] Associating contact with deal:', { contactId, dealId });
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
    };
  }
}

// Export singleton instance
export const hubspotService = new HubSpotApiService();
export default hubspotService;