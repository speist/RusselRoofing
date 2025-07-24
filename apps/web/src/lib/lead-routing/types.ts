// Lead Priority and Scoring Types
export type LeadPriority = 'emergency' | 'high' | 'medium' | 'low';

export interface LeadScoringCriteria {
  estimateAmount: number;      // 0-40 points (40% weight)
  propertyType: string;        // 0-20 points (20% weight)  
  serviceCount: number;        // 0-15 points (15% weight)
  timeline: string;            // 0-15 points (15% weight)
  location: string;            // 0-10 points (10% weight)
}

export interface CustomDealProperties {
  lead_priority: LeadPriority;
  lead_score: number; // 0-100
  is_emergency: boolean;
  estimate_min: number;
  estimate_max: number;
  services_count: number;
  assigned_sales_rep: string;
  notification_sent: boolean;
}

// Routing Engine Types
export interface RoutingRule {
  id: string;
  name: string;
  conditions: RoutingCondition[];
  actions: RoutingAction[];
  priority: number;
}

export interface RoutingCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'contains' | 'in';
  value: any;
}

export interface RoutingAction {
  type: 'assign_to' | 'notify' | 'set_priority' | 'add_to_sequence';
  value: string;
}

// Emergency Detection Types
export interface EmergencyDetectionCriteria {
  isEmergencyChecked: boolean;
  serviceTypes: string[];
  projectDescription: string;
  timeline: string;
}

// Notification Types
export interface NotificationTemplate {
  emergency: {
    subject: string;
    message: string;
  };
  high_value: {
    subject: string;
    message: string;
  };
  standard: {
    subject: string;
    message: string;
  };
}

export interface NotificationChannel {
  type: 'email' | 'slack' | 'sms';
  enabled: boolean;
  config: Record<string, any>;
}

export interface NotificationRequest {
  priority: LeadPriority;
  dealId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address: string;
  estimateRange: string;
  services: string[];
  leadScore: number;
  assignedRep?: string;
}

// Lead Processing Result
export interface LeadProcessingResult {
  dealId: string;
  priority: LeadPriority;
  score: number;
  isEmergency: boolean;
  assignedRep?: string;
  notificationsSent: string[];
  workflowsTriggered: string[];
}