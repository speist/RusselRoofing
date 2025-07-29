# Epic 5: Homepage Finalization & Content Integration

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
