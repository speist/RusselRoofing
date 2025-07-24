import { LeadRoutingEngine } from '../routing-engine';
import { RoutingRule } from '../types';

describe('Lead Routing Engine', () => {
  let routingEngine: LeadRoutingEngine;

  beforeEach(() => {
    routingEngine = new LeadRoutingEngine();
  });

  describe('Emergency Lead Processing', () => {
    it('should route emergency leads correctly', async () => {
      const leadData = {
        dealId: 'test-emergency-001',
        estimateMin: 5000,
        estimateMax: 8000,
        propertyType: 'single_family',
        services: ['leak_repair'],
        timeline: 'asap',
        location: '123 Main St',
        projectDescription: 'Emergency roof leak repair needed immediately',
        isEmergencyChecked: true
      };

      const result = await routingEngine.processLead(leadData);

      expect(result.priority).toBe('emergency');
      expect(result.isEmergency).toBe(true);
      expect(result.assignedRep).toBe('emergency-dispatcher');
      expect(result.workflowsTriggered).toContain('Emergency Lead Routing');
    });

    it('should detect emergency from service types', async () => {
      const leadData = {
        dealId: 'test-emergency-002',
        estimateMin: 3000,
        estimateMax: 5000,
        propertyType: 'single_family',
        services: ['storm_damage'],
        timeline: 'flexible',
        location: '456 Oak Ave',
        projectDescription: 'Storm damage assessment',
        isEmergencyChecked: false
      };

      const result = await routingEngine.processLead(leadData);

      expect(result.isEmergency).toBe(true);
      expect(result.priority).toBe('emergency');
    });
  });

  describe('High-Value Lead Processing', () => {
    it('should route high-value leads to senior sales', async () => {
      const leadData = {
        dealId: 'test-highvalue-001',
        estimateMin: 20000,
        estimateMax: 25000,
        propertyType: 'single_family',
        services: ['roof_replacement', 'gutter_installation'],
        timeline: 'this_month',
        location: '789 Premium St',
        projectDescription: 'Complete roof replacement project',
        isEmergencyChecked: false
      };

      const result = await routingEngine.processLead(leadData);

      expect(result.priority).toBe('high');
      expect(result.assignedRep).toBe('senior-sales-rep');
      expect(result.score).toBeGreaterThan(80);
      expect(result.workflowsTriggered).toContain('High-Value Lead Routing');
    });

    it('should route commercial projects as high-value', async () => {
      const leadData = {
        dealId: 'test-commercial-001',
        estimateMin: 8000,
        estimateMax: 12000,
        propertyType: 'commercial',
        services: ['roof_inspection'],
        timeline: 'next_month',
        location: 'Business District',
        projectDescription: 'Commercial building inspection',
        isEmergencyChecked: false
      };

      const result = await routingEngine.processLead(leadData);

      expect(result.priority).toBe('high');
      expect(result.assignedRep).toBe('commercial-specialist');
    });
  });

  describe('Standard Lead Processing', () => {
    it('should route standard leads correctly', async () => {
      const leadData = {
        dealId: 'test-standard-001',
        estimateMin: 2000,
        estimateMax: 4000,
        propertyType: 'single_family',
        services: ['roof_cleaning'],
        timeline: 'flexible',
        location: '321 Standard Ave',
        projectDescription: 'Regular roof cleaning service',
        isEmergencyChecked: false
      };

      const result = await routingEngine.processLead(leadData);

      expect(result.priority).toBe('low');
      expect(result.assignedRep).toBe('sales-rep-1');
      expect(result.isEmergency).toBe(false);
      expect(result.score).toBeLessThan(50);
    });
  });

  describe('Lead Scoring Integration', () => {
    it('should calculate appropriate lead scores', async () => {
      const highValueLead = {
        dealId: 'test-score-high',
        estimateMin: 15000,
        estimateMax: 18000,
        propertyType: 'commercial',
        services: ['roof_replacement', 'insulation', 'gutters'],
        timeline: 'asap',
        location: 'Premium Hills',
        projectDescription: 'Complete commercial roof overhaul',
        isEmergencyChecked: false
      };

      const result = await routingEngine.processLead(highValueLead);

      expect(result.score).toBeGreaterThan(80);
      expect(result.priority).toBe('high');
    });

    it('should handle edge case scores correctly', async () => {
      const edgeCaseLead = {
        dealId: 'test-score-edge',
        estimateMin: 0,
        estimateMax: 500,
        propertyType: undefined,
        services: [],
        timeline: undefined,
        location: '',
        projectDescription: '',
        isEmergencyChecked: false
      };

      const result = await routingEngine.processLead(edgeCaseLead);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.priority).toBeDefined();
    });
  });

  describe('Rule Management', () => {
    it('should allow adding custom rules', () => {
      const customRule: RoutingRule = {
        id: 'custom-vip-rule',
        name: 'VIP Customer Routing',
        priority: 1,
        conditions: [
          { field: 'customer_type', operator: 'equals', value: 'vip' }
        ],
        actions: [
          { type: 'assign_to', value: 'vip-specialist' },
          { type: 'set_priority', value: 'high' }
        ]
      };

      routingEngine.addRule(customRule);
      const rules = routingEngine.getRules();

      expect(rules).toContainEqual(customRule);
      expect(rules[0]).toEqual(customRule); // Should be first due to priority
    });

    it('should allow removing rules', () => {
      const initialRuleCount = routingEngine.getRules().length;
      
      routingEngine.removeRule('emergency-routing');
      const remainingRules = routingEngine.getRules();

      expect(remainingRules.length).toBe(initialRuleCount - 1);
      expect(remainingRules.find(rule => rule.id === 'emergency-routing')).toBeUndefined();
    });

    it('should maintain rule priority order', () => {
      const rules = routingEngine.getRules();
      
      for (let i = 1; i < rules.length; i++) {
        expect(rules[i].priority).toBeGreaterThanOrEqual(rules[i - 1].priority);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle missing lead data gracefully', async () => {
      const incompleteLead = {
        dealId: 'test-incomplete',
        // Missing many required fields
      };

      const result = await routingEngine.processLead(incompleteLead);

      expect(result).toBeDefined();
      expect(result.dealId).toBe('test-incomplete');
      expect(result.priority).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    it('should not fail on malformed data', async () => {
      const malformedLead = {
        dealId: 'test-malformed',
        estimateMin: 'not-a-number' as any,
        estimateMax: null as any,
        services: 'not-an-array' as any,
        propertyType: 123 as any
      };

      const result = await routingEngine.processLead(malformedLead);

      expect(result).toBeDefined();
      expect(result.dealId).toBe('test-malformed');
    });
  });
});