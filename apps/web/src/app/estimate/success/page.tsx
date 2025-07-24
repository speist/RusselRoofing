"use client";

import React, { useEffect, useState } from "react";
import { EstimateSuccess, EstimateSuccessData } from "@/components/estimate/success/EstimateSuccess";
import { useRouter } from "next/navigation";

export default function EstimateSuccessPage() {
  const [estimateData, setEstimateData] = useState<EstimateSuccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Try to get estimate data from localStorage
    try {
      const submissionData = localStorage.getItem('estimate_submission');
      if (submissionData) {
        const parsed = JSON.parse(submissionData);
        if (parsed.data) {
          setEstimateData(parsed.data);
        } else {
          // Redirect to estimate form if no data found
          router.push('/estimate');
        }
      } else {
        // No submission data, redirect to estimate form
        router.push('/estimate');
      }
    } catch (error) {
      console.error('Error loading estimate data:', error);
      router.push('/estimate');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-burgundy border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600">Loading your estimate...</p>
        </div>
      </div>
    );
  }

  if (!estimateData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <svg className="w-16 h-16 text-neutral-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.4a7.962 7.962 0 01-8-7.934 8 8 0 018-8.464 8.01 8.01 0 018 8.464M3 4h18M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
          </svg>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">No Estimate Found</h1>
          <p className="text-neutral-600 mb-6">
            We couldn&apos;t find your estimate data. Please complete the estimate form to get your personalized quote.
          </p>
          <button
            onClick={() => router.push('/estimate')}
            className="bg-primary-burgundy text-white px-6 py-3 rounded-lg hover:bg-primary-burgundy/90 transition-colors"
          >
            Start New Estimate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <EstimateSuccess estimateData={estimateData} />
    </div>
  );
}