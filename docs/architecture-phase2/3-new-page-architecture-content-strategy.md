# 3. New Page Architecture & Content Strategy

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
