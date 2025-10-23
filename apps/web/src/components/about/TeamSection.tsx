'use client';

import React from 'react';
import Image from 'next/image';
import { companyInfo } from '@/data/about';
import type { TeamMember } from '@/data/about';

interface TeamMemberCardProps {
  member: TeamMember;
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition-transform hover:scale-105">
      {/* Photo */}
      <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
        <Image
          src={member.image}
          alt={`${member.name} - ${member.title}`}
          className="w-full h-full object-cover"
          width={300}
          height={225}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {member.name}
        </h3>

        <p className="text-[#960120] font-semibold mb-4">
          {member.title}
        </p>

        <p className="text-gray-700 mb-4 leading-relaxed">
          {member.bio}
        </p>

        {/* Contact Info */}
        {(member.email || member.phone) && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="text-sm text-[#960120] hover:underline"
                >
                  {member.email}
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="text-sm text-[#960120] hover:underline"
                >
                  {member.phone}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamSection() {
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

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companyInfo.team.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>

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