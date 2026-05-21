# Brownfield Architecture: Homepage Redesign & Site Completion (Phase 2)

## 1. Introduction & Integration Strategy

**Purpose:** This document outlines the architectural approach for implementing the "Homepage Redesign & Site Completion" PRD. It serves as the technical guide for developers, ensuring that all new features are built in a way that is consistent with, and safely integrated into, the existing application.

**Core Principle:** The primary goal is to minimize disruption. We will introduce new patterns and components for the redesign while ensuring existing functionality remains stable.

**Integration Approach:**

* **UI & Styling Integration:**
    * The new homepage design will be built using the code generated from Vercel v0, which is based on `shadcn/ui`.
    * We will use the `npx shadcn-ui@latest add` command to add these new components (like buttons, cards, carousels) into the existing project one by one, as needed by the `dev` agent.
    * The new global styles (fonts like "Skolar Latin", the updated red color, etc.) will be applied to the application's main layout file. This will ensure that while new components get the full new look, older pages will inherit the new fonts and colors, creating a more unified feel across the entire site.

* **Page & Routing Integration:**
    * The new pages (`/services`, `/about`, `/contact`) will be created as new routes within the existing Next.js application structure. This is a non-disruptive addition.
    * The homepage route (`/`) will be updated to render the new Vercel v0 component code.

* **Backend & API Integration:**
    * New backend functionality (like fetching the Instagram feed or Google Places testimonials) will be built as new, isolated serverless functions or API routes. This prevents interference with your existing backend logic.

---

## 2. Component Architecture & Integration

* **New Component Directory:**
    All new, redesigned components generated from Vercel v0 (which are built with `shadcn/ui`) will be added to a dedicated directory: `src/components/ui/`. This keeps them organized and distinct from any older, legacy components. The `dev` agent will use the `npx shadcn-ui@latest add` command to bring each component's code into this directory as required by the user stories.

* **Feature-Specific Component Organization:**
    Components that are specific to a new feature or page will be organized by that feature. For example, all the new sections for the homepage will be created in a `src/components/home/` directory.
    * `src/components/home/hero-section.tsx`
    * `src/components/home/services-carousel.tsx`
    * `src/components/home/testimonials-carousel.tsx`

* **Interaction Between New and Old Components:**
    To maintain design consistency, our `dev` agent will follow a clear principle:
    * **Forward-Compatibility:** New, redesigned components (from `src/components/ui/`) can be used to upgrade older pages.
    * **No Backward-Compatibility:** We will avoid placing old, legacy components inside the new, redesigned sections (like the homepage) to prevent visual inconsistencies.

* **Component Structure Diagram:**
    This diagram illustrates the separation:
    ```mermaid
    graph TD
        subgraph Application
            A[App Shell / Layout]
        end

        subgraph New Pages (e.g., Homepage)
            B[src/components/home/...]
        end
        
        subgraph Reusable New UI
            C[src/components/ui/ (shadcn)]
        end

        subgraph Legacy Pages & Components
            D[src/components/legacy/...]
        end

        A --> B
        A --> D
        B --> C
        D --> C
    ```

---

## 3. New Page Architecture & Content Strategy

* **Page File Structure:**
    The new pages will be created within your Next.js App Router structure as follows:
    * `src/app/about/page.tsx` - The About Us page.
    * `src/app/contact/page.tsx` - The Contact Us page.
    * `src/app/services/page.tsx` - The main services landing page.
    * `src/app/services/[slug]/page.tsx` - The dynamic template for individual service detail pages.

* **Content Sourcing & Management:**

    * **About & Contact Pages:** The content for these pages is static. The text gathered by the Analyst will be placed directly into the page components by the `dev` agent.

    * **Services Pages (File-Based CMS):** To manage the descriptions and photo galleries for your services, we will use a simple, file-based approach.
        1.  A new directory will be created: `src/content/services/`.
        2.  Inside, a markdown file will be created for each service (e.g., `roofing.mdx`).
        3.  Each file will contain the service description and a list of image paths for its gallery.
        4.  The `dev` agent will build the `[slug]` page template to dynamically read and display the content from these files.

    * **Live Data Content (Testimonials & Instagram):**
        1.  **Client Testimonials:** The component will be a client-side component (`"use client"`) that securely fetches reviews using your Google Places API key.
        2.  **Instagram Feed:** To protect your access token, the `dev` agent will create a serverless function (an API route in Next.js). This function will run on the server, fetch the latest posts from the Instagram API, and then send the necessary data to the component in the browser.

---

## 4. Production Readiness Architecture

* **Environment Configuration:**
    To manage API keys and other secrets securely, the `dev` agent will implement the following structure:
    1.  A `.env.example` file will be maintained in the repository. It will list all required environment variables with placeholder values (e.g., `HUBSPOT_API_KEY="your_hubspot_key_here"`).
    2.  Developers will use a `.env.local` file for their local keys, which will be ignored by version control.
    3.  For production, all secrets will be set directly in the Vercel project's Environment Variables dashboard.

* **Environment Variable Validation:**
    To prevent runtime errors from missing configuration, the `dev` agent will implement a validation step using the **Zod** library.
    1.  A schema will be created that defines all required environment variables and their expected types.
    2.  This schema will parse the environment variables when the application starts.
    3.  If any variable is missing or has the wrong format, the build or startup process will fail immediately with a clear error message.

* **Custom Domain & SSL Preparation:**
    Vercel automatically provides and renews SSL certificates. The architectural work is to ensure the codebase is domain-agnostic.
    1.  A new environment variable, `NEXT_PUBLIC_SITE_URL`, will be created.
    2.  The `dev` agent will be instructed to use this variable for any part of the code that requires the full site URL (e.g., for SEO canonical tags or sharing links).
    3.  This ensures that when you connect your custom domain in the Vercel dashboard, all links generated by the application will update automatically.