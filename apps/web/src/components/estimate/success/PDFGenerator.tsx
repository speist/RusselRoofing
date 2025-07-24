"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { generateEstimateFilename } from "@/lib/estimate-utils";

export interface PDFEstimateData {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  projectDetails: {
    propertyType: string;
    services: string[];
    estimateRange: { min: number; max: number };
    squareFootage?: number;
    fieldValues?: Record<string, any>;
  };
  additionalNotes?: string;
}

export interface PDFGeneratorProps {
  estimateData: PDFEstimateData;
  className?: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ estimateData, className }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Import jsPDF dynamically to avoid SSR issues
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Russell Roofing Header
      doc.setFontSize(24);
      doc.setTextColor(133, 30, 39); // Primary burgundy color
      doc.text('Russell Roofing', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Professional Roofing Services', margin, yPosition);
      yPosition += 20;

      // Title
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('Estimate Summary', margin, yPosition);
      yPosition += 15;

      // Customer Information
      doc.setFontSize(14);
      doc.setTextColor(133, 30, 39);
      doc.text('Customer Information', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Name: ${estimateData.customerInfo.name}`, margin, yPosition);
      yPosition += 6;
      doc.text(`Email: ${estimateData.customerInfo.email}`, margin, yPosition);
      yPosition += 6;
      doc.text(`Phone: ${estimateData.customerInfo.phone}`, margin, yPosition);
      yPosition += 6;
      doc.text(`Property Address: ${estimateData.customerInfo.address}`, margin, yPosition);
      yPosition += 15;

      // Project Details
      doc.setFontSize(14);
      doc.setTextColor(133, 30, 39);
      doc.text('Project Details', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Property Type: ${estimateData.projectDetails.propertyType}`, margin, yPosition);
      yPosition += 6;
      doc.text(`Services: ${estimateData.projectDetails.services.join(', ')}`, margin, yPosition);
      yPosition += 6;
      
      if (estimateData.projectDetails.squareFootage) {
        doc.text(`Square Footage: ${estimateData.projectDetails.squareFootage} sq ft`, margin, yPosition);
        yPosition += 6;
      }
      
      yPosition += 10;

      // Estimate Range (Highlighted)
      doc.setFillColor(133, 30, 39, 0.1);
      doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 20, 'F');
      
      doc.setFontSize(16);
      doc.setTextColor(133, 30, 39);
      const estimateText = `Estimated Cost: $${estimateData.projectDetails.estimateRange.min.toLocaleString()} - $${estimateData.projectDetails.estimateRange.max.toLocaleString()}`;
      doc.text(estimateText, margin + 5, yPosition + 8);
      yPosition += 25;

      // Important Notes
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Important Notes:', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(9);
      const notes = [
        '• This estimate is based on the information provided and may vary after on-site inspection.',
        '• Final pricing will be confirmed after a detailed assessment of your property.',
        '• All work comes with our comprehensive warranty and satisfaction guarantee.',
        '• We are GAF Master Elite contractors with full licensing and insurance.',
      ];
      
      notes.forEach(note => {
        doc.text(note, margin, yPosition);
        yPosition += 5;
      });

      yPosition += 10;

      // Contact Information
      doc.setFontSize(12);
      doc.setTextColor(133, 30, 39);
      doc.text('Contact Information', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('Russell Roofing Company', margin, yPosition);
      yPosition += 5;
      doc.text('Phone: (555) 123-ROOF', margin, yPosition);
      yPosition += 5;
      doc.text('Email: info@russellroofing.com', margin, yPosition);
      yPosition += 5;
      doc.text('Website: www.russellroofing.com', margin, yPosition);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 15);
      doc.text('Russell Roofing - Licensed, Bonded & Insured', pageWidth - margin - 60, pageHeight - 15);

      // Generate filename with customer name and date
      const filename = generateEstimateFilename(estimateData.customerInfo.name);

      // Download the PDF
      doc.save(filename);

    } catch (error) {
      console.error('PDF generation error:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-lg border border-neutral-200 p-6", className)}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Download Your Estimate
        </h2>
        <p className="text-neutral-600">
          Get a professional PDF summary of your estimate for your records.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-functional-error-red/10 border border-functional-error-red/20 rounded-lg">
          <p className="text-sm text-functional-error-red">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Download PDF Estimate
            </>
          )}
        </Button>

        {/* Features list */}
        <div className="bg-neutral-50 rounded-lg p-4">
          <p className="text-sm font-medium text-neutral-700 mb-2">Your PDF includes:</p>
          <ul className="space-y-1 text-sm text-neutral-600">
            <li className="flex items-center gap-2">
              <svg className="w-3 h-3 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Detailed estimate breakdown
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-3 h-3 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Project specifications
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-3 h-3 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Professional formatting
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-3 h-3 text-accent-success-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Contact information
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export { PDFGenerator };