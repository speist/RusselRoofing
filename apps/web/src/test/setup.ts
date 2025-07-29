import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock IntersectionObserver globally
global.IntersectionObserver = vi.fn().mockImplementation((callback, options) => ({
  observe: vi.fn((element) => {
    // Simulate immediate intersection
    callback([{ isIntersecting: true, target: element }]);
  }),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Next.js modules that aren't available in test environment
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => 
    React.createElement('img', { src, alt, ...props }),
}));