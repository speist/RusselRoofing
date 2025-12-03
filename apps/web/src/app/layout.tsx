import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Lora } from "next/font/google";
import { GoogleMapsScript } from "@/components/GoogleMapsScript";
import { TrackingScripts } from "@/components/TrackingScripts";
import { MainStructuredData } from "@/components/StructuredData";
import { validateEnvironmentOrThrow } from "@/lib/env-validation";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://russellroofing.com'

// Validate environment on server-side rendering
if (typeof window === 'undefined') {
  try {
    validateEnvironmentOrThrow();
  } catch (error) {
    console.error('\n Runtime Environment Validation Failed\n');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('\n Application may not function correctly with missing variables.\n');
  }
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#960120",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Russell Roofing & Exteriors | Roofing, Siding & More in Philadelphia & South Jersey",
    template: "%s | Russell Roofing & Exteriors",
  },
  description: "Professional roofing, siding, gutters, windows, skylights, masonry, and exterior services. Serving Greater Philadelphia, South Jersey, Montgomery, Bucks & Delaware Counties since 1992. Free estimates!",
  keywords: [
    "roofing contractor",
    "roof repair",
    "roof replacement",
    "siding installation",
    "gutter services",
    "window installation",
    "skylight installation",
    "masonry",
    "commercial roofing",
    "historical restoration",
    "Philadelphia roofing",
    "South Jersey roofing",
    "Montgomery County roofing",
    "Bucks County roofing",
    "Delaware County roofing",
  ],
  authors: [{ name: "Russell Roofing & Exteriors" }],
  creator: "Russell Roofing & Exteriors",
  publisher: "Russell Roofing & Exteriors",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Russell Roofing & Exteriors",
    title: "Russell Roofing & Exteriors | Professional Exterior Services Since 1992",
    description: "Expert roofing, siding, gutters, windows, skylights & masonry services. Serving Greater Philadelphia, South Jersey & surrounding counties. Free estimates!",
    // OG image is auto-generated from opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Russell Roofing & Exteriors | Professional Exterior Services",
    description: "Expert roofing, siding, gutters & more. Serving Greater Philadelphia & South Jersey since 1992.",
    // Twitter image is auto-generated from opengraph-image.tsx
    creator: "@russellroofing",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <MainStructuredData />
      </head>
      <body className={`${inter.variable} ${playfairDisplay.variable} ${lora.variable} antialiased`}>
        <GoogleMapsScript />
        {children}

        {/* Cookie Consent Banner and Tracking Scripts */}
        <TrackingScripts />
      </body>
    </html>
  );
}
