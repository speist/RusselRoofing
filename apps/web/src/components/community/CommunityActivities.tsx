'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CommunityActivity } from '@/lib/hubspot/community';

// Utility function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Utility function to extract video thumbnail URL
const getVideoThumbnail = (url: string): string => {
  if (!url) return url;

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      const videoId = match[1];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }

  // Vimeo patterns
  const vimeoPatterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/
  ];

  for (const pattern of vimeoPatterns) {
    const match = url.match(pattern);
    if (match) {
      const videoId = match[1];
      return `https://vumbnail.com/${videoId}.jpg`;
    }
  }

  // Return original URL if not a video (fallback to regular image)
  return url;
};

interface CommunityActivitiesProps {
  initialActivities?: CommunityActivity[];
}

export default function CommunityActivities({ initialActivities = [] }: CommunityActivitiesProps) {
  return (
    <section className="py-16 md:py-24 bg-[#F5F3F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Community <span className="text-[#960120]">Involvement</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We believe in giving back to the communities that have supported us.
            Here&apos;s how we&apos;re making a positive impact beyond roofing.
          </p>
        </div>

        {/* Community Activities Grid */}
        {initialActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {initialActivities.map((activity) => {
              const slug = activity.properties.slug || generateSlug(activity.properties.name);
              const imageUrl = activity.properties.image_url || '';
              const thumbnailUrl = imageUrl ? getVideoThumbnail(imageUrl) : '';

              // Debug logging
              if (process.env.NODE_ENV === 'development') {
                console.log('Community Activity:', {
                  name: activity.properties.name,
                  original_url: imageUrl,
                  thumbnail_url: thumbnailUrl
                });
              }

              return (
              <Link
                key={activity.id}
                href={`/community/${slug}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
              >
                {/* Activity Image/Thumbnail */}
                {thumbnailUrl && (
                  <div className="aspect-[16/9] bg-gray-200 overflow-hidden">
                    <Image
                      src={thumbnailUrl}
                      alt={activity.properties.name}
                      className="w-full h-full object-cover"
                      width={400}
                      height={225}
                      onError={(e) => {
                        console.error('Image failed to load:', thumbnailUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {activity.properties.name}
                    </h3>
                    {activity.properties.year && (
                      <span className="bg-[#960120] text-white px-2 py-1 rounded text-sm font-semibold">
                        {activity.properties.year}
                      </span>
                    )}
                  </div>

                  {activity.properties.description && (
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {activity.properties.description}
                    </p>
                  )}

                  {/* Impact */}
                  {activity.properties.impact && (
                    <div className="bg-[#F5F3F0] p-4 rounded-lg border-l-4 border-[#960120]">
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        Impact
                      </div>
                      <div className="text-sm text-gray-700">
                        {activity.properties.impact}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Check back soon for updates on our community involvement activities.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
