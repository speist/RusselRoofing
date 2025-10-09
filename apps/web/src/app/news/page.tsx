"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";

interface BlogPost {
  id: string;
  name: string;
  slug: string;
  featuredImage: string;
  postSummary: string;
  publishDate: string;
  category?: {
    id: string;
    name: string;
  };
}

export default function NewsPage() {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayCount, setDisplayCount] = useState(9);
  const [totalArticles, setTotalArticles] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/hubspot/blog?limit=50');
        const data = await response.json();

        if (data.success && data.data) {
          setArticles(data.data.results);
          setTotalArticles(data.data.total);
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Extract unique categories from articles
  const categories: string[] = ["All", ...Array.from(new Set(articles.map(article => article.category?.name).filter((name): name is string => Boolean(name))))];

  // Filter articles by category
  const filteredArticles = selectedCategory === "All"
    ? articles
    : articles.filter(article => article.category?.name === selectedCategory);

  // Display limited articles
  const displayedArticles = filteredArticles.slice(0, displayCount);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 9);
  };
  return (
    <FloatingPageLayout>
      {/* Header Section */}
      <section
        className="relative py-16 md:py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/images/news/news-hero.jpeg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            News & Articles
          </h1>
          <p className="font-body text-lg md:text-xl text-white max-w-3xl mx-auto">
            Stay informed with the latest roofing industry insights, maintenance tips, and expert advice from our experienced team.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          {!loading && (
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setDisplayCount(9);
                    }}
                    className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 ${
                      category === selectedCategory
                        ? "bg-primary-burgundy text-white"
                        : "bg-white text-text-primary border border-gray-200 hover:bg-primary-burgundy hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayedArticles.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`}>
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer">
                    <div className="relative">
                      <Image
                        src={article.featuredImage}
                        alt={article.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      {article.category && (
                        <div className="absolute top-4 left-4">
                          <span className="inline-block bg-primary-burgundy text-white px-3 py-1 rounded-full text-xs font-medium">
                            {article.category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center text-sm text-text-secondary mb-3">
                        <span>{formatDate(article.publishDate)}</span>
                      </div>

                      <h2 className="font-display text-xl font-semibold text-text-primary mb-3 line-clamp-2">
                        {article.name}
                      </h2>

                      <p className="font-body text-text-secondary mb-4 line-clamp-3">
                        {article.postSummary}
                      </p>

                      <span className="inline-flex items-center font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors">
                        Read More
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-body text-text-secondary text-lg">No articles available at this time.</p>
            </div>
          )}

          {/* Load More Button */}
          {!loading && displayedArticles.length < filteredArticles.length && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                className="bg-primary-burgundy text-white px-8 py-3 rounded-lg font-body font-medium hover:bg-primary-charcoal transition-colors"
              >
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-secondary-light-warm-gray py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Stay Updated
          </h2>
          <p className="font-body text-text-secondary mb-8">
            Subscribe to our newsletter for the latest roofing tips, industry news, and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-primary-burgundy"
            />
            <button
              type="submit"
              className="bg-primary-burgundy text-white px-6 py-3 rounded-lg font-body font-medium hover:bg-primary-charcoal transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </FloatingPageLayout>
  );
}