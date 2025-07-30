"use client";

import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import { EstimateForm, EstimateFormData } from "@/components/estimate/EstimateForm";
import { useRouter } from "next/navigation";

export default function EstimatePage() {
  const router = useRouter();

  const handleFormComplete = (data: EstimateFormData) => {
    // Navigate to success page after form completion
    router.push('/estimate/success');
  };

  return (
    <FloatingPageLayout>
      <div className="py-8 px-4">
        <div className="container mx-auto">
          <EstimateForm onComplete={handleFormComplete} />
        </div>
      </div>
    </FloatingPageLayout>
  );
}