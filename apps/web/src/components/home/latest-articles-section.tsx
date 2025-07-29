"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";

const articles = [
  {
    id: "1",
    title: "5 Signs Your Roof Needs Immediate Attention",
    excerpt: "Learn to identify the warning signs that indicate your roof needs professional inspection and potential repair before problems get worse.",
    imageUrl: "/api/placeholder/400/250",
    author: "Russell Team",
    publishDate: "2024-01-15",
    readTime: "5 min read",
    category: "Maintenance",
    slug: "5-signs-roof-needs-attention"
  },
  {
    id: "2", 
    title: "Understanding GAF System Plus Warranties",
    excerpt: "Discover the benefits of GAF's comprehensive warranty system and why choosing a Master Elite contractor matters for your investment.",
    imageUrl: "/api/placeholder/400/250",
    author: "Russell Team",
    publishDate: "2024-01-08",
    readTime: "7 min read", 
    category: "Warranties",
    slug: "understanding-gaf-system-plus-warranties"
  },
  {
    id: "3",
    title: "Preparing Your Home for Storm Season",
    excerpt: "Essential steps to protect your roof and exterior from severe weather, plus what to do if storm damage occurs.",
    imageUrl: "/api/placeholder/400/250",
    author: "Russell Team", 
    publishDate: "2024-01-01",
    readTime: "6 min read",
    category: "Weather Protection",
    slug: "preparing-home-storm-season"
  }
];

export function LatestArticlesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest Articles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with our expert advice on roofing maintenance, materials, and home protection tips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {articles.map((article) => (
            <Card key={article.id} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-200">
                {/* Placeholder for article image */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <span className="text-white text-4xl">📰</span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{article.author}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="font-display text-xl font-semibold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <Link 
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="secondary" size="lg" className="px-8 py-4">
            <Link href="/blog">
              View All Articles
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}