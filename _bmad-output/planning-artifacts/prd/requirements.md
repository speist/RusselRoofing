# Requirements
## Functional
1.  **FR1:** The system shall present a multi-step "Instant Estimate" form that collects property, project, and contact information.
2.  **FR2:** The estimate form shall provide real-time feedback on the estimated price range as the user makes selections.
3.  [cite_start]**FR3:** The system must use the Google Places API to provide address autocomplete functionality. [cite: 252]
4.  **FR4:** All form submissions must be sent to HubSpot, creating or updating a contact and deal.
5.  **FR5:** The system shall display a gallery of past projects filterable by service type (e.g., Roofing, Siding).
6.  **FR6:** The gallery shall feature a lightbox view for detailed image inspection.
7.  **FR7:** The website shall display a carousel of customer reviews sourced dynamically.
8.  **FR8:** The system shall implement progressive profiling for returning visitors to avoid asking for redundant information.
9.  **FR9:** Emergency requests submitted through the form must be visually prioritized and trigger an expedited internal workflow.

## Non-Functional
1.  **NFR1:** All page loads must achieve a Largest Contentful Paint (LCP) of under 2.5 seconds.
2.  [cite_start]**NFR2:** All interactive elements (buttons, inputs) must have a response time of less than 200ms. [cite: 644]
3.  **NFR3:** The user interface must be fully responsive and functional across mobile, tablet, and desktop breakpoints as defined in the style guide.
4.  **NFR4:** All user-facing text and imagery must meet WCAG AA contrast compliance.
5.  **NFR5:** Form state must be preserved locally in the browser in case of accidental closure or network interruption.
