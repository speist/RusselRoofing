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
} from "lucide-react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/autoplay"

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

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
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

  const articles = [
    {
      title: "Expert Tips for Roof Maintenance",
      description: "Learn essential maintenance tips to extend your roof's lifespan and prevent costly repairs.",
    },
    {
      title: "Choosing the Right Siding Material",
      description: "Compare different siding materials and find the perfect option for your home's style and budget.",
    },
    {
      title: "Storm Damage: What to Look For",
      description: "Identify signs of storm damage and understand the insurance claim process for roof repairs.",
    },
    {
      title: "Energy-Efficient Roofing Solutions",
      description: "Discover how modern roofing materials can help reduce your energy costs and environmental impact.",
    },
    {
      title: "Historic Home Restoration Guide",
      description: "Specialized techniques and materials for preserving the character of historic properties.",
    },
    {
      title: "Commercial Roofing Best Practices",
      description: "Understanding the unique requirements and solutions for commercial roofing projects.",
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
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Perfectly aligned with hero headline */}
            <div className="flex-shrink-0">
              <Image
                src="/rrlogo-white.svg"
                alt="Russell Roofing & Exteriors"
                width={180}
                height={40}
                className="h-10 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
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
                href="/contact"
                className="text-white font-inter hover:text-accent-yellow transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Request Estimate Button - Aligned with hero CTA */}
            <Link
              href="/estimate"
              className={`hidden md:block px-6 py-2 rounded-full font-inter font-medium transition-all duration-300 ${
                isScrolled
                  ? "bg-white text-primary-red hover:bg-gray-100"
                  : "border-2 border-white text-white hover:bg-white hover:text-primary-red"
              }`}
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

      {/* Main Content Container */}
      <div className="max-w-[1280px] mx-auto bg-white shadow-lg">
        {/* Hero Section - Video Background */}
        <section className="pt-16 md:pt-0 px-4 sm:px-6 lg:px-8 pb-6">
          <div className="relative h-[500px] md:h-[600px] rounded-b-xl overflow-hidden shadow-xl">
            {/* Video Background */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
              {/* Fallback image if video doesn't load */}
              <Image
                src="/placeholder.svg?height=600&width=1280"
                alt="Beautiful residential home roofline"
                fill
                className="object-cover"
              />
            </video>
            
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Content positioned at bottom with perfect alignment */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row justify-between items-end gap-4">
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
                className="bg-primary-red text-white px-6 md:px-8 py-3 rounded-full font-inter font-medium inline-flex items-center gap-2 hover:bg-opacity-90 transition-colors whitespace-nowrap shadow-lg"
              >
                Request Estimate
                <ArrowRight className="w-5 h-5" />
              </Link>
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
                <div className="bg-white p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
                  <Shield className="w-12 h-12 text-primary-red mx-auto mb-4" />
                  <h3 className="font-inter font-semibold text-dark-grey text-xl mb-3">Licensed & Insured</h3>
                  <p className="font-inter text-gray-600">
                    Fully licensed and insured for your peace of mind and protection.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
                  <Clock className="w-12 h-12 text-primary-red mx-auto mb-4" />
                  <h3 className="font-inter font-semibold text-dark-grey text-xl mb-3">On-Time Service</h3>
                  <p className="font-inter text-gray-600">
                    We respect your time and always deliver projects on schedule.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
                  <Users className="w-12 h-12 text-primary-red mx-auto mb-4" />
                  <h3 className="font-inter font-semibold text-dark-grey text-xl mb-3">Expert Team</h3>
                  <p className="font-inter text-gray-600">Skilled professionals with years of industry experience.</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
                  <Award className="w-12 h-12 text-primary-red mx-auto mb-4" />
                  <h3 className="font-inter font-semibold text-dark-grey text-xl mb-3">Quality Materials</h3>
                  <p className="font-inter text-gray-600">
                    We use only the highest quality materials for lasting results.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
                  <Wrench className="w-12 h-12 text-primary-red mx-auto mb-4" />
                  <h3 className="font-inter font-semibold text-dark-grey text-xl mb-3">Warranty Backed</h3>
                  <p className="font-inter text-gray-600">All work comes with comprehensive warranty coverage.</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
                  <Star className="w-12 h-12 text-primary-red mx-auto mb-4" />
                  <h3 className="font-inter font-semibold text-dark-grey text-xl mb-3">5-Star Service</h3>
                  <p className="font-inter text-gray-600">Consistently rated 5 stars by satisfied customers.</p>
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
                          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow duration-300">
                            <Image
                              src={`/placeholder.svg?height=150&width=200&query=${service} professional roofing service`}
                              alt={`${service} services`}
                              width={200}
                              height={150}
                              className="rounded-lg mb-4 mx-auto w-full h-32 object-cover"
                            />
                            <h3 className="font-inter font-semibold text-dark-grey text-lg">{service}</h3>
                          </div>
                        </div>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </section>

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
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
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
                  {articles.map((article, index) => (
                    <SwiperSlide key={index}>
                      <article className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                        <Image
                          src={`/placeholder.svg?height=200&width=350&query=${article.title} roofing article professional`}
                          alt={article.title}
                          width={350}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <h3 className="font-inter font-semibold text-dark-grey text-xl mb-3">{article.title}</h3>
                          <p className="font-inter text-gray-600 mb-4">{article.description}</p>
                          <a href="#" className="font-inter text-primary-red font-medium hover:underline">
                            Learn More →
                          </a>
                        </div>
                      </article>
                    </SwiperSlide>
                  ))}
                </Swiper>
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
                <Link href="/careers" className="bg-white p-6 md:p-8 rounded-lg shadow-md border-t-4 border-primary-red hover:shadow-lg transition-shadow duration-300 block">
                  <h3 className="font-inter font-bold text-dark-grey text-xl mb-2">FOREMAN</h3>
                  <p className="font-inter text-gray-600">
                    Lead construction teams and ensure project quality standards.
                  </p>
                </Link>
                <Link href="/careers" className="bg-white p-6 md:p-8 rounded-lg shadow-md border-t-4 border-primary-red hover:shadow-lg transition-shadow duration-300 block">
                  <h3 className="font-inter font-bold text-dark-grey text-xl mb-2">SUPERINTENDENT</h3>
                  <p className="font-inter text-gray-600">
                    Oversee multiple projects and coordinate with clients and teams.
                  </p>
                </Link>
                <Link href="/careers" className="bg-white p-6 md:p-8 rounded-lg shadow-md border-t-4 border-primary-red hover:shadow-lg transition-shadow duration-300 block">
                  <h3 className="font-inter font-bold text-dark-grey text-xl mb-2">ROOFING LABORER</h3>
                  <p className="font-inter text-gray-600">Join our skilled team and learn the roofing trade.</p>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Get In Touch Section */}
        <section id="contact" className="bg-cream py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Contact Form */}
              <div>
                <h2 className="font-skolar text-3xl md:text-4xl font-bold text-dark-grey mb-8">Get In Touch</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary-red transition-all duration-300"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary-red transition-all duration-300"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary-red transition-all duration-300"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary-red transition-all duration-300"
                  />
                  <textarea
                    placeholder="Message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-primary-red resize-none transition-all duration-300"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-dark-grey text-white px-8 py-3 rounded-lg font-inter font-medium hover:bg-opacity-90 transition-colors transform hover:scale-105 duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Image */}
              <div className="order-first lg:order-last">
                <Image
                  src="/placeholder.svg?height=500&width=600"
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

              {/* Column 4 - Service Areas & Certifications */}
              <div>
                <h3 className="font-inter font-semibold text-white text-lg mb-4">Service Areas</h3>
                <ul className="space-y-2 mb-6">
                  <li className="font-inter text-gray-300 text-sm">Philadelphia</li>
                  <li className="font-inter text-gray-300 text-sm">Montgomery County</li>
                  <li className="font-inter text-gray-300 text-sm">Bucks County</li>
                  <li className="font-inter text-gray-300 text-sm">Delaware County</li>
                </ul>

                <h4 className="font-inter font-semibold text-white text-md mb-3">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-accent-blue text-white px-3 py-1 rounded text-xs font-inter">Licensed</div>
                  <div className="bg-accent-green text-white px-3 py-1 rounded text-xs font-inter">Insured</div>
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