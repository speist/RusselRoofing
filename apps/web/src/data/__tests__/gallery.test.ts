import { describe, it, expect } from 'vitest';
import { sampleProjects } from '../gallery';

// Phrases that indicate the pre-8.2 generic alt text regressed back in.
const BANNED_GENERIC_ALTS = [
  'Professional roofing installation',
  'Quality roofing workmanship',
  'Modern roofing solution',
  'Beautiful siding installation',
  'Skylight installation',
  'Professional masonry work',
  'Commercial roofing project',
];

describe('gallery alt text (Story 8.2 SEO)', () => {
  it('every project has descriptive alt text within schema/SEO length limits (AC2)', () => {
    for (const p of sampleProjects) {
      expect(p.alt, `alt for ${p.id}`).toBeTruthy();
      // Descriptive, not a bare word.
      expect(p.alt.trim().length, `alt too short for ${p.id}`).toBeGreaterThanOrEqual(12);
      // Google recommends alt text under ~125 characters (AC2).
      expect(p.alt.length, `alt too long for ${p.id}`).toBeLessThanOrEqual(125);
    }
  });

  it('alt text is location-specific where a location is known (AC1)', () => {
    for (const p of sampleProjects) {
      if (p.location) {
        expect(p.alt, `alt for ${p.id} should mention its location`).toContain(p.location);
      }
    }
  });

  it('no project uses the old generic alt phrases (regression guard)', () => {
    for (const p of sampleProjects) {
      expect(
        BANNED_GENERIC_ALTS.includes(p.alt.trim()),
        `${p.id} regressed to a generic alt: "${p.alt}"`
      ).toBe(false);
    }
  });
});
