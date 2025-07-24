# Russell Roofing & Exteriors - Lead Capture & Conversion System Product Requirements Document (PRD)

## Goals and Background Context
**Goals:**
* [cite_start]To provide customers with a transparent and immediate way to get a roofing/exterior project estimate. [cite: 440]
* [cite_start]To build trust through dynamic social proof and a professional, high-quality user experience. [cite: 440]
* [cite_start]To streamline the internal lead management process by capturing detailed information and integrating directly with HubSpot. [cite: 440]

**Background Context:**
[cite_start]This project addresses a key friction point in the customer journey for home and commercial exterior services. [cite: 441] [cite_start]By replacing a simple "Contact Us" form with an interactive "Instant Estimate" tool, we aim to significantly increase engagement and conversion. [cite: 441] [cite_start]The system is designed not just as a lead form, but as a value-add tool for the user, providing them with instant information while simultaneously qualifying them as a lead. [cite: 441] [cite_start]All design and functionality must adhere strictly to the provided Style Guide and State Design Brief to ensure a cohesive and trustworthy brand presentation. [cite: 441]

**Change Log:**
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-07-22 | 1.0 | Initial PRD creation from Project Brief. | Product Manager |

## Requirements
### Functional
1.  **FR1:** The system shall present a multi-step "Instant Estimate" form that collects property, project, and contact information.
2.  **FR2:** The estimate form shall provide real-time feedback on the estimated price range as the user makes selections.
3.  [cite_start]**FR3:** The system must use the Google Places API to provide address autocomplete functionality. [cite: 252]
4.  **FR4:** All form submissions must be sent to HubSpot, creating or updating a contact and deal.
5.  **FR5:** The system shall display a gallery of past projects filterable by service type (e.g., Roofing, Siding).
6.  **FR6:** The gallery shall feature a lightbox view for detailed image inspection.
7.  **FR7:** The website shall display a carousel of customer reviews sourced dynamically.
8.  **FR8:** The system shall implement progressive profiling for returning visitors to avoid asking for redundant information.
9.  **FR9:** Emergency requests submitted through the form must be visually prioritized and trigger an expedited internal workflow.

### Non-Functional
1.  **NFR1:** All page loads must achieve a Largest Contentful Paint (LCP) of under 2.5 seconds.
2.  [cite_start]**NFR2:** All interactive elements (buttons, inputs) must have a response time of less than 200ms. [cite: 644]
3.  **NFR3:** The user interface must be fully responsive and functional across mobile, tablet, and desktop breakpoints as defined in the style guide.
4.  **NFR4:** All user-facing text and imagery must meet WCAG AA contrast compliance.
5.  **NFR5:** Form state must be preserved locally in the browser in case of accidental closure or network interruption.

## User Interface Design Goals
* **Overall UX Vision:** To create a highly polished, professional, and trustworthy user experience that feels less like a form and more like a helpful consultation tool. The interface should be intuitive, responsive, and visually impressive, leveraging motion and subtle animations to guide the user and provide feedback.
* [cite_start]**Core Screens and Views:** Main Landing/Estimator Page, Project Gallery, Dynamic Testimonials Section, Estimate Success/Scheduling Page. [cite: 448]
* [cite_start]**Accessibility:** WCAG AA. [cite: 447]
* [cite_start]**Branding:** Must strictly adhere to the `russell-roofing-style-guide.md`, using the specified color palette, typography, and component styles. [cite: 450]
* [cite_start]**Target Device and Platforms:** Web Responsive. [cite: 453]

## Technical Assumptions
* [cite_start]**Repository Structure:** Monorepo. [cite: 455]
* [cite_start]**Service Architecture:** A Jamstack approach using a serverless backend is preferred to optimize for performance and scalability. [cite: 456]
* **Testing Requirements:** Unit and Integration tests are required for all core logic. [cite_start]E2E tests are required for the full estimate form user flow. [cite: 457]

## Epic List
1.  **Epic 1: Foundation & Core UI Setup:** Establish the project foundation, including the monorepo structure, CI/CD pipeline, and implementation of the global style guide. [cite_start]Deliver a static landing page shell. [cite: 462]
2.  [cite_start]**Epic 2: Instant Estimate & Lead Capture System:** Develop the complete, multi-step Instant Estimate form, from property information to contact details, including real-time price updates. [cite: 463]
3.  [cite_start]**Epic 3: Trust-Building & Gallery Systems:** Implement the dynamic social proof carousel and the filterable project gallery with its lightbox functionality. [cite: 463]
4.  [cite_start]**Epic 4: HubSpot Integration & Smart Routing:** Connect the estimate form to HubSpot, implement progressive profiling, and build the smart lead routing logic for high-intent and emergency leads. [cite: 463]

## Epic 1: Foundation & Core UI Setup
**Goal:** To create the foundational codebase, repository structure, and core styling that all other features will be built upon.

* **Story 1.1: Project Initialization**
    * **As a** developer, **I want** a configured monorepo with a Next.js frontend app, **so that** I can begin building components in a structured environment.
    * **Acceptance Criteria:**
        1.  A monorepo is initialized.
        2.  A Next.js application is created within the `apps/web` directory.
        3.  TypeScript and Tailwind CSS are configured for the Next.js app.
        4.  A basic "Hello World" page is viewable when running the development server.
* **Story 1.2: Global Styling & Theme Implementation**
    * **As a** developer, **I want** all colors, fonts, and spacing from the style guide implemented as a global theme, **so that** components are styled consistently.
    * **Acceptance Criteria:**
        1.  All colors from the style guide are available as CSS variables or in the Tailwind theme.
        2.  The Inter and Playfair Display fonts are configured and applied to the base document.
        3.  Core UI components (Buttons, Cards, Inputs) are created as reusable React components matching the style guide specifications.
        4.  Dark mode variants are implemented and can be toggled.
* **Story 1.3: Site Layout & Navigation Shell**
    * **As a** developer, **I want** a main layout component with a header and footer, **so that** all pages have a consistent structure.
    * **Acceptance Criteria:**
        1.  A responsive header component is created.
        2.  A footer component with a dark background is created.
        3.  A placeholder for the hero section is present on the main page.
        4.  The layout handles mobile (hamburger menu) and desktop navigation.

*(Subsequent epics and stories would be detailed here in a similar fashion)*