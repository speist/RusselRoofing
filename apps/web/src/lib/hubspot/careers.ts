import { HubSpotApiResponse, HUBSPOT_ERROR_CODES } from './types';

export interface Career {
  id: string;
  properties: {
    job_title: string;
    department?: string;
    location?: string;
    employment_type?: string; // Full-time, Part-time, Contract
    experience_level?: string;
    salary_range?: string;
    job_description?: string;
    key_responsibilities?: string; // Comma or newline separated
    requirements?: string; // Comma or newline separated
    live: string; // 'true' or 'false'
    createdate?: string;
    hs_lastmodifieddate?: string;
  };
}

export interface CareersListResponse {
  total: number;
  results: Career[];
}

export interface CareersParams {
  limit?: number;
  liveOnly?: boolean;
}

class CareersService {
  private apiKey: string;
  private readonly CAREERS_OBJECT_TYPE_ID = '2-51900429'; // From HubSpot
  private readonly BASE_URL = 'https://api.hubapi.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get all career postings, optionally filtered by live status
   */
  async getCareers(params?: CareersParams): Promise<HubSpotApiResponse<CareersListResponse>> {
    try {
      const limit = params?.limit || 100;
      const liveOnly = params?.liveOnly !== false; // Default to true

      // Build properties list
      const properties = [
        'job_title',
        'department',
        'location',
        'employment_type',
        'experience_level',
        'salary_range',
        'job_description',
        'key_responsibilities',
        'requirements',
        'live'
      ];

      // Build URL with properties
      let url = `${this.BASE_URL}/crm/v3/objects/${this.CAREERS_OBJECT_TYPE_ID}?limit=${limit}&properties=${properties.join(',')}`;

      // Note: HubSpot custom object search API doesn't support filtering by property values in the basic GET
      // We'll filter in memory after fetching
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HubSpot API error: ${response.status} - ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();
      let results = data.results || [];

      // Filter by live status if requested
      if (liveOnly) {
        results = results.filter((career: Career) => career.properties.live === 'true');
      }

      return {
        success: true,
        data: {
          total: results.length,
          results,
        },
      };
    } catch (error: any) {
      console.error('[HubSpot Careers] Error fetching careers:', error);
      return {
        success: false,
        error: {
          status: error.status || HUBSPOT_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Failed to fetch careers from HubSpot',
        },
      };
    }
  }

  /**
   * Get a single career posting by ID
   */
  async getCareerById(id: string): Promise<HubSpotApiResponse<Career | null>> {
    try {
      const properties = [
        'job_title',
        'department',
        'location',
        'employment_type',
        'experience_level',
        'salary_range',
        'job_description',
        'key_responsibilities',
        'requirements',
        'live'
      ];

      const url = `${this.BASE_URL}/crm/v3/objects/${this.CAREERS_OBJECT_TYPE_ID}/${id}?properties=${properties.join(',')}`;

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
      console.error('[HubSpot Careers] Error fetching career by ID:', error);
      return {
        success: false,
        error: {
          status: error.status || HUBSPOT_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Failed to fetch career from HubSpot',
        },
      };
    }
  }
}

export default CareersService;
