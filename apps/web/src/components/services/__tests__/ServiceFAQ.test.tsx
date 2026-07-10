import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServiceFAQ from '../ServiceFAQ';
import { serviceFAQs } from '@/data/faqs';

function getFaqSchema(container: HTMLElement) {
  const scripts = Array.from(
    container.querySelectorAll('script[type="application/ld+json"]')
  );
  const faqScript = scripts.find((s) => s.innerHTML.includes('"FAQPage"'));
  return faqScript ? JSON.parse(faqScript.innerHTML) : null;
}

describe('ServiceFAQ', () => {
  it('emits FAQPage schema generated from the same serviceFAQs data (AC2)', () => {
    const { container } = render(
      <ServiceFAQ serviceArea="roofing" serviceTitle="Roofing" />
    );

    const schema = getFaqSchema(container);
    expect(schema).not.toBeNull();
    expect(schema['@type']).toBe('FAQPage');

    // One schema entry per FAQ in the data source — no duplication/omission.
    expect(schema.mainEntity).toHaveLength(serviceFAQs.roofing.length);
    const schemaQuestions = schema.mainEntity.map((q: { name: string }) => q.name);
    for (const faq of serviceFAQs.roofing) {
      expect(schemaQuestions).toContain(faq.question);
    }
  });

  it('still renders the visible FAQ accordion unchanged alongside the schema (AC5)', () => {
    render(<ServiceFAQ serviceArea="roofing" serviceTitle="Roofing" />);

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    // The first FAQ question is visible in the DOM (accordion), not only in schema.
    expect(
      screen.getByRole('heading', { name: serviceFAQs.roofing[0].question })
    ).toBeInTheDocument();
  });

  it('emits no schema and no section when the slug has no FAQs (AC2 constraint)', () => {
    const { container } = render(
      <ServiceFAQ serviceArea="nonexistent-slug" serviceTitle="Nope" />
    );
    expect(container.querySelector('section')).toBeNull();
    expect(getFaqSchema(container)).toBeNull();
  });
});
