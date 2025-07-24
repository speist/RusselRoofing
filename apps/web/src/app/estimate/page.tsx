"use client";

import { EstimateForm, EstimateFormData } from "@/components/estimate/EstimateForm";
import { useRouter } from "next/navigation";

export default function EstimatePage() {
  const router = useRouter();

  const handleFormComplete = (data: EstimateFormData) => {
    // Navigate to success page after form completion
    router.push('/estimate/success');
  };

  return (
    <div className="min-h-screen bg-background-warm-white dark:bg-dark-background py-8 px-4">
      <div className="container mx-auto">
        <EstimateForm onComplete={handleFormComplete} />
      </div>
    </div>
  );
}