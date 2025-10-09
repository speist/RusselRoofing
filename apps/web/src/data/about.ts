export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  experience: string;
  certifications: string[];
  image: string;
  email?: string;
  phone?: string;
  specialties: string[];
}

export interface CompanyMilestone {
  year: number;
  title: string;
  description: string;
  image?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number;
  image: string;
  description: string;
  verificationUrl?: string;
}

export interface Award {
  id: string;
  name: string;
  issuer: string;
  year: number;
  description: string;
  image?: string;
}

export interface CommunityActivity {
  id: string;
  name: string;
  description: string;
  year: number;
  image?: string;
  impact: string;
}

export interface CompanyInfo {
  foundedYear: number;
  missionStatement: string;
  visionStatement: string;
  coreValues: string[];
  companyStory: string;
  team: TeamMember[];
  milestones: CompanyMilestone[];
  certifications: Certification[];
  awards: Award[];
  communityInvolvement: CommunityActivity[];
}

// Placeholder data for the About page
export const companyInfo: CompanyInfo = {
  foundedYear: 1992,
  missionStatement: "To provide exceptional roofing services that protect what matters most to our customers - their homes and families - while building lasting relationships based on trust, quality, and reliability.",
  visionStatement: "To be New Jersey's most trusted roofing company, known for our unwavering commitment to quality craftsmanship and customer satisfaction.",
  coreValues: [
    "Quality Craftsmanship",
    "Customer Trust",
    "Community Service",
    "Professional Excellence",
    "Environmental Responsibility",
    "Continuous Innovation"
  ],
  companyStory: "Russell Roofing & Exteriors was founded in 1992 by Russell \"Kip\" Kaller, who developed his expertise working in his family's roofing business with his Father and Brothers. This hands-on experience fostered an appreciation for true craftsmanship and quality, leading to the company's commitment to traditional installation methods following both best trade practices and following the manufacturers specifications, ensuring excellence in finish and durability.\n\nKaller's dedication to honest and respectful customer service helped Russell Roofing earn a reputation for quality, professionalism and reliability, establishing it as one of the industry's most trusted roofing and exterior contractors. The company stands out for its commitment to both high standards of workmanship and customer relations, building long-term trust throughout the Philadelphia region.\n\nRussell Roofing is a veteran owned operation. Upon High School Graduation Kip Kaller enlisted with the United States Navy where he served as an Aviation Electrician.",
  team: [
    {
      id: "founder-ceo",
      name: "John Russell",
      title: "Founder & CEO",
      bio: "With over 25 years in the roofing industry, John founded Russell Roofing to provide homeowners with honest, quality roofing services. His hands-on approach and commitment to excellence have made Russell Roofing one of New Jersey's most trusted roofing companies.",
      experience: "25+ years in roofing and construction",
      certifications: ["GAF Master Elite Contractor", "CertainTeed SELECT ShingleMaster", "OSHA 30-Hour Safety Certified"],
      image: "/images/team/john-russell.jpg.placeholder",
      email: "john@russellroofing.com",
      phone: "(555) 123-4567",
      specialties: ["Residential Roofing", "Storm Damage Assessment", "Business Development", "Quality Control"]
    },
    {
      id: "operations-manager",
      name: "Sarah Mitchell",
      title: "Operations Manager",
      bio: "Sarah ensures every project runs smoothly from initial consultation to final cleanup. Her attention to detail and project management expertise keep our customers informed and satisfied throughout the roofing process.",
      experience: "15+ years in construction management",
      certifications: ["Project Management Professional (PMP)", "Construction Management Certificate"],
      image: "/images/team/sarah-mitchell.jpg.placeholder",
      email: "sarah@russellroofing.com",
      specialties: ["Project Management", "Customer Relations", "Quality Assurance", "Scheduling Coordination"]
    },
    {
      id: "lead-estimator",
      name: "Mike Thompson",
      title: "Lead Estimator & Inspector",
      bio: "Mike brings precision and expertise to every estimate and inspection. His thorough assessments help homeowners understand exactly what their roof needs and why, ensuring transparency in every project.",
      experience: "12+ years in roofing estimation",
      certifications: ["Certified Roofing Inspector", "Insurance Claims Specialist"],
      image: "/images/team/mike-thompson.jpg.placeholder",
      email: "mike@russellroofing.com",
      specialties: ["Roof Inspections", "Insurance Claims", "Cost Estimation", "Material Selection"]
    },
    {
      id: "safety-director",
      name: "David Chen",
      title: "Safety Director & Master Craftsman",
      bio: "David leads our commitment to safety while maintaining the highest standards of craftsmanship. His expertise ensures every project is completed safely and to the highest quality standards.",
      experience: "20+ years in construction safety",
      certifications: ["OSHA 30-Hour Trainer", "Fall Protection Specialist", "First Aid/CPR Certified"],
      image: "/images/team/david-chen.jpg.placeholder",
      specialties: ["Safety Training", "Quality Control", "Crew Leadership", "Installation Techniques"]
    }
  ],
  milestones: [
    {
      year: 2015,
      title: "Russell Roofing Founded",
      description: "John Russell established the company with a commitment to quality and customer service."
    },
    {
      year: 2017,
      title: "GAF Master Elite Certification",
      description: "Achieved GAF Master Elite status, joining less than 3% of roofing contractors nationwide."
    },
    {
      year: 2019,
      title: "Team Expansion",
      description: "Grew to a full-service team of certified professionals and expanded service areas."
    },
    {
      year: 2021,
      title: "Community Recognition",
      description: "Received the Chamber of Commerce Excellence in Service Award for outstanding community contribution."
    },
    {
      year: 2023,
      title: "Technology Integration",
      description: "Implemented advanced project management and customer communication systems for enhanced service delivery."
    }
  ],
  certifications: [
    {
      id: "gaf-master-elite",
      name: "GAF Master Elite Contractor",
      issuer: "GAF",
      year: 2017,
      image: "/images/certifications/gaf-master-elite.jpg.placeholder",
      description: "Only awarded to the top 3% of roofing contractors who meet GAF's strict criteria for licensing, insurance, reputation, and ongoing training.",
      verificationUrl: "https://www.gaf.com/en-us/contractors"
    },
    {
      id: "certainteed-shinglemaster",
      name: "CertainTeed SELECT ShingleMaster",
      issuer: "CertainTeed",
      year: 2018,
      image: "/images/certifications/certainteed-select.jpg.placeholder",
      description: "Recognition for expertise in CertainTeed roofing systems and commitment to quality installation practices."
    },
    {
      id: "bbb-accredited",
      name: "Better Business Bureau Accredited",
      issuer: "Better Business Bureau",
      year: 2016,
      image: "/images/certifications/bbb-accredited.jpg.placeholder",
      description: "A+ rating with the Better Business Bureau, reflecting our commitment to ethical business practices and customer satisfaction."
    }
  ],
  awards: [
    {
      id: "chamber-excellence-2021",
      name: "Excellence in Service Award",
      issuer: "Greater Newark Chamber of Commerce",
      year: 2021,
      description: "Recognized for outstanding service to the community and excellence in business practices."
    },
    {
      id: "angie-list-super-service-2022",
      name: "Angie's List Super Service Award",
      issuer: "Angie's List",
      year: 2022,
      description: "Awarded to businesses that provide exceptional service and maintain excellent customer reviews."
    }
  ],
  communityInvolvement: [
    {
      id: "habitat-for-humanity",
      name: "Habitat for Humanity Partnership",
      description: "Annual volunteer work providing roofing services for Habitat for Humanity home builds.",
      year: 2018,
      impact: "Helped roof 12+ homes for families in need"
    },
    {
      id: "local-schools-support",
      name: "Local Schools Support Program",
      description: "Sponsoring local high school sports teams and providing scholarships for trade education.",
      year: 2019,
      impact: "Supported 25+ students in pursuing construction education"
    },
    {
      id: "storm-relief-efforts",
      name: "Emergency Storm Relief",
      description: "Providing free emergency roof repairs for elderly and disabled community members after severe weather.",
      year: 2020,
      impact: "Completed 50+ emergency repairs at no cost"
    }
  ]
};