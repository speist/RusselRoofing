import type React from "react"
import type { Metadata } from "next"
import { Inter, Lora } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
})

export const metadata: Metadata = {
  title: "Russell Roofing & Exteriors - Professional Roofing Solutions",
  description:
    "Trusted, hassle-free property solutions tailored for you. Professional roofing, siding, windows, and exterior services.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} antialiased`}>{children}</body>
    </html>
  )
}
