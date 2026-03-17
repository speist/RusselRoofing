export interface FAQ {
  question: string;
  answer: string;
}

export const serviceFAQs: Record<string, FAQ[]> = {
  roofing: [
    {
      question: "How often should I have my roof inspected?",
      answer:
        "We recommend annual roof inspections, especially after severe weather events. Regular inspections help identify minor issues before they become major problems.",
    },
    {
      question: "Do you offer financing options?",
      answer:
        "Yes, we offer flexible financing options to help make your roofing project affordable. We can discuss available plans during your consultation.",
    },
    {
      question: "What roofing materials do you recommend?",
      answer:
        "The best material depends on your home's architecture, local climate, and budget. We'll help you choose from asphalt shingles, metal, slate, or tile based on your specific needs.",
    },
    {
      question: "How long does a typical roof replacement take?",
      answer:
        "Most residential roof replacements are completed in 1-3 days, depending on the size and complexity of the roof. We'll provide a specific timeline during your consultation.",
    },
  ],
  "siding-and-gutters": [
    {
      question: "Can you match my existing siding for repairs?",
      answer:
        "Yes, we maintain relationships with major manufacturers and can source matching materials for most siding types. For discontinued products, we'll find the closest match available.",
    },
    {
      question: "What's the best siding material for Pennsylvania weather?",
      answer:
        "Fiber cement and quality vinyl siding perform excellently in our climate. Both resist moisture, temperature changes, and storm damage while maintaining their appearance.",
    },
    {
      question: "How long does siding installation take?",
      answer:
        "Most homes can be completed in 3-7 days, depending on size and complexity. We'll provide a detailed timeline during your consultation.",
    },
    {
      question: "Does new siding really improve energy efficiency?",
      answer:
        "Yes! Modern siding with proper insulation can reduce energy costs by 20-30%. We can add insulation during installation for maximum efficiency.",
    },
  ],
  commercial: [
    {
      question: "Can you work outside of business hours?",
      answer:
        "Absolutely. We offer flexible scheduling including evenings, weekends, and overnight work to minimize disruption to your business operations.",
    },
    {
      question: "What types of commercial roofing systems do you install?",
      answer:
        "We install and repair all commercial roofing systems including TPO, EPDM, PVC, modified bitumen, built-up roofing, and metal roofing systems.",
    },
    {
      question:
        "Do you work with building managers and property management companies?",
      answer:
        "Yes, we have extensive experience working with property managers, building owners, and facility managers. We understand the unique requirements of commercial properties and can coordinate with your team.",
    },
    {
      question: "Do you provide maintenance plans for commercial properties?",
      answer:
        "Yes, we offer comprehensive maintenance programs tailored to commercial properties. Regular maintenance extends roof life and helps prevent costly emergency repairs.",
    },
  ],
  "churches-and-institutions": [
    {
      question: "Can you work with our building committee or board?",
      answer:
        "Absolutely. We're experienced in presenting to committees and boards, providing detailed proposals, and working within institutional decision-making processes.",
    },
    {
      question: "Do you have experience working on active facilities?",
      answer:
        "Yes, we specialize in working around active operations. We coordinate schedules to minimize disruption to worship services, school activities, or hospital operations.",
    },
    {
      question: "Can you help with fundraising documentation?",
      answer:
        "Yes, we provide detailed project documentation, phasing options, and cost breakdowns that support capital campaign and fundraising efforts.",
    },
    {
      question: "Do you handle steeples and bell towers?",
      answer:
        "Yes, we have the specialized equipment and expertise to work on steeples, bell towers, and other elevated architectural features unique to institutional buildings.",
    },
  ],
  "historical-restorations": [
    {
      question:
        "Do you offer documentation for historic preservation tax credits?",
      answer:
        "Yes, we can provide detailed documentation of materials, methods, and work performed to support historic preservation tax credit applications.",
    },
    {
      question:
        "Do you work with historic preservation societies and boards?",
      answer:
        "Yes, we have extensive experience working with historic preservation commissions and architectural review boards. We understand the approval process and can help navigate requirements.",
    },
    {
      question: "Can you source authentic historic materials?",
      answer:
        "Absolutely. We have established relationships with suppliers of authentic materials including slate, clay tiles, copper, and historic wood products. We can match or replicate original materials.",
    },
    {
      question: "Are you familiar with period-appropriate techniques?",
      answer:
        "Yes, our craftsmen are trained in traditional building techniques including hand-cut slate installation, copper work, and historic masonry methods.",
    },
  ],
  gutters: [
    {
      question: "What type of gutters do you recommend?",
      answer:
        "We typically recommend seamless aluminum gutters for most homes due to their durability, low maintenance, and custom fit. For historic or high-end properties, we also offer copper and zinc gutter systems.",
    },
    {
      question: "How do I know if my gutters need to be replaced?",
      answer:
        "Signs include sagging, pulling away from the fascia, visible rust or cracks, water pooling around your foundation, and paint peeling on or near the gutters. We offer free inspections to assess their condition.",
    },
    {
      question: "Do you install gutter guards?",
      answer:
        "Yes, we install high-quality gutter guard systems that help prevent leaves and debris from clogging your gutters, reducing the need for regular cleaning and helping maintain proper water flow.",
    },
    {
      question: "How often should gutters be cleaned?",
      answer:
        "We recommend cleaning gutters at least twice a year — in late spring and late fall. Homes surrounded by trees may need more frequent cleaning. Gutter guards can significantly reduce this maintenance.",
    },
  ],
  windows: [
    {
      question: "How long does window installation take?",
      answer:
        "Most window installations take 1-3 days depending on the number of windows and complexity. We work efficiently to minimize disruption to your daily routine.",
    },
    {
      question: "Do you offer a warranty on window installations?",
      answer:
        "Yes, we provide comprehensive warranties on both materials and labor. Manufacturer warranties vary by brand, and we offer additional installation warranties for your peace of mind.",
    },
    {
      question: "What are the benefits of energy-efficient windows?",
      answer:
        "Energy-efficient windows reduce heating and cooling costs, improve home comfort, minimize outside noise, reduce UV damage to furniture, and increase your home's resale value.",
    },
    {
      question: "Can you match my existing window style?",
      answer:
        "Absolutely! We work with all major window manufacturers and can match virtually any style, including double-hung, casement, bay, bow, and custom shapes.",
    },
  ],
  skylights: [
    {
      question: "Can you install skylights in any type of roof?",
      answer:
        "We can install skylights in most roof types including asphalt shingle, metal, slate, and tile. Each installation is customized to your specific roof structure and material.",
    },
    {
      question: "What are the benefits of modern skylights?",
      answer:
        "Modern skylights provide natural light, reduce energy costs, improve ventilation, and enhance your home's aesthetic appeal. Many feature Low-E coatings and insulated glass for energy efficiency.",
    },
    {
      question: "Do you repair existing skylights?",
      answer:
        "Yes, we repair and service all major skylight brands. Common repairs include resealing, flashing replacement, glass replacement, and mechanism repairs for operable units.",
    },
    {
      question: "How do you prevent skylight leaks?",
      answer:
        "We use proper flashing techniques, high-quality sealants, and careful integration with your roofing system. Our installations come with comprehensive warranties against leaks.",
    },
  ],
};
