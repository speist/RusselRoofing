export interface Review {
  id: string;
  customerName: string;
  neighborhood?: string;
  rating: number; // 1-5
  reviewText: string;
  shortText: string; // Truncated version
  date: string;
  verified: boolean;
  platform: 'google' | 'facebook' | 'yelp';
  response?: string; // Business response
}

export interface TrustBadge {
  id: string;
  name: string;
  image: string;
  description: string;
  credibilityInfo: string;
  verificationUrl?: string;
}