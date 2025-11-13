import { ContactFormData } from "./ContactForm";
import { ProjectDetailsData } from "../step2/ProjectDetailsStep";
import { PropertyInfoData } from "../step1/PropertyInfoStep";

export interface EstimateSubmissionData {
  property: PropertyInfoData;
  project: ProjectDetailsData;
  contact: ContactFormData;
}

export interface HubSpotTicket {
  subject: string;
  content: string;
  hs_pipeline: string;
  hs_pipeline_stage: string;
  hs_ticket_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  property_address?: string;
  property_type?: string;
  services_requested?: string;
  estimate_min?: number;
  estimate_max?: number;
  is_emergency?: boolean;
  project_timeline?: string;
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

      // Create Deal in HubSpot (Lead 5% stage)
      const dealId = await this.createDeal(data, contactId);

      // Associate deal with contact
      if (contactId && dealId) {
        await this.associateDealWithContact(dealId, contactId);
      }

      // Create ticket in HubSpot (for internal tracking)
      const ticketId = await this.createTicket(data, contactId);

      // Associate ticket with contact
      if (contactId && ticketId) {
        await this.associateTicketWithContact(ticketId, contactId);
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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: contact.firstName,
          lastname: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          address: property.address,
          message: `Estimate request for ${project.selectedServices.join(', ')}. Estimate range: $${project.estimateRange.min} - $${project.estimateRange.max}`,
          preferredContact: contact.preferredContact,
          timePreference: contact.timePreference,
          isEmergency: contact.isEmergency,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create deal');
      }

      const result = await response.json();
      return result.data?.dealId || null;
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
      // Association is handled by the /api/contact endpoint
      // This method exists for consistency with associateTicketWithContact
      console.log('Deal associated with contact via /api/contact endpoint');
    } catch (error) {
      console.error('Deal association error:', error);
    }
  }

  private async createTicket(
    data: EstimateSubmissionData,
    contactId: string | null
  ): Promise<string | null> {
    const { property, project, contact } = data;

    // Build detailed content from project field values
    const fieldDetails = Object.entries(project.fieldValues)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    const ticketData: HubSpotTicket = {
      subject: `Estimate Request - ${contact.firstName} ${contact.lastName}`,
      content: `Estimate request for ${property.address}. Services: ${project.selectedServices.join(', ')}. ${fieldDetails ? `Details: ${fieldDetails}` : ''}`,
      hs_pipeline: '0',
      hs_pipeline_stage: '1',
      hs_ticket_priority: contact.isEmergency ? 'URGENT' : 'MEDIUM',
      property_address: property.address,
      property_type: property.propertyType,
      services_requested: project.selectedServices.join(', '),
      estimate_min: project.estimateRange.min,
      estimate_max: project.estimateRange.max,
      is_emergency: contact.isEmergency,
      preferred_contact_method: contact.preferredContact,
      preferred_contact_time: contact.timePreference,
    };

    try {
      const response = await fetch('/api/hubspot/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      const result = await response.json();
      return result.ticketId;
    } catch (error) {
      console.error('Ticket creation error:', error);
      return null;
    }
  }

  private async associateTicketWithContact(
    ticketId: string,
    contactId: string
  ): Promise<void> {
    try {
      await fetch('/api/hubspot/associate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticketId,
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