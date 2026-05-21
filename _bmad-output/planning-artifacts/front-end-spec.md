# Russell Roofing & Exteriors UI/UX Specification

## Introduction
[cite_start]This document defines the user experience goals, information architecture, user flows, and visual design specifications for the Russell Roofing & Exteriors website. [cite: 667] [cite_start]It is based on the provided `style-guide.md` and `state-design-brief.md` and serves as the primary reference for frontend development. [cite: 668]

## Overall UX Goals & Principles
* [cite_start]**Target User Personas:** Homeowners seeking estimates, Commercial Property Managers. [cite: 672]
* **Usability Goals:**
    * [cite_start]**Efficiency:** Allow users to get a meaningful estimate in under 90 seconds. [cite: 673]
    * [cite_start]**Trust:** The design must feel professional, secure, and authoritative through the consistent use of brand colors, high-quality imagery, and trust badges. [cite: 673]
    * **Clarity:** At every step, the user must understand what information is needed and why. [cite_start]All interactions should have immediate and clear feedback. [cite: 673]
* **Design Principles:**
    1.  [cite_start]**Clarity Over Cleverness:** Prioritize clear communication. [cite: 675]
    2.  [cite_start]**Progressive Disclosure:** Show only what's needed, revealing complexity as the user progresses. [cite: 675]
    3.  [cite_start]**Consistent Patterns:** Use the defined component styles universally. [cite: 675]
    4.  [cite_start]**Delight in the Details:** Use motion and micro-interactions to create a polished, memorable experience. [cite: 34]

## Information Architecture (IA)
### Site Map
```mermaid
graph TD
    A[Homepage / Instant Estimate] --> B[Project Gallery]
    A --> C[Dynamic Reviews Section]
    A --> D[Privacy Policy]
    A --> E[Estimate Success Page]
    E --> F[Calendly Scheduling]
````

## User Flows

### Instant Estimate Form

  * [cite\_start]**User Goal:** To get a quick, reasonably accurate price range for their exterior project. [cite: 686]
  * [cite\_start]**Entry Points:** "Get Instant Estimate" CTA in the hero section and sticky mobile CTA bar. [cite: 686]
  * [cite\_start]**Success Criteria:** User successfully submits the form and sees the Success State with their estimate range and scheduling options. [cite: 686]
  * **Flow Diagram:**


```mermaid
graph TD
    Start((Start)) --> S1[Step 1: Property Info];
    S1 -- Address & Type Provided --> S2[Step 2: Project Details];
    S2 -- Services Selected --> S3[Step 3: Contact Info];
    S1 --> BackToStart{Exit};
    S2 --> S1_Back(Back);
    S3 --> S2_Back(Back);
    S3 -- Submitted --> Processing[Submission Processing];
    Processing -- Success --> SuccessState[Success State w/ Estimate];
    Processing -- Error/Offline --> ErrorState[Error / Offline State];
    SuccessState --> Calendly[Schedule Call];
    SuccessState --> Download[Download PDF];
```

## Wireframes & Mockups

[cite\_start]Primary design direction and state definitions are contained within the `russell-roofing-state-brief.md` document, which serves as the source of truth for all interactive states. [cite: 689]

## Component Library / Design System

The core design system is defined in `russell-roofing-style-guide.md`. [cite\_start]Development will use this as a direct blueprint for creating a library of reusable React components. [cite: 694] Key components include:

  * [cite\_start]Primary & Secondary Buttons [cite: 697]
  * [cite\_start]Cards (for services, reviews, etc.) [cite: 697]
  * [cite\_start]Styled Input Fields [cite: 697]

## Branding & Style Guide

The complete style guide is provided in `russell-roofing-style-guide.md`. All frontend development must adhere to the specifications within, including:

  * [cite\_start]**Color Palette:** Primary Burgundy (\#8B1538) and Charcoal (\#2D2D2D). [cite: 698]
  * [cite\_start]**Typography:** Inter for primary text, Playfair Display for select headlines. [cite: 698]
  * [cite\_start]**Spacing System:** 4px base unit. [cite: 698]
  * [cite\_start]**Dark Mode:** All components must have corresponding dark mode variants as specified. [cite: 698]

