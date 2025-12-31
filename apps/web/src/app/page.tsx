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
  Copy,
  Check,
} from "lucide-react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/autoplay"

// Import Components
import AssociationsSlider from "@/components/home/AssociationsSlider"
import QualityMaterialsSlider from "@/components/about/QualityMaterialsSlider"
import { AddressInput } from "@/components/estimate/AddressInput"
import { parseAddressComponents } from "@/lib/hubspot/utils"
import { Review } from "@/types/review"
import { InstagramFeed } from "@/components/home/instagram-feed"

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

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [googleReviews, setGoogleReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [emailCopied, setEmailCopied] = useState(false)
  const email = "info@russellroofing.com"

  const copyEmailToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(email)
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  // Contact form state
  const [contactForm, setContactForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    city: undefined as string | undefined,
    state: undefined as string | undefined,
    zip: undefined as string | undefined,
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

  // Fetch Google Reviews (5-star only)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true)
        const response = await fetch('/api/reviews')
        const data = await response.json()

        if (data.reviews) {
          // Filter for 5-star reviews only
          const fiveStarReviews = data.reviews.filter((review: Review) => review.rating === 5)
          setGoogleReviews(fiveStarReviews)
        }
      } catch (error) {
        console.error('Failed to fetch Google reviews:', error)
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchReviews()
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
          address: '',
          city: undefined,
          state: undefined,
          zip: undefined,
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

        {/* The Art of the Build - Video Section */}
        <section className="bg-cream py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey text-center mb-8 md:mb-12">
              The Art of the Build
            </h2>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl"
                src="https://www.youtube.com/embed/YP0pArYDvaY?rel=0"
                title="Russell Roofing - The Art of the Build"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
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
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Shield className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">Licensed & Insured</h3>
                    </div>
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
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Clock className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">On-Time Service</h3>
                    </div>
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
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Users className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">Expert Team</h3>
                    </div>
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
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Award className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">Quality Materials</h3>
                    </div>
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
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Wrench className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">Warranty Backed</h3>
                    </div>
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
                    <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                      <Star className="w-16 h-16 text-primary-red mb-4" />
                      <h3 className="font-inter font-bold text-dark-grey text-xl">5-Star Service</h3>
                    </div>
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

        {/* Quality Materials Section */}
        <QualityMaterialsSlider />

        {/* Associations Section */}
        <AssociationsSlider />

        {/* Client Testimonials Auto-Playing Carousel with Pause on Hover */}
        <section id="testimonials" className="bg-cream py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey text-center mb-4">
              Client Testimonials
            </h2>
            {/* Google Logo */}
            <div className="flex justify-center mb-4">
              <svg className="w-24 h-8" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
                <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
                <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
                <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
                <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="#4285F4"/>
              </svg>
            </div>
            <p className="text-center text-gray-600 mb-8">
              Please give us your feedback!
            </p>
            {reviewsLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <TestimonialSkeleton key={i} />
                ))}
              </div>
            ) : googleReviews.length > 0 ? (
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
                  loop={googleReviews.length > 2}
                  breakpoints={{
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 30,
                    },
                  }}
                  className="testimonials-swiper"
                >
                  {googleReviews.map((review) => (
                    <SwiperSlide key={review.id}>
                      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-accent-yellow fill-current" />
                          ))}
                        </div>
                        <p className="font-inter text-gray-600 text-lg mb-6 italic line-clamp-4">&ldquo;{review.shortText || review.reviewText}&rdquo;</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center text-gray-500 font-semibold text-lg">
                              {review.customerName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-inter font-semibold text-dark-grey">{review.customerName}</h4>
                              <p className="font-inter text-gray-500 text-sm">Verified Google Review</p>
                            </div>
                          </div>
                          {review.verified && (
                            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <p className="text-center text-gray-500">No reviews available at this time.</p>
            )}
          </div>
        </section>

        {/* Instagram Section - Live Feed from API */}
        <InstagramFeed />

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
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-dark-grey mb-2 font-inter">
                      Property Address
                    </label>
                    <AddressInput
                      value={contactForm.address}
                      onChange={(address, placeDetails) => {
                        // Parse address components from Google Places
                        const { city, state, zip } = parseAddressComponents(placeDetails);
                        setContactForm({
                          ...contactForm,
                          address,
                          city,
                          state,
                          zip
                        });
                      }}
                      placeholder="Enter your property address"
                      disabled={contactFormSubmitting}
                    />
                  </div>
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