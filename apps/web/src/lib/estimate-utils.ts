/**
 * Utility functions for estimate-related formatting and processing
 */

/**
 * Capitalizes the first letter of a string
 */
export const capitalizeString = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Formats currency values consistently across the application
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats an estimate range for display
 */
export const formatEstimateRange = (min: number, max: number): string =>
  `${formatCurrency(min)} - ${formatCurrency(max)}`;

/**
 * Creates a sanitized filename from customer name and date
 */
export const generateEstimateFilename = (customerName: string): string => {
  const sanitizedName = customerName.replace(/[^a-zA-Z0-9]/g, '');
  const date = new Date().toISOString().split('T')[0];
  return `Russell_Roofing_Estimate_${sanitizedName}_${date}.pdf`;
};

/**
 * Formats a list of services for display
 */
export const formatServicesDisplay = (services: string[]): string => {
  if (services.length === 0) return 'No services selected';
  if (services.length === 1) return capitalizeString(services[0]);
  if (services.length === 2) {
    return `${capitalizeString(services[0])} + ${capitalizeString(services[1])}`;
  }
  return `${capitalizeString(services[0])} + ${services.length - 1} more services`;
};

/**
 * Validates that estimate data is complete
 */
export const validateEstimateData = (data: any): boolean => {
  return !!(
    data?.property?.address &&
    data?.project?.selectedServices?.length > 0 &&
    data?.project?.estimateRange?.min &&
    data?.project?.estimateRange?.max &&
    data?.contact?.firstName &&
    data?.contact?.lastName &&
    data?.contact?.email
  );
};