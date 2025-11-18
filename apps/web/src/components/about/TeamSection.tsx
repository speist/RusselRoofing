'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { TeamMember as HubSpotTeamMember } from '@/lib/hubspot/api';

interface DisplayTeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  phone?: string;
}

interface TeamMemberCardProps {
  member: DisplayTeamMember;
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition-transform hover:scale-105">
      {/* Photo */}
      <div className="aspect-[4/3] bg-gray-200 overflow-hidden relative">
        {!imageError && member.image ? (
          <Image
            src={member.image}
            alt={`${member.name} - ${member.title}`}
            className="w-full h-full object-cover"
            width={300}
            height={225}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {member.name}
        </h3>

        <p className="text-[#960120] font-semibold mb-4">
          {member.title}
        </p>

        {member.bio && (
          <p className="text-gray-700 mb-4 leading-relaxed">
            {member.bio}
          </p>
        )}

        {/* Contact Info */}
        {member.phone && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1">
              <a
                href={`tel:${member.phone}`}
                className="text-sm text-[#960120] hover:underline"
              >
                {member.phone}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<DisplayTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        setLoading(true);
        const response = await fetch('/api/hubspot/team?liveOnly=true');

        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }

        const result = await response.json();

        if (result.success && result.data) {
          // Map HubSpot team members to display format
          const mappedMembers: DisplayTeamMember[] = result.data.results.map((member: HubSpotTeamMember) => ({
            id: member.id,
            name: member.properties.employee_name,
            title: member.properties.employee_title || '',
            bio: member.properties.employee_description || '',
            image: member.properties.employee_photo || '',
            phone: member.properties.employee_phone_number,
          }));

          setTeamMembers(mappedMembers);
        } else {
          throw new Error(result.error || 'Failed to load team members');
        }
      } catch (err) {
        console.error('[TeamSection] Error fetching team members:', err);
        setError(err instanceof Error ? err.message : 'Failed to load team members');
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Meet Our <span className="text-[#960120]">Team</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our experienced professionals are dedicated to providing exceptional roofing services
            and building lasting relationships with our customers.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#960120]"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Team Grid */}
        {!loading && !error && teamMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && teamMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No team members to display at this time.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-[#F5F3F0] p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Work with Our Team?
            </h3>
            <p className="text-gray-700 mb-6">
              Get in touch today to schedule your free consultation and experience 
              the Russell Roofing difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/estimate"
                className="bg-[#960120] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#7a0f1a] transition-colors"
              >
                Get Free Estimate
              </a>
              <a
                href="/contact"
                className="border border-[#960120] text-[#960120] px-8 py-3 rounded-lg font-semibold hover:bg-[#960120] hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}