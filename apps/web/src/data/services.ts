export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  category: ServiceCategory;
  popular?: boolean;
}

export const serviceCategories = [
  'Roofing',
  'Siding',
  'Commercial',
  'Churches & Institutions',
  'Historical Restoration',
  'Gutters',
  'Windows',
  'Skylights'
] as const;

export type ServiceCategory = typeof serviceCategories[number];

export const services: Service[] = [
  {
    id: "1",
    slug: "roofing",
    title: "Roofing",
    shortDescription: "Complete roof installations, repairs, and maintenance",
    description: "Professional roofing services including new installations, repairs, and preventive maintenance. We specialize in all roofing materials from asphalt shingles to slate and metal roofing systems.",
    icon: "/images/icons/roofing.svg",
    image: "/images/services/ServiceHeroImages/roofing-hero.jpg",
    features: ["New Installations", "Roof Repairs", "Preventive Maintenance", "Emergency Services"],
    category: "Roofing",
    popular: true
  },
  {
    id: "2",
    slug: "siding-and-gutters",
    title: "Siding",
    shortDescription: "Exterior siding installation and comprehensive gutter services",
    description: "Transform your home's exterior with our professional siding services and protect your foundation with our comprehensive gutter solutions. We work with all major materials and provide seamless installations.",
    icon: "/images/icons/siding.svg",
    image: "/images/services/ServiceHeroImages/siding-gutters-hero.jpg",
    features: ["Vinyl Siding", "Fiber Cement", "Seamless Gutters", "Gutter Guards"],
    category: "Siding",
    popular: true
  },
  {
    id: "3",
    slug: "commercial",
    title: "Commercial",
    shortDescription: "Large-scale commercial projects",
    description: "Professional commercial roofing and exterior services for businesses, schools, and institutions. We handle projects of all sizes with minimal disruption to your operations.",
    icon: "/images/icons/commercial.svg",
    image: "/images/services/ServiceHeroImages/commercial-hero.jpg",
    features: ["Commercial Roofing", "Building Maintenance", "Large Scale Projects", "Minimal Disruption"],
    category: "Commercial",
    popular: true
  },
  {
    id: "4",
    slug: "churches-and-institutions",
    title: "Churches & Institutions",
    shortDescription: "Specialized services for religious and institutional buildings",
    description: "Expert roofing and exterior services for churches, schools, hospitals, and other institutional buildings. We understand the unique requirements and architectural considerations of these important structures.",
    icon: "/images/icons/commercial.svg",
    image: "/images/services/ServiceHeroImages/church-institutions-hero.jpg",
    features: ["Church Roofing", "School Buildings", "Hospital Projects", "Historic Preservation"],
    category: "Churches & Institutions"
  },
  {
    id: "5",
    slug: "historical-restorations",
    title: "Specialty and Historic Restoration",
    shortDescription: "Expert craftsmanship in specialty roofing and historic roof restoration",
    description: "For over 34 years, Russell Roofing has been Philadelphia's trusted expert in specialty roofing and historic roof restoration. We combine traditional craftsmanship with modern precision to deliver roofs that are both structurally superior and architecturally stunning.",
    icon: "/images/icons/restoration.svg",
    image: "/images/services/ServiceHeroImages/historical-restoration-hero.jpg",
    features: ["Custom Copper Roofing", "Slate & Tile Roofing", "Cedar Roofing", "Historic Roof Restoration"],
    category: "Historical Restoration"
  },
  {
    id: "6",
    slug: "gutters",
    title: "Gutters",
    shortDescription: "Complete gutter expertise for every property",
    description: "We install and service gutters of all types to match the architecture, performance needs, and budget of your home or building. From traditional systems to high-end custom metals, every gutter is designed as part of a complete water-management solution.",
    icon: "/images/icons/gutters.svg",
    image: "/images/services/ServiceHeroImages/gutters-hero.jpg",
    features: ["Seamless Aluminum Gutters", "Copper Gutters", "Custom Fabrication", "Gutter Guards"],
    category: "Gutters"
  },
  {
    id: "7",
    slug: "windows",
    title: "Windows",
    shortDescription: "Window installation and replacement",
    description: "Improve your home's energy efficiency and curb appeal with our professional window installation and replacement services. We work with all major window brands and styles.",
    icon: "/images/icons/windows.svg",
    image: "/images/services/ServiceHeroImages/windows-hero.jpg",
    features: ["Window Replacement", "New Installations", "Energy Efficient", "Custom Sizes"],
    category: "Windows"
  },
  {
    id: "8",
    slug: "skylights",
    title: "Skylights",
    shortDescription: "Skylight installation and repair services",
    description: "Bring natural light into your home with professional skylight installation and repair services. We work with all major skylight brands and provide expert waterproofing to prevent leaks.",
    icon: "/images/icons/skylights.svg",
    image: "/images/services/ServiceHeroImages/skylight-hero.jpg",
    features: ["New Installations", "Skylight Repairs", "Leak Prevention", "Energy Efficient Models"],
    category: "Skylights"
  }
];