# Epic 6: Core Page Creation

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
