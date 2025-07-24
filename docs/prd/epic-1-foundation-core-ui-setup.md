# Epic 1: Foundation & Core UI Setup
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