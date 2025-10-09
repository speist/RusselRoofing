import { Client } from '@hubspot/api-client';
import { TicketInput, Ticket, HubSpotApiResponse } from './types';
import { mapTicketInputToProperties, calculateBackoffDelay } from './utils';

class TicketsService {
  private client: Client;
  private maxRetries = 3;

  constructor(apiKey: string) {
    this.client = new Client({ accessToken: apiKey });
  }

  /**
   * Create a new ticket in HubSpot
   */
  async createTicket(ticketData: TicketInput): Promise<HubSpotApiResponse<Ticket>> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const properties = mapTicketInputToProperties(ticketData);

        const response = await this.client.crm.tickets.basicApi.create({
          properties,
        });

        // Log successful ticket creation
        console.log(`[HubSpot] Ticket created successfully: ${response.id}`, {
          subject: ticketData.subject,
          ticketId: response.id,
          priority: ticketData.hs_ticket_priority,
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          data: {
            id: response.id!,
            properties: response.properties as Ticket['properties'],
          },
        };
      } catch (error: any) {
        lastError = error;

        // Log the error
        console.error(`[HubSpot] Ticket creation attempt ${attempt + 1} failed:`, {
          subject: ticketData.subject,
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying ticket creation in ${delay}ms...`);
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
        message: lastError?.message || 'Failed to create ticket',
        correlationId: lastError?.correlationId,
        category: lastError?.category,
      },
    };
  }

  /**
   * Associate a contact with a ticket
   */
  async associateContactToTicket(
    contactId: string,
    ticketId: string
  ): Promise<HubSpotApiResponse<void>> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        await this.client.crm.associations.v4.basicApi.create(
          'tickets',
          ticketId,
          'contacts',
          contactId,
          [
            {
              associationCategory: 'HUBSPOT_DEFINED' as any,
              associationTypeId: 16, // Ticket to Contact association
            },
          ]
        );

        // Log successful association
        console.log(`[HubSpot] Contact associated with ticket successfully`, {
          contactId,
          ticketId,
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
        };
      } catch (error: any) {
        lastError = error;

        // Log the error
        console.error(`[HubSpot] Ticket association attempt ${attempt + 1} failed:`, {
          contactId,
          ticketId,
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying ticket association in ${delay}ms...`);
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
        message: lastError?.message || 'Failed to associate contact with ticket',
        correlationId: lastError?.correlationId,
        category: lastError?.category,
      },
    };
  }

  /**
   * Update an existing ticket in HubSpot
   */
  async updateTicket(
    ticketId: string,
    updates: Partial<TicketInput>
  ): Promise<HubSpotApiResponse<Ticket>> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const properties = mapTicketInputToProperties(updates as TicketInput);

        const response = await this.client.crm.tickets.basicApi.update(ticketId, {
          properties,
        });

        // Log successful ticket update
        console.log(`[HubSpot] Ticket updated successfully: ${ticketId}`, {
          ticketId,
          updatedFields: Object.keys(updates),
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          data: {
            id: response.id!,
            properties: response.properties as Ticket['properties'],
          },
        };
      } catch (error: any) {
        lastError = error;

        // Log the error
        console.error(`[HubSpot] Ticket update attempt ${attempt + 1} failed:`, {
          ticketId,
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying ticket update in ${delay}ms...`);
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
        message: lastError?.message || 'Failed to update ticket',
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

export default TicketsService;
