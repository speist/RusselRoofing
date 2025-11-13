'use client';

import Link from 'next/link';
import { HardHat, ClipboardCheck, Hammer, Briefcase } from 'lucide-react';

interface Career {
  id: string;
  properties: {
    job_title: string;
    job_description?: string;
    live: string;
  };
}

interface JobOpeningsCardsProps {
  jobs: Career[];
}

// Map job titles to icons
const getJobIcon = (jobTitle: string) => {
  const title = jobTitle.toLowerCase();
  if (title.includes('foreman')) return HardHat;
  if (title.includes('superintendent')) return ClipboardCheck;
  if (title.includes('laborer') || title.includes('roofer')) return Hammer;
  return Briefcase; // Default icon
};

// Truncate description for card display
const truncateDescription = (description: string | undefined, maxLength: number = 100): string => {
  if (!description) return 'Join our team and grow your career with Russell Roofing.';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength).trim() + '...';
};

export default function JobOpeningsCards({ jobs }: JobOpeningsCardsProps) {
  // Limit to first 3 jobs for home page
  const displayJobs = jobs.slice(0, 3);

  if (displayJobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-4">
          No open positions at the moment.
        </p>
        <Link
          href="/careers"
          className="inline-block px-6 py-2 rounded-full font-inter font-medium bg-primary-red text-white hover:bg-[#7a0118] transition-all duration-300"
        >
          Check Careers Page
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {displayJobs.map((job) => {
          const IconComponent = getJobIcon(job.properties.job_title);
          const description = truncateDescription(job.properties.job_description);

          return (
            <div key={job.id} className="flip-card h-[220px] w-full md:w-[calc(33.333%-1.5rem)] max-w-sm" style={{ perspective: "1000px" }}>
              <div className="flip-card-inner relative w-full h-full transition-transform duration-700" style={{ transformStyle: "preserve-3d" }}>
                {/* Front */}
                <div className="flip-card-front absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
                  <IconComponent className="w-16 h-16 text-primary-red mb-4" />
                  <h3 className="font-inter font-bold text-dark-grey text-xl text-center">
                    {job.properties.job_title.toUpperCase()}
                  </h3>
                </div>
                {/* Back */}
                <div className="flip-card-back absolute w-full h-full bg-white rounded-lg shadow-md border-t-4 border-primary-red flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <p className="font-inter text-gray-600 text-center mb-6">
                    {description}
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
          );
        })}
      </div>

      <style jsx>{`
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
}
