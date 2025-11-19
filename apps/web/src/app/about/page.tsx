import React from 'react';
import { Metadata } from 'next';
import FloatingPageLayout from '@/components/layout/FloatingPageLayout';
import AboutHero from '@/components/about/AboutHero';
import MissionSection from '@/components/about/MissionSection';
import TeamSection from '@/components/about/TeamSection';
import CompanyHistory from '@/components/about/CompanyHistory';
import CertificationsSection from '@/components/about/CertificationsSection';
import QualityMaterialsSlider from '@/components/about/QualityMaterialsSlider';

export const metadata: Metadata = {
  title: 'About Us - Russell Roofing | Expert Roofing Services in New Jersey',
  description: 'Learn about Russell Roofing\'s history, experienced team, and commitment to quality roofing services. Serving New Jersey homeowners with trust and expertise since our founding.',
  keywords: 'Russell Roofing about, New Jersey roofing company, roofing contractors, company history, roofing team',
  openGraph: {
    title: 'About Russell Roofing - Your Trusted New Jersey Roofing Experts',
    description: 'Discover our company\'s story, meet our experienced team, and learn why homeowners trust Russell Roofing for their roofing needs.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <FloatingPageLayout>
      <AboutHero />
      <MissionSection />
      <TeamSection />
      <CompanyHistory />
      <CertificationsSection />
      <QualityMaterialsSlider />
    </FloatingPageLayout>
  );
}