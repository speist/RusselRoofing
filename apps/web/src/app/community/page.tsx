import React from 'react';
import { Metadata } from 'next';
import FloatingPageLayout from '@/components/layout/FloatingPageLayout';
import CommunityHero from '@/components/community/CommunityHero';
import CommunityActivities from '@/components/community/CommunityActivities';
import { hubspotService } from '@/lib/hubspot/api';

export const metadata: Metadata = {
  title: 'Community Involvement | Russell Roofing & Exteriors',
  description: 'Learn about Russell Roofing\'s commitment to giving back to the community. Discover our partnerships, volunteer work, and community support programs.',
  keywords: 'Russell Roofing community, community involvement, Habitat for Humanity, local support, Philadelphia community',
  openGraph: {
    title: 'Community Involvement - Russell Roofing & Exteriors',
    description: 'Making a positive impact beyond roofing. See how we give back to the communities that have supported us.',
    type: 'website',
  },
};

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function CommunityPage() {
  // Fetch community activities on the server
  const activitiesResponse = await hubspotService.getCommunityActivities({ liveOnly: true });
  const initialActivities = activitiesResponse.success && activitiesResponse.data ? activitiesResponse.data.results : [];

  return (
    <FloatingPageLayout>
      <CommunityHero />
      <CommunityActivities initialActivities={initialActivities} />
    </FloatingPageLayout>
  );
}
