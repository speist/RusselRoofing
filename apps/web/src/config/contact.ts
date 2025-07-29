// Contact configuration for Russell Roofing
export const contactConfig = {
  phone: {
    display: "(123) 456-7890",
    href: "tel:+1234567890"
  },
  email: {
    display: "info@russellroofing.com",
    href: "mailto:info@russellroofing.com"
  },
  address: {
    street: "123 Main Street",
    city: "Anytown",
    state: "NJ",
    zip: "12345",
    full: "123 Main Street, Anytown, NJ 12345"
  },
  hours: {
    monday: "8:00 AM - 6:00 PM",
    tuesday: "8:00 AM - 6:00 PM",
    wednesday: "8:00 AM - 6:00 PM",
    thursday: "8:00 AM - 6:00 PM",
    friday: "8:00 AM - 6:00 PM",
    saturday: "9:00 AM - 4:00 PM",
    sunday: "Closed"
  },
  emergency: {
    available: true,
    phone: {
      display: "(123) 456-7890",
      href: "tel:+1234567890"
    }
  }
} as const;