"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Menu,
  X,
} from "lucide-react"

export default function PageNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-red shadow-lg">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/rrlogo-white.svg"
                alt="Russell Roofing & Exteriors"
                width={180}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-white font-inter hover:text-accent-yellow transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white font-inter hover:text-accent-yellow transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/services"
              className="text-white font-inter hover:text-accent-yellow transition-colors"
            >
              Services
            </Link>
            <Link
              href="/news"
              className="text-white font-inter hover:text-accent-yellow transition-colors"
            >
              News
            </Link>
            <Link
              href="/contact"
              className="text-white font-inter hover:text-accent-yellow transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Request Estimate Button */}
          <Link
            href="/estimate"
            className="hidden md:block px-6 py-2 rounded-full font-inter font-medium bg-white text-primary-red hover:bg-gray-100 transition-all duration-300"
          >
            Request Estimate
          </Link>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-primary-red border-t border-red-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-white font-inter hover:bg-red-800 rounded"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-white font-inter hover:bg-red-800 rounded"
              >
                About Us
              </Link>
              <Link
                href="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-white font-inter hover:bg-red-800 rounded"
              >
                Services
              </Link>
              <Link
                href="/news"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-white font-inter hover:bg-red-800 rounded"
              >
                News
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-white font-inter hover:bg-red-800 rounded"
              >
                Contact
              </Link>
              <Link
                href="/estimate"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full mt-2 bg-white text-primary-red px-6 py-2 rounded-full font-inter font-medium block text-center"
              >
                Request Estimate
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}