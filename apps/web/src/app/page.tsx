import { Hero } from "@/components/sections/Hero";
import { ServicesSection } from "@/components/home/services-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { InstagramSection } from "@/components/home/instagram-section";
import { LatestArticlesSection } from "@/components/home/latest-articles-section";
import { CTASection } from "@/components/home/cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <TestimonialsSection />
      <InstagramSection />
      <LatestArticlesSection />
      <CTASection />
    </>
  );
}