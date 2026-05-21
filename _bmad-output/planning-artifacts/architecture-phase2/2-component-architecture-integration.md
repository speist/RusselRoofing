# 2. Component Architecture & Integration

* **New Component Directory:**
    All new, redesigned components generated from Vercel v0 (which are built with `shadcn/ui`) will be added to a dedicated directory: `src/components/ui/`. This keeps them organized and distinct from any older, legacy components. The `dev` agent will use the `npx shadcn-ui@latest add` command to bring each component's code into this directory as required by the user stories.

* **Feature-Specific Component Organization:**
    Components that are specific to a new feature or page will be organized by that feature. For example, all the new sections for the homepage will be created in a `src/components/home/` directory.
    * `src/components/home/hero-section.tsx`
    * `src/components/home/services-carousel.tsx`
    * `src/components/home/testimonials-carousel.tsx`

* **Interaction Between New and Old Components:**
    To maintain design consistency, our `dev` agent will follow a clear principle:
    * **Forward-Compatibility:** New, redesigned components (from `src/components/ui/`) can be used to upgrade older pages.
    * **No Backward-Compatibility:** We will avoid placing old, legacy components inside the new, redesigned sections (like the homepage) to prevent visual inconsistencies.

* **Component Structure Diagram:**
    This diagram illustrates the separation:
    ```mermaid
    graph TD
        subgraph Application
            A[App Shell / Layout]
        end

        subgraph New Pages (e.g., Homepage)
            B[src/components/home/...]
        end
        
        subgraph Reusable New UI
            C[src/components/ui/ (shadcn)]
        end

        subgraph Legacy Pages & Components
            D[src/components/legacy/...]
        end

        A --> B
        A --> D
        B --> C
        D --> C
    ```

---
