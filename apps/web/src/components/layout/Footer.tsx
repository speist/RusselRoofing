"use client";

import React from "react";
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
} from "lucide-react";

export function Footer() {
  const services = [
    "Roofing",
    "Siding and Gutters",
    "Commercial",
    "Churches & Institutions",
    "Historical Restoration",
    "Masonry",
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
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3" />
                <span className="font-inter text-sm">info@russellroofing.com</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Our Services */}
          <div>
            <h3 className="font-inter font-semibold text-white text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <a href="#" className="font-inter text-gray-300 text-sm hover:text-white transition-colors">
                    {service}
                  </a>
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
              <li className="font-inter text-gray-300 text-sm">Greater Philadelphia Area</li>
              <li className="font-inter text-gray-300 text-sm">South Jersey</li>
              <li className="font-inter text-gray-300 text-sm">Central Jersey</li>
              <li className="font-inter text-gray-300 text-sm">Montgomery County</li>
              <li className="font-inter text-gray-300 text-sm">Bucks County</li>
              <li className="font-inter text-gray-300 text-sm">Delaware County</li>
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
      </div>
    </footer>
  );
}
