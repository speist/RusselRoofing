import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "next-themes";
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
      <head>
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`}
        />
      </head>
      <body className={`${inter.variable} ${playfairDisplay.variable} font-body floating-page-bg`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <Header />
          <main className="floating-page-container">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
