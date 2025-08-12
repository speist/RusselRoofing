import { LeadScoringCriteria, LeadPriority, EmergencyDetectionCriteria } from './types';

/**
 * Calculate lead score based on multiple criteria
 * Returns a score from 0-100 based on estimate amount, property type, services, timeline, and location
 */
export function calculateLeadScore(criteria: LeadScoringCriteria): number {
  let score = 0;
  const estimateAmount = typeof criteria.estimateAmount === 'number' && !isNaN(criteria.estimateAmount)
    ? criteria.estimateAmount
    : 0;
  
  // Estimate amount scoring (0-40 points, 40% weight)
  score += Math.min(40, Math.floor(estimateAmount / 500));
  
  // Property type scoring (0-20 points, 20% weight)
  const propertyScores: Record<string, number> = {
    'commercial': 20,
    'multi_family': 15,
    'single_family': 10
  };
  score += propertyScores[criteria.propertyType] || 0;
  
  // Service count scoring (0-15 points, 15% weight)
  score += Math.min(15, criteria.serviceCount * 5);
  
  // Timeline urgency scoring (0-15 points, 15% weight)
  const timelineScores: Record<string, number> = {
    'asap': 15,
    'this_month': 12,
    'next_month': 8,
    'flexible': 5
  };
  score += timelineScores[criteria.timeline] || 0;
  
  // Location premium areas scoring (0-10 points, 10% weight)
  // For now, we'll implement basic location scoring
  // This can be enhanced with specific service area logic
  const locationScore = calculateLocationScore(criteria.location);
  score += locationScore;
  
  return Math.min(100, score);
}

/**
 * Calculate location-based scoring
 * This is a placeholder that can be enhanced with specific geographic data
 */
function calculateLocationScore(location: string): number {
  // Basic implementation - can be enhanced with zip code data, service areas, etc.
  if (!location) return 0;
  
  // Example premium areas (this would come from configuration)
  const premiumKeywords = ['downtown', 'uptown', 'hills', 'estates', 'premium'];
  const locationLower = location.toLowerCase();
  
  for (const keyword of premiumKeywords) {
    if (locationLower.includes(keyword)) {
      return 10;
    }
  }
  
  return 5; // Default moderate score for any location
}

/**
 * Determine lead priority based on score and emergency criteria
 */
export function determineLeadPriority(score: number, isEmergency: boolean): LeadPriority {
  if (isEmergency) {
    return 'emergency';
  }
  
  if (score >= 80) {
    return 'high';
  }
  
  if (score >= 50) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Detect if a lead qualifies as emergency based on multiple criteria
 */
export function detectEmergency(criteria: EmergencyDetectionCriteria): boolean {
  // 1. Emergency checkbox was explicitly selected
  if (criteria.isEmergencyChecked) {
    return true;
  }
  
  // 2. Check for emergency service types
  const emergencyServices = ['storm_damage', 'leak_repair', 'emergency_repair'];
  if (Array.isArray(criteria.serviceTypes)) {
    const hasEmergencyService = criteria.serviceTypes.some(service =>
      emergencyServices.includes(service)
    );

    if (hasEmergencyService) {
      return true;
    }
  }
  
  // 3. Check for emergency keywords in project description
  if (criteria.projectDescription) {
    const emergencyKeywords = ['urgent', 'emergency', 'immediate', 'leak', 'storm', 'damage'];
    const descriptionLower = criteria.projectDescription.toLowerCase();
    
    const hasEmergencyKeywords = emergencyKeywords.some(keyword => 
      descriptionLower.includes(keyword)
    );
    
    if (hasEmergencyKeywords) {
      return true;
    }
  }
  
  // 4. Check for immediate timeline requirements
  const urgentTimelines = ['same_day', 'next_day', 'immediate'];
  if (urgentTimelines.includes(criteria.timeline)) {
    return true;
  }
  
  return false;
}

/**
 * Check if a lead qualifies as high-value based on business criteria
 */
export function isHighValueLead(estimateAmount: number, propertyType: string, serviceCount: number): boolean {
  // High-value criteria from story requirements
  
  // 1. Estimate amount > $15,000
  if (estimateAmount > 15000) {
    return true;
  }
  
  // 2. Commercial property types
  if (propertyType === 'commercial') {
    return true;
  }
  
  // 3. Multiple services selected (3 or more)
  if (serviceCount >= 3) {
    return true;
  }
  
  return false;
}

/**
 * Calculate estimate range display string
 */
export function formatEstimateRange(minAmount: number, maxAmount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  if (minAmount === maxAmount) {
    return formatter.format(minAmount);
  }
  
  return `${formatter.format(minAmount)} - ${formatter.format(maxAmount)}`;
}