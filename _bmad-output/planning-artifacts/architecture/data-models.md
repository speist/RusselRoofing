# Data Models

## Estimate

  * **Purpose:** Stores the details and results of a user's estimate request.
  * **TypeScript Interface:**
    ```typescript
    interface Estimate {
      id: string; // uuid
      createdAt: Date;
      propertyType: 'single_family' | 'multi_family' | 'commercial';
      address: string;
      services: string[]; // e.g., ['roofing', 'gutters']
      squareFootage?: number;
      contactName: string;
      contactEmail: string;
      contactPhone: string;
      estimatedRange: { min: number; max: number };
      status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
    }
    ```

*(Additional models for Projects, Reviews, etc., would be defined here)*
