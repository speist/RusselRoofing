import { FAQ, FAQListResponse, FAQParams, HubSpotApiResponse, HUBSPOT_ERROR_CODES } from './types';

class FAQService {
  private apiKey: string;
  // FAQ custom object type ID from HubSpot
  private readonly FAQ_OBJECT_TYPE_ID = '2-53256317';
  private readonly BASE_URL = 'https://api.hubapi.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get all FAQs, optionally filtered by service area
   */
  async getFAQs(params?: FAQParams): Promise<HubSpotApiResponse<FAQListResponse>> {
    try {
      const limit = params?.limit || 100;

      // Build properties list
      const properties = [
        'service_area',
        'question',
        'answer',
        'live'
      ];

      // Build URL with properties
      let url = `${this.BASE_URL}/crm/v3/objects/${this.FAQ_OBJECT_TYPE_ID}?limit=${limit}&properties=${properties.join(',')}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 3600 // Cache for 1 hour
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HubSpot API error: ${response.status} - ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();
      let results = data.results || [];

      // Filter by live status (only show live FAQs)
      // If 'live' property doesn't exist, treat as live (show by default)
      results = results.filter((faq: FAQ) =>
        faq.properties.live === 'true' || faq.properties.live === undefined || faq.properties.live === null
      );

      // Filter by service area if requested
      if (params?.serviceArea) {
        results = results.filter((faq: FAQ) =>
          faq.properties.service_area === params.serviceArea
        );
      }

      return {
        success: true,
        data: {
          total: results.length,
          results,
        },
      };
    } catch (error: any) {
      console.error('[HubSpot FAQs] Error fetching FAQs:', error);
      return {
        success: false,
        error: {
          status: error.status || HUBSPOT_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Failed to fetch FAQs from HubSpot',
        },
      };
    }
  }

  /**
   * Get a single FAQ by ID
   */
  async getFAQById(id: string): Promise<HubSpotApiResponse<FAQ | null>> {
    try {
      const properties = [
        'service_area',
        'question',
        'answer',
        'live'
      ];

      const url = `${this.BASE_URL}/crm/v3/objects/${this.FAQ_OBJECT_TYPE_ID}/${id}?properties=${properties.join(',')}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return {
          success: true,
          data: null,
        };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HubSpot API error: ${response.status} - ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('[HubSpot FAQs] Error fetching FAQ by ID:', error);
      return {
        success: false,
        error: {
          status: error.status || HUBSPOT_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Failed to fetch FAQ from HubSpot',
        },
      };
    }
  }
}

export default FAQService;
