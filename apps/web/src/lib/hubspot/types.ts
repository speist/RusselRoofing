export interface ContactInput {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  property_type: 'single_family' | 'multi_family' | 'commercial';
  preferred_contact_method: 'phone' | 'email' | 'text';
  preferred_contact_time?: string;
  lead_source: string; // HubSpot has specific allowed values
  lead_source_category?: string; // e.g., "Digital Marketing / Online Presence"
}

export interface DealInput {
  dealname: string;
  amount: string;
  pipeline?: string;
  dealstage: string;
  services_requested: string;
  property_square_footage?: number;
  estimate_min: number;
  estimate_max: number;
  is_emergency: boolean;
  project_timeline?: string;
  // Contact preferences
  preferred_contact_method?: 'phone' | 'email' | 'text';
  preferred_contact_time?: string;
  // Lead source properties (direct Deal properties)
  lead_source__?: string; // Lead Source
  lead_source_category__?: string; // Lead Source Category
  // New lead routing properties
  lead_priority?: 'emergency' | 'high' | 'medium' | 'low';
  lead_score?: number;
  services_count?: number;
  assigned_sales_rep?: string;
  notification_sent?: boolean;
  project_description?: string;
  property_type?: string;
  location?: string;
  // Contact information fields on Deal (sync/calculated properties)
  contact_first_name_?: string;
  contact_last_name_?: string;
  contact_street_address?: string;
  contact_city?: string;
  contact_zip?: string;
  contact_email_?: string;
  contact_phone_?: string;
  contact_mobile_phone?: string;
  contact_lead_source?: string; // Contact Lead Source Category (sync property)
  contact_lead_source__?: string; // Contact Lead Source (sync property)
  contact_lead_source_other?: string;
}

export interface TicketInput {
  subject: string;
  content: string;
  hs_pipeline: string;
  hs_pipeline_stage: string;
  hs_ticket_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  // Custom properties for estimate requests
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

export interface Contact {
  id: string;
  properties: {
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    address: string;
    property_type: string;
    preferred_contact_method: string;
    preferred_contact_time?: string;
    lead_source: string;
    lead_source_category?: string;
    createdate: string;
    lastmodifieddate: string;
  };
}

export interface Deal {
  id: string;
  properties: {
    dealname: string;
    amount: string;
    pipeline?: string;
    dealstage: string;
    services_requested: string;
    property_square_footage?: string;
    estimate_min: string;
    estimate_max: string;
    is_emergency: string;
    project_timeline?: string;
    // Contact preferences
    preferred_contact_method?: string;
    preferred_contact_time?: string;
    createdate: string;
    // New lead routing properties
    lead_priority?: string;
    lead_score?: string;
    services_count?: string;
    assigned_sales_rep?: string;
    notification_sent?: string;
    project_description?: string;
    property_type?: string;
    location?: string;
  };
}

export interface Ticket {
  id: string;
  properties: {
    subject: string;
    content: string;
    hs_pipeline: string;
    hs_pipeline_stage: string;
    hs_ticket_priority: string;
    createdate: string;
    // Custom properties for estimate requests
    property_address?: string;
    property_type?: string;
    services_requested?: string;
    estimate_min?: string;
    estimate_max?: string;
    is_emergency?: string;
    project_timeline?: string;
    preferred_contact_method?: string;
    preferred_contact_time?: string;
  };
}

export interface ContactProfile {
  isReturning: boolean;
  knownFields?: Partial<ContactInput>;
  welcomeMessage?: string;
}

// Blog Post Types
export interface BlogPost {
  id: string;
  name: string;
  slug: string;
  state: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  featuredImage: string;
  featuredImageAltText?: string;
  postBody: string;
  postSummary: string;
  metaDescription?: string;
  htmlTitle?: string;
  publishDate: string;
  created: string;
  updated: string;
  authorName?: string;
  blogAuthorId?: string;
  category?: {
    id: string;
    name: string;
  };
  tagIds?: string[];
  tags?: string[]; // Array of tag names for filtering
  url: string;
}

export interface BlogListResponse {
  total: number;
  results: BlogPost[];
}

export interface BlogPostParams {
  limit?: number;
  offset?: number;
  state?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  slug?: string;
  id?: string;
}

export interface HubSpotError {
  status: string;
  message: string;
  correlationId?: string;
  category?: string;
}

export interface HubSpotApiResponse<T> {
  data?: T;
  error?: HubSpotError;
  success: boolean;
}

// Error constants for consistent error handling
export const HUBSPOT_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export type HubSpotErrorCode = typeof HUBSPOT_ERROR_CODES[keyof typeof HUBSPOT_ERROR_CODES];