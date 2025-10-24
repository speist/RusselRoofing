export interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  thumbnailSrc: string;
  blurDataUrl: string;
  serviceTypes: string[];
  projectTitle: string;
  description: string;
  location?: string;
  completedDate?: string;
  aspectRatio: number;
}

export const serviceCategories = [
  'All',
  'Roofing',
  'Siding',
  'Windows',
  'Skylights',
  'Masonry',
  'Commercial',
  'Churches & Institutions',
  'Historical Restoration'
] as const;

export type ServiceCategory = typeof serviceCategories[number];