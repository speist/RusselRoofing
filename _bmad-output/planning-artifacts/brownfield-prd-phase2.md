# Brownfield PRD: Homepage Redesign & Site Completion

## 1. Introduction & Goals

**Enhancement Scope:** This document outlines the requirements for a comprehensive redesign of the homepage, the creation of several new core pages (Services, About, Contact), and the population of the site with real content and production-ready configurations.

**Goal:** To transform the existing application from a functional shell into a visually polished, content-rich, and conversion-focused website that aligns with the new brand identity.

## 2. High-Level Epic Structure

The work for this phase is organized into the following three epics:

* **Epic 5: Homepage Finalization & Content Integration:** Covers implementing the final V6 design, adding the new "Hiring" and "Instagram" sections, and populating the "Client Testimonials" and "Project Gallery" with real content.
* **Epic 6: Core Page Creation:** Covers the creation of the three missing navigation pages: `/services`, `/about`, and `/contact`, including gathering all necessary content and ensuring they match the new design aesthetic.
* **Epic 7: Production Readiness & Configuration:** A technical epic to handle all the high-priority environment configurations, including API keys, validation, and preparing for a custom domain.

---

## Epic 5: Homepage Finalization & Content Integration

**Goal:** To fully implement the new V6 homepage design, integrate real content feeds for testimonials and Instagram, and add the new "Hiring" and "Get In Touch" sections.

* **Story 5.1: Implement Final Homepage UI/UX**
    * **As a** developer, **I want** to apply the final V6 design to the live homepage, **so that** it matches the approved mockup.
    * **Acceptance Criteria:**
        1.  The "floating page" background is Light Grey (`#F5F3F0`).
        2.  The primary red color is updated to `#960120` on all components.
        3.  The hero image card is flush with the top of the content area and has only its bottom two corners rounded.
        4.  The dynamic header transitions from transparent to solid red on scroll.
        5.  All fonts are updated, with "Skolar Latin" used for serif headlines.
        6.  The layout is fully responsive and matches the mobile-first instructions.

* **Story 5.2: Integrate Live Instagram Feed**
    * **As a** site visitor, **I want** to see the latest posts from the company's Instagram feed, **so that** I can see their most recent work and updates.
    * **Acceptance Criteria:**
        1.  The Instagram section on the homepage pulls the most recent images from the `russellroofingcompany` account.
        2.  The feed displays a grid of 6 images.
        3.  The implementation uses a reliable method (e.g., an official API or a stable third-party widget).
        4.  The section includes a "Follow Us on Instagram" link.

* **Story 5.3: Add "We're Hiring" Section**
    * **As a** job seeker, **I want** to see current career opportunities, **so that** I can apply to work at the company.
    * **Acceptance Criteria:**
        1.  A new "We're Hiring!" section is added to the homepage.
        2.  The section contains the correct introductory text and email address (`info@russellroofing.com`).
        3.  The three positions (`FOREMAN`, `SUPERINTENDENT`, `ROOFING LABORER`) are clearly listed.

* **Story 5.4: Implement Functional Client Testimonials**
    * **As a** potential customer, **I want** to see real, recent reviews, **so that** I can build trust in the company.
    * **Acceptance Criteria:**
        1.  The "Client Testimonials" section is implemented as an auto-playing carousel.
        2.  The component is connected to the Google Places API using the key from the environment variables.
        3.  It successfully fetches and displays real 5-star reviews.
        4.  If the API fails, the component gracefully falls back to a set of 6 hardcoded placeholder reviews.

* **Story 5.5: Create Project Photo Gallery Structure**
    * **As a** site administrator, **I want** a designated place to add project photos, **so that** they can be displayed in the future `/services` page galleries.
    * **Acceptance Criteria:**
        1.  A folder structure is created within the project for gallery images (e.g., `/public/images/gallery/roofing/`).
        2.  Instructions are provided on how to add photos for each service category.
        3.  The user's existing project photos are added to the appropriate folders.

---

## Epic 6: Core Page Creation

**Goal:** To build the main informational and contact pages of the website (`/services`, `/about`, `/contact`), ensuring they are populated with content and are visually consistent with the newly designed homepage.

* **Story 6.1: Create Master Services Page**
    * **As a** potential customer, **I want** to see a clear overview of all the services offered, **so that** I can easily navigate to the one I'm interested in.
    * **Acceptance Criteria:**
        1.  A new page is created at the `/services` route.
        2.  The page uses the standard site header and footer for consistency.
        3.  The page displays a grid of all 8 services (`Roofing`, `Siding and Gutters`, etc.).
        4.  Each service in the grid is a clickable card that links to its own unique detail page (e.g., `/services/roofing`).

* **Story 6.2: Create Reusable Service Detail Page Template**
    * **As a** developer, **I want** a single, reusable template for all individual service pages, **so that** new services can be added easily in the future without rebuilding pages from scratch.
    * **Acceptance Criteria:**
        1.  A dynamic page template is created that can handle different service content (e.g., `services/[slug]`).
        2.  The template includes sections for a service title, a detailed description, and an image gallery.
        3.  The design of the template matches the new, polished aesthetic of the homepage.
        4.  The content for the service descriptions will be provided by the Analyst.

* **Story 6.3: Create About Us Page**
    * **As a** potential customer, **I want** to learn about the company's history and team, **so that** I can feel confident and trust who I am hiring.
    * **Acceptance Criteria:**
        1.  A new page is created at the `/about` route.
        2.  The page uses the standard site header and footer.
        3.  The page is populated with the company information and team content provided by the Analyst.

* **Story 6.4: Create Contact Us Page**
    * **As a** user, **I want** a dedicated page to find contact information and send a message, **so that** I can easily get in touch with the company.
    * **Acceptance Criteria:**
        1.  A new page is created at the `/contact` route.
        2.  The page prominently features the "Get In Touch" form component designed for the homepage.
        3.  The page also displays the business's contact information (address, phone, email) and a map of previously completed jobs (pending investigation by the Analyst).

---

## Epic 7: Production Readiness & Configuration

**Goal:** To ensure the application is secure, correctly configured, and ready for deployment to a live production environment with a custom domain and real API keys.

* **Story 7.1: Implement Production Environment Configuration**
    * **As a** developer, **I want** the application to use a separate set of production-ready API keys and settings, **so that** we can safely connect to live services without affecting development.
    * **Acceptance Criteria:**
        1.  An example environment file (`.env.example`) is created or updated with placeholders for all required production keys, specifically `HUBSPOT_API_KEY`.
        2.  The application's code is configured to use the production variables when running in a production environment.
        3.  The Google Places API key is correctly read from the production environment variables.

* **Story 7.2: Add Environment Variable Validation**
    * **As a** developer, **I want** the application to verify that all required environment variables are present on startup, **so that** it fails immediately with a clear error instead of crashing unexpectedly later.
    * **Acceptance Criteria:**
        1.  A validation check is added to the application's startup process.
        2.  If a required variable (like `HUBSPOT_API_KEY` or `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`) is missing, the application will not start.
        3.  A clear error message is logged to the console indicating which specific variable is missing.

* **Story 7.3: Prepare Application for Custom Domain & SSL**
    * **As a** site owner, **I want** the application to work correctly when deployed to a custom domain (e.g., russellroofing.com), **so that** the website is professional and secure.
    * **Acceptance Criteria:**
        1.  All internal links and API calls within the code are updated to use relative paths or environment-aware URLs, removing any hardcoded `localhost` references.
        2.  Documentation is added to the project's `README.md` explaining the steps to connect a custom domain within the Vercel hosting dashboard.
        3.  The application is confirmed to run correctly with the Vercel-provided SSL certificate.