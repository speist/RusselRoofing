# Epic 7: Production Readiness & Configuration

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