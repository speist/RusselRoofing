import React from 'react';
import PageNavigation from './PageNavigation';
import { Footer } from './Footer';

interface FloatingPageLayoutProps {
  children: React.ReactNode;
}

export default function FloatingPageLayout({ children }: FloatingPageLayoutProps) {
  return (
    <div className="min-h-screen bg-light-grey">
      <PageNavigation />
      
      {/* Main Content Container with floating design */}
      <div className="max-w-[1280px] mx-auto bg-white shadow-lg">
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}