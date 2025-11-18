import { HubSpotApiResponse, HUBSPOT_ERROR_CODES } from './types';

export interface TeamMember {
  id: string;
  properties: {
    employee_name: string;
    employee_title?: string;
    employee_description?: string;
    employee_email?: string;
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
  private fileUrlCache: Map<string, string> = new Map(); // Cache file ID to URL mappings

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Convert HubSpot file ID to file URL using Files API
   */
  private async getFileUrl(fileId: string): Promise<string | null> {
    // Return cached URL if available
    if (this.fileUrlCache.has(fileId)) {
      console.log(`[HubSpot Files] Using cached URL for file ${fileId}`);
      return this.fileUrlCache.get(fileId)!;
    }

    try {
      console.log(`[HubSpot Files] Fetching file details for ID: ${fileId}`);
      const url = `${this.BASE_URL}/files/v3/files/${fileId}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`[HubSpot Files] API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[HubSpot Files] Failed to fetch file ${fileId}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        return null;
      }

      const data = await response.json();
      console.log(`[HubSpot Files] File data received:`, {
        fileId,
        hasUrl: !!data.url,
        url: data.url,
        fullData: data,
      });

      const fileUrl = data.url || null;

      // Cache the result
      if (fileUrl) {
        this.fileUrlCache.set(fileId, fileUrl);
        console.log(`[HubSpot Files] Cached URL for file ${fileId}: ${fileUrl}`);
      }

      return fileUrl;
    } catch (error) {
      console.error(`[HubSpot Files] Error fetching file ${fileId}:`, error);
      return null;
    }
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
        'employee_email',
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

      // Convert file IDs to URLs for employee photos
      // HubSpot stores file IDs in employee_photo field, we need to fetch the actual URLs
      const resultsWithUrls = await Promise.all(
        results.map(async (member: TeamMember) => {
          if (member.properties.employee_photo) {
            // Check if it's a file ID (numeric string) or already a URL
            const isFileId = /^\d+$/.test(member.properties.employee_photo);

            if (isFileId) {
              console.log(`[HubSpot Team] Converting file ID ${member.properties.employee_photo} to URL for ${member.properties.employee_name}`);
              const fileUrl = await this.getFileUrl(member.properties.employee_photo);

              if (fileUrl) {
                console.log(`[HubSpot Team] Got URL: ${fileUrl}`);
                member.properties.employee_photo = fileUrl;
              } else {
                console.warn(`[HubSpot Team] Could not fetch URL for file ID ${member.properties.employee_photo}`);
                member.properties.employee_photo = ''; // Clear invalid file ID
              }
            }
          }
          return member;
        })
      );

      return {
        success: true,
        data: {
          total: resultsWithUrls.length,
          results: resultsWithUrls,
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
        'employee_email',
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

      // Convert file ID to URL for employee photo if needed
      if (data.properties?.employee_photo) {
        const isFileId = /^\d+$/.test(data.properties.employee_photo);

        if (isFileId) {
          console.log(`[HubSpot Team] Converting file ID ${data.properties.employee_photo} to URL for ${data.properties.employee_name}`);
          const fileUrl = await this.getFileUrl(data.properties.employee_photo);

          if (fileUrl) {
            console.log(`[HubSpot Team] Got URL: ${fileUrl}`);
            data.properties.employee_photo = fileUrl;
          } else {
            console.warn(`[HubSpot Team] Could not fetch URL for file ID ${data.properties.employee_photo}`);
            data.properties.employee_photo = ''; // Clear invalid file ID
          }
        }
      }

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
