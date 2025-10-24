/**
 * HubSpot Community Involvement Service
 * Handles CRUD operations for Community custom object
 */

import { HubSpotApiResponse } from './types';

export interface CommunityActivity {
  id: string;
  properties: {
    name: string;
    description?: string;
    year?: number;
    impact?: string;
    image_url?: string;
    live: string;
    createdate?: string;
    hs_lastmodifieddate?: string;
  };
}

export interface CommunityListResponse {
  results: CommunityActivity[];
  total: number;
}

export interface CommunityParams {
  limit?: number;
  liveOnly?: boolean;
}

class CommunityService {
  private apiKey: string;
  private readonly COMMUNITY_OBJECT_TYPE_ID = '2-51945309';
  private readonly BASE_URL = 'https://api.hubapi.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get all community activities
   */
  async getCommunityActivities(params?: CommunityParams): Promise<HubSpotApiResponse<CommunityListResponse>> {
    try {
      const limit = params?.limit || 100;
      const liveOnly = params?.liveOnly !== false; // Default to true

      const properties = [
        'name',
        'description',
        'year',
        'impact',
        'image_url',
        'live'
      ];

      let url = `${this.BASE_URL}/crm/v3/objects/${this.COMMUNITY_OBJECT_TYPE_ID}?limit=${limit}&properties=${properties.join(',')}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HubSpot API error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      let results = data.results || [];

      // Filter by live status if requested
      if (liveOnly) {
        results = results.filter((activity: CommunityActivity) =>
          activity.properties.live === 'true'
        );
      }

      // Sort by year descending (most recent first)
      results.sort((a: CommunityActivity, b: CommunityActivity) => {
        const yearA = a.properties.year || 0;
        const yearB = b.properties.year || 0;
        return yearB - yearA;
      });

      return {
        success: true,
        data: {
          results,
          total: results.length,
        },
      };
    } catch (error: any) {
      console.error('Error fetching community activities:', error);
      return {
        success: false,
        error: {
          status: 'error',
          message: error.message || 'Failed to fetch community activities',
        },
      };
    }
  }

  /**
   * Get a single community activity by ID
   */
  async getCommunityActivityById(id: string): Promise<HubSpotApiResponse<CommunityActivity | null>> {
    try {
      const properties = [
        'name',
        'description',
        'year',
        'impact',
        'image_url',
        'live'
      ];

      const url = `${this.BASE_URL}/crm/v3/objects/${this.COMMUNITY_OBJECT_TYPE_ID}/${id}?properties=${properties.join(',')}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: true,
            data: null,
          };
        }
        const errorData = await response.json();
        throw new Error(`HubSpot API error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error(`Error fetching community activity ${id}:`, error);
      return {
        success: false,
        error: {
          status: 'error',
          message: error.message || 'Failed to fetch community activity',
        },
      };
    }
  }
}

export default CommunityService;
