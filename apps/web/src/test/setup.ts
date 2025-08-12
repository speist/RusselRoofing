import '@testing-library/jest-dom/vitest';
import React from 'react';
import { vi } from 'vitest';

// A more robust mock for IntersectionObserver
class IntersectionObserverMock {
  private callback: IntersectionObserverCallback;
  private options: IntersectionObserverInit;
  private elements: Set<Element> = new Set();

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options || {};
  }

  observe(element: Element) {
    this.elements.add(element);
    // Immediately trigger the callback with an intersecting entry
    const entry: IntersectionObserverEntry = {
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRatio: 1,
      intersectionRect: element.getBoundingClientRect(),
      isIntersecting: true,
      rootBounds: document.body.getBoundingClientRect(),
      target: element,
      time: Date.now(),
    };
    this.callback([entry], this);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);


// Mock Next.js modules that aren't available in test environment
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  notFound: vi.fn(() => {
    // Throw an error that simulates the Not Found behavior in Next.js
    const error = new Error('NEXT_NOT_FOUND');
    // You might need to adjust the stack trace if your tests depend on it
    error.stack = '...';
    throw error;
  }),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => 
    React.createElement('img', { src, alt, ...props }),
}));