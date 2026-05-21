# High Level Architecture
## Technical Summary
[cite_start]The system will be a modern fullstack application built on a Jamstack architecture. [cite: 902] [cite_start]It will feature a statically generated frontend for maximum performance, with dynamic capabilities provided by serverless functions. [cite: 891] [cite_start]The frontend will be built with Next.js and React, served from Vercel's edge network. [cite: 891] [cite_start]The backend will be powered by Supabase, providing the database, authentication, and file storage. [cite: 891] [cite_start]This architecture is designed for fast performance, scalability, and an excellent developer experience. [cite: 891]

## Platform and Infrastructure Choice
* **Platform:** Vercel for frontend hosting and serverless functions; [cite_start]Supabase for the backend. [cite: 896]
* **Key Services:**
    * [cite_start]**Vercel:** Next.js Hosting, Edge Functions, Image Optimization. [cite: 896]
    * [cite_start]**Supabase:** PostgreSQL Database, Auth, Storage. [cite: 896]
* [cite_start]**Deployment Host and Regions:** Vercel (Global Edge Network), Supabase (US-East). [cite: 896]

## Repository Structure
* [cite_start]**Structure:** Monorepo. [cite: 897]
* [cite_start]**Monorepo Tool:** pnpm workspaces. [cite: 897]

## High Level Architecture Diagram
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
