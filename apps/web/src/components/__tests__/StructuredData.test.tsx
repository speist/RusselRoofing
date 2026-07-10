import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FAQSchema } from '../StructuredData';

function parseSchema(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse(script!.innerHTML);
}

describe('FAQSchema', () => {
  it('emits valid FAQPage JSON-LD with question/answer mapping (AC1)', () => {
    const faqs = [
      { question: 'How often should I inspect my roof?', answer: 'Once a year.' },
      { question: 'Do you offer financing?', answer: 'Yes, flexible plans.' },
    ];
    const { container } = render(<FAQSchema faqs={faqs} />);
    const schema = parseSchema(container);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(2);

    const first = schema.mainEntity[0];
    expect(first['@type']).toBe('Question');
    expect(first.name).toBe('How often should I inspect my roof?');
    expect(first.acceptedAnswer['@type']).toBe('Answer');
    expect(first.acceptedAnswer.text).toBe('Once a year.');
  });

  it('renders nothing for an empty FAQ array (AC1 guard)', () => {
    const { container } = render(<FAQSchema faqs={[]} />);
    expect(container.querySelector('script')).toBeNull();
  });

  it('renders nothing when faqs is undefined', () => {
    // @ts-expect-error deliberately exercising the missing-prop guard
    const { container } = render(<FAQSchema faqs={undefined} />);
    expect(container.querySelector('script')).toBeNull();
  });

  it('strips markup and decodes HTML entities so answers are plain text (AC4)', () => {
    const faqs = [
      {
        question: 'Roofing &amp; siding?',
        answer: 'We do <strong>both</strong> — roofing &amp; siding, rated &lt;5 stars&gt;.',
      },
    ];
    const { container } = render(<FAQSchema faqs={faqs} />);
    const schema = parseSchema(container);

    const entry = schema.mainEntity[0];
    // Entities decoded to their plain-text characters.
    expect(entry.name).toBe('Roofing & siding?');
    expect(entry.acceptedAnswer.text).toContain('roofing & siding');
    // Real markup tags are removed (their inner text is kept).
    expect(entry.acceptedAnswer.text).not.toContain('<strong>');
    expect(entry.acceptedAnswer.text).not.toContain('</strong>');
    expect(entry.acceptedAnswer.text).toContain('both');
    // Escaped angle brackets decode to literal text, not treated as tags.
    expect(entry.acceptedAnswer.text).toContain('<5 stars>');
  });

  it('produces JSON serializable without throwing (valid JSON-LD)', () => {
    const faqs = [{ question: 'Q "quoted"?', answer: "It's fine." }];
    const { container } = render(<FAQSchema faqs={faqs} />);
    expect(() => parseSchema(container)).not.toThrow();
  });
});
