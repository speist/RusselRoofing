'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Mail } from 'lucide-react';

interface Career {
  id: string;
  properties: {
    job_title: string;
    department?: string;
    location?: string;
    employment_type?: string;
    experience_level?: string;
    salary_range?: string;
    job_description?: string;
    key_responsibilities?: string;
    requirements?: string;
    live: string;
  };
}

interface JobListingsProps {
  initialJobs?: Career[];
}

export default function JobListings({ initialJobs = [] }: JobListingsProps) {
  const [jobs, setJobs] = useState<Career[]>(initialJobs);
  const [loading, setLoading] = useState(!initialJobs.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we don't have initial jobs
    if (initialJobs.length > 0) {
      return;
    }

    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/hubspot/careers?liveOnly=true');
        const data = await response.json();

        if (data.success && data.data) {
          setJobs(data.data.results);
        } else {
          setError(data.error || 'Failed to load job postings');
        }
      } catch (err) {
        console.error('Error fetching careers:', err);
        setError('Unable to load job postings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [initialJobs.length]);

  // Helper function to strip HTML tags from text
  const stripHtml = (html: string): string => {
    // Replace common HTML entities
    let text = html
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");

    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, '');

    return text;
  };

  // Helper function to parse comma or newline separated strings into arrays
  const parseList = (text?: string): string[] => {
    if (!text) return [];

    // First strip any HTML tags
    const cleanText = stripHtml(text);

    // Split by newline or comma, trim whitespace, filter empty strings
    return cleanText
      .split(/[\n,]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  if (loading) {
    return (
      <section id="open-positions" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Current Openings
            </h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-burgundy mb-4"></div>
              <p className="font-body text-text-secondary">Loading job postings...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="open-positions" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Current Openings
            </h2>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="font-body text-red-800">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section id="open-positions" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Current Openings
            </h2>
          </div>
          <div className="bg-background-light rounded-lg p-12 text-center">
            <h3 className="font-display text-xl font-semibold text-text-primary mb-4">
              No Open Positions at This Time
            </h3>
            <p className="font-body text-text-secondary mb-6">
              We don&rsquo;t have any open positions right now, but we&rsquo;re always looking for talented individuals to join our team.
            </p>
            <p className="font-body text-text-secondary">
              Please check back soon or send us your resume for future opportunities.
            </p>
            <div className="mt-8">
              <a
                href="mailto:info@russellroofing.com?subject=Future Employment Opportunities"
                className="inline-flex items-center bg-primary-burgundy text-white px-6 py-3 rounded-lg font-body font-medium hover:bg-primary-charcoal transition-colors"
              >
                Submit Your Resume
                <Mail className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="open-positions" className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Current Openings
          </h2>
          <p className="font-body text-text-secondary max-w-3xl mx-auto">
            Explore our current job opportunities and take the next step in your career with Russell Roofing & Exteriors.
          </p>
        </div>

        <div className="space-y-8">
          {jobs.map((job) => {
            const responsibilities = parseList(job.properties.key_responsibilities);
            const requirements = parseList(job.properties.requirements);

            return (
              <div key={job.id} className="bg-background-light rounded-lg p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                      {job.properties.job_title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-4">
                      {job.properties.location && (
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.properties.location}
                        </span>
                      )}
                      {job.properties.employment_type && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.properties.employment_type}
                        </span>
                      )}
                      {job.properties.salary_range && (
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.properties.salary_range}
                        </span>
                      )}
                    </div>
                    {job.properties.job_description && (
                      <p className="font-body text-text-secondary mb-6">
                        {job.properties.job_description}
                      </p>
                    )}
                  </div>
                  <div className="lg:ml-8">
                    <a
                      href={`mailto:info@russellroofing.com?subject=Job Application - ${job.properties.job_title}`}
                      className="inline-flex items-center bg-primary-burgundy text-white px-6 py-3 rounded-lg font-body font-medium hover:bg-primary-charcoal transition-colors whitespace-nowrap"
                    >
                      Apply Now
                      <Mail className="ml-2 w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {responsibilities.length > 0 && (
                    <div>
                      <h4 className="font-display text-lg font-semibold text-text-primary mb-3">
                        Key Responsibilities
                      </h4>
                      <ul className="font-body text-text-secondary space-y-2">
                        {responsibilities.map((responsibility, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {requirements.length > 0 && (
                    <div>
                      <h4 className="font-display text-lg font-semibold text-text-primary mb-3">
                        Requirements
                      </h4>
                      <ul className="font-body text-text-secondary space-y-2">
                        {requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
