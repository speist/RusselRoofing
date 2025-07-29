"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

// Mock Instagram posts for display - these would be replaced with real Instagram API data
const instagramPosts = [
  {
    id: "1",
    imageUrl: "/api/placeholder/300/300",
    caption: "New roof installation completed in Springfield! Another happy customer with GAF materials.",
    likes: 45,
    url: "#"
  },
  {
    id: "2", 
    imageUrl: "/api/placeholder/300/300",
    caption: "Storm damage repair - before and after. We're here 24/7 for emergencies.",
    likes: 62,
    url: "#"
  },
  {
    id: "3",
    imageUrl: "/api/placeholder/300/300", 
    caption: "Beautiful new gutters and siding installation. Complete exterior makeover!",
    likes: 38,
    url: "#"
  },
  {
    id: "4",
    imageUrl: "/api/placeholder/300/300",
    caption: "Our team hard at work on a residential roof replacement. Quality craftsmanship every time.",
    likes: 71,
    url: "#"
  },
  {
    id: "5",
    imageUrl: "/api/placeholder/300/300",
    caption: "Check out this stunning architectural shingle installation. GAF Timberline HDZ series.",
    likes: 89,
    url: "#"
  },
  {
    id: "6",
    imageUrl: "/api/placeholder/300/300",
    caption: "Emergency roof repair completed just in time before the next storm. We've got you covered!",
    likes: 54,
    url: "#"
  }
];

export function InstagramSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Follow Our Work
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See our latest projects and behind-the-scenes content on Instagram. Real work, real results.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {instagramPosts.map((post) => (
            <div key={post.id} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200">
              {/* Placeholder for Instagram image */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-4xl">📸</span>
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white p-4">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{post.likes}</span>
                  </div>
                  <p className="text-sm leading-tight line-clamp-3">
                    {post.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="secondary"
            size="lg"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none hover:from-purple-700 hover:to-pink-700"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow @RussellRoofing
          </Button>
        </div>
      </div>
    </section>
  );
}