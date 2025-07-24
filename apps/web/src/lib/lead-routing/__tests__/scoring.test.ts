import {
  calculateLeadScore,
  determineLeadPriority,
  detectEmergency,
  isHighValueLead,
  formatEstimateRange,
} from '../scoring';
import { LeadScoringCriteria, EmergencyDetectionCriteria } from '../types';

describe('Lead Scoring System', () => {
  describe('calculateLeadScore', () => {
    it('should calculate correct score for high-value commercial project', () => {
      const criteria: LeadScoringCriteria = {
        estimateAmount: 25000, // 40 points (max)
        propertyType: 'commercial', // 20 points
        serviceCount: 4, // 12 points
        timeline: 'asap', // 15 points
        location: 'premium hills area' // 10 points
      };

      const score = calculateLeadScore(criteria);
      expect(score).toBe(97); // 40 + 20 + 12 + 15 + 10
    });

    it('should calculate correct score for standard residential project', () => {
      const criteria: LeadScoringCriteria = {
        estimateAmount: 5000, // 10 points
        propertyType: 'single_family', // 10 points
        serviceCount: 1, // 3 points
        timeline: 'flexible', // 5 points
        location: 'standard area' // 5 points
      };

      const score = calculateLeadScore(criteria);
      expect(score).toBe(33); // 10 + 10 + 3 + 5 + 5
    });

    it('should cap score at 100', () => {
      const criteria: LeadScoringCriteria = {
        estimateAmount: 100000, // would be 200 points, but capped at 40
        propertyType: 'commercial', // 20 points
        serviceCount: 10, // 15 points (capped)
        timeline: 'asap', // 15 points
        location: 'premium downtown' // 10 points
      };

      const score = calculateLeadScore(criteria);
      expect(score).toBe(100); // Capped at maximum
    });

    it('should handle missing or invalid property types', () => {
      const criteria: LeadScoringCriteria = {
        estimateAmount: 10000,
        propertyType: 'unknown_type',
        serviceCount: 2,
        timeline: 'this_month',
        location: ''
      };

      const score = calculateLeadScore(criteria);
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('determineLeadPriority', () => {
    it('should prioritize emergency leads regardless of score', () => {
      expect(determineLeadPriority(10, true)).toBe('emergency');
      expect(determineLeadPriority(100, true)).toBe('emergency');
    });

    it('should assign high priority for high scores', () => {
      expect(determineLeadPriority(85, false)).toBe('high');
      expect(determineLeadPriority(80, false)).toBe('high');
    });

    it('should assign medium priority for moderate scores', () => {
      expect(determineLeadPriority(65, false)).toBe('medium');
      expect(determineLeadPriority(50, false)).toBe('medium');
    });

    it('should assign low priority for low scores', () => {
      expect(determineLeadPriority(30, false)).toBe('low');
      expect(determineLeadPriority(0, false)).toBe('low');
    });
  });

  describe('detectEmergency', () => {
    it('should detect emergency when checkbox is checked', () => {
      const criteria: EmergencyDetectionCriteria = {
        isEmergencyChecked: true,
        serviceTypes: ['roof_repair'],
        projectDescription: 'Regular maintenance',
        timeline: 'flexible'
      };

      expect(detectEmergency(criteria)).toBe(true);
    });

    it('should detect emergency based on service types', () => {
      const criteria: EmergencyDetectionCriteria = {
        isEmergencyChecked: false,
        serviceTypes: ['storm_damage', 'roof_repair'],
        projectDescription: 'Regular maintenance',
        timeline: 'flexible'
      };

      expect(detectEmergency(criteria)).toBe(true);
    });

    it('should detect emergency based on keywords in description', () => {
      const criteria: EmergencyDetectionCriteria = {
        isEmergencyChecked: false,
        serviceTypes: ['roof_repair'],
        projectDescription: 'Urgent repair needed due to storm damage',
        timeline: 'flexible'
      };

      expect(detectEmergency(criteria)).toBe(true);
    });

    it('should detect emergency based on urgent timeline', () => {
      const criteria: EmergencyDetectionCriteria = {
        isEmergencyChecked: false,
        serviceTypes: ['roof_repair'],
        projectDescription: 'Regular maintenance',
        timeline: 'asap'
      };

      expect(detectEmergency(criteria)).toBe(true);
    });

    it('should not detect emergency for standard requests', () => {
      const criteria: EmergencyDetectionCriteria = {
        isEmergencyChecked: false,
        serviceTypes: ['roof_cleaning'],
        projectDescription: 'Routine maintenance',
        timeline: 'flexible'
      };

      expect(detectEmergency(criteria)).toBe(false);
    });
  });

  describe('isHighValueLead', () => {
    it('should identify high-value leads by estimate amount', () => {
      expect(isHighValueLead(20000, 'single_family', 1)).toBe(true);
      expect(isHighValueLead(15001, 'single_family', 1)).toBe(true);
    });

    it('should identify high-value leads by property type', () => {
      expect(isHighValueLead(5000, 'commercial', 1)).toBe(true);
    });

    it('should identify high-value leads by service count', () => {
      expect(isHighValueLead(5000, 'single_family', 3)).toBe(true);
      expect(isHighValueLead(5000, 'single_family', 4)).toBe(true);
    });

    it('should not identify standard leads as high-value', () => {
      expect(isHighValueLead(10000, 'single_family', 1)).toBe(false);
      expect(isHighValueLead(5000, 'multi_family', 2)).toBe(false);
    });
  });

  describe('formatEstimateRange', () => {
    it('should format single amount correctly', () => {
      expect(formatEstimateRange(5000, 5000)).toBe('$5,000');
    });

    it('should format range correctly', () => {
      expect(formatEstimateRange(5000, 8000)).toBe('$5,000 - $8,000');
    });

    it('should handle large amounts with proper formatting', () => {
      expect(formatEstimateRange(15000, 25000)).toBe('$15,000 - $25,000');
    });

    it('should handle decimal amounts', () => {
      expect(formatEstimateRange(1500.50, 2000.75)).toBe('$1,501 - $2,001');
    });
  });
});