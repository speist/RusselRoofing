import type { Metadata } from "next";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import { MapPin, Clock, DollarSign, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | Russell Roofing & Exteriors",
  description: "Join the Russell Roofing team! Explore career opportunities with a leading roofing contractor. We offer competitive benefits, growth opportunities, and a supportive work environment.",
  keywords: "roofing jobs, construction careers, foreman jobs, roofing laborer, superintendent positions, Pennsylvania jobs",
};

const jobOpenings = [
  {
    id: 1,
    title: "FOREMAN",
    department: "Field Operations",
    location: "Oreland, PA",
    type: "Full-time",
    experience: "5+ years",
    salary: "$65,000 - $85,000",
    description: "Lead construction teams and ensure project quality standards. Oversee daily operations, manage crew schedules, and maintain safety protocols on residential and commercial roofing projects.",
    responsibilities: [
      "Supervise and coordinate work crews on roofing projects",
      "Ensure all work meets company quality standards and safety requirements",
      "Communicate with project managers and clients regarding progress",
      "Train and mentor junior team members",
      "Maintain accurate project documentation and reports",
      "Enforce safety protocols and OSHA compliance"
    ],
    requirements: [
      "5+ years of roofing or construction experience",
      "Previous supervisory or leadership experience",
      "Strong knowledge of roofing materials and techniques",
      "Excellent communication and organizational skills",
      "Valid driver's license and reliable transportation",
      "OSHA 10 certification preferred"
    ]
  },
  {
    id: 2,
    title: "SUPERINTENDENT",
    department: "Project Management",
    location: "Oreland, PA",
    type: "Full-time",
    experience: "7+ years",
    salary: "$75,000 - $95,000",
    description: "Oversee multiple projects and coordinate with clients and teams. Manage project timelines, budgets, and ensure successful completion of roofing and exterior projects.",
    responsibilities: [
      "Manage multiple construction projects simultaneously",
      "Coordinate with clients, suppliers, and subcontractors",
      "Develop and maintain project schedules and budgets",
      "Conduct quality inspections and ensure compliance",
      "Resolve project issues and client concerns",
      "Prepare progress reports and documentation"
    ],
    requirements: [
      "7+ years of construction management experience",
      "Strong project management and organizational skills",
      "Experience with commercial and residential projects",
      "Proficiency in project management software",
      "Excellent client communication skills",
      "Bachelor's degree in Construction Management preferred"
    ]
  },
  {
    id: 3,
    title: "ROOFING LABORER",
    department: "Field Operations",
    location: "Oreland, PA",
    type: "Full-time",
    experience: "Entry Level",
    salary: "$18 - $25/hour",
    description: "Join our skilled team and learn the roofing trade. Work alongside experienced professionals on residential and commercial roofing projects while developing your skills.",
    responsibilities: [
      "Assist with roofing installation and repair projects",
      "Load and unload materials and equipment",
      "Maintain clean and organized work sites",
      "Follow safety protocols and wear required PPE",
      "Support foremen and experienced crew members",
      "Participate in ongoing training and skill development"
    ],
    requirements: [
      "Physical ability to work outdoors in various weather conditions",
      "Willingness to learn roofing techniques and safety procedures",
      "Reliable attendance and strong work ethic",
      "Ability to lift 50+ pounds and work at heights",
      "Valid driver's license preferred",
      "Previous construction experience helpful but not required"
    ]
  },
  {
    id: 4,
    title: "ESTIMATOR",
    department: "Sales & Estimating",
    location: "Oreland, PA",
    type: "Full-time",
    experience: "3+ years",
    salary: "$55,000 - $70,000",
    description: "Prepare accurate project estimates and proposals for residential and commercial roofing projects. Work closely with sales team and project managers to ensure profitable project execution.",
    responsibilities: [
      "Conduct on-site measurements and assessments",
      "Prepare detailed project estimates and proposals",
      "Research material costs and labor requirements",
      "Collaborate with sales team on customer presentations",
      "Maintain accurate records and documentation",
      "Support project managers during execution phase"
    ],
    requirements: [
      "3+ years of construction estimating experience",
      "Strong mathematical and analytical skills",
      "Proficiency in estimating software and Microsoft Office",
      "Knowledge of roofing materials and installation methods",
      "Excellent attention to detail and accuracy",
      "Strong communication and presentation skills"
    ]
  }
];

export default function CareersPage() {
  return (
    <FloatingPageLayout>
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/images/careers/careers-hero.jpeg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Join Our Team
          </h1>
          <p className="font-body text-lg md:text-xl text-white max-w-3xl mx-auto mb-8">
            Build your career with a leading roofing contractor. We offer competitive benefits, growth opportunities, and a supportive work environment where your skills can flourish.
          </p>
          <a
            href="#open-positions"
            className="inline-flex items-center bg-white text-primary-burgundy px-8 py-3 rounded-lg font-body font-medium hover:bg-gray-100 transition-colors"
          >
            View Open Positions
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Open Positions */}
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
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-background-light rounded-lg p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-4">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.type}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </span>
                    </div>
                    <p className="font-body text-text-secondary mb-6">
                      {job.description}
                    </p>
                  </div>
                  <div className="lg:ml-8">
                    <a
                      href="mailto:info@russellroofing.com?subject=Job Application - ${job.title}"
                      className="inline-flex items-center bg-primary-burgundy text-white px-6 py-3 rounded-lg font-body font-medium hover:bg-primary-charcoal transition-colors whitespace-nowrap"
                    >
                      Apply Now
                      <Mail className="ml-2 w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-display text-lg font-semibold text-text-primary mb-3">
                      Key Responsibilities
                    </h4>
                    <ul className="font-body text-text-secondary space-y-2">
                      {job.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-text-primary mb-3">
                      Requirements
                    </h4>
                    <ul className="font-body text-text-secondary space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-6">
            How to Apply
          </h2>
          <p className="font-body text-text-secondary mb-8">
            Ready to join our team? We&rsquo;d love to hear from you! Send us your resume and a brief cover letter explaining why you&rsquo;d be a great fit for Russell Roofing & Exteriors.
          </p>
          
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <Mail className="w-12 h-12 text-primary-burgundy mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                  Email Your Resume
                </h3>
                <p className="font-body text-text-secondary mb-4">
                  Send your application materials to:
                </p>
                <a
                  href="mailto:info@russellroofing.com?subject=Job Application"
                  className="font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors"
                >
                  info@russellroofing.com
                </a>
              </div>
              
              <div className="text-center">
                <Phone className="w-12 h-12 text-primary-burgundy mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                  Call Us
                </h3>
                <p className="font-body text-text-secondary mb-4">
                  Have questions? Give us a call:
                </p>
                <a
                  href="tel:+18885677663"
                  className="font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors"
                >
                  1-888-567-7663
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 text-left bg-secondary-light-warm-gray rounded-lg p-6">
            <h3 className="font-display text-lg font-semibold text-text-primary mb-3">
              Application Tips:
            </h3>
            <ul className="font-body text-text-secondary space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Include relevant work experience and certifications
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Mention the specific position you&rsquo;re applying for
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Highlight any safety training or certifications
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-burgundy rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Be sure to include your contact information and availability
              </li>
            </ul>
          </div>
        </div>
      </section>
    </FloatingPageLayout>
  );
}