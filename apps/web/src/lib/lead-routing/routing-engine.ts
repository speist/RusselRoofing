import { 
  RoutingRule, 
  RoutingCondition, 
  RoutingAction, 
  LeadPriority, 
  LeadProcessingResult,
  CustomDealProperties 
} from './types';
import { 
  calculateLeadScore, 
  determineLeadPriority, 
  detectEmergency, 
  isHighValueLead,
  formatEstimateRange 
} from './scoring';
import { 
  getRoutingConfig, 
  isHighValueByConfig, 
  getAssignmentByConfig,
  getNotificationConfig,
  isBusinessHours 
} from './config';

/**
 * Lead Routing Engine
 * Processes incoming leads and applies routing rules based on priority and business logic
 */
export class LeadRoutingEngine {
  private rules: RoutingRule[] = [];
  private standardRepIndex = 0;

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Initialize default routing rules based on business requirements
   */
  private initializeDefaultRules(): void {
    const config = getRoutingConfig();
    
    this.rules = [
      // Emergency routing rule (highest priority)
      {
        id: 'emergency-routing',
        name: 'Emergency Lead Routing',
        priority: 1,
        conditions: [
          { field: 'is_emergency', operator: 'equals', value: true }
        ],
        actions: [
          { type: 'set_priority', value: 'emergency' },
          { type: 'assign_to', value: 'emergency-dispatcher' },
          { type: 'notify', value: 'emergency-channels' }
        ]
      },
      
      // High-value routing rule
      {
        id: 'high-value-routing',
        name: 'High-Value Lead Routing',
        priority: 2,
        conditions: [
          { field: 'estimate_amount', operator: 'greater_than', value: config.highValueThresholds.estimateAmount }
        ],
        actions: [
          { type: 'set_priority', value: 'high' },
          { type: 'assign_to', value: 'senior-sales-rep' },
          { type: 'notify', value: 'high-value-channels' }
        ]
      },
      
      // Commercial property routing
      {
        id: 'commercial-routing',
        name: 'Commercial Property Routing',
        priority: 3,
        conditions: [
          { field: 'property_type', operator: 'equals', value: 'commercial' }
        ],
        actions: [
          { type: 'set_priority', value: 'high' },
          { type: 'assign_to', value: 'commercial-specialist' },
          { type: 'notify', value: 'commercial-channels' }
        ]
      },
      
      // Multiple services high-value rule
      {
        id: 'multiple-services-routing',
        name: 'Multiple Services High-Value Routing',
        priority: 4,
        conditions: [
          { field: 'services_count', operator: 'greater_than', value: config.highValueThresholds.multipleServicesThreshold - 1 }
        ],
        actions: [
          { type: 'set_priority', value: 'high' },
          { type: 'assign_to', value: 'senior-sales-rep' },
          { type: 'notify', value: 'high-value-channels' }
        ]
      },
      
      // Standard routing rule (lowest priority)
      {
        id: 'standard-routing',
        name: 'Standard Lead Routing',
        priority: 99,
        conditions: [], // No conditions - catch all
        actions: [
          { type: 'assign_to', value: 'general-sales' },
          { type: 'notify', value: 'standard-channels' }
        ]
      }
    ];
  }

  /**
   * Process a lead through the routing engine
   */
  async processLead(leadData: any): Promise<LeadProcessingResult> {
    try {
      // Extract lead information
      const {
        dealId,
        estimateMin,
        estimateMax,
        propertyType,
        services,
        timeline,
        location,
        projectDescription,
        isEmergencyChecked
      } = leadData;

      // Calculate lead score
      const scoringCriteria = {
        estimateAmount: (estimateMin + estimateMax) / 2,
        propertyType: propertyType || 'single_family',
        serviceCount: services?.length || 1,
        timeline: timeline || 'flexible',
        location: location || ''
      };

      const leadScore = calculateLeadScore(scoringCriteria);

      // Detect emergency status
      const isEmergency = detectEmergency({
        isEmergencyChecked: isEmergencyChecked || false,
        serviceTypes: services || [],
        projectDescription: projectDescription || '',
        timeline: timeline || 'flexible'
      });

      // Determine priority
      const priority = determineLeadPriority(leadScore, isEmergency);

      // Check if high-value using both old and new logic
      const estimateAmount = (estimateMin + estimateMax) / 2;
      const isHighValue = isHighValueLead(
        estimateAmount,
        propertyType || 'single_family',
        services?.length || 1
      ) || isHighValueByConfig(
        estimateAmount,
        propertyType || 'single_family',
        services?.length || 1,
        leadData.propertySquareFootage
      );

      // Apply routing rules
      const matchedRules = this.findMatchingRules({
        is_emergency: isEmergency,
        estimate_amount: (estimateMin + estimateMax) / 2,
        property_type: propertyType,
        lead_score: leadScore,
        services_count: services?.length || 1
      });

      // Execute actions from matched rules
      const result: LeadProcessingResult = {
        dealId: dealId || 'unknown',
        priority,
        score: leadScore,
        isEmergency,
        notificationsSent: [],
        workflowsTriggered: []
      };

      // Apply routing actions from the highest-priority rule
      if (matchedRules.length > 0) {
        const rule = matchedRules[0]; // Highest priority rule
        for (const action of rule.actions) {
          await this.executeAction(action, result, leadData);
        }
        result.workflowsTriggered.push(rule.name);
      }

      // Use config-based assignment if no rules matched or for enhanced assignment
      if (!result.assignedRep) {
        result.assignedRep = getAssignmentByConfig(
          isEmergency,
          isHighValue,
          propertyType || 'single_family',
          leadScore
        );
      }

      console.log(`[Lead Routing] Processed lead ${dealId}:`, {
        priority,
        score: leadScore,
        isEmergency,
        isHighValue,
        assignedRep: result.assignedRep,
        rulesTriggered: result.workflowsTriggered.length
      });

      return result;

    } catch (error) {
      console.error('[Lead Routing] Error processing lead:', error);
      throw error;
    }
  }

  /**
   * Find routing rules that match the given criteria
   */
  private findMatchingRules(criteria: Record<string, any>): RoutingRule[] {
    const matchedRules: RoutingRule[] = [];

    for (const rule of this.rules) {
      if (this.evaluateConditions(rule.conditions, criteria)) {
        matchedRules.push(rule);
      }
    }

    // Sort by priority (lower number = higher priority)
    return matchedRules.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Evaluate if all conditions in a rule are met
   */
  private evaluateConditions(conditions: RoutingCondition[], criteria: Record<string, any>): boolean {
    // If no conditions, rule matches everything (catch-all)
    if (conditions.length === 0) {
      return true;
    }

    return conditions.every(condition => {
      const value = criteria[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'greater_than':
          return typeof value === 'number' && value > condition.value;
        case 'contains':
          return typeof value === 'string' && value.includes(condition.value);
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(value);
        default:
          return false;
      }
    });
  }

  /**
   * Execute a routing action
   */
  private async executeAction(
    action: RoutingAction, 
    result: LeadProcessingResult, 
    leadData: any
  ): Promise<void> {
    switch (action.type) {
      case 'set_priority':
        result.priority = action.value as LeadPriority;
        break;

      case 'assign_to':
        result.assignedRep = this.getAssignedRep(action.value, leadData);
        break;

      case 'notify':
        // Notification handling will be implemented in notifications.ts
        result.notificationsSent.push(action.value);
        break;

      case 'add_to_sequence':
        // Sequence handling for future implementation
        break;

      default:
        console.warn(`[Lead Routing] Unknown action type: ${action.type}`);
    }
  }

  /**
   * Get assigned sales representative based on routing type
   */
  private getAssignedRep(routingType: string, leadData: any): string {
    const config = getRoutingConfig();
    
    // Map routing types to configuration-based assignments
    const assignments: Record<string, string> = {
      'emergency-dispatcher': config.assignmentRules.emergencyDispatcher,
      'senior-sales-rep': config.assignmentRules.seniorSalesRep,
      'commercial-specialist': config.assignmentRules.commercialSpecialist,
      'general-sales': this.getStandardSalesRep()
    };

    return assignments[routingType] || this.getStandardSalesRep();
  }

  /**
   * Get a standard sales rep using round-robin assignment
   */
  private getStandardSalesRep(): string {
    const config = getRoutingConfig();
    const reps = config.assignmentRules.standardSalesReps;

    if (reps.length === 0) {
      return 'default-sales-rep';
    }

    const rep = reps[this.standardRepIndex];
    this.standardRepIndex = (this.standardRepIndex + 1) % reps.length;
    return rep;
  }

  /**
   * Add a custom routing rule
   */
  addRule(rule: RoutingRule): void {
    const index = this.rules.findIndex(r => r.priority >= rule.priority);
    if (index === -1) {
      this.rules.push(rule);
    } else {
      this.rules.splice(index, 0, rule);
    }
  }

  /**
   * Remove a routing rule by ID
   */
  removeRule(ruleId: string): boolean {
    const index = this.rules.findIndex(rule => rule.id === ruleId);
    if (index >= 0) {
      this.rules.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get all active routing rules
   */
  getRules(): RoutingRule[] {
    return [...this.rules];
  }
}

// Export singleton instance
export const leadRoutingEngine = new LeadRoutingEngine();