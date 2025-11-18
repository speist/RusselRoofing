import { HubSpotApiResponse, HUBSPOT_ERROR_CODES } from './types';

export interface TeamMember {
  id: string;
  properties: {
    employee_name: string;
    employee_title?: string;
    employee_description?: string;
    employee_phone_number?: string;
    employee_photo?: string; // URL to photo
    live: string; // 'true' or 'false'
    createdate?: string;
    hs_lastmodifieddate?: string;
  };
}

export interface TeamListResponse {
  total: number;
  results: TeamMember[];
}

export interface TeamParams {
  limit?: number;
  liveOnly?: boolean;
}

class TeamService {
  private apiKey: string;
  private readonly TEAM_OBJECT_TYPE_ID = '2-52960731'; // RR Team object from HubSpot
  private readonly BASE_URL = 'https://api.hubapi.com';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get all team members, optionally filtered by live status
   */
  async getTeamMembers(params?: TeamParams): Promise<HubSpotApiResponse<TeamListResponse>> {
    try {
      const limit = params?.limit || 100;
      const liveOnly = params?.liveOnly !== false; // Default to true

      // Build properties list
      const properties = [
        'employee_name',
        'employee_title',
        'employee_description',
        'employee_phone_number',
        'employee_photo',
        'live'
      ];

      // Build URL with properties
      let url = `${this.BASE_URL}/crm/v3/objects/${this.TEAM_OBJECT_TYPE_ID}?limit=${limit}&properties=${properties.join(',')}`;

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
        results = results.filter((member: TeamMember) => member.properties.live === 'true');
      }

      return {
        success: true,
        data: {
          total: results.length,
          results,
        },
      };
    } catch (error: any) {
      console.error('[HubSpot Team] Error fetching team members:', error);
      return {
        success: false,
        error: {
          status: error.status || HUBSPOT_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Failed to fetch team members from HubSpot',
        },
      };
    }
  }

  /**
   * Get a single team member by ID
   */
  async getTeamMemberById(id: string): Promise<HubSpotApiResponse<TeamMember | null>> {
    try {
      const properties = [
        'employee_name',
        'employee_title',
        'employee_description',
        'employee_phone_number',
        'employee_photo',
        'live'
      ];

      const url = `${this.BASE_URL}/crm/v3/objects/${this.TEAM_OBJECT_TYPE_ID}/${id}?properties=${properties.join(',')}`;

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
      console.error('[HubSpot Team] Error fetching team member by ID:', error);
      return {
        success: false,
        error: {
          status: error.status || HUBSPOT_ERROR_CODES.UNKNOWN_ERROR,
          message: error.message || 'Failed to fetch team member from HubSpot',
        },
      };
    }
  }
}

export default TeamService;
