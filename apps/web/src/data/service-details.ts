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
    title: "Roofing Services",
    shortDescription: "Complete roof installations, repairs, and maintenance",
    description: "Professional roofing services including new installations, repairs, and preventive maintenance. We specialize in all roofing materials from asphalt shingles to slate and metal roofing systems.",
    icon: "/images/icons/roofing.svg",
    image: "/images/gallery/roofing/full/roofing-complete-replacement-westfield-2024-01-15.jpg",
    features: ["New Installations", "Roof Repairs", "Preventive Maintenance", "Emergency Services"],
    category: "Roofing",
    popular: true,
    hero: {
      title: "Professional Roofing Services",
      subtitle: "Protecting Your Home with Quality Craftsmanship Since 1985",
      backgroundImage: "/images/gallery/roofing/full/roofing-complete-replacement-westfield-2024-01-15.jpg"
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
  siding: {
    id: "2",
    slug: "siding",
    title: "Siding Services",
    shortDescription: "Exterior siding installation and repair",
    description: "Transform your home's exterior with our professional siding services. We work with vinyl, fiber cement, wood, and composite materials to enhance both beauty and protection.",
    icon: "/images/icons/siding.svg",
    image: "/images/gallery/siding/full/siding-colonial-renovation-princeton-2023-12-08.jpg",
    features: ["Vinyl Siding", "Fiber Cement", "Wood Siding", "Siding Repairs"],
    category: "Siding",
    popular: true,
    hero: {
      title: "Expert Siding Installation",
      subtitle: "Enhance Your Home's Beauty and Protection",
      backgroundImage: "/images/gallery/siding/full/siding-colonial-renovation-princeton-2023-12-08.jpg"
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
  gutters: {
    id: "3",
    slug: "gutters",
    title: "Gutter Services",
    shortDescription: "Gutter installation, cleaning, and maintenance",
    description: "Protect your home's foundation and landscape with our comprehensive gutter services. From seamless installations to cleaning and repair, we keep water flowing where it should.",
    icon: "/images/icons/gutters.svg",
    image: "/images/gallery/gutters/full/gutters-seamless-installation-summit-2024-01-22.jpg",
    features: ["Seamless Gutters", "Gutter Guards", "Cleaning Services", "Repairs & Maintenance"],
    category: "Gutters",
    hero: {
      title: "Professional Gutter Services",
      subtitle: "Protecting Your Home from Water Damage",
      backgroundImage: "/images/gallery/gutters/full/gutters-seamless-installation-summit-2024-01-22.jpg"
    },
    overview: "Properly functioning gutters are essential for protecting your home from water damage. Russell Roofing provides complete gutter solutions to keep your property safe and dry.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [],
    relatedServices: ["roofing", "siding"],
    testimonials: [],
    emergencyAvailable: true,
    certifications: []
  },
  windows: {
    id: "4",
    slug: "windows",
    title: "Window Services",
    shortDescription: "Window installation and replacement",
    description: "Improve your home's energy efficiency and curb appeal with our professional window installation and replacement services. We work with all major window brands and styles.",
    icon: "/images/icons/windows.svg",
    image: "/images/gallery/windows/full/windows-replacement-victorian-morristown-2024-01-05.jpg",
    features: ["Window Replacement", "New Installations", "Energy Efficient", "Custom Sizes"],
    category: "Windows",
    hero: {
      title: "Quality Window Installation",
      subtitle: "Energy Efficiency and Beauty Combined",
      backgroundImage: "/images/gallery/windows/full/windows-replacement-victorian-morristown-2024-01-05.jpg"
    },
    overview: "Upgrade your home with energy-efficient windows that enhance comfort, reduce utility costs, and improve curb appeal. Our expert installers ensure perfect fit and function.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [],
    relatedServices: ["siding", "roofing"],
    testimonials: [],
    emergencyAvailable: false,
    certifications: []
  },
  chimneys: {
    id: "5",
    slug: "chimneys",
    title: "Chimney Services",
    shortDescription: "Chimney repair and maintenance",
    description: "Keep your chimney safe and functional with our comprehensive chimney services. From repairs and cleaning to complete rebuilds, we ensure your chimney operates safely.",
    icon: "/images/icons/chimneys.svg",
    image: "/images/gallery/chimneys/full/chimneys-restoration-repair-madison-2023-12-15.jpg",
    features: ["Chimney Repairs", "Cleaning Services", "Crown Replacement", "Liner Installation"],
    category: "Chimneys",
    hero: {
      title: "Expert Chimney Services",
      subtitle: "Safety and Performance You Can Trust",
      backgroundImage: "/images/gallery/chimneys/full/chimneys-restoration-repair-madison-2023-12-15.jpg"
    },
    overview: "Ensure your chimney operates safely and efficiently with our professional chimney services. From routine maintenance to complete rebuilds, we protect your home and family.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [],
    relatedServices: ["roofing", "maintenance"],
    testimonials: [],
    emergencyAvailable: true,
    certifications: []
  },
  commercial: {
    id: "6",
    slug: "commercial",
    title: "Commercial Services",
    shortDescription: "Large-scale commercial projects",
    description: "Professional commercial roofing and exterior services for businesses, schools, and institutions. We handle projects of all sizes with minimal disruption to your operations.",
    icon: "/images/icons/commercial.svg",
    image: "/images/gallery/commercial/full/commercial-roof-restoration-newark-2023-11-30.jpg",
    features: ["Commercial Roofing", "Building Maintenance", "Large Scale Projects", "Minimal Disruption"],
    category: "Commercial",
    popular: true,
    hero: {
      title: "Commercial Roofing Solutions",
      subtitle: "Protecting Your Business Investment",
      backgroundImage: "/images/gallery/commercial/full/commercial-roof-restoration-newark-2023-11-30.jpg"
    },
    overview: "Russell Roofing provides comprehensive commercial roofing and exterior services designed to protect your investment while minimizing disruption to your operations.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [],
    relatedServices: ["roofing", "maintenance"],
    testimonials: [],
    emergencyAvailable: true,
    certifications: []
  },
  "storm-damage": {
    id: "7",
    slug: "storm-damage",
    title: "Storm Damage Repair",
    shortDescription: "Emergency repairs and insurance work",
    description: "When storms strike, we're here to help. Our emergency repair services and insurance claim assistance get your home protected quickly and properly.",
    icon: "/images/icons/storm-damage.svg",
    image: "/images/gallery/roofing/full/roofing-slate-restoration-chatham-2023-10-28.jpg",
    features: ["Emergency Repairs", "Insurance Claims", "24/7 Response", "Temporary Protection"],
    category: "Storm Damage",
    hero: {
      title: "Storm Damage Repair",
      subtitle: "Fast Response When You Need It Most",
      backgroundImage: "/images/gallery/roofing/full/roofing-slate-restoration-chatham-2023-10-28.jpg"
    },
    overview: "When severe weather damages your home, Russell Roofing responds quickly with emergency repairs and insurance claim assistance to restore your property.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [],
    relatedServices: ["roofing", "siding", "gutters"],
    testimonials: [],
    emergencyAvailable: true,
    certifications: []
  },
  maintenance: {
    id: "8",
    slug: "maintenance",
    title: "Maintenance Services",
    shortDescription: "Preventive maintenance services",
    description: "Protect your investment with our comprehensive maintenance services. Regular inspections and preventive care extend the life of your roof and exterior systems.",
    icon: "/images/icons/maintenance.svg",
    image: "/images/gallery/siding/full/siding-mixed-material-contemporary-short-hills-2024-01-10.jpg",
    features: ["Regular Inspections", "Preventive Care", "Maintenance Plans", "Early Problem Detection"],
    category: "Maintenance",
    hero: {
      title: "Preventive Maintenance Services",
      subtitle: "Protect Your Investment Year-Round",
      backgroundImage: "/images/gallery/siding/full/siding-mixed-material-contemporary-short-hills-2024-01-10.jpg"
    },
    overview: "Regular maintenance is the key to maximizing the life of your roof and exterior systems. Our comprehensive maintenance programs help prevent costly repairs.",
    detailedDescription: "Content to be provided by Analyst",
    process: [],
    featureDetails: [],
    faqs: [],
    relatedServices: ["roofing", "gutters", "siding"],
    testimonials: [],
    emergencyAvailable: false,
    certifications: []
  }
};

// Helper function to get service details by slug
export function getServiceDetailsBySlug(slug: string): ServiceDetail | undefined {
  return serviceDetails[slug];
}