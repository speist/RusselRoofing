# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Russell Roofing & Exteriors is a Next.js 14 (App Router) website built with TypeScript, Tailwind CSS, and Vitest. It's a pnpm monorepo structured with the web application in `apps/web/`.

**Tech Stack:**
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS with custom design system
- Vitest for testing
- React Hook Form for forms
- HubSpot, Google Places, and Instagram API integrations

## Development Commands

### Project Setup
```bash
# Install dependencies (requires pnpm)
pnpm install

# Development server (runs apps/web)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start
```

### Quality & Testing
```bash
# Run all linters across workspace
pnpm lint

# Type checking across workspace
pnpm typecheck

# Format code across workspace
pnpm format

# Run tests with Vitest
cd apps/web && pnpm test

# Run tests in UI mode
cd apps/web && pnpm test:ui

# Run tests once (CI mode)
cd apps/web && pnpm test:run
```

### Gallery Management
```bash
# Validate gallery images structure
cd apps/web && pnpm gallery:validate

# Generate thumbnails
cd apps/web && pnpm gallery:thumbnails

# Generate blur data URLs
cd apps/web && pnpm gallery:blur-data

# Process all gallery images
cd apps/web && pnpm gallery:process
```

## Architecture

### Directory Structure

```
apps/web/src/
├── app/              # Next.js App Router pages and API routes
│   ├── api/         # API routes (health, hubspot, instagram, reviews)
│   ├── services/    # Service detail pages (dynamic [slug])
│   └── [page]/      # Other pages (about, contact, estimate, gallery, etc.)
├── components/       # React components organized by feature
│   ├── about/       # About page components
│   ├── contact/     # Contact form components
│   ├── estimate/    # Multi-step estimate form (step1, step2, step3, success)
│   ├── gallery/     # Gallery components
│   ├── home/        # Homepage components
│   ├── layout/      # Header, Footer, navigation
│   ├── services/    # Service-related components
│   ├── social-proof/# Reviews, testimonials, trust indicators
│   ├── ui/          # Reusable UI components (buttons, cards, inputs)
│   └── theme/       # Theme provider components
├── data/            # Static data and content
│   ├── about.ts     # About page content
│   ├── gallery.ts   # Gallery configuration
│   ├── reviews.ts   # Customer reviews
│   ├── services.ts  # Service list
│   └── service-details.ts  # Detailed service information
├── lib/             # Utilities and business logic
│   ├── hubspot/     # HubSpot integration (client, contact management)
│   ├── lead-routing/# Lead routing and scoring logic
│   ├── middleware/  # API middleware (rate limiting, validation)
│   ├── utils/       # General utilities
│   ├── config.ts    # Application configuration
│   ├── env-validation.ts  # Environment variable validation
│   ├── gallery-validation.ts  # Gallery structure validation
│   └── security-utils.ts  # Security helpers
├── test/            # Test setup and utilities
└── types/           # TypeScript type definitions
```

### Key Architectural Patterns

**Environment Validation:**
- Environment variables are validated at runtime using `src/lib/env-validation.ts`
- Validation runs on server-side during app initialization (see `apps/web/src/app/layout.tsx`)
- Required variables include HubSpot, Google Places, and Instagram API keys
- Comprehensive validation with categorized error messages

**Design System:**
- Custom Tailwind configuration in `apps/web/tailwind.config.ts`
- CSS custom properties for colors (primary, secondary, accent, functional, dark mode)
- Typography scale with custom font families (Inter, Playfair Display, Lora)
- Consistent spacing, border radius, and shadow tokens

**Data Structure:**
- Static content lives in `src/data/` as TypeScript modules
- Service data is centralized in `service-details.ts` with 8 service categories
- Type-safe data structures with TypeScript interfaces

**Component Organization:**
- Components are feature-organized (by page/domain)
- Shared UI components in `components/ui/`
- Co-located tests in `__tests__/` directories alongside components

**API Integration:**
- HubSpot for contact management and CRM
- Google Places for location services and reviews
- Instagram Basic Display for social media feed
- Lead routing system with urgency scoring

**Testing:**
- Vitest with jsdom environment
- Test setup in `src/test/setup.ts`
- Tests use React Testing Library conventions
- Path alias `@/` maps to `src/`

### Security Features

- Security headers configured in `next.config.mjs` (HSTS, X-Frame-Options, CSP, etc.)
- Environment variable validation prevents missing configuration
- Security utilities in `src/lib/security-utils.ts`
- Server-side API keys never exposed to client

## Important Notes

### Path Aliases
- Use `@/` for imports from `src/` directory
- Example: `import { Button } from "@/components/ui/Button"`

### Environment Variables
- Copy `.env.example` to `.env.local` for development
- Required variables are validated on server startup
- See `apps/web/src/lib/env-validation.ts` for complete list
- Client-side variables must be prefixed with `NEXT_PUBLIC_`

### Testing Conventions
- Tests are co-located with components in `__tests__/` directories
- Use Vitest globals (no need to import `describe`, `it`, `expect`)
- jsdom environment is configured for React component testing
- Path aliases work in tests via vitest.config.ts

### Gallery System
- Gallery images must follow specific directory structure
- Run `pnpm gallery:validate` before committing gallery changes
- Image processing scripts handle thumbnails and blur data URLs
- Gallery configuration in `src/data/gallery.ts`

### Service Management
- Services are defined in `src/data/services.ts` (list view)
- Detailed service information in `src/data/service-details.ts`
- Service pages use dynamic routes: `/services/[slug]`
- 8 service categories: Roofing, Siding and Gutters, Commercial, Churches & Institutions, Historical Restoration, Masonry, Windows, Skylights

### Monorepo Structure
- This is a pnpm workspace with packages defined in `pnpm-workspace.yaml`
- Main application is in `apps/web/`
- Run commands from root for workspace-wide operations
- Use `pnpm --filter=web <command>` to target specific package

### Design Tokens
- Colors use RGB custom properties: `rgb(var(--color-primary-burgundy))`
- Theme switching via `next-themes` with class-based dark mode
- Typography scale follows consistent naming (h1, h2, h3, h4, body, body-sm)
- Primary brand color: `#960120` (burgundy)

### BMad Framework
- The project uses the BMad Method with custom Cursor agent rules in `.cursor/rules/`
- Agent personas available: architect, analyst, dev, pm, po, qa, ux-expert, sm, and infrastructure
- These are primarily for Cursor IDE integration and not required for Claude Code usage
