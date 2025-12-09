"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Copy,
  Check,
} from "lucide-react";

export function Footer() {
  const [emailCopied, setEmailCopied] = useState(false);
  const email = "info@russellroofing.com";

  const copyEmailToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const services = [
    { title: "Roofing", slug: "roofing" },
    { title: "Siding and Gutters", slug: "siding-and-gutters" },
    { title: "Commercial", slug: "commercial" },
    { title: "Churches & Institutions", slug: "churches-institutions" },
    { title: "Historical Restoration", slug: "historical-restoration" },
    { title: "Masonry", slug: "masonry" },
    { title: "Windows", slug: "windows" },
    { title: "Skylights", slug: "skylights" },
  ];

  return (
    <footer className="bg-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1 - Company Info */}
          <div>
            <Image
              src="/rrlogo-white.svg"
              alt="Russell Roofing & Exteriors"
              width={180}
              height={40}
              className="h-10 w-auto mb-6"
            />
            <div className="space-y-3">
              <div className="flex items-start text-gray-300">
                <MapPin className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                <span className="font-inter text-sm">1200 Pennsylvania Ave, Oreland, PA 19075</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3" />
                <span className="font-inter text-sm">1-888-567-7663</span>
              </div>
              <div className="flex items-center text-gray-300 group">
                <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="font-inter text-sm hover:text-white transition-colors"
                >
                  {email}
                </a>
                <button
                  onClick={copyEmailToClipboard}
                  className="ml-2 p-1 rounded hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label={emailCopied ? "Email copied" : "Copy email to clipboard"}
                  title={emailCopied ? "Copied!" : "Copy email"}
                >
                  {emailCopied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Column 2 - Our Services */}
          <div>
            <h3 className="font-inter font-semibold text-white text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="font-inter text-gray-300 text-sm hover:text-white transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Quick Links */}
          <div>
            <h3 className="font-inter font-semibold text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="font-inter text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="font-inter text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="font-inter text-gray-300 text-sm hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-inter text-gray-300 text-sm hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="font-inter text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="font-inter text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Service Areas */}
          <div>
            <h3 className="font-inter font-semibold text-white text-lg mb-4">Service Areas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/service-areas/greater-philadelphia" className="font-inter text-gray-300 text-sm hover:text-white transition-colors">
                  Greater Philadelphia Area
                </Link>
              </li>
              <li>
                <Link href="/service-areas/south-jersey" className="font-inter text-gray-300 text-sm hover:text-white transition-colors">
                  South Jersey
                </Link>
              </li>
              <li>
                <Link href="/service-areas/central-jersey" className="font-inter text-gray-300 text-sm hover:text-white transition-colors">
                  Central Jersey
                </Link>
              </li>
              <li>
                <Link href="/service-areas/montgomery-county" className="font-inter text-gray-300 text-sm hover:text-white transition-colors">
                  Montgomery County
                </Link>
              </li>
              <li>
                <Link href="/service-areas/bucks-county" className="font-inter text-gray-300 text-sm hover:text-white transition-colors">
                  Bucks County
                </Link>
              </li>
              <li>
                <Link href="/service-areas/delaware-county" className="font-inter text-gray-300 text-sm hover:text-white transition-colors">
                  Delaware County
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Follow Us */}
          <div>
            <h3 className="font-inter font-semibold text-white text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4 mb-6 w-fit">
              <a
                href="https://twitter.com/russellroofing?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/RussellRoofing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/russell-roofing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/russellroofingcompany/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
            <div className="w-[120px]">
              <Image
                src="/images/about/RR-33-years-on-transparent-white.png"
                alt="Russell Roofing - 33 Years of Excellence"
                width={150}
                height={150}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar - Copyright and Legal */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-inter text-gray-400 text-sm">
              © {new Date().getFullYear()} Russell Roofing & Exteriors. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy-policy"
                className="font-inter text-gray-400 text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
