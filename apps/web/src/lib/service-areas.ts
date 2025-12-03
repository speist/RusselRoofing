/**
 * Service Area Definitions
 *
 * Defines geographic boundaries for Russell Roofing's service areas.
 * Used for filtering gallery photos by location and future service area pages.
 */

export interface ServiceAreaBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface ServiceArea {
  id: string;
  name: string;
  slug: string;
  center: {
    lat: number;
    lon: number;
  };
  bounds: ServiceAreaBounds;
  description: string;
  counties?: string[];
}

/**
 * Service area definitions with approximate bounding boxes
 * Based on actual county/region boundaries in the Philadelphia metro area
 */
export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'greater-philadelphia',
    name: 'Greater Philadelphia Area',
    slug: 'greater-philadelphia',
    center: { lat: 39.9526, lon: -75.1652 },
    bounds: {
      north: 40.05,
      south: 39.85,
      east: -74.95,
      west: -75.35,
    },
    description: 'Philadelphia city and immediate surroundings',
    counties: ['Philadelphia'],
  },
  {
    id: 'montgomery-county',
    name: 'Montgomery County',
    slug: 'montgomery-county',
    center: { lat: 40.15, lon: -75.35 },
    bounds: {
      north: 40.35,
      south: 40.00,
      east: -75.05,
      west: -75.65,
    },
    description: 'Montgomery County, PA - North of Philadelphia',
    counties: ['Montgomery'],
  },
  {
    id: 'bucks-county',
    name: 'Bucks County',
    slug: 'bucks-county',
    center: { lat: 40.34, lon: -75.10 },
    bounds: {
      north: 40.60,
      south: 40.05,
      east: -74.70,
      west: -75.30,
    },
    description: 'Bucks County, PA - Northeast of Philadelphia',
    counties: ['Bucks'],
  },
  {
    id: 'delaware-county',
    name: 'Delaware County',
    slug: 'delaware-county',
    center: { lat: 39.92, lon: -75.40 },
    bounds: {
      north: 40.00,
      south: 39.80,
      east: -75.20,
      west: -75.60,
    },
    description: 'Delaware County, PA - Southwest of Philadelphia',
    counties: ['Delaware'],
  },
  {
    id: 'south-jersey',
    name: 'South Jersey',
    slug: 'south-jersey',
    center: { lat: 39.80, lon: -75.05 },
    bounds: {
      north: 40.00,
      south: 39.50,
      east: -74.70,
      west: -75.25,
    },
    description: 'Camden, Burlington, and Gloucester counties in New Jersey',
    counties: ['Camden', 'Burlington', 'Gloucester'],
  },
  {
    id: 'central-jersey',
    name: 'Central Jersey',
    slug: 'central-jersey',
    center: { lat: 40.22, lon: -74.76 },
    bounds: {
      north: 40.45,
      south: 40.00,
      east: -74.40,
      west: -75.00,
    },
    description: 'Mercer and Middlesex areas of New Jersey',
    counties: ['Mercer', 'Middlesex', 'Monmouth'],
  },
];

/**
 * Location area type for filtering
 */
export const LOCATION_AREAS = [
  'All Areas',
  'Greater Philadelphia Area',
  'Montgomery County',
  'Bucks County',
  'Delaware County',
  'South Jersey',
  'Central Jersey',
] as const;

export type LocationArea = typeof LOCATION_AREAS[number];

/**
 * Determine which service area a coordinate falls within
 * Returns the first matching area, or undefined if outside all areas
 */
export function getServiceAreaFromCoordinates(
  lat: number,
  lon: number
): ServiceArea | undefined {
  // Check each service area's bounding box
  for (const area of SERVICE_AREAS) {
    const { bounds } = area;
    if (
      lat <= bounds.north &&
      lat >= bounds.south &&
      lon <= bounds.east &&
      lon >= bounds.west
    ) {
      return area;
    }
  }
  return undefined;
}

/**
 * Get the display name for a location based on coordinates
 * Returns "Greater Philadelphia Area" as default if coordinates don't match any area
 */
export function getLocationAreaName(
  lat: number | undefined,
  lon: number | undefined
): LocationArea {
  if (lat === undefined || lon === undefined || (lat === 0 && lon === 0)) {
    return 'All Areas';
  }

  const area = getServiceAreaFromCoordinates(lat, lon);
  return area ? (area.name as LocationArea) : 'Greater Philadelphia Area';
}

/**
 * Get service area by slug
 */
export function getServiceAreaBySlug(slug: string): ServiceArea | undefined {
  return SERVICE_AREAS.find((area) => area.slug === slug);
}

/**
 * Get service area by name
 */
export function getServiceAreaByName(name: string): ServiceArea | undefined {
  return SERVICE_AREAS.find((area) => area.name === name);
}

/**
 * Check if coordinates fall within any service area
 */
export function isWithinServiceArea(lat: number, lon: number): boolean {
  return getServiceAreaFromCoordinates(lat, lon) !== undefined;
}

/**
 * Calculate distance between two coordinates in miles
 * Uses Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get the nearest service area to given coordinates
 */
export function getNearestServiceArea(lat: number, lon: number): ServiceArea {
  let nearest = SERVICE_AREAS[0];
  let minDistance = Infinity;

  for (const area of SERVICE_AREAS) {
    const distance = calculateDistance(lat, lon, area.center.lat, area.center.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = area;
    }
  }

  return nearest;
}
