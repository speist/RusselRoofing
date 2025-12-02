import type { Metadata } from "next";
import { Inter, Playfair_Display, Lora } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { GoogleMapsScript } from "@/components/GoogleMapsScript";
import { TrackingScripts } from "@/components/TrackingScripts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { validateEnvironmentOrThrow } from "@/lib/env-validation";
import "./globals.css";

// Validate environment on server-side rendering
if (typeof window === 'undefined') {
  try {
    validateEnvironmentOrThrow();
  } catch (error) {
    console.error('\n❌ Runtime Environment Validation Failed\n');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('\n⚠️  Application may not function correctly with missing variables.\n');
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

export const metadata: Metadata = {
  title: "Russell Roofing & Exteriors",
  description: "Expert roofing services with quality craftsmanship and reliable solutions. GAF Master Elite certified contractor serving your local area.",
  keywords: "roofing, roof repair, roof replacement, GAF Master Elite, siding, gutters, exteriors",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#960120",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfairDisplay.variable} ${lora.variable} antialiased`}>
        <GoogleMapsScript />
        {children}

        {/* Cookie Consent Banner and Tracking Scripts */}
        <TrackingScripts />
      </body>
    </html>
  );
}
