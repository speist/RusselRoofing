import { Hero } from "@/components/sections/Hero";
import { InstagramFeed, HiringSection, TestimonialsCarousel } from "@/components/home";

export default function Home() {
  return (
    <>
      <Hero />
      <InstagramFeed />
      <HiringSection />
      <section className="py-16 lg:py-24 bg-background-secondary">
        <div className="container mx-auto px-4">
          <TestimonialsCarousel />
        </div>
      </section>
      {/* Future sections will be added here */}
    </>
  );
}