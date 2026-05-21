# Unified Project Structure

```plaintext
russell-roofing-monorepo/
├── apps/
│   └── web/                    # Next.js frontend application
│       ├── src/
│       │   ├── app/            # App Router: pages and layouts
│       │   ├── components/     # Reusable UI components (Buttons, Cards)
│       │   ├── lib/            # Helper functions, utils
│       │   └── server/         # tRPC API definitions and routers
│       └── tailwind.config.ts
├── packages/
│   ├── ui/                     # Shared headless UI components (using Radix)
│   ├── config/                 # Shared configs (ESLint, TSConfig)
│   └── db/                     # Drizzle ORM schema and migrations
└── pnpm-workspace.yaml
```
