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
  'Gutters',
  'Windows',
  'Chimneys',
  'Commercial',
  'Storm Damage',
  'Maintenance'
] as const;

export type ServiceCategory = typeof serviceCategories[number];

export const services: Service[] = [
  {
    id: "1",
    slug: "roofing",
    title: "Roofing Services",
    shortDescription: "Complete roof installations, repairs, and maintenance",
    description: "Professional roofing services including new installations, repairs, and preventive maintenance. We specialize in all roofing materials from asphalt shingles to slate and metal roofing systems.",
    icon: "/images/icons/roofing.svg",
    image: "/images/gallery/roofing/full/roofing-complete-replacement-westfield-2024-01-15.jpg",
    features: ["New Installations", "Roof Repairs", "Preventive Maintenance", "Emergency Services"],
    category: "Roofing",
    popular: true
  },
  {
    id: "2",
    slug: "siding",
    title: "Siding Services",
    shortDescription: "Exterior siding installation and repair",
    description: "Transform your home's exterior with our professional siding services. We work with vinyl, fiber cement, wood, and composite materials to enhance both beauty and protection.",
    icon: "/images/icons/siding.svg",
    image: "/images/gallery/siding/full/siding-colonial-renovation-princeton-2023-12-08.jpg",
    features: ["Vinyl Siding", "Fiber Cement", "Wood Siding", "Siding Repairs"],
    category: "Siding",
    popular: true
  },
  {
    id: "3",
    slug: "gutters",
    title: "Gutter Services",
    shortDescription: "Gutter installation, cleaning, and maintenance",
    description: "Protect your home's foundation and landscape with our comprehensive gutter services. From seamless installations to cleaning and repair, we keep water flowing where it should.",
    icon: "/images/icons/gutters.svg",
    image: "/images/gallery/gutters/full/gutters-seamless-installation-summit-2024-01-22.jpg",
    features: ["Seamless Gutters", "Gutter Guards", "Cleaning Services", "Repairs & Maintenance"],
    category: "Gutters"
  },
  {
    id: "4",
    slug: "windows",
    title: "Window Services",
    shortDescription: "Window installation and replacement",
    description: "Improve your home's energy efficiency and curb appeal with our professional window installation and replacement services. We work with all major window brands and styles.",
    icon: "/images/icons/windows.svg",
    image: "/images/gallery/windows/full/windows-replacement-victorian-morristown-2024-01-05.jpg",
    features: ["Window Replacement", "New Installations", "Energy Efficient", "Custom Sizes"],
    category: "Windows"
  },
  {
    id: "5",
    slug: "chimneys",
    title: "Chimney Services",
    shortDescription: "Chimney repair and maintenance",
    description: "Keep your chimney safe and functional with our comprehensive chimney services. From repairs and cleaning to complete rebuilds, we ensure your chimney operates safely.",
    icon: "/images/icons/chimneys.svg",
    image: "/images/gallery/chimneys/full/chimneys-restoration-repair-madison-2023-12-15.jpg",
    features: ["Chimney Repairs", "Cleaning Services", "Crown Replacement", "Liner Installation"],
    category: "Chimneys"
  },
  {
    id: "6",
    slug: "commercial",
    title: "Commercial Services",
    shortDescription: "Large-scale commercial projects",
    description: "Professional commercial roofing and exterior services for businesses, schools, and institutions. We handle projects of all sizes with minimal disruption to your operations.",
    icon: "/images/icons/commercial.svg",
    image: "/images/gallery/commercial/full/commercial-roof-restoration-newark-2023-11-30.jpg",
    features: ["Commercial Roofing", "Building Maintenance", "Large Scale Projects", "Minimal Disruption"],
    category: "Commercial",
    popular: true
  },
  {
    id: "7",
    slug: "storm-damage",
    title: "Storm Damage Repair",
    shortDescription: "Emergency repairs and insurance work",
    description: "When storms strike, we're here to help. Our emergency repair services and insurance claim assistance get your home protected quickly and properly.",
    icon: "/images/icons/storm-damage.svg",
    image: "/images/gallery/roofing/full/roofing-slate-restoration-chatham-2023-10-28.jpg",
    features: ["Emergency Repairs", "Insurance Claims", "24/7 Response", "Temporary Protection"],
    category: "Storm Damage"
  },
  {
    id: "8",
    slug: "maintenance",
    title: "Maintenance Services",
    shortDescription: "Preventive maintenance services",
    description: "Protect your investment with our comprehensive maintenance services. Regular inspections and preventive care extend the life of your roof and exterior systems.",
    icon: "/images/icons/maintenance.svg",
    image: "/images/gallery/siding/full/siding-mixed-material-contemporary-short-hills-2024-01-10.jpg",
    features: ["Regular Inspections", "Preventive Care", "Maintenance Plans", "Early Problem Detection"],
    category: "Maintenance"
  }
];