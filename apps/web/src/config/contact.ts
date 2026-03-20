// Contact configuration for Russell Roofing
export const contactConfig = {
  phone: {
    display: "1-888-567-7663",
    href: "tel:+18885677663"
  },
  email: {
    display: "info@russellroofing.com",
    href: "mailto:info@russellroofing.com"
  },
  address: {
    street: "1200 Pennsylvania Ave",
    city: "Oreland",
    state: "PA",
    zip: "19075",
    full: "1200 Pennsylvania Ave, Oreland, PA 19075"
  },
  hours: {
    monday: "8:00 AM - 4:30 PM",
    tuesday: "8:00 AM - 4:30 PM",
    wednesday: "8:00 AM - 4:30 PM",
    thursday: "8:00 AM - 4:30 PM",
    friday: "8:00 AM - 4:30 PM",
    saturday: "Closed",
    sunday: "Closed"
  },
  emergency: {
    available: true,
    phone: {
      display: "1-888-567-7663",
      href: "tel:+18885677663"
    }
  }
} as const;
