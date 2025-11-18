import { Service } from "./services";

export interface ServiceStep {
  step: number;
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceFeature {
  title: string;
  description: string;
  icon: string;
  highlight?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServiceDetail extends Service {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  overview: string;
  detailedDescription: string;
  process: ServiceStep[];
  featureDetails: ServiceFeature[];
  faqs: FAQ[];
  relatedServices: string[];
  testimonials: string[]; // References to specific testimonials
  emergencyAvailable?: boolean;
  certifications?: string[];
}

// Extended service data with full details
export const serviceDetails: Record<string, ServiceDetail> = {
  roofing: {
    id: "1",
    slug: "roofing",
    title: "Roofing",
    shortDescription: "Complete roof installations, repairs, and maintenance",
    description: "Professional roofing services including new installations, repairs, and preventive maintenance. We specialize in all roofing materials from asphalt shingles to slate and metal roofing systems.",
    icon: "/images/icons/roofing.svg",
    image: "/images/services/ServiceHeroImages/roofing-hero.jpg",
    features: ["New Installations", "Roof Repairs", "Preventive Maintenance", "Emergency Services"],
    category: "Roofing",
    popular: true,
    hero: {
      title: "Professional Roofing Services",
      subtitle: "Protecting Your Home with Quality Craftsmanship Since 1985",
      backgroundImage: "/images/services/ServiceHeroImages/roofing-hero.jpg"
    },
    overview: "With over 35 years of experience, Russell Roofing has been the trusted choice for homeowners throughout New Jersey. Our comprehensive roofing services ensure your home stays protected through every season.",
    detailedDescription: `Russell Roofing specializes in complete roofing solutions tailored to your home's specific needs. Whether you need a full roof replacement, emergency repairs, or regular maintenance, our certified professionals deliver exceptional results.

We work with all major roofing materials including asphalt shingles, architectural shingles, slate, tile, and metal roofing systems. Our team stays current with the latest installation techniques and building codes to ensure your roof provides maximum protection and value.

Every project begins with a thorough inspection to assess your roof's condition and identify the best solution for your needs and budget. We provide detailed estimates and work closely with insurance companies when storm damage is involved.`,
    process: [
      {
        step: 1,
        title: "Initial Inspection",
        description: "Comprehensive roof assessment with detailed documentation",
        icon: "/images/icons/inspection.svg"
      },
      {
        step: 2,
        title: "Custom Proposal",
        description: "Detailed estimate with material options and timeline",
        icon: "/images/icons/proposal.svg"
      },
      {
        step: 3,
        title: "Professional Installation",
        description: "Expert installation by certified roofing specialists",
        icon: "/images/icons/installation.svg"
      },
      {
        step: 4,
        title: "Quality Assurance",
        description: "Final inspection and warranty documentation",
        icon: "/images/icons/quality.svg"
      }
    ],
    featureDetails: [
      {
        title: "Lifetime Warranties",
        description: "Comprehensive coverage on materials and workmanship",
        icon: "/images/icons/warranty.svg",
        highlight: true
      },
      {
        title: "Insurance Expertise",
        description: "We work directly with your insurance company",
        icon: "/images/icons/insurance.svg"
      },
      {
        title: "Emergency Response",
        description: "24/7 emergency repairs to protect your home",
        icon: "/images/icons/emergency.svg"
      },
      {
        title: "Energy Efficient",
        description: "Modern materials that reduce energy costs",
        icon: "/images/icons/energy.svg"
      },
      {
        title: "Free Inspections",
        description: "No-obligation roof assessments and estimates",
        icon: "/images/icons/free.svg"
      },
      {
        title: "Certified Installers",
        description: "Factory-trained professionals for every job",
        icon: "/images/icons/certified.svg"
      }
    ],
    faqs: [
      {
        question: "How often should I have my roof inspected?",
        answer: "We recommend annual roof inspections, especially after severe weather events. Regular inspections help identify minor issues before they become major problems."
      },
      {
        question: "How long does a typical roof replacement take?",
        answer: "Most residential roof replacements are completed in 1-3 days, depending on the size and complexity of the roof. We'll provide a specific timeline during your consultation."
      },
      {
        question: "Do you offer financing options?",
        answer: "Yes, we offer flexible financing options to help make your roofing project affordable. We can discuss available plans during your consultation."
      },
      {
        question: "What roofing materials do you recommend?",
        answer: "The best material depends on your home's architecture, local climate, and budget. We'll help you choose from asphalt shingles, metal, slate, or tile based on your specific needs."
      }
    ],
    relatedServices: ["gutters", "siding", "storm-damage"],
    testimonials: ["roofing-1", "roofing-2", "roofing-3"],
    emergencyAvailable: true,
    certifications: ["GAF Master Elite", "CertainTeed SELECT ShingleMaster", "NRCA Member", "BBB A+ Rated"]
  },
  "siding-and-gutters": {
    id: "2",
    slug: "siding-and-gutters",
    title: "Siding and Gutters",
    shortDescription: "Exterior siding installation and repair",
    description: "Transform your home's exterior with our professional siding services. We work with vinyl, fiber cement, wood, and composite materials to enhance both beauty and protection.",
    icon: "/images/icons/siding.svg",
    image: "/images/services/ServiceHeroImages/siding-gutters-hero.jpg",
    features: ["Vinyl Siding", "Fiber Cement", "Wood Siding", "Siding Repairs"],
    category: "Siding and Gutters",
    popular: true,
    hero: {
      title: "Expert Siding Installation",
      subtitle: "Enhance Your Home's Beauty and Protection",
      backgroundImage: "/images/services/ServiceHeroImages/siding-gutters-hero.jpg"
    },
    overview: "Russell Roofing's siding services combine aesthetic appeal with superior protection. Our expert installers work with premium materials to transform your home's exterior while improving energy efficiency.",
    detailedDescription: `Quality siding does more than beautify your home - it provides essential protection against the elements while improving energy efficiency and property value. Russell Roofing offers comprehensive siding services using the industry's best materials and installation practices.

Our experienced team works with all major siding types including vinyl, fiber cement (James Hardie), wood, and composite materials. We help you select the perfect siding solution based on your home's architecture, your aesthetic preferences, and your budget.

Every siding project begins with a detailed consultation where we assess your home's current condition, discuss your goals, and provide samples of available materials. Our installations include proper moisture barriers, insulation upgrades when needed, and meticulous attention to detail that ensures lasting beauty and performance.`,
    process: [
      {
        step: 1,
        title: "Design Consultation",
        description: "Material selection and color coordination",
        icon: "/images/icons/design.svg"
      },
      {
        step: 2,
        title: "Preparation",
        description: "Remove old siding and repair any damage",
        icon: "/images/icons/preparation.svg"
      },
      {
        step: 3,
        title: "Expert Installation",
        description: "Precise installation with weather barriers",
        icon: "/images/icons/installation.svg"
      },
      {
        step: 4,
        title: "Finishing Touches",
        description: "Trim work and final quality inspection",
        icon: "/images/icons/finishing.svg"
      }
    ],
    featureDetails: [
      {
        title: "James Hardie Elite",
        description: "Certified installer of premium fiber cement siding",
        icon: "/images/icons/elite.svg",
        highlight: true
      },
      {
        title: "Energy Savings",
        description: "Improved insulation reduces heating and cooling costs",
        icon: "/images/icons/energy.svg"
      },
      {
        title: "Color Guarantee",
        description: "Fade-resistant colors that last for decades",
        icon: "/images/icons/color.svg"
      },
      {
        title: "Storm Resistant",
        description: "Materials rated for high winds and impact",
        icon: "/images/icons/storm.svg"
      },
      {
        title: "Low Maintenance",
        description: "Minimal upkeep required for lasting beauty",
        icon: "/images/icons/maintenance.svg"
      },
      {
        title: "Increased Value",
        description: "Boost your home's curb appeal and resale value",
        icon: "/images/icons/value.svg"
      }
    ],
    faqs: [
      {
        question: "What's the best siding material for New Jersey weather?",
        answer: "Fiber cement and quality vinyl siding perform excellently in our climate. Both resist moisture, temperature changes, and storm damage while maintaining their appearance."
      },
      {
        question: "Can you match my existing siding for repairs?",
        answer: "Yes, we maintain relationships with major manufacturers and can source matching materials for most siding types. For discontinued products, we'll find the closest match available."
      },
      {
        question: "How long does siding installation take?",
        answer: "Most homes can be completed in 3-7 days, depending on size and complexity. We'll provide a detailed timeline during your consultation."
      },
      {
        question: "Does new siding really improve energy efficiency?",
        answer: "Yes! Modern siding with proper insulation can reduce energy costs by 20-30%. We can add insulation during installation for maximum efficiency."
      }
    ],
    relatedServices: ["roofing", "windows", "gutters"],
    testimonials: ["siding-1", "siding-2", "siding-3"],
    emergencyAvailable: false,
    certifications: ["James Hardie Elite Preferred", "VSI Certified Installer", "EPA RRP Certified"]
  },
  // Placeholder for remaining services - to be populated with full details
  windows: {
    id: "4",
    slug: "windows",
    title: "Windows",
    shortDescription: "Window installation and replacement",
    description: "Improve your home's energy efficiency and curb appeal with our professional window installation and replacement services. We work with all major window brands and styles.",
    icon: "/images/icons/windows.svg",
    image: "/images/services/ServiceHeroImages/windows-hero.jpg",
    features: ["Window Replacement", "New Installations", "Energy Efficient", "Custom Sizes"],
    category: "Windows",
    hero: {
      title: "Quality Window Installation",
      subtitle: "Energy Efficiency and Beauty Combined",
      backgroundImage: "/images/services/ServiceHeroImages/windows-hero.jpg"
    },
    overview: "Upgrade your home with energy-efficient windows that enhance comfort, reduce utility costs, and improve curb appeal. Our expert installers ensure perfect fit and function.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [
      {
        question: "What are the benefits of energy-efficient windows?",
        answer: "Energy-efficient windows reduce heating and cooling costs, improve home comfort, minimize outside noise, reduce UV damage to furniture, and increase your home's resale value."
      },
      {
        question: "How long does window installation take?",
        answer: "Most window installations take 1-3 days depending on the number of windows and complexity. We work efficiently to minimize disruption to your daily routine."
      },
      {
        question: "Do you offer a warranty on window installations?",
        answer: "Yes, we provide comprehensive warranties on both materials and labor. Manufacturer warranties vary by brand, and we offer additional installation warranties for your peace of mind."
      },
      {
        question: "Can you match my existing window style?",
        answer: "Absolutely! We work with all major window manufacturers and can match virtually any style, including double-hung, casement, bay, bow, and custom shapes."
      }
    ],
    relatedServices: ["siding", "roofing"],
    testimonials: [],
    emergencyAvailable: false,
    certifications: []
  },
  commercial: {
    id: "6",
    slug: "commercial",
    title: "Commercial",
    shortDescription: "Large-scale commercial projects",
    description: "Professional commercial roofing and exterior services for businesses, schools, and institutions. We handle projects of all sizes with minimal disruption to your operations.",
    icon: "/images/icons/commercial.svg",
    image: "/images/services/ServiceHeroImages/commercial-hero.jpg",
    features: ["Commercial Roofing", "Building Maintenance", "Large Scale Projects", "Minimal Disruption"],
    category: "Commercial",
    popular: true,
    hero: {
      title: "Commercial Roofing Solutions",
      subtitle: "Protecting Your Business Investment",
      backgroundImage: "/images/services/ServiceHeroImages/commercial-hero.jpg"
    },
    overview: "Russell Roofing provides comprehensive commercial roofing and exterior services designed to protect your investment while minimizing disruption to your operations.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [
      {
        question: "Do you work with building managers and property management companies?",
        answer: "Yes, we have extensive experience working with property managers, building owners, and facility managers. We understand the unique requirements of commercial properties and can coordinate with your team."
      },
      {
        question: "Can you work outside of business hours?",
        answer: "Absolutely. We offer flexible scheduling including evenings, weekends, and overnight work to minimize disruption to your business operations."
      },
      {
        question: "What types of commercial roofing systems do you install?",
        answer: "We install and repair all commercial roofing systems including TPO, EPDM, PVC, modified bitumen, built-up roofing, and metal roofing systems."
      },
      {
        question: "Do you provide maintenance plans for commercial properties?",
        answer: "Yes, we offer comprehensive maintenance programs tailored to commercial properties. Regular maintenance extends roof life and helps prevent costly emergency repairs."
      }
    ],
    relatedServices: ["roofing", "maintenance"],
    testimonials: [],
    emergencyAvailable: true,
    certifications: []
  },
  "historical-restoration": {
    id: "5",
    slug: "historical-restoration",
    title: "Historical Restoration",
    shortDescription: "Preserving historic buildings with authentic materials and techniques",
    description: "Specialized restoration services for historic properties. We use traditional materials and techniques while meeting modern performance standards to preserve the character and integrity of historic buildings.",
    icon: "/images/icons/restoration.svg",
    image: "/images/services/ServiceHeroImages/historical-restoration-hero.jpg",
    features: ["Slate Restoration", "Historic Materials", "Preservation Techniques", "Period-Appropriate Methods"],
    category: "Historical Restoration",
    hero: {
      title: "Historical Restoration",
      subtitle: "Preserving History with Expert Craftsmanship",
      backgroundImage: "/images/services/ServiceHeroImages/historical-restoration-hero.jpg"
    },
    overview: "When severe weather damages your home, Russell Roofing responds quickly with emergency repairs and insurance claim assistance to restore your property.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [
      {
        question: "Do you work with historic preservation societies and boards?",
        answer: "Yes, we have extensive experience working with historic preservation commissions and architectural review boards. We understand the approval process and can help navigate requirements."
      },
      {
        question: "Can you source authentic historic materials?",
        answer: "Absolutely. We have established relationships with suppliers of authentic materials including slate, clay tiles, copper, and historic wood products. We can match or replicate original materials."
      },
      {
        question: "Are you familiar with period-appropriate techniques?",
        answer: "Yes, our craftsmen are trained in traditional building techniques including hand-cut slate installation, copper work, and historic masonry methods."
      },
      {
        question: "Do you offer documentation for historic preservation tax credits?",
        answer: "Yes, we can provide detailed documentation of materials, methods, and work performed to support historic preservation tax credit applications."
      }
    ],
    relatedServices: ["roofing", "siding", "gutters"],
    testimonials: [],
    emergencyAvailable: true,
    certifications: []
  },
  skylights: {
    id: "8",
    slug: "skylights",
    title: "Skylights",
    shortDescription: "Skylight installation and repair services",
    description: "Bring natural light into your home with professional skylight installation and repair services. We work with all major skylight brands and provide expert waterproofing to prevent leaks.",
    icon: "/images/icons/skylights.svg",
    image: "/images/services/ServiceHeroImages/skylight-hero.jpg",
    features: ["New Installations", "Skylight Repairs", "Leak Prevention", "Energy Efficient Models"],
    category: "Skylights",
    hero: {
      title: "Skylights",
      subtitle: "Bring Natural Light Into Your Home",
      backgroundImage: "/images/services/ServiceHeroImages/skylight-hero.jpg"
    },
    overview: "Regular maintenance is the key to maximizing the life of your roof and exterior systems. Our comprehensive maintenance programs help prevent costly repairs.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [
      {
        question: "How do you prevent skylight leaks?",
        answer: "We use proper flashing techniques, high-quality sealants, and careful integration with your roofing system. Our installations come with comprehensive warranties against leaks."
      },
      {
        question: "Can you install skylights in any type of roof?",
        answer: "We can install skylights in most roof types including asphalt shingle, metal, slate, and tile. Each installation is customized to your specific roof structure and material."
      },
      {
        question: "What are the benefits of modern skylights?",
        answer: "Modern skylights provide natural light, reduce energy costs, improve ventilation, and enhance your home's aesthetic appeal. Many feature Low-E coatings and insulated glass for energy efficiency."
      },
      {
        question: "Do you repair existing skylights?",
        answer: "Yes, we repair and service all major skylight brands. Common repairs include resealing, flashing replacement, glass replacement, and mechanism repairs for operable units."
      }
    ],
    relatedServices: ["roofing", "gutters", "siding"],
    testimonials: [],
    emergencyAvailable: false,
    certifications: []
  },
  "churches-institutions": {
    id: "4",
    slug: "churches-institutions",
    title: "Churches & Institutions",
    shortDescription: "Specialized services for religious and institutional buildings",
    description: "Expert roofing and exterior services for churches, schools, hospitals, and other institutional buildings. We understand the unique requirements and architectural considerations of these important structures.",
    icon: "/images/icons/commercial.svg",
    image: "/images/services/ServiceHeroImages/historical-restoration-hero.jpg",
    features: ["Church Roofing", "School Buildings", "Hospital Projects", "Historic Preservation"],
    category: "Churches & Institutions",
    hero: {
      title: "Churches & Institutions",
      subtitle: "Specialized Services for Important Buildings",
      backgroundImage: "/images/services/ServiceHeroImages/historical-restoration-hero.jpg"
    },
    overview: "Russell Roofing provides specialized services for churches, schools, hospitals, and other institutional buildings with unique architectural and operational requirements.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [
      {
        question: "Do you have experience working on active facilities?",
        answer: "Yes, we specialize in working around active operations. We coordinate schedules to minimize disruption to worship services, school activities, or hospital operations."
      },
      {
        question: "Can you work with our building committee or board?",
        answer: "Absolutely. We're experienced in presenting to committees and boards, providing detailed proposals, and working within institutional decision-making processes."
      },
      {
        question: "Do you handle steeples and bell towers?",
        answer: "Yes, we have the specialized equipment and expertise to work on steeples, bell towers, and other elevated architectural features unique to institutional buildings."
      },
      {
        question: "Can you help with fundraising documentation?",
        answer: "Yes, we provide detailed project documentation, phasing options, and cost breakdowns that support capital campaign and fundraising efforts."
      }
    ],
    relatedServices: ["roofing", "commercial", "historical-restoration"],
    testimonials: [],
    emergencyAvailable: true,
    certifications: []
  },
  masonry: {
    id: "6",
    slug: "masonry",
    title: "Masonry",
    shortDescription: "Stone and brick work for chimneys and exterior walls",
    description: "Professional masonry services including chimney repairs, stone work, and brick restoration. We restore and repair masonry structures to ensure both safety and aesthetic appeal.",
    icon: "/images/icons/masonry.svg",
    image: "/images/services/ServiceHeroImages/masonry-hero.jpg",
    features: ["Chimney Repairs", "Stone Work", "Brick Restoration", "Pointing and Repointing"],
    category: "Masonry",
    hero: {
      title: "Masonry Services",
      subtitle: "Expert Stone and Brick Work",
      backgroundImage: "/images/services/ServiceHeroImages/masonry-hero.jpg"
    },
    overview: "Professional masonry services including chimney repairs, stone work, and brick restoration to ensure both safety and aesthetic appeal.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [
      {
        question: "How do I know if my chimney needs repair?",
        answer: "Signs include crumbling mortar, loose or missing bricks, white staining (efflorescence), cracks in the crown, or interior water damage. We offer free inspections to assess your chimney's condition."
      },
      {
        question: "What is tuckpointing and when is it needed?",
        answer: "Tuckpointing is the process of removing and replacing deteriorated mortar between bricks. It's needed when mortar becomes soft, cracked, or recessed, typically every 25-30 years."
      },
      {
        question: "Can you match the existing brick or stone?",
        answer: "Yes, we specialize in matching existing materials including historic brick, stone, and mortar. We can source authentic materials or custom-blend mortar to match original colors."
      },
      {
        question: "Do you handle chimney crown and cap repairs?",
        answer: "Yes, we repair and rebuild chimney crowns, install and replace chimney caps, and ensure proper flashing to prevent water infiltration and extend chimney life."
      }
    ],
    relatedServices: ["roofing", "chimneys", "historical-restoration"],
    testimonials: [],
    emergencyAvailable: true,
    certifications: []
  }
};

// Helper function to get service details by slug
export function getServiceDetailsBySlug(slug: string): ServiceDetail | undefined {
  return serviceDetails[slug];
}