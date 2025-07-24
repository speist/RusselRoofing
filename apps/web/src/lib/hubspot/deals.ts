import { Client } from '@hubspot/api-client';
import { DealInput, Deal, HubSpotApiResponse } from './types';
import { mapDealInputToProperties, calculateBackoffDelay } from './utils';

class DealsService {
  private client: Client;
  private maxRetries = 3;

  constructor(apiKey: string) {
    this.client = new Client({ accessToken: apiKey });
  }

  /**
   * Create a new deal in HubSpot
   */
  async createDeal(dealData: DealInput): Promise<HubSpotApiResponse<Deal>> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const properties = mapDealInputToProperties(dealData);
        
        const response = await this.client.crm.deals.basicApi.create({
          properties,
        });

        // Log successful deal creation
        console.log(`[HubSpot] Deal created successfully: ${response.id}`, {
          dealname: dealData.dealname,
          dealId: response.id,
          amount: dealData.amount,
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          data: {
            id: response.id!,
            properties: response.properties as Deal['properties'],
          },
        };
      } catch (error: any) {
        lastError = error;
        
        // Log the error
        console.error(`[HubSpot] Deal creation attempt ${attempt + 1} failed:`, {
          dealname: dealData.dealname,
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying deal creation in ${delay}ms...`);
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
        message: lastError?.message || 'Failed to create deal',
        correlationId: lastError?.correlationId,
        category: lastError?.category,
      },
    };
  }

  /**
   * Associate a contact with a deal
   */
  async associateContactToDeal(
    contactId: string,
    dealId: string
  ): Promise<HubSpotApiResponse<void>> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        await this.client.crm.associations.v4.basicApi.create(
          'deals',
          dealId,
          'contacts',
          contactId,
          [
            {
              associationCategory: 'HUBSPOT_DEFINED' as any,
              associationTypeId: 3, // Deal to Contact association
            },
          ]
        );

        // Log successful association
        console.log(`[HubSpot] Contact associated with deal successfully`, {
          contactId,
          dealId,
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
        };
      } catch (error: any) {
        lastError = error;
        
        // Log the error
        console.error(`[HubSpot] Deal association attempt ${attempt + 1} failed:`, {
          contactId,
          dealId,
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying deal association in ${delay}ms...`);
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
        message: lastError?.message || 'Failed to associate contact with deal',
        correlationId: lastError?.correlationId,
        category: lastError?.category,
      },
    };
  }

  /**
   * Update an existing deal in HubSpot
   */
  async updateDeal(
    dealId: string,
    updates: Partial<DealInput>
  ): Promise<HubSpotApiResponse<Deal>> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const properties = mapDealInputToProperties(updates as DealInput);
        
        const response = await this.client.crm.deals.basicApi.update(dealId, {
          properties,
        });

        // Log successful deal update
        console.log(`[HubSpot] Deal updated successfully: ${dealId}`, {
          dealId,
          updatedFields: Object.keys(updates),
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          data: {
            id: response.id!,
            properties: response.properties as Deal['properties'],
          },
        };
      } catch (error: any) {
        lastError = error;
        
        // Log the error
        console.error(`[HubSpot] Deal update attempt ${attempt + 1} failed:`, {
          dealId,
          error: error.message,
          statusCode: error.code,
          attempt: attempt + 1,
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(error)) {
          const delay = calculateBackoffDelay(attempt);
          console.log(`[HubSpot] Retrying deal update in ${delay}ms...`);
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
        message: lastError?.message || 'Failed to update deal',
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

export default DealsService;