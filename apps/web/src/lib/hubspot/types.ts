export interface ContactInput {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  property_type: 'single_family' | 'multi_family' | 'commercial';
  preferred_contact_method: 'phone' | 'email' | 'text';
  lead_source: 'instant_estimate';
}

export interface DealInput {
  dealname: string;
  amount: string;
  dealstage: string;
  services_requested: string;
  property_square_footage?: number;
  estimate_min: number;
  estimate_max: number;
  is_emergency: boolean;
  project_timeline?: string;
  // New lead routing properties
  lead_priority?: 'emergency' | 'high' | 'medium' | 'low';
  lead_score?: number;
  services_count?: number;
  assigned_sales_rep?: string;
  notification_sent?: boolean;
  project_description?: string;
  property_type?: string;
  location?: string;
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
    lead_source: string;
    createdate: string;
    lastmodifieddate: string;
  };
}

export interface Deal {
  id: string;
  properties: {
    dealname: string;
    amount: string;
    dealstage: string;
    services_requested: string;
    property_square_footage?: string;
    estimate_min: string;
    estimate_max: string;
    is_emergency: string;
    project_timeline?: string;
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

export interface ContactProfile {
  isReturning: boolean;
  knownFields?: Partial<ContactInput>;
  welcomeMessage?: string;
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