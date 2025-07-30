import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "News & Articles | Russell Roofing & Exteriors",
  description: "Stay up to date with the latest roofing news, tips, and insights from Russell Roofing & Exteriors experts.",
  keywords: "roofing news, roofing tips, home improvement articles, roofing maintenance, storm damage",
};

const articles = [
  {
    id: 1,
    title: "Expert Tips for Roof Maintenance",
    description: "Learn essential maintenance tips to extend your roof's lifespan and prevent costly repairs. Our comprehensive guide covers seasonal inspections, cleaning procedures, and early warning signs.",
    category: "Maintenance",
    date: "December 15, 2024",
    readTime: "5 min read",
    image: "/placeholder.svg?height=300&width=400&query=roof maintenance professional inspection"
  },
  {
    id: 2,
    title: "Choosing the Right Siding Material",
    description: "Compare different siding materials and find the perfect option for your home's style and budget. We break down vinyl, fiber cement, wood, and metal options.",
    category: "Materials",
    date: "December 12, 2024",
    readTime: "7 min read",
    image: "/placeholder.svg?height=300&width=400&query=home siding materials comparison"
  },
  {
    id: 3,
    title: "Storm Damage: What to Look For",
    description: "Identify signs of storm damage and understand the insurance claim process for roof repairs. Know when to call professionals and how to document damage properly.",
    category: "Storm Damage",
    date: "December 10, 2024",
    readTime: "6 min read",
    image: "/placeholder.svg?height=300&width=400&query=storm damage roof assessment"
  },
  {
    id: 4,
    title: "Energy-Efficient Roofing Solutions",
    description: "Discover how modern roofing materials can help reduce your energy costs and environmental impact. From cool roofs to solar integration options.",
    category: "Energy Efficiency",
    date: "December 8, 2024",
    readTime: "8 min read",
    image: "/placeholder.svg?height=300&width=400&query=energy efficient roofing solar panels"
  },
  {
    id: 5,
    title: "Historic Home Restoration Guide",
    description: "Specialized techniques and materials for preserving the character of historic properties while meeting modern performance standards.",
    category: "Restoration",
    date: "December 5, 2024",
    readTime: "10 min read",
    image: "/placeholder.svg?height=300&width=400&query=historic home roof restoration preservation"
  },
  {
    id: 6,
    title: "Commercial Roofing Best Practices",
    description: "Understanding the unique requirements and solutions for commercial roofing projects, from flat roof systems to maintenance programs.",
    category: "Commercial",
    date: "December 3, 2024",
    readTime: "9 min read",
    image: "/placeholder.svg?height=300&width=400&query=commercial roofing flat roof systems"
  },
  {
    id: 7,
    title: "Winter Roof Preparation Checklist",
    description: "Essential steps to prepare your roof for winter weather, including gutter cleaning, ice dam prevention, and insulation checks.",
    category: "Seasonal",
    date: "November 28, 2024",
    readTime: "6 min read",
    image: "/placeholder.svg?height=300&width=400&query=winter roof preparation snow ice"
  },
  {
    id: 8,
    title: "Understanding Roof Warranties",
    description: "Navigate the different types of roofing warranties and what they cover. Learn the difference between manufacturer and workmanship warranties.",
    category: "Education",
    date: "November 25, 2024",
    readTime: "7 min read",
    image: "/placeholder.svg?height=300&width=400&query=roof warranty documentation coverage"
  },
  {
    id: 9,
    title: "Sustainable Roofing Materials Guide",
    description: "Explore eco-friendly roofing options that reduce environmental impact while providing excellent performance and durability.",
    category: "Sustainability",
    date: "November 22, 2024",
    readTime: "8 min read",
    image: "/placeholder.svg?height=300&width=400&query=sustainable roofing materials green eco friendly"
  }
];

const categories = ["All", "Maintenance", "Materials", "Storm Damage", "Energy Efficiency", "Restoration", "Commercial", "Seasonal", "Education", "Sustainability"];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background-light">
      {/* Header Section */}
      <section className="bg-primary-burgundy text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            News & Articles
          </h1>
          <p className="font-body text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Stay informed with the latest roofing industry insights, maintenance tips, and expert advice from our experienced team.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 ${
                    category === "All"
                      ? "bg-primary-burgundy text-white"
                      : "bg-white text-text-primary border border-gray-200 hover:bg-primary-burgundy hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {articles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-primary-burgundy text-white px-3 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-text-secondary mb-3">
                    <span>{article.date}</span>
                    <span className="mx-2">•</span>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  
                  <p className="font-body text-text-secondary mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  
                  <Link
                    href={`/news/${article.id}`}
                    className="inline-flex items-center font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors"
                  >
                    Read More
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center">
            <button className="bg-primary-burgundy text-white px-8 py-3 rounded-lg font-body font-medium hover:bg-primary-charcoal transition-colors">
              Load More Articles
            </button>
          </div>
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
    </div>
  );
}