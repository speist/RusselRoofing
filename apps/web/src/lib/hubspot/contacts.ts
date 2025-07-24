import { Client } from '@hubspot/api-client';
import { ContactInput, Contact, HubSpotApiResponse } from './types';
import { mapContactInputToProperties, calculateBackoffDelay } from './utils';

class ContactsService {
  private client: Client;
  private maxRetries = 3;

  constructor(apiKey: string) {
    this.client = new Client({ accessToken: apiKey });
  }

  /**
   * Create a new contact in HubSpot
   */
  async createContact(contactData: ContactInput): Promise<HubSpotApiResponse<Contact>> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const properties = mapContactInputToProperties(contactData);
        
        const response = await this.client.crm.contacts.basicApi.create({
          properties,
        });

        // Log successful contact creation
        console.log(`[HubSpot] Contact created successfully: ${response.id}`, {
          email: contactData.email,
          contactId: response.id,
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          data: {
            id: response.id!,
            properties: response.properties as Contact['properties'],
          },
        };
      } catch (error: any) {
        lastError = error;
        
        // Log the error
        console.error(`[HubSpot] Contact creation attempt ${attempt + 1} failed:`, {
          email: contactData.email,
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying contact creation in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        break;
      }
    }

    return {
      success: false,
      error: {
        status: lastError?.code || 'UNKNOWN_ERROR',
        message: lastError?.message || 'Failed to create contact',
        correlationId: lastError?.correlationId,
        category: lastError?.category,
      },
    };
  }

  /**
   * Update an existing contact in HubSpot
   */
  async updateContact(
    contactId: string,
    updates: Partial<ContactInput>
  ): Promise<HubSpotApiResponse<Contact>> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const properties = mapContactInputToProperties(updates as ContactInput);
        
        const response = await this.client.crm.contacts.basicApi.update(contactId, {
          properties,
        });

        // Log successful contact update
        console.log(`[HubSpot] Contact updated successfully: ${contactId}`, {
          contactId,
          updatedFields: Object.keys(updates),
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          data: {
            id: response.id!,
            properties: response.properties as Contact['properties'],
          },
        };
      } catch (error: any) {
        lastError = error;
        
        // Log the error
        console.error(`[HubSpot] Contact update attempt ${attempt + 1} failed:`, {
          contactId,
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying contact update in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        break;
      }
    }

    return {
      success: false,
      error: {
        status: lastError?.code || 'UNKNOWN_ERROR',
        message: lastError?.message || 'Failed to update contact',
        correlationId: lastError?.correlationId,
        category: lastError?.category,
      },
    };
  }

  /**
   * Find a contact by email address
   */
  async findContactByEmail(email: string): Promise<HubSpotApiResponse<Contact | null>> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.client.crm.contacts.searchApi.doSearch({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: 'EQ' as any,
                  value: email.toLowerCase().trim(),
                },
              ],
            },
          ],
          properties: [
            'email',
            'firstname',
            'lastname',
            'phone',
            'address',
            'property_type',
            'preferred_contact_method',
            'lead_source',
            'createdate',
            'lastmodifieddate',
          ],
          limit: 1,
        });

        if (response.results && response.results.length > 0) {
          const contact = response.results[0];
          
          // Log successful contact found
          console.log(`[HubSpot] Contact found by email: ${email}`, {
            email,
            contactId: contact.id,
            timestamp: new Date().toISOString(),
          });

          return {
            success: true,
            data: {
              id: contact.id!,
              properties: contact.properties as Contact['properties'],
            },
          };
        }

        // Log no contact found
        console.log(`[HubSpot] No contact found for email: ${email}`, {
          email,
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          data: null,
        };
      } catch (error: any) {
        lastError = error;
        
        // Log the error
        console.error(`[HubSpot] Contact search attempt ${attempt + 1} failed:`, {
          email,
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying contact search in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        break;
      }
    }

    return {
      success: false,
      error: {
        status: lastError?.code || 'UNKNOWN_ERROR',
        message: lastError?.message || 'Failed to search for contact',
        correlationId: lastError?.correlationId,
        category: lastError?.category,
      },
    };
  }

  /**
   * Determine if an error is retryable
   */
  private shouldRetry(error: any): boolean {
    // Retry on rate limiting (429) and server errors (5xx)
    const retryableCodes = [429, 500, 502, 503, 504];
    
    if (error.code && retryableCodes.includes(error.code)) {
      return true;
    }
    
    // Retry on network errors
    if (error.message && (
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('ETIMEDOUT')
    )) {
      return true;
    }
    
    return false;
  }
}

export default ContactsService;