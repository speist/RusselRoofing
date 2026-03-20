import { ContactFormData } from "./ContactForm";
import { ProjectDetailsData } from "../step2/ProjectDetailsStep";
import { PropertyInfoData } from "../step1/PropertyInfoStep";

export interface EstimateSubmissionData {
  property: PropertyInfoData;
  project: ProjectDetailsData;
  contact: ContactFormData;
}

export class SubmissionHandler {
  async submitEstimate(data: EstimateSubmissionData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: {
            firstName: data.contact.firstName,
            lastName: data.contact.lastName,
            email: data.contact.email,
            phone: data.contact.phone,
            preferredContact: data.contact.preferredContact,
            timePreference: data.contact.timePreference,
            isEmergency: data.contact.isEmergency,
          },
          property: {
            propertyType: data.property.propertyType,
            address: data.property.address,
          },
          project: {
            selectedServices: data.project.selectedServices,
            fieldValues: data.project.fieldValues,
            estimateRange: data.project.estimateRange,
          },
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Failed to submit estimate request');
      }

      // Save to local storage for persistence
      this.saveToLocalStorage(data);

      return { success: true };
    } catch (error) {
      console.error('Submission error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit estimate request'
      };
    }
  }

  private saveToLocalStorage(data: EstimateSubmissionData): void {
    try {
      localStorage.setItem('estimate_submission', JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Local storage error:', error);
    }
  }

  clearLocalStorage(): void {
    try {
      localStorage.removeItem('estimate_submission');
      localStorage.removeItem('estimate_form_data');
    } catch (error) {
      console.error('Clear storage error:', error);
    }
  }
}
