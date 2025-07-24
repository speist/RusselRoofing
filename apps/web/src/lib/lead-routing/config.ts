/**
 * Lead routing configuration and thresholds
 */

export interface LeadRoutingConfig {
  highValueThresholds: {
    estimateAmount: number;
    commercialPropertyBonus: boolean;
    multipleServicesThreshold: number;
    largeSquareFootageThreshold: number;
  };
  emergencyDetection: {
    emergencyServiceTypes: string[];
    urgentKeywords: string[];
    urgentTimelines: string[];
  };
  assignmentRules: {
    emergencyDispatcher: string;
    seniorSalesRep: string;
    commercialSpecialist: string;
    standardSalesReps: string[];
  };
  notificationChannels: {
    emergency: {
      channels: ('sms' | 'slack' | 'email')[];
      delay: number; // milliseconds
    };
    highValue: {
      channels: ('slack' | 'email')[];
      delay: number; // milliseconds
    };
    standard: {
      channels: ('email')[];
      delay: number; // milliseconds
    };
  };
  businessHours: {
    timezone: string;
    workDays: number[]; // 0-6 (Sunday-Saturday)
    startHour: number; // 24-hour format
    endHour: number; // 24-hour format
  };
  scoring: {
    weights: {
      estimateAmount: number; // 40%
      propertyType: number;   // 20%
      serviceCount: number;   // 15%
      timeline: number;       // 15%
      location: number;       // 10%
    };
    priorityThresholds: {
      high: number;    // 80+ points
      medium: number;  // 50+ points
      low: number;     // 0+ points
    };
  };
}

/**
 * Default routing configuration
 */
export const DEFAULT_ROUTING_CONFIG: LeadRoutingConfig = {
  highValueThresholds: {
    estimateAmount: 15000, // $15K threshold for high-value leads
    commercialPropertyBonus: true, // Commercial properties are always high-value
    multipleServicesThreshold: 3, // 3+ services = high-value
    largeSquareFootageThreshold: 3000, // 3000+ sq ft = high-value
  },
  
  emergencyDetection: {
    emergencyServiceTypes: [
      'leak_repair',
      'storm_damage',
      'emergency_repair',
      'structural_damage',
      'water_damage',
    ],
    urgentKeywords: [
      'urgent',
      'emergency',
      'asap',
      'immediate',
      'right away',
      'storm',
      'leak',
      'flooding',
      'damage',
    ],
    urgentTimelines: [
      'asap',
      'immediate',
      'today',
      'tomorrow',
    ],
  },
  
  assignmentRules: {
    emergencyDispatcher: 'emergency-dispatcher',
    seniorSalesRep: 'senior-sales-rep',
    commercialSpecialist: 'commercial-specialist',
    standardSalesReps: [
      'sales-rep-1',
      'sales-rep-2',
      'sales-rep-3',
    ],
  },
  
  notificationChannels: {
    emergency: {
      channels: ['sms', 'slack', 'email'],
      delay: 0, // Immediate
    },
    highValue: {
      channels: ['slack', 'email'],
      delay: 900000, // 15 minutes
    },
    standard: {
      channels: ['email'],
      delay: 3600000, // 1 hour
    },
  },
  
  businessHours: {
    timezone: 'America/Denver', // Mountain Time
    workDays: [1, 2, 3, 4, 5], // Monday-Friday
    startHour: 8, // 8 AM
    endHour: 18, // 6 PM
  },
  
  scoring: {
    weights: {
      estimateAmount: 0.40, // 40%
      propertyType: 0.20,   // 20%
      serviceCount: 0.15,   // 15%
      timeline: 0.15,       // 15%
      location: 0.10,       // 10%
    },
    priorityThresholds: {
      high: 80,    // 80+ points = high priority
      medium: 50,  // 50+ points = medium priority
      low: 0,      // 0+ points = low priority
    },
  },
};

/**
 * Get current routing configuration
 * In the future, this could be loaded from environment variables or a database
 */
export function getRoutingConfig(): LeadRoutingConfig {
  // For now, return default config
  // TODO: Implement environment-specific overrides
  return DEFAULT_ROUTING_CONFIG;
}

/**
 * Check if a lead qualifies as high-value based on configuration
 */
export function isHighValueByConfig(
  estimateAmount: number,
  propertyType: string,
  serviceCount: number,
  squareFootage?: number
): boolean {
  const config = getRoutingConfig();
  const thresholds = config.highValueThresholds;
  
  // Check estimate amount threshold
  if (estimateAmount >= thresholds.estimateAmount) {
    return true;
  }
  
  // Check commercial property bonus
  if (thresholds.commercialPropertyBonus && propertyType === 'commercial') {
    return true;
  }
  
  // Check multiple services threshold
  if (serviceCount >= thresholds.multipleServicesThreshold) {
    return true;
  }
  
  // Check large square footage threshold
  if (squareFootage && squareFootage >= thresholds.largeSquareFootageThreshold) {
    return true;
  }
  
  return false;
}

/**
 * Get appropriate sales rep assignment based on lead characteristics
 */
export function getAssignmentByConfig(
  isEmergency: boolean,
  isHighValue: boolean,
  propertyType: string,
  leadScore: number
): string {
  const config = getRoutingConfig();
  const rules = config.assignmentRules;
  
  // Emergency leads go to emergency dispatcher
  if (isEmergency) {
    return rules.emergencyDispatcher;
  }
  
  // Commercial properties go to specialist
  if (propertyType === 'commercial') {
    return rules.commercialSpecialist;
  }
  
  // High-value leads go to senior sales rep
  if (isHighValue || leadScore >= config.scoring.priorityThresholds.high) {
    return rules.seniorSalesRep;
  }
  
  // Standard leads get round-robin assignment
  // Use a more deterministic approach than pure random for better distribution
  const repIndex = Date.now() % rules.standardSalesReps.length;
  return rules.standardSalesReps[repIndex];
}

/**
 * Get notification configuration for a priority level
 */
export function getNotificationConfig(priority: 'emergency' | 'high' | 'medium' | 'low') {
  const config = getRoutingConfig();
  
  switch (priority) {
    case 'emergency':
      return config.notificationChannels.emergency;
    case 'high':
      return config.notificationChannels.highValue;
    default:
      return config.notificationChannels.standard;
  }
}

/**
 * Check if current time is within business hours
 */
export function isBusinessHours(): boolean {
  const config = getRoutingConfig();
  const now = new Date();
  
  // Convert to configured timezone and get hour
  const timeInTz = new Intl.DateTimeFormat('en-US', {
    timeZone: config.businessHours.timezone,
    hour: 'numeric',
    hour12: false,
  }).formatToParts(now);
  
  const currentHour = parseInt(timeInTz.find(part => part.type === 'hour')?.value || '0');
  
  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const currentDay = now.getDay();
  
  // Check if current day is a work day
  if (!config.businessHours.workDays.includes(currentDay)) {
    return false;
  }
  
  // Check if current hour is within work hours
  return currentHour >= config.businessHours.startHour && 
         currentHour < config.businessHours.endHour;
}