# Development Workflow

## Local Development Setup

1.  [cite\_start]**Prerequisites:** Node.js (\~20.x), pnpm (\~8.x). [cite: 970]
2.  **Initial Setup:**
    ```bash
    git clone <repo_url>
    cd russell-roofing-monorepo
    pnpm install
    cp apps/web/.env.local.example apps/web/.env.local # Populate with Supabase keys
    ```
3.  **Development Commands:**
    ```bash
    # Run the Next.js development server
    pnpm dev
    ```
