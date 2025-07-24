import { Review, TrustBadge } from "@/types/review";

export const sampleReviews: Review[] = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    neighborhood: "Westfield",
    rating: 5,
    reviewText: "Russell Roofing exceeded all my expectations! Their team was professional, punctual, and incredibly skilled. The roof replacement was completed ahead of schedule and within budget. The cleanup was thorough, and I couldn't be happier with the quality of work. I've already recommended them to three neighbors who are also getting quotes. Truly exceptional service from start to finish.",
    shortText: "Russell Roofing exceeded all my expectations! Their team was professional, punctual, and incredibly skilled. The roof replacement was completed ahead of schedule...",
    date: "2024-01-15",
    verified: true,
    platform: "google",
    response: "Thank you so much, Sarah! We're thrilled that you're happy with your new roof. Your recommendation means the world to us!"
  },
  {
    id: "2", 
    customerName: "Mike Thompson",
    neighborhood: "Riverside",
    rating: 5,
    reviewText: "After storm damage, we needed emergency roof repair. Russell Roofing responded the same day with a protective tarp and detailed assessment. Their insurance expertise saved us thousands, and the repair work is flawless. The GAF Master Elite certification really shows in their craftsmanship. Worth every penny!",
    shortText: "After storm damage, we needed emergency roof repair. Russell Roofing responded the same day with a protective tarp and detailed assessment...",
    date: "2024-01-08",
    verified: true,
    platform: "google"
  },
  {
    id: "3",
    customerName: "Jennifer Martinez",
    neighborhood: "Oak Hills", 
    rating: 5,
    reviewText: "Outstanding gutter installation and roof maintenance! The team explained everything clearly, provided a detailed written estimate, and stuck to their timeline perfectly. The new gutters have already handled two heavy rainstorms without any issues. Highly recommend for any roofing needs!",
    shortText: "Outstanding gutter installation and roof maintenance! The team explained everything clearly, provided a detailed written estimate...",
    date: "2023-12-22",
    verified: true,
    platform: "google"
  },
  {
    id: "4",
    customerName: "David Chen",
    neighborhood: "Downtown",
    rating: 5,
    reviewText: "Professional service from quote to completion. Russell Roofing provided the most competitive pricing while maintaining the highest quality standards. Their crew was respectful of our property and neighbors. The new roof looks amazing and has significantly improved our home's value. Couldn't ask for better service!",
    shortText: "Professional service from quote to completion. Russell Roofing provided the most competitive pricing while maintaining the highest quality standards...",
    date: "2023-12-18",
    verified: true,
    platform: "google"
  },
  {
    id: "5",
    customerName: "Lisa Rodriguez", 
    neighborhood: "Maple Grove",
    rating: 5,
    reviewText: "Exceptional attention to detail and customer service. The team went above and beyond to ensure we were completely satisfied with our siding repair. They even fixed a small issue with our chimney flashing at no extra charge. This is how all contractors should operate - with integrity and pride in their work.",
    shortText: "Exceptional attention to detail and customer service. The team went above and beyond to ensure we were completely satisfied with our siding repair...",
    date: "2023-12-10",
    verified: true,
    platform: "google"
  },
  {
    id: "6",
    customerName: "Robert Williams",
    neighborhood: "Hillcrest",
    rating: 5,
    reviewText: "Fast, reliable, and honest. When other contractors were trying to sell us a full roof replacement, Russell Roofing diagnosed the issue correctly and saved us thousands with a targeted repair. Six months later, no problems at all. This is a company you can trust with your biggest investment.",
    shortText: "Fast, reliable, and honest. When other contractors were trying to sell us a full roof replacement, Russell Roofing diagnosed the issue correctly...",
    date: "2023-11-28",
    verified: true,
    platform: "google"
  }
];

export const trustBadges: TrustBadge[] = [
  {
    id: "gaf-master-elite",
    name: "GAF Master Elite",
    image: "/images/badges/gaf-master-elite.png",
    description: "Top 3% of roofing contractors nationwide",
    credibilityInfo: "GAF Master Elite contractors are in the top 3% of all roofing contractors in North America. This certification requires proven operational excellence, commitment to ongoing training, and a track record of customer satisfaction.",
    verificationUrl: "https://www.gaf.com/en-us/for-professionals/contractor-zone"
  },
  {
    id: "google-reviews",
    name: "5-Star Google Reviews",
    image: "/images/badges/google-reviews.png", 
    description: "Consistently rated 5 stars by customers",
    credibilityInfo: "Maintaining a 5-star average across 100+ verified Google reviews demonstrates our commitment to exceptional service and customer satisfaction."
  },
  {
    id: "bbb-accredited",
    name: "BBB Accredited",
    image: "/images/badges/bbb-accredited.png",
    description: "Better Business Bureau Accredited Business",
    credibilityInfo: "BBB Accreditation means we have met BBB's strict standards for ethical business practices, customer service excellence, and dispute resolution."
  },
  {
    id: "licensed-insured",
    name: "Licensed & Insured",
    image: "/images/badges/licensed-insured.png",
    description: "Fully licensed and insured contractor",
    credibilityInfo: "We carry full liability insurance and workers' compensation coverage, protecting both our team and your property during all projects."
  }
];