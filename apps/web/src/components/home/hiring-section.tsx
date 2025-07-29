"use client";

import React from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

interface JobPosition {
  title: string;
  department?: string;
  type?: 'full-time' | 'part-time';
}

const positions: JobPosition[] = [
  { title: 'FOREMAN' },
  { title: 'SUPERINTENDENT' },
  { title: 'ROOFING LABORER' }
];

interface JobPositionCardProps {
  position: JobPosition;
  className?: string;
}

const JobPositionCard: React.FC<JobPositionCardProps> = ({ position, className }) => {
  return (
    <Card 
      variant="default" 
      hover 
      className={cn("h-full transition-all duration-300", className)}
    >
      <CardHeader className="text-center">
        <CardTitle className="text-h4 font-display text-primary-burgundy">
          {position.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Button 
          variant="primary" 
          size="default"
          onClick={() => window.location.href = `mailto:info@russellroofing.com?subject=Job Application: ${position.title}`}
          className="w-full"
        >
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
};

interface HiringSectionProps {
  className?: string;
}

export const HiringSection: React.FC<HiringSectionProps> = ({ className }) => {
  return (
    <section 
      className={cn(
        "w-full py-16 px-4 bg-background-light",
        className
      )}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-h2 font-display text-primary-burgundy mb-6">
            We&rsquo;re Hiring!
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-body text-text-primary leading-relaxed">
              Join the Russell Roofing team and become part of a company that values 
              quality craftsmanship, professional growth, and team collaboration. 
              We&rsquo;re looking for dedicated professionals to help us continue delivering 
              exceptional roofing solutions to our community.
            </p>
            <p className="text-body text-text-secondary">
              Ready to build your career with us? Send your resume and get started today.
            </p>
          </div>
        </div>

        {/* Job Positions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {positions.map((position, index) => (
            <JobPositionCard 
              key={index} 
              position={position}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-background-white rounded-card p-8 shadow-card">
          <h3 className="text-h3 font-display text-primary-charcoal mb-4">
            Ready to Apply?
          </h3>
          <p className="text-body text-text-secondary mb-6 max-w-2xl mx-auto">
            Send us your resume and let us know which position interests you most. 
            We&rsquo;ll get back to you promptly to discuss opportunities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => window.location.href = 'mailto:info@russellroofing.com?subject=Job Application - Russell Roofing Career Opportunity'}
            >
              Email Us
            </Button>
            <a 
              href="mailto:info@russellroofing.com" 
              className="text-primary-burgundy hover:text-primary-burgundy/80 transition-colors text-body font-medium"
            >
              info@russellroofing.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};