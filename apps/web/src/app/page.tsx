"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Users,
  Award,
  Wrench,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Menu,
  X,
  Facebook,
  Linkedin,
  Twitter,
  HardHat,
  ClipboardCheck,
  Hammer,
} from "lucide-react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/autoplay"

// Import Components
import AssociationsSlider from "@/components/home/AssociationsSlider"

// Loading Skeleton Component
const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-md p-6">
    <div className="bg-gray-300 h-32 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
  </div>
)

const TestimonialSkeleton = () => (
  <div className="animate-pulse bg-white p-6 md:p-8 rounded-lg shadow-md h-full">
    <div className="flex mb-4 space-x-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-5 h-5 bg-gray-300 rounded"></div>
      ))}
    </div>
    <div className="space-y-2 mb-6">
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
    <div className="flex items-center">
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
      <div>
        <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
        <div className="h-3 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  </div>
)

interface BlogPost {
  id: string;
  name: string;
  slug: string;
  featuredImage: string;
  postSummary: string;
  publishDate: string;
}

// Utility function to strip HTML tags and decode entities
const stripHtml = (html: string): string => {
  if (!html) return '';
  // Remove HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, '');
  // Decode common HTML entities
  const decoded = withoutTags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return decoded.trim();
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [articles, setArticles] = useState<BlogPost[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)

  // Contact form state
  const [contactForm, setContactForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    message: '',
    preferredContact: 'email' as 'phone' | 'email' | 'text',
    timePreference: '',
    isEmergency: false,
  })
  const [contactFormSubmitting, setContactFormSubmitting] = useState(false)
  const [contactFormMessage, setContactFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setArticlesLoading(true)
        const response = await fetch('/api/hubspot/blog?limit=6')
        const data = await response.json()

        if (data.success && data.data) {
          setArticles(data.data.results)
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error)
      } finally {
        setArticlesLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear any previous messages
    setContactFormMessage(null)
    setContactFormSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      })

      const data = await response.json()

      if (data.success) {
        setContactFormMessage({
          type: 'success',
          text: 'Thank you for contacting us! We\'ll be in touch soon.',
        })
        // Reset form
        setContactForm({
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          message: '',
          preferredContact: 'email',
          timePreference: '',
          isEmergency: false,
        })
      } else {
        setContactFormMessage({
          type: 'error',
          text: data.error || 'Failed to submit form. Please try again.',
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setContactFormMessage({
        type: 'error',
        text: 'An error occurred. Please try again later.',
      })
    } finally {
      setContactFormSubmitting(false)
    }
  }

  const services = [
    "Roofing",
    "Siding and Gutters",
    "Commercial",
    "Churches & Institutions",
    "Historical Restoration",
    "Masonry",
    "Windows",
    "Skylights",
  ]

  // Map service names to slugs for navigation
  const serviceSlugMap: Record<string, string> = {
    "Roofing": "roofing",
    "Siding and Gutters": "siding-and-gutters",
    "Commercial": "commercial",
    "Churches & Institutions": "churches-institutions",
    "Historical Restoration": "historical-restoration",
    "Masonry": "masonry",
    "Windows": "windows",
    "Skylights": "skylights",
  }

  // Map service names to card images
  const serviceImageMap: Record<string, string> = {
    "Roofing": "/images/services/service cards/roofing-card.jpg",
    "Siding and Gutters": "/images/services/service cards/siding-gutters-card.jpg",
    "Commercial": "/images/services/service cards/commercial-card.jpg",
    "Churches & Institutions": "/images/services/service cards/church-institutions-card.jpg",
    "Historical Restoration": "/images/services/service cards/historical-restoration-card.jpg",
    "Masonry": "/images/services/service cards/masonry-card.jpg",
    "Windows": "/images/services/service cards/windows-card.jpg",
    "Skylights": "/images/services/service cards/skylight-card.jpg",
  }

  const testimonials = [
    {
      text: "Russell Roofing exceeded our expectations. The team was professional, efficient, and the quality of work was outstanding. Our new roof looks amazing and we couldn't be happier with the service.",
      name: "Sarah Johnson",
      title: "Property Owner",
    },
    {
      text: "From start to finish, Russell Roofing provided exceptional service. They were transparent about pricing, completed the work on time, and cleaned up thoroughly. Highly recommended!",
      name: "Michael Chen",
      title: "Property Owner",
    },
    {
      text: "Professional, reliable, and honest. They completed our roofing project on time and within budget. The attention to detail was impressive and the results speak for themselves.",
      name: "Jennifer Martinez",
      title: "Property Owner",
    },
    {
      text: "Excellent communication throughout the entire process. The crew was respectful of our property and delivered quality workmanship. We're extremely satisfied with our new siding.",
      name: "David Thompson",
      title: "Property Owner",
    },
    {
      text: "Russell Roofing transformed our historic home while preserving its character. Their expertise in restoration work is unmatched. Truly a professional organization.",
      name: "Lisa Anderson",
      title: "Property Owner",
    },
    {
      text: "Outstanding customer service and craftsmanship. They handled our commercial roofing project with precision and completed it ahead of schedule. Highly recommend their services.",
      name: "Robert Wilson",
      title: "Business Owner",
    },
  ]


  return (
    <div className="min-h-screen bg-light-grey">
      {/* Dynamic Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? "bg-primary-red shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex items-center h-16">
            {/* Logo - Aligned with hero headline */}
            <div className="flex-shrink-0">
              <Image
                src="/rrlogo-white.svg"
                alt="Russell Roofing & Exteriors"
                width={180}
                height={40}
                className="h-10 w-auto"
              />
            </div>

            {/* Desktop Navigation - Centered with flex-grow */}
            <nav className="hidden md:flex space-x-8 flex-grow justify-center">
              <a href="#" className="text-white font-inter hover:text-accent-yellow transition-colors">
                Home
              </a>
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
                href="/community"
                className="text-white font-inter hover:text-accent-yellow transition-colors"
              >
                Community
              </Link>
              <Link
                href="/careers"
                className="text-white font-inter hover:text-accent-yellow transition-colors"
              >
                Careers
              </Link>
            </nav>

            {/* Desktop Contact Us Button - Aligned with hero CTA */}
            <Link
              href="/contact"
              className={`hidden md:block px-6 py-2 rounded-full font-inter font-medium transition-all duration-300 flex-shrink-0 ${
                isScrolled
                  ? "bg-white text-primary-red hover:bg-gray-100"
                  : "border-2 border-white text-white hover:bg-white hover:text-primary-red"
              }`}
            >
              Contact Us
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
                <a href="#" className="block px-3 py-2 text-white font-inter hover:bg-red-800 rounded">
                  Home
                </a>
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
                  href="/community"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-white font-inter hover:bg-red-800 rounded"
                >
                  Community
                </Link>
                <Link
                  href="/careers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-white font-inter hover:bg-red-800 rounded"
                >
                  Careers
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full mt-2 bg-white text-primary-red px-6 py-2 rounded-full font-inter font-medium block text-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-[1280px] mx-auto bg-white shadow-lg">
        {/* Hero Section - Video Background */}
        <section className="pt-16 md:pt-0 pb-6">
          <div className="relative h-[500px] md:h-[600px] rounded-b-xl overflow-hidden shadow-xl mx-4 sm:mx-6 lg:mx-8">
            {/* Video Background */}
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                console.error('Video failed to load:', e);
                // Hide video element and show fallback
                e.currentTarget.style.display = 'none';
              }}
            >
              <source src="/videos/russell-v2-full.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Fallback image - always present in case video fails */}
            <Image
              src="/placeholder.svg?height=600&width=1280"
              alt="Beautiful residential home roofline"
              fill
              className="object-cover"
              style={{ zIndex: -1 }}
            />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Content positioned at bottom with perfect alignment */}
            <div className="absolute bottom-0 left-0 right-0 px-8 sm:px-12 lg:px-16 pb-4 sm:pb-6 lg:pb-8">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                {/* Text content - bottom left, perfectly aligned with header logo */}
                <div className="flex-1">
                  <h1 className="font-skolar text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    Russell Roofing & Exteriors
                  </h1>
                  <p className="font-inter text-lg md:text-xl text-white max-w-2xl drop-shadow-md">
                    Trusted, Hassle-Free Property Solutions Tailored For You.
                  </p>
                </div>

                {/* CTA Button - bottom right, aligned with header contact button */}
                <Link
                  href="/estimate"
                  className="bg-primary-red text-white px-6 py-2 rounded-full font-inter font-medium inline-flex items-center gap-2 hover:bg-opacity-90 transition-colors whitespace-nowrap shadow-lg"
                >
                  Request Estimate
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="about" className="bg-dark-grey py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-skolar text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">
              Why Choose Us
            </h2>
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white p-6 rounded-lg text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Licensed & Insured Card */}
                <div className="flip-card h-[220px]" style={{ perspective: "1000px" }}>
                  <div className="flip-card-inner relative w-full h-full transition-transform duration-700" style={{ transformStyle: "preserve-3d" }}>
                    {/* Front */}
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Shield className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">Licensed & Insured</h3>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <p className="font-inter text-gray-600 text-center">
                        Fully licensed and insured for your peace of mind and protection. Your investment is secure with us.
                      </p>
                    </div>
                  </div>
                </div>

                {/* On-Time Service Card */}
                <div className="flip-card h-[220px]" style={{ perspective: "1000px" }}>
                  <div className="flip-card-inner relative w-full h-full transition-transform duration-700" style={{ transformStyle: "preserve-3d" }}>
                    {/* Front */}
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Clock className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">On-Time Service</h3>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <p className="font-inter text-gray-600 text-center">
                        We respect your time and always deliver projects on schedule. Punctuality is part of our commitment to excellence.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expert Team Card */}
                <div className="flip-card h-[220px]" style={{ perspective: "1000px" }}>
                  <div className="flip-card-inner relative w-full h-full transition-transform duration-700" style={{ transformStyle: "preserve-3d" }}>
                    {/* Front */}
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Users className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">Expert Team</h3>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <p className="font-inter text-gray-600 text-center">
                        Skilled professionals with years of industry experience. Our team brings expertise to every project.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quality Materials Card */}
                <div className="flip-card h-[220px]" style={{ perspective: "1000px" }}>
                  <div className="flip-card-inner relative w-full h-full transition-transform duration-700" style={{ transformStyle: "preserve-3d" }}>
                    {/* Front */}
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Award className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">Quality Materials</h3>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <p className="font-inter text-gray-600 text-center">
                        We use only the highest quality materials for lasting results. Your project deserves the best.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warranty Backed Card */}
                <div className="flip-card h-[220px]" style={{ perspective: "1000px" }}>
                  <div className="flip-card-inner relative w-full h-full transition-transform duration-700" style={{ transformStyle: "preserve-3d" }}>
                    {/* Front */}
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Wrench className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">Warranty Backed</h3>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <p className="font-inter text-gray-600 text-center">
                        All work comes with comprehensive warranty coverage. We stand behind every project we complete.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5-Star Service Card */}
                <div className="flip-card h-[220px]" style={{ perspective: "1000px" }}>
                  <div className="flip-card-inner relative w-full h-full transition-transform duration-700" style={{ transformStyle: "preserve-3d" }}>
                    {/* Front */}
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Star className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">5-Star Service</h3>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <p className="font-inter text-gray-600 text-center">
                        Consistently rated 5 stars by satisfied customers. Your satisfaction is our top priority.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Our Services Section with Swiper */}
        <section id="services" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey text-center mb-8 md:mb-12">
              Our Services
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="relative">
                {/* Navigation Buttons */}
                <button className="services-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-light-grey hover:bg-gray-300 transition-colors shadow-md">
                  <ChevronLeft className="w-6 h-6 text-dark-grey" />
                </button>
                <button className="services-next absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-light-grey hover:bg-gray-300 transition-colors shadow-md">
                  <ChevronRight className="w-6 h-6 text-dark-grey" />
                </button>

                {/* Services Swiper */}
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    prevEl: ".services-prev",
                    nextEl: ".services-next",
                  }}
                  spaceBetween={20}
                  slidesPerView={1.5}
                  centeredSlides={true}
                  loop={true}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 30,
                    },
                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 30,
                    },
                  }}
                  className="services-swiper"
                >
                  {services.map((service, index) => (
                    <SwiperSlide key={service}>
                      {({ isActive }) => (
                        <div
                          className={`text-center transition-transform duration-300 ${
                            isActive ? "transform scale-110" : "transform scale-100"
                          }`}
                        >
                          <Link href={`/services/${serviceSlugMap[service]}`}>
                            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                              <Image
                                src={serviceImageMap[service]}
                                alt={`${service} services`}
                                width={200}
                                height={150}
                                className="rounded-lg mb-4 mx-auto w-full h-32 object-cover"
                              />
                              <h3 className="font-inter font-semibold text-dark-grey text-lg">{service}</h3>
                            </div>
                          </Link>
                        </div>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </section>

        {/* Associations Section */}
        <AssociationsSlider />

        {/* Client Testimonials Auto-Playing Carousel with Pause on Hover */}
        <section id="testimonials" className="bg-cream py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey text-center mb-8 md:mb-12">
              Client Testimonials
            </h2>
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <TestimonialSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="relative">
                {/* Auto-playing Testimonials Swiper with Pause on Hover */}
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  spaceBetween={30}
                  slidesPerView={1}
                  loop={true}
                  breakpoints={{
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 30,
                    },
                  }}
                  className="testimonials-swiper"
                >
                  {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={index}>
                      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-accent-yellow fill-current" />
                          ))}
                        </div>
                        <p className="font-inter text-gray-600 text-lg mb-6 italic">&ldquo;{testimonial.text}&rdquo;</p>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                          <div>
                            <h4 className="font-inter font-semibold text-dark-grey">{testimonial.name}</h4>
                            <p className="font-inter text-gray-500">{testimonial.title}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </section>

        {/* Popular Articles Swiper Section */}
        <section id="articles" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey text-center mb-8 md:mb-12">
              Popular Articles
            </h2>
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="relative">
                {/* Navigation Buttons */}
                <button className="articles-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-light-grey hover:bg-gray-300 transition-colors shadow-md">
                  <ChevronLeft className="w-6 h-6 text-dark-grey" />
                </button>
                <button className="articles-next absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-light-grey hover:bg-gray-300 transition-colors shadow-md">
                  <ChevronRight className="w-6 h-6 text-dark-grey" />
                </button>

                {/* Articles Swiper */}
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    prevEl: ".articles-prev",
                    nextEl: ".articles-next",
                  }}
                  spaceBetween={20}
                  slidesPerView={1}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 30,
                    },
                  }}
                  className="articles-swiper"
                >
                  {articles.map((article) => (
                    <SwiperSlide key={article.id}>
                      <Link href={`/news/${article.slug}`}>
                        <article className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                          <div className="relative w-full h-48">
                            <Image
                              src={article.featuredImage || '/placeholder.svg?height=200&width=350'}
                              alt={article.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg?height=200&width=350';
                              }}
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="font-display text-xl font-semibold text-text-primary mb-3 line-clamp-2">{article.name}</h3>
                            <p className="font-body text-text-secondary mb-4 line-clamp-3">{stripHtml(article.postSummary)}</p>
                            <span className="inline-flex items-center font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors">
                              Read More
                              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </article>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="font-inter text-gray-600 text-lg">No articles available at this time.</p>
              </div>
            )}
          </div>
        </section>

        {/* Instagram Section with Lightbox */}
        <section className="bg-light-grey py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey mb-2">Follow Us on Instagram</h2>
              <p className="font-inter text-gray-600 text-lg">@russellroofingcompany</p>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse aspect-square bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="relative aspect-square group cursor-pointer transform hover:scale-105 transition-transform duration-300"
                    onClick={() =>
                      setLightboxImage(
                        `/placeholder.svg?height=800&width=800&query=roofing work instagram post ${index + 1}`,
                      )
                    }
                  >
                    <Image
                      src={`/placeholder.svg?height=200&width=200&query=roofing work instagram post ${index + 1}`}
                      alt={`Instagram post ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Hiring Section */}
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey mb-6">We&rsquo;re Hiring!</h2>
            <p className="font-inter text-gray-600 text-lg mb-8 md:mb-12 max-w-4xl mx-auto">
              Interested in a new career opportunity? Are you looking for a rewarding position with longevity and
              growth? Please email your resume to info@russellroofing.com!
            </p>
            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-white p-6 md:p-8 rounded-lg shadow-md border-t-4 border-gray-300"
                  >
                    <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {/* Foreman Card */}
                <div className="flip-card h-[220px]" style={{ perspective: "1000px" }}>
                  <div className="flip-card-inner relative w-full h-full transition-transform duration-700" style={{ transformStyle: "preserve-3d" }}>
                    {/* Front */}
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <HardHat className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">FOREMAN</h3>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <p className="font-inter text-gray-600 text-center mb-6">
                        Lead construction teams and ensure project quality standards.
                      </p>
                      <Link
                        href="/careers"
                        className="px-6 py-2 rounded-full font-inter font-medium bg-white text-primary-red border-2 border-primary-red hover:bg-primary-red hover:text-white transition-all duration-300"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Superintendent Card */}
                <div className="flip-card h-[220px]" style={{ perspective: "1000px" }}>
                  <div className="flip-card-inner relative w-full h-full transition-transform duration-700" style={{ transformStyle: "preserve-3d" }}>
                    {/* Front */}
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <ClipboardCheck className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">SUPERINTENDENT</h3>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <p className="font-inter text-gray-600 text-center mb-6">
                        Oversee multiple projects and coordinate with clients and teams.
                      </p>
                      <Link
                        href="/careers"
                        className="px-6 py-2 rounded-full font-inter font-medium bg-white text-primary-red border-2 border-primary-red hover:bg-primary-red hover:text-white transition-all duration-300"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Roofing Laborer Card */}
                <div className="flip-card h-[220px]" style={{ perspective: "1000px" }}>
                  <div className="flip-card-inner relative w-full h-full transition-transform duration-700" style={{ transformStyle: "preserve-3d" }}>
                    {/* Front */}
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Hammer className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">ROOFING LABORER</h3>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <p className="font-inter text-gray-600 text-center mb-6">
                        Join our skilled team and learn the roofing trade.
                      </p>
                      <Link
                        href="/careers"
                        className="px-6 py-2 rounded-full font-inter font-medium bg-white text-primary-red border-2 border-primary-red hover:bg-primary-red hover:text-white transition-all duration-300"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <style jsx>{`
          .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
          }
        `}</style>

        {/* Get In Touch Section */}
        <section id="contact" className="bg-cream py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Contact Form */}
              <div>
                <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey mb-8">Get In Touch</h2>

                {/* Success/Error Message */}
                {contactFormMessage && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      contactFormMessage.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {contactFormMessage.text}
                  </div>
                )}

                <form onSubmit={handleContactFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstname"
                      placeholder="First Name"
                      value={contactForm.firstname}
                      onChange={(e) => setContactForm({ ...contactForm, firstname: e.target.value })}
                      required
                      disabled={contactFormSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary-red transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Last Name"
                      value={contactForm.lastname}
                      onChange={(e) => setContactForm({ ...contactForm, lastname: e.target.value })}
                      required
                      disabled={contactFormSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary-red transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    disabled={contactFormSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary-red transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    required
                    disabled={contactFormSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary-red transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    disabled={contactFormSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary-red resize-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  ></textarea>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm font-medium text-dark-grey mb-2 font-inter">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-4">
                      {['phone', 'email', 'text'].map((method) => (
                        <label key={method} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value={method}
                            checked={contactForm.preferredContact === method}
                            onChange={(e) => setContactForm({ ...contactForm, preferredContact: e.target.value as 'phone' | 'email' | 'text' })}
                            disabled={contactFormSubmitting}
                            className="mr-2 text-primary-red focus:ring-primary-red disabled:opacity-50"
                          />
                          <span className="font-inter capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Time Preference */}
                  <div>
                    <label htmlFor="timePreference" className="block text-sm font-medium text-dark-grey mb-2 font-inter">
                      Best Time to Contact
                    </label>
                    <select
                      id="timePreference"
                      name="timePreference"
                      value={contactForm.timePreference}
                      onChange={(e) => setContactForm({ ...contactForm, timePreference: e.target.value })}
                      disabled={contactFormSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary-red transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a time</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                      <option value="anytime">Anytime</option>
                    </select>
                  </div>

                  {/* Emergency Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isEmergency"
                      name="isEmergency"
                      checked={contactForm.isEmergency}
                      onChange={(e) => setContactForm({ ...contactForm, isEmergency: e.target.checked })}
                      disabled={contactFormSubmitting}
                      className="w-4 h-4 text-primary-red border-gray-300 rounded focus:ring-primary-red disabled:opacity-50"
                    />
                    <label htmlFor="isEmergency" className="ml-2 text-sm font-inter text-dark-grey">
                      This is an emergency repair request
                    </label>
                  </div>

                  {contactForm.isEmergency && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-800 font-medium font-inter">
                          Emergency Request - We&apos;ll prioritize your message and respond ASAP
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={contactFormSubmitting}
                    className="bg-dark-grey text-white px-8 py-3 rounded-lg font-inter font-medium hover:bg-opacity-90 transition-colors transform hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {contactFormSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Contact Image */}
              <div className="order-first lg:order-last">
                <Image
                  src="/images/contact/get-in-touch.jpg"
                  alt="Modern home exterior"
                  width={600}
                  height={500}
                  className="rounded-lg shadow-lg w-full h-auto hover:shadow-xl transition-shadow duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Footer Section */}
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
                  {services.slice(0, 6).map((service) => (
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
                      href="/about"
                      className="font-inter text-gray-300 text-sm hover:text-white transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="font-inter text-gray-300 text-sm hover:text-white transition-colors">
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="font-inter text-gray-300 text-sm hover:text-white transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/estimate"
                      className="font-inter text-gray-300 text-sm hover:text-white transition-colors"
                    >
                      Get Estimate
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#testimonials"
                      onClick={(e) => {
                        e.preventDefault()
                        smoothScrollTo("testimonials")
                      }}
                      className="font-inter text-gray-300 text-sm hover:text-white transition-colors"
                    >
                      Reviews
                    </a>
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
      </div>

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <Image
              src={lightboxImage || "/placeholder.svg"}
              alt="Lightbox image"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}