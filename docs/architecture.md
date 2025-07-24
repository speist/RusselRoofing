# Russell Roofing & Exteriors Fullstack Architecture Document

## Introduction
[cite_start]This document outlines the complete fullstack architecture for the Russell Roofing & Exteriors lead capture platform. [cite: 881] [cite_start]It serves as the single source of truth for all technology choices, patterns, and structural decisions, guiding AI-driven development to ensure a cohesive, performant, and scalable application. [cite: 881]

**Change Log:**
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-07-22 | 1.0 | Initial architecture design. | Architect |

## High Level Architecture
### Technical Summary
[cite_start]The system will be a modern fullstack application built on a Jamstack architecture. [cite: 902] [cite_start]It will feature a statically generated frontend for maximum performance, with dynamic capabilities provided by serverless functions. [cite: 891] [cite_start]The frontend will be built with Next.js and React, served from Vercel's edge network. [cite: 891] [cite_start]The backend will be powered by Supabase, providing the database, authentication, and file storage. [cite: 891] [cite_start]This architecture is designed for fast performance, scalability, and an excellent developer experience. [cite: 891]

### Platform and Infrastructure Choice
* **Platform:** Vercel for frontend hosting and serverless functions; [cite_start]Supabase for the backend. [cite: 896]
* **Key Services:**
    * [cite_start]**Vercel:** Next.js Hosting, Edge Functions, Image Optimization. [cite: 896]
    * [cite_start]**Supabase:** PostgreSQL Database, Auth, Storage. [cite: 896]
* [cite_start]**Deployment Host and Regions:** Vercel (Global Edge Network), Supabase (US-East). [cite: 896]

### Repository Structure
* [cite_start]**Structure:** Monorepo. [cite: 897]
* [cite_start]**Monorepo Tool:** pnpm workspaces. [cite: 897]

### High Level Architecture Diagram
```mermaid
graph TD
    subgraph User Browser
        U[User]
    end

    subgraph Vercel Edge Network
        direction LR
        W[Next.js Frontend]
        F[Serverless Functions / API]
    end

    subgraph Cloud Services
        direction LR
        S[Supabase: Auth, DB, Storage]
        G[Google Places API]
        C[Calendly API]
        H[HubSpot API]
    end

    U --> W
    W --> F
    F --> S
    F --> G
    F --> C
    F --> H
````

## Tech Stack

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| Frontend Language | TypeScript | \~5.3.3 | [cite\_start]Main language for type safety. [cite: 754] | Industry standard for robust React development. |
| Frontend Framework| Next.js | \~14.1.0 | [cite\_start]React framework for production. [cite: 910] | Provides SSR, SSG, and API routes out-of-the-box. |
| UI Component Lib | Radix UI | \~1.0.1 | Headless UI components for accessibility. | Gives full styling control while ensuring accessibility. |
| State Management | Zustand | \~4.5.0 | [cite\_start]Minimalist state management. [cite: 910] | Simple, unopinionated, and avoids boilerplate. |
| Backend Language | TypeScript | \~5.3.3 | [cite\_start]Main language for serverless functions. [cite: 910] | Enables type sharing between frontend and backend. |
| API Style | tRPC | \~11.0.0-rc.292 | Typesafe APIs without schemas. | Perfect for Next.js monorepos, ensures end-to-end type safety. |
| Database | Supabase (Postgres) | 15.1 | [cite\_start]Relational database for all application data. [cite: 910] | Robust, open-source, and well-supported. |
| Authentication | Supabase Auth | \~2.39.7 | [cite\_start]Handles user authentication and row-level security. [cite: 911] | Tightly integrated with the database. |
| Frontend Testing| Vitest | \~1.2.2 | Unit and integration testing. | Fast, modern, and has a Jest-compatible API. |
| E2E Testing | Playwright | \~1.41.2 | [cite\_start]End-to-end testing for critical user flows. [cite: 911] | Powerful, reliable, and supports all major browsers. |
| CSS Framework | Tailwind CSS | \~3.4.1 | Utility-first CSS framework. | Rapidly build custom designs that match the style guide. |

## Data Models

### Estimate

  * **Purpose:** Stores the details and results of a user's estimate request.
  * **TypeScript Interface:**
    ```typescript
    interface Estimate {
      id: string; // uuid
      createdAt: Date;
      propertyType: 'single_family' | 'multi_family' | 'commercial';
      address: string;
      services: string[]; // e.g., ['roofing', 'gutters']
      squareFootage?: number;
      contactName: string;
      contactEmail: string;
      contactPhone: string;
      estimatedRange: { min: number; max: number };
      status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
    }
    ```

*(Additional models for Projects, Reviews, etc., would be defined here)*

## Unified Project Structure

```plaintext
russell-roofing-monorepo/
├── apps/
│   └── web/                    # Next.js frontend application
│       ├── src/
│       │   ├── app/            # App Router: pages and layouts
│       │   ├── components/     # Reusable UI components (Buttons, Cards)
│       │   ├── lib/            # Helper functions, utils
│       │   └── server/         # tRPC API definitions and routers
│       └── tailwind.config.ts
├── packages/
│   ├── ui/                     # Shared headless UI components (using Radix)
│   ├── config/                 # Shared configs (ESLint, TSConfig)
│   └── db/                     # Drizzle ORM schema and migrations
└── pnpm-workspace.yaml
```

## Development Workflow

### Local Development Setup

1.  [cite\_start]**Prerequisites:** Node.js (\~20.x), pnpm (\~8.x). [cite: 970]
2.  **Initial Setup:**
    ```bash
    git clone <repo_url>
    cd russell-roofing-monorepo
    pnpm install
    cp apps/web/.env.local.example apps/web/.env.local # Populate with Supabase keys
    ```
3.  **Development Commands:**
    ```bash
    # Run the Next.js development server
    pnpm dev
    ```

## Security and Performance

  * **Security:**
      * [cite\_start]All database access from the frontend will be subject to PostgreSQL Row Level Security (RLS) policies managed by Supabase Auth. [cite: 983]
      * [cite\_start]Environment variables must be used for all secrets and keys. [cite: 983]
      * [cite\_start]Input validation will be handled on serverless functions before database insertion. [cite: 984]
  * **Performance:**
      * [cite\_start]The frontend will be primarily statically generated (SSG) for fast initial loads. [cite: 985]
      * Vercel's Edge Network will serve assets globally.
      * [cite\_start]Images will be optimized using Next.js Image component. [cite: 985]
