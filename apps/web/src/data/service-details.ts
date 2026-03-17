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
    overview: "With over 33 years of experience, nationally recognized awards, and an unwavering commitment to quality, Russell Roofing is the trusted choice for property owners throughout the Greater Philadelphia Area seeking solutions that truly last. Our comprehensive, consultative approach to roofing keeps your property protected in every season, from harsh winter freeze–thaw cycles to the intense thermal shock of scorching summer heat. Our roofing systems are designed to perform, endure, and stand the test of time.",
    detailedDescription: `Russell Roofing specializes in complete roofing solutions tailored to your home's unique needs and architectural character. Whether you require a full roof replacement, emergency repairs, or ongoing maintenance, our certified professionals deliver exceptional workmanship and reliable results.

We install all major roofing systems, including asphalt shingles, slate, tile, single-ply membranes, and metal roofing. Our team continually trains on the latest installation methods and stays current with evolving building codes to ensure your roof delivers maximum protection, performance, and value.

Every project begins with a thorough roof inspection to evaluate current conditions and determine the most effective solution for your needs and budget. You receive a detailed written estimate, and when storm damage is involved, we coordinate closely with your insurance company to help streamline the claims process.`,
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
    title: "Siding",
    shortDescription: "Exterior siding installation and repair",
    description: "Transform your home's exterior with our professional siding services. We work with vinyl, fiber cement, wood, and composite materials to enhance both beauty and protection.",
    icon: "/images/icons/siding.svg",
    image: "/images/services/ServiceHeroImages/siding-gutters-hero.jpg",
    features: ["Vinyl Siding", "Fiber Cement", "Wood Siding", "Siding Repairs"],
    category: "Siding",
    popular: true,
    hero: {
      title: "Expert Siding Installation",
      subtitle: "Enhance Your Home's Beauty and Protection",
      backgroundImage: "/images/services/ServiceHeroImages/siding-gutters-hero.jpg"
    },
    overview: "Russell Roofing & Exteriors has been a trusted siding contractor for more than 33 years, proudly serving thousands of satisfied residential and commercial clients throughout the region. As a certified installer for CertainTeed, James Hardie, and Mastic, our team is uniquely qualified to offer a full range of premium siding systems supported by robust lifetime warranty options.",
    detailedDescription: `We invite you to connect with our team to speak with an experienced design professional about the siding solution that best aligns with your home, aesthetic preferences, and budget. Most homeowners approach a siding project with four primary objectives: enhancing curb appeal, improving energy efficiency, increasing overall property value, and selecting a low-maintenance product that delivers long-term performance.

Our specialists take the time to listen, present tailored options, and guide you through each step of the process so you feel informed, supported, and confident in every decision you make.`,
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
    emergencyAvailable: true,
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
    overview: "We install a full range of high-quality replacement and new-construction windows, matching the right products to your property, style, and budget. Every window is measured, ordered, and installed with careful attention to detail so it fits properly, seals tightly, and operates smoothly for years to come.",
    detailedDescription: `**Expert window installation for every need**

• Double-hung, casement, awning, and slider windows
• Bay, bow, and picture windows for expanded views and natural light
• Specialty shapes and architectural windows for distinctive designs
• Basement, egress, and utility windows for safety and code compliance

**Energy efficiency and comfort**

Modern windows do far more than just look good—they play a major role in your home's comfort and energy performance. We help you choose options that make a real difference in how your home feels and what you pay in utilities.

• Energy-efficient glass packages to help reduce heat loss and drafts
• Low-E coatings to manage solar heat gain and protect interiors from UV rays
• Insulated frames and professional air sealing to improve overall performance

Our goal is to provide windows that help keep your home warmer in winter, cooler in summer, and quieter year-round.

**Styles and materials to match your home**

Whether you're updating a historic property, modernizing a contemporary home, or refreshing a classic suburban residence, we offer window solutions that complement your architecture.

• Vinyl, fiberglass, composite, and wood-clad window options
• Multiple interior and exterior colors and finishes
• Grille patterns and hardware choices to match your design vision

We take the time to review samples, explain options, and recommend combinations that align with both your aesthetic preferences and long-term maintenance expectations.

**Award-winning craftsmanship and clean installation**

As a nationally recognized specialty contractor, we approach window projects with the same disciplined process we use on complex roofing work.

• Careful removal of old windows to protect surrounding finishes
• Proper flashing, insulation, and sealing at all critical points
• Trim, casing, and interior/exterior finishing for a complete, polished look
• Jobsite cleanliness and respectful crews on every project

You get windows that look like they've always belonged there—installed to perform and built to last.

**Start with a window consultation**

If you're considering new or replacement windows, our specialists are ready to help you plan the right project. We'll review your existing windows, discuss your goals, present product options, and provide a clear, detailed proposal.

Contact us today to schedule a window consultation and discover why property owners have trusted our nationally award-winning team for 33 years to deliver high-quality window installations and exterior solutions.`,
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
    emergencyAvailable: true,
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
    overview: "A leading commercial roofing partner for 33 years, Russell Roofing & Exteriors delivers long-lasting solutions for properties that demand the highest level of performance and professionalism. From office buildings and retail centers to schools, institutions, and industrial facilities, our team has the experience to handle complex projects safely, efficiently, and with minimal disruption to your operations.",
    detailedDescription: `**Why businesses trust us**

For more than three decades, we have helped building owners, property managers, and developers protect their investments with roofing systems designed to perform—not just pass inspection. Our experts evaluate each roof as a complete system, recommending solutions based on building use, budget, lifecycle costs, and long-term performance, not just lowest upfront price.

• 33 years of specialized commercial roofing experience
• Proven track record across thousands of projects
• Highly trained crews focused on safety and quality
• Strong relationships with leading manufacturers and inspectors

**Comprehensive commercial roofing services**

We provide a full range of commercial roofing services to support your property at every stage of its lifecycle.

• New construction roofing and design input
• Roof replacement and re-roofing
• Roof repairs and leak tracking
• Preventive maintenance programs
• Roof inspections, reports, and budgeting support

Whether you need a durable flat roofing system, a high-performance membrane, or a specialty solution for a unique structure, we tailor our recommendations to your building's needs and your long-term plans.

**Solutions engineered to last**

Every commercial roof we install is designed to deliver maximum value over time. We focus on proper design, high-quality materials, and precise installation to help reduce emergency repairs, extend roof life, and protect what's inside your building.

• Thoughtful system selection based on climate and use
• Code-compliant details and manufacturer-approved methods
• Emphasis on energy efficiency, durability, and low maintenance

Our goal is to provide the best overall solution—not just for today, but for the next 20+ years of service life.

**Safety, communication, and professionalism**

On an active commercial property, safety and coordination are critical. Our teams follow strict safety protocols and maintain clear communication with owners, managers, and other trades to keep projects on schedule and minimize impact on tenants and operations.

You get a dedicated point of contact, regular updates, and detailed documentation so you always know what's happening on your roof.

**Schedule a commercial roof assessment**

If your facility needs a new roof, a long-term plan for an aging system, or help solving recurring leaks, our commercial roofing specialists are ready to help. We'll inspect your roof, discuss your goals and budget, and present clear options with straightforward recommendations.

Contact us today to schedule a commercial roof assessment and discover why businesses have trusted our team for 33 years to deliver the best roofing solutions for their properties.`,
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
  "historical-restorations": {
    id: "5",
    slug: "historical-restorations",
    title: "Specialty and Historic Restoration",
    shortDescription: "Expert craftsmanship in specialty roofing and historic roof restoration",
    description: "For over 34 years, Russell Roofing has been Philadelphia's trusted expert in specialty roofing and historic roof restoration. We combine traditional craftsmanship with modern precision to deliver roofs that are both structurally superior and architecturally stunning.",
    icon: "/images/icons/restoration.svg",
    image: "/images/services/ServiceHeroImages/historical-restoration-hero.jpg",
    features: ["Custom Copper Roofing", "Slate & Tile Roofing", "Cedar Roofing", "Historic Roof Restoration"],
    category: "Historical Restoration",
    hero: {
      title: "Specialty and Historic Restoration",
      subtitle: "Expert Roofing Craftsmanship That Stands the Test of Time",
      backgroundImage: "/images/services/ServiceHeroImages/historical-restoration-hero.jpg"
    },
    overview: "For over 34 years, Russell Roofing has been Philadelphia's trusted expert in specialty roofing and historic roof restoration. As a nationally awarded roofing company, we combine traditional craftsmanship with modern precision to deliver roofs that are both structurally superior and architecturally stunning. From custom copper and slate roofing to cedar shake and tile, every project is completed with integrity, artistry, and attention to detail.",
    detailedDescription: `**Philadelphia's Specialty Roofing Experts**

At Russell Roofing, our reputation is built on mastery of premium and historic roofing systems. We specialize in distinctive, long-lasting roofs that enhance curb appeal, energy efficiency, and property value.

**Custom Copper Roofing**

Our custom copper roofing contractors create beautifully crafted, weather-resistant roofs that last for generations. Each seam and joint is hand-soldered for maximum performance and timeless aesthetic appeal. Copper naturally patinas over time, adding depth and character that make every roof truly one of a kind.

**Slate and Tile Roofing**

We provide expert slate roof installation and tile roof replacement using the highest-grade materials available. Whether restoring a historic home or upgrading a classic estate, slate and tile deliver unparalleled durability, fire resistance, and distinctive architectural beauty.

**Cedar Roofing**

As experienced cedar roofing contractors, Russell Roofing installs premium cedar shake and shingle roofs that balance natural beauty with exceptional strength. Sustainably sourced and meticulously installed, our cedar roofs offer excellent insulation and a timeless look suited for traditional and modern homes alike.

**Historic Roof Restoration**

Preserve your home's history with Russell Roofing's nationally recognized historic roof restoration services. Our craftsmen specialize in reproducing and restoring roofs on historic homes, churches, and buildings across the Philadelphia region. We work closely with preservation committees and architects to ensure accuracy, authenticity, and long-term protection.

**Why Choose Russell Roofing**

- Over 34 years of nationally awarded roofing experience
- Philadelphia's leader in specialty and historic roofing
- Fully licensed, insured, and manufacturer-certified
- Experts in copper, slate, cedar, and tile roofing systems
- Unmatched craftsmanship, integrity, and customer satisfaction

Preserve your legacy. Enhance your home. Protect your investment. Contact Russell Roofing, Philadelphia's specialty roofing and historic restoration experts, to schedule your consultation or request a free quote today.`,
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
    overview: "For more than 33 years, Russell Roofing & Exteriors has been a trusted specialty roofing company, known for nationally award-winning craftsmanship and long-lasting solutions. Our team brings that same level of expertise to skylight installation, transforming dark spaces into bright, welcoming areas while protecting your home from the elements.",
    detailedDescription: `**Expert skylight installation of all kinds**

We install a full range of skylights to match your roof type, room layout, and design goals, whether you're adding natural light to a single room or planning multiple daylighting points throughout your home.

• Fixed skylights for consistent natural light
• Venting (operable) skylights for added ventilation and fresh air
• Roof windows and balcony-style units for lofts and upper stories
• Sun tunnels/tubular skylights for hallways, closets, and tight spaces

Our specialists evaluate roof pitch, structure, and interior layout to recommend the right skylight type, size, and placement for optimal light and performance.

**Designed to perform, not just look good**

A skylight should bring in light—not leaks. We focus on proper integration with your roofing system to ensure durability, weather resistance, and long-term performance.

• High-quality glazing options to manage heat gain and glare
• Energy-efficient glass to help maintain comfortable indoor temperatures
• Professional flashing systems tailored to your roofing material
• Careful sealing and insulation at all critical joints

Every skylight is installed as part of a complete roofing solution, helping prevent issues like condensation, drafts, and water intrusion.

**Options to fit your home and lifestyle**

From traditional homes to modern designs, skylights can be customized to match your style and how you use the space.

• Manual and solar-powered venting skylights
• Integrated blinds and shades for light and privacy control
• Smart controls and rain sensors for added convenience
• Interior finishing options to blend seamlessly with your ceiling design

We take time to understand how you live in the space so the skylight not only looks right but functions the way you need it to.

**Award-winning craftsmanship and careful installation**

As a nationally recognized specialty roofing contractor, we treat skylight projects with the same care as complex roofing and restoration work.

• Precise roof cutting and framing adjustments, when needed
• Proper integration with shingles, slate, tile, or flat roofing systems
• Clean interior work to minimize dust and disruption
• Respectful, professional crews on every project

The result is a skylight that looks like it was always meant to be there—installed to high standards and built to last.

**Schedule a skylight consultation**

If you're considering adding new skylights, replacing old units, or integrating daylighting into a larger roofing project, our specialists are ready to help. We'll review your roof and interior spaces, discuss design and performance goals, and provide clear recommendations and pricing.

Contact us today to schedule a skylight consultation and discover why homeowners have trusted our nationally award-winning specialty roofing team for more than 33 years to install skylights of all kinds.`,
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
    emergencyAvailable: true,
    certifications: []
  },
  "churches-and-institutions": {
    id: "4",
    slug: "churches-and-institutions",
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
    overview: "A nationally recognized leader in specialty roofing for churches and institutions, Russell Roofing & Exteriors has been trusted for more than 33 years to protect some of the region's most significant and sacred buildings. Our craftsmen combine old-world skill with modern roofing technology to deliver work that is both historically respectful and nationally award-winning.",
    detailedDescription: `**Dedicated to churches and institutions**

For decades, we have focused on the unique needs of churches, schools, colleges, and institutional facilities. These projects demand more than standard roofing—they require sensitivity to architecture, scheduling, and long-term stewardship of important properties.

• Extensive experience with historic and architecturally significant structures
• Careful coordination around services, school schedules, and daily operations
• Solutions tailored to long-term ownership, not short-term fixes

Whether your building is a century-old stone church or a large campus facility, we approach every project with the same respect and attention to detail.

**Nationally award-winning craftsmanship**

Our work has been recognized with national awards that highlight our commitment to excellence in specialty roofing. These honors reflect the quality of our installations, the complexity of the projects we undertake, and the long-term performance of the systems we install.

• Nationally award-winning roofing projects
• Proven track record on complex, high-visibility buildings
• Reputation for meticulous detailing and superior workmanship

Every roof is treated as a legacy project designed to protect your building for decades to come.

**Expertise in specialty roofing systems**

Specialty and institutional roofing often involves materials and details that go far beyond standard commercial work. Our teams are trained and experienced in a wide range of high-end systems and traditional techniques.

• Slate, tile, and copper roofing
• Steep-slope and complex roof geometries
• Ornamental metalwork, gutters, and custom flashings
• Long-lasting flat and low-slope systems for institutional campuses

We carefully evaluate each structure, recommending materials and assemblies that fit both the architecture and the performance goals of your organization.

**Respectful, safe, and well-managed projects**

Working on churches and institutions requires a disciplined approach to safety, cleanliness, and communication. We plan every project to minimize disruption while maintaining the highest standards of site conduct.

• Strict safety protocols to protect congregations, students, staff, and visitors
• Clear communication with building committees, boards, and facility managers
• Professional crews trained to work respectfully around occupied spaces

From staging and access to noise and scheduling, we design our process around your building's daily life.

**Partner with a trusted specialty roofing expert**

If your church or institution needs expert guidance on roof repair, restoration, or replacement, our team is ready to help. We can assess your current roof, provide detailed recommendations, and help you prioritize work over time to fit your budget and long-range plans.

Contact us today to schedule a consultation and discover why churches and institutions have trusted our nationally award-winning specialty roofing team for over 33 years.`,
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
    relatedServices: ["roofing", "commercial", "historical-restorations"],
    testimonials: [],
    emergencyAvailable: true,
    certifications: []
  },
  gutters: {
    id: "6",
    slug: "gutters",
    title: "Gutters",
    shortDescription: "Complete gutter expertise for every property",
    description: "We install and service gutters of all types to match the architecture, performance needs, and budget of your home or building. From traditional systems to high-end custom metals, every gutter is designed as part of a complete water-management solution.",
    icon: "/images/icons/gutters.svg",
    image: "/images/services/ServiceHeroImages/gutters-hero.jpg",
    features: ["Seamless Aluminum Gutters", "Copper Gutters", "Custom Fabrication", "Gutter Guards"],
    category: "Gutters",
    hero: {
      title: "Gutter Services",
      subtitle: "Complete Gutter Expertise for Every Property",
      backgroundImage: "/images/services/ServiceHeroImages/gutters-hero.jpg"
    },
    overview: "We install and service gutters of all types to match the architecture, performance needs, and budget of your home or building. From traditional systems to high-end custom metals, every gutter is designed as part of a complete water-management solution that moves water away from your structure and protects roofs, walls, and foundations.",
    detailedDescription: `**Complete gutter expertise for every property**

• Seamless aluminum gutters in multiple sizes and colors
• Copper gutters and downspouts for premium and historic properties
• Steel and specialty metal gutters for added strength and durability
• K-style and half-round profiles to complement any architectural style

We carefully evaluate roof lines, drainage patterns, and landscaping to recommend the right gutter size, style, and configuration for your property.

**Award-winning installation and craftsmanship**

Our nationally recognized work reflects a commitment to doing things the right way—from layout and pitch to fastening and flashing details. Proper gutter installation is critical to preventing leaks, ice issues, and damage to trim, fascia, and masonry.

• Precise gutter slopes for proper water flow
• Secure hangers and brackets for long-term stability
• Thoughtful downspout placement to direct water away from foundations
• Integration with roofing, flashings, and drainage systems

Every project is installed to high standards so your gutters not only look good but perform reliably in heavy rain and harsh weather.

**Custom solutions and specialty metals**

For high-end homes, historic properties, and architecturally distinctive buildings, we offer fully custom gutter solutions that enhance both performance and curb appeal.

• Custom-fabricated copper and metal gutters
• Ornamental brackets, leader heads, and collector boxes
• Coordination with slate, tile, cedar, and specialty roofing systems

Our specialists work closely with owners, architects, and contractors to ensure the gutter system complements the overall design of the building.

**Protection, maintenance, and long-term value**

A properly designed gutter system is one of the most important defenses against water damage. We help you protect your investment with thoughtful design and ongoing support.

• Gutter repairs and system upgrades
• Gutter guards and leaf protection options
• Maintenance and inspection services to keep systems clear and flowing

The goal is to reduce water intrusion, staining, and foundation issues while extending the life of your roof, siding, and exterior finishes.

**Schedule a gutter consultation**

Whether you need new gutters for a specialty roofing project, a full-system upgrade, or custom metal gutters for a high-end property, our team is ready to help. We'll inspect your current setup, discuss your goals, and present clear options tailored to your building and budget.

Contact us today to schedule a gutter consultation and see why property owners have trusted our nationally award-winning specialty roofing and gutter team for more than 33 years.`,
    process: [
      {
        step: 1,
        title: "Property Assessment",
        description: "Evaluate roof lines, drainage patterns, and existing gutter condition",
        icon: "/images/icons/inspection.svg"
      },
      {
        step: 2,
        title: "Custom Design",
        description: "Recommend optimal gutter size, style, and configuration",
        icon: "/images/icons/design.svg"
      },
      {
        step: 3,
        title: "Professional Installation",
        description: "Expert installation with precise slopes and secure fastening",
        icon: "/images/icons/installation.svg"
      },
      {
        step: 4,
        title: "Quality Assurance",
        description: "Final inspection and drainage testing",
        icon: "/images/icons/quality.svg"
      }
    ],
    featureDetails: [
      {
        title: "Seamless Gutters",
        description: "Custom-fabricated on-site for a perfect fit with no seams to leak",
        icon: "/images/icons/seamless.svg",
        highlight: true
      },
      {
        title: "Copper & Specialty Metals",
        description: "Premium materials for historic and high-end properties",
        icon: "/images/icons/copper.svg"
      },
      {
        title: "Gutter Guards",
        description: "Leaf protection systems to reduce maintenance",
        icon: "/images/icons/guard.svg"
      },
      {
        title: "Custom Fabrication",
        description: "Ornamental brackets, leader heads, and collector boxes",
        icon: "/images/icons/custom.svg"
      },
      {
        title: "Foundation Protection",
        description: "Proper drainage to protect your foundation from water damage",
        icon: "/images/icons/foundation.svg"
      },
      {
        title: "Award-Winning Work",
        description: "Nationally recognized craftsmanship and attention to detail",
        icon: "/images/icons/award.svg"
      }
    ],
    faqs: [
      {
        question: "What types of gutters do you install?",
        answer: "We install seamless aluminum gutters, copper gutters and downspouts, steel and specialty metal gutters, and both K-style and half-round profiles to match any architectural style."
      },
      {
        question: "How do I know if my gutters need to be replaced?",
        answer: "Signs include sagging, pulling away from the house, visible rust or cracks, water pooling near your foundation, or peeling paint on trim and fascia. We offer free inspections to assess your gutter system."
      },
      {
        question: "Do you offer gutter guards?",
        answer: "Yes, we install a variety of gutter guard and leaf protection systems. We can recommend the best option based on your roof type, surrounding trees, and maintenance preferences."
      },
      {
        question: "Can you match gutters to historic properties?",
        answer: "Absolutely. We specialize in custom-fabricated copper and metal gutters with ornamental brackets and details that complement historic and architecturally distinctive buildings."
      }
    ],
    relatedServices: ["roofing", "siding-and-gutters", "historical-restorations"],
    testimonials: [],
    emergencyAvailable: true,
    certifications: []
  }
};

// Helper function to get service details by slug
export function getServiceDetailsBySlug(slug: string): ServiceDetail | undefined {
  return serviceDetails[slug];
}