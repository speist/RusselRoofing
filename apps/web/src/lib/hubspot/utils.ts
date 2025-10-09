import { ContactInput, Contact, DealInput, TicketInput } from './types';

/**
 * Extract known fields from existing contact for progressive profiling
 */
export function extractKnownFields(contact: Contact): Partial<ContactInput> {
  const knownFields: Partial<ContactInput> = {};
  
  if (contact.properties.firstname) {
    knownFields.firstname = contact.properties.firstname;
  }
  
  if (contact.properties.lastname) {
    knownFields.lastname = contact.properties.lastname;
  }
  
  if (contact.properties.phone) {
    knownFields.phone = contact.properties.phone;
  }
  
  if (contact.properties.address) {
    knownFields.address = contact.properties.address;
  }
  
  if (contact.properties.property_type) {
    knownFields.property_type = contact.properties.property_type as ContactInput['property_type'];
  }
  
  if (contact.properties.preferred_contact_method) {
    knownFields.preferred_contact_method = contact.properties.preferred_contact_method as ContactInput['preferred_contact_method'];
  }
  
  return knownFields;
}

/**
 * Map form data to HubSpot contact properties format
 */
export function mapContactInputToProperties(input: ContactInput) {
  return {
    email: input.email,
    firstname: input.firstname,
    lastname: input.lastname,
    phone: input.phone,
    address: input.address,
    property_type: input.property_type,
    preferred_contact_method: input.preferred_contact_method,
    lead_source: input.lead_source,
  };
}

/**
 * Map deal input to HubSpot deal properties format
 */
export function mapDealInputToProperties(input: DealInput) {
  const properties: Record<string, string> = {
    dealname: input.dealname,
    amount: input.amount,
    dealstage: input.dealstage,
    services_requested: input.services_requested,
    estimate_min: input.estimate_min.toString(),
    estimate_max: input.estimate_max.toString(),
    is_emergency: input.is_emergency.toString(),
  };

  // Only add optional fields if they have values
  if (input.property_square_footage !== undefined) {
    properties.property_square_footage = input.property_square_footage.toString();
  }
  
  if (input.project_timeline) {
    properties.project_timeline = input.project_timeline;
  }

  // New lead routing properties
  if (input.lead_priority) {
    properties.lead_priority = input.lead_priority;
  }

  if (input.lead_score !== undefined) {
    properties.lead_score = input.lead_score.toString();
  }

  if (input.services_count !== undefined) {
    properties.services_count = input.services_count.toString();
  }

  if (input.assigned_sales_rep) {
    properties.assigned_sales_rep = input.assigned_sales_rep;
  }

  if (input.notification_sent !== undefined) {
    properties.notification_sent = input.notification_sent.toString();
  }

  if (input.project_description) {
    properties.project_description = input.project_description;
  }

  if (input.property_type) {
    properties.property_type = input.property_type;
  }

  if (input.location) {
    properties.location = input.location;
  }

  return properties;
}

/**
 * Exponential backoff delay calculation
 */
export function calculateBackoffDelay(attempt: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  const delay = baseDelay * Math.pow(2, attempt);
  return Math.min(delay, maxDelay);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize and validate contact input
 */
export function validateContactInput(input: Partial<ContactInput>): ContactInput | null {
  if (!input.email || !isValidEmail(input.email)) {
    return null;
  }
  
  if (!input.firstname || !input.lastname) {
    return null;
  }
  
  return {
    email: input.email.trim().toLowerCase(),
    firstname: input.firstname.trim(),
    lastname: input.lastname.trim(),
    phone: input.phone?.trim() || '',
    address: input.address?.trim() || '',
    property_type: input.property_type || 'single_family',
    preferred_contact_method: input.preferred_contact_method || 'email',
    lead_source: 'instant_estimate',
  };
}

/**
 * Validate deal input
 */
export function validateDealInput(input: Partial<DealInput>): DealInput | null {
  if (!input.dealname || !input.amount || !input.services_requested) {
    return null;
  }

  if (typeof input.estimate_min !== 'number' || typeof input.estimate_max !== 'number') {
    return null;
  }

  return {
    dealname: input.dealname.trim(),
    amount: input.amount.trim(),
    dealstage: input.dealstage || 'estimate_submitted',
    services_requested: input.services_requested.trim(),
    property_square_footage: input.property_square_footage,
    estimate_min: input.estimate_min,
    estimate_max: input.estimate_max,
    is_emergency: input.is_emergency || false,
    project_timeline: input.project_timeline?.trim(),
  };
}

/**
 * Map ticket input to HubSpot ticket properties format
 */
export function mapTicketInputToProperties(input: TicketInput) {
  const properties: Record<string, string> = {
    subject: input.subject,
    content: input.content,
    hs_pipeline: input.hs_pipeline,
    hs_pipeline_stage: input.hs_pipeline_stage,
    hs_ticket_priority: input.hs_ticket_priority,
  };

  // Only add optional fields if they have values
  if (input.property_address) {
    properties.property_address = input.property_address;
  }

  if (input.property_type) {
    properties.property_type = input.property_type;
  }

  if (input.services_requested) {
    properties.services_requested = input.services_requested;
  }

  if (input.estimate_min !== undefined) {
    properties.estimate_min = input.estimate_min.toString();
  }

  if (input.estimate_max !== undefined) {
    properties.estimate_max = input.estimate_max.toString();
  }

  if (input.is_emergency !== undefined) {
    properties.is_emergency = input.is_emergency.toString();
  }

  if (input.project_timeline) {
    properties.project_timeline = input.project_timeline;
  }

  if (input.preferred_contact_method) {
    properties.preferred_contact_method = input.preferred_contact_method;
  }

  if (input.preferred_contact_time) {
    properties.preferred_contact_time = input.preferred_contact_time;
  }

  return properties;
}

/**
 * Validate ticket input
 */
export function validateTicketInput(input: Partial<TicketInput>): TicketInput | null {
  if (!input.subject || !input.content) {
    return null;
  }

  return {
    subject: input.subject.trim(),
    content: input.content.trim(),
    hs_pipeline: input.hs_pipeline || '0',
    hs_pipeline_stage: input.hs_pipeline_stage || '1',
    hs_ticket_priority: input.hs_ticket_priority || 'MEDIUM',
    property_address: input.property_address?.trim(),
    property_type: input.property_type?.trim(),
    services_requested: input.services_requested?.trim(),
    estimate_min: input.estimate_min,
    estimate_max: input.estimate_max,
    is_emergency: input.is_emergency || false,
    project_timeline: input.project_timeline?.trim(),
    preferred_contact_method: input.preferred_contact_method,
    preferred_contact_time: input.preferred_contact_time,
  };
}