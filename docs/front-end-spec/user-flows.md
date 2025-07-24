# User Flows

## Instant Estimate Form

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
