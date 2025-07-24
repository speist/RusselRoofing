import { ContactFormData } from "./ContactForm";
import { ProjectDetailsData } from "../step2/ProjectDetailsStep";
import { PropertyInfoData } from "../step1/PropertyInfoStep";

export interface EstimateSubmissionData {
  property: PropertyInfoData;
  project: ProjectDetailsData;
  contact: ContactFormData;
}

export interface HubSpotDeal {
  dealname: string;
  amount: string;
  dealstage: string;
  pipeline?: string;
  closedate?: number;
  hubspot_owner_id?: string;
  property_address?: string;
  property_type?: string;
  services_requested?: string;
  is_emergency?: boolean;
  preferred_contact_method?: string;
  preferred_contact_time?: string;
}

export class SubmissionHandler {
  private apiKey: string;
  private portalId: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_HUBSPOT_API_KEY || '';
    this.portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '';
  }

  async submitEstimate(data: EstimateSubmissionData): Promise<{ success: boolean; error?: string }> {
    try {
      // Create or update contact in HubSpot
      const contactId = await this.createOrUpdateContact(data.contact, data.property);

      // Create deal in HubSpot
      const dealId = await this.createDeal(data, contactId);

      // Associate deal with contact
      if (contactId && dealId) {
        await this.associateDealWithContact(dealId, contactId);
      }

      // Save to local storage for persistence
      this.saveToLocalStorage(data);

      return { success: true };
    } catch (error) {
      console.error('Submission error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to submit estimate request' 
      };
    }
  }

  private async createOrUpdateContact(
    contact: ContactFormData,
    property: PropertyInfoData
  ): Promise<string | null> {
    try {
      const response = await fetch('/api/hubspot/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contact.email,
          firstname: contact.firstName,
          lastname: contact.lastName,
          phone: contact.phone,
          address: property.address,
          preferred_contact_method: contact.preferredContact,
          preferred_contact_time: contact.timePreference,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create/update contact');
      }

      const result = await response.json();
      return result.contactId;
    } catch (error) {
      console.error('Contact creation error:', error);
      return null;
    }
  }

  private async createDeal(
    data: EstimateSubmissionData,
    contactId: string | null
  ): Promise<string | null> {
    const { property, project, contact } = data;
    
    const dealData: HubSpotDeal = {
      dealname: `${contact.firstName} ${contact.lastName} - ${property.address}`,
      amount: project.estimateRange.max.toString(),
      dealstage: contact.isEmergency ? 'emergency_request' : 'estimate_requested',
      property_address: property.address,
      property_type: property.propertyType,
      services_requested: project.selectedServices.join(', '),
      is_emergency: contact.isEmergency,
      preferred_contact_method: contact.preferredContact,
      preferred_contact_time: contact.timePreference,
    };

    try {
      const response = await fetch('/api/hubspot/deal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      });

      if (!response.ok) {
        throw new Error('Failed to create deal');
      }

      const result = await response.json();
      return result.dealId;
    } catch (error) {
      console.error('Deal creation error:', error);
      return null;
    }
  }

  private async associateDealWithContact(
    dealId: string,
    contactId: string
  ): Promise<void> {
    try {
      await fetch('/api/hubspot/associate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId,
          contactId,
        }),
      });
    } catch (error) {
      console.error('Association error:', error);
    }
  }

  private saveToLocalStorage(data: EstimateSubmissionData): void {
    try {
      localStorage.setItem('estimate_submission', JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Local storage error:', error);
    }
  }

  clearLocalStorage(): void {
    try {
      localStorage.removeItem('estimate_submission');
      localStorage.removeItem('estimate_form_data');
    } catch (error) {
      console.error('Clear storage error:', error);
    }
  }
}