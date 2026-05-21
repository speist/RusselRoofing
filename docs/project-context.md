# Russell Roofing & Exteriors — Project Context

**Last refreshed:** 2026-05-21
**Status:** Production / post-Epic-7 (all planned epics complete)
**BMad framework:** v6.7.1

This document gives AI agents the working context they need to make changes
without re-discovering the codebase. It's the canonical answer to "what is this
project, what's done, what conventions apply?"

---

## What this project is

Marketing website + lead-capture funnel for **Russell Roofing & Exteriors**, a
roofing/exteriors contractor. The site's primary commercial purpose is to convert
visitors into estimate requests routed into HubSpot CRM.

Key user flows:
- **Instant Estimate** — multi-step form (property → project → contact) that scores leads and routes them to the right sales rep
- **Service pages** — eight service categories with detailed pages
- **Trust building** — social proof carousel, project gallery, client testimonials, Instagram feed
- **Lead capture** — contact form, hiring form, all routed through HubSpot

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript (strict)
- **Styling:** Tailwind CSS with custom design tokens
- **Forms:** React Hook Form
- **Testing:** Vitest + React Testing Library (jsdom)
- **Package manager:** pnpm 8+ (monorepo workspace)
- **Node:** 20+ (see `.nvmrc`)
- **Theming:** `next-themes` (class-based dark mode)
- **Email:** Resend (lazy-initialized to avoid build-time errors)
- **Anti-spam:** Google reCAPTCHA on contact and estimate forms

**External integrations:**
- HubSpot CRM (contacts, deals, tickets, notes, blog, careers, FAQs)
- Google Places API
- Instagram Basic Display API
- CompanyCam API (for gallery photos)

---

## Repo Layout

```
/                                  # monorepo root (pnpm workspace)
├── apps/web/                      # the Next.js app (only app)
│   └── src/
│       ├── app/                   # App Router
│       │   ├── api/               # hubspot/, instagram/, reviews/, companycam/, contact/, estimate/, health/
│       │   └── services/[slug]/   # dynamic service detail pages
│       ├── components/            # feature-organized (estimate/, layout/, ui/, ...)
│       ├── data/                  # static content: services.ts, service-details.ts, gallery.ts
│       ├── lib/
│       │   ├── hubspot/           # unified HubSpotApiService with mock-mode fallback
│       │   ├── lead-routing/      # scoring + routing engine
│       │   ├── recaptcha.ts       # server verification
│       │   ├── useRecaptcha.ts    # client hook
│       │   ├── config.ts          # service config (getServiceConfig)
│       │   └── env-validation.ts  # validates env vars on server startup
│       └── types/                 # TypeScript definitions
├── packages/                      # (reserved — no shared packages yet)
├── _bmad/                         # BMad v6 install (installer-managed)
├── _bmad-output/                  # BMad-generated artifacts
│   ├── planning-artifacts/        # PRDs, architecture, briefs, UX spec
│   ├── implementation-artifacts/  # stories/, sprint-status.md
│   └── test-artifacts/            # (empty — populate via /bmad-tea)
├── docs/                          # general project knowledge (this file, ENVIRONMENT_SETUP, etc.)
├── _archive/bmad-v4/              # legacy v4 BMad install (reference only)
└── archon/                        # Archon task-management server (project-local)
```

---

## Implementation State (level-set)

All 23 stories across 7 epics complete. See
`_bmad-output/implementation-artifacts/sprint-status.md` for the full breakdown.

**Phase 1 (Epics 1–4):** Foundation, multi-step Estimate form, social proof + gallery, HubSpot + lead routing.
**Phase 2 (Epics 5–7):** Homepage finalization, /services + /about + /contact pages, production env config.

**Post-completion changes** (not formal BMad stories):
- HubSpot Blog integration
- HubSpot FAQ setup (CSV in repo root)
- Form submissions migrated from HubSpot forms → email via Resend
- reCAPTCHA on contact + estimate
- Phone number + "24/7" language refresh site-wide
- Mobile estimate CTAs → tel: link, desktop → contact page

---

## Conventions

### Path aliases
```typescript
import { Button } from "@/components/ui/Button"  // @/ → apps/web/src/
```

### Design system
- Primary color: `#960120` (burgundy) via `rgb(var(--color-primary-burgundy))`
- Fonts: Inter, Playfair Display, Lora
- Dark mode: class-based via `next-themes`

### API routes
- All export `export const dynamic = 'force-dynamic'` for Vercel compat
- Server-side only — API keys never reach the client
- Typed responses via `HubSpotApiResponse<T>` for HubSpot endpoints
- Mock-mode fallback in `lib/hubspot/` when API keys are absent (enables local dev without secrets)

### Environment variables
- Copy `.env.example` → `.env.local`
- Validated on server startup by `lib/env-validation.ts` (runs in `app/layout.tsx`)
- Categories: hubspot, google, instagram, companycam, app, notification
- Client-side vars require `NEXT_PUBLIC_` prefix

### Testing
- Co-located `__tests__/` directories
- Vitest globals enabled (no imports needed)
- Run: `cd apps/web && pnpm test` (watch) or `pnpm test:run` (CI)

### Services
8 categories defined in `apps/web/src/data/service-details.ts`:
Roofing, Siding and Gutters, Commercial, Churches & Institutions,
Historical Restoration, Masonry, Windows, Skylights.
Dynamic routes: `/services/[slug]`.

---

## Task Management Rule (project override)

**This project uses Archon as the primary task system, not TodoWrite/TaskCreate.**
See `CLAUDE.md` "Archon-First Rule" at repo root. BMad stories live in
`_bmad-output/implementation-artifacts/stories/` — they describe planned work.
Archon tracks ongoing/in-flight tasks.

---

## Common Commands

```bash
# Install + run
pnpm install              # requires pnpm 8+, Node 20+
pnpm dev                  # dev server
pnpm build                # production build
pnpm start                # serve production build

# Quality
pnpm lint
pnpm typecheck
pnpm format

# Tests (from apps/web/)
pnpm test                 # watch
pnpm test:run             # CI mode
pnpm test:ui              # Vitest UI
pnpm test -- path/to.test.ts

# Gallery tooling (from apps/web/)
pnpm gallery:validate     # validate image structure
pnpm gallery:process      # generate thumbnails + blur data
```

---

## Where to find things

| Question | File |
|----------|------|
| What's the PRD? | `_bmad-output/planning-artifacts/prd.md` (Phase 1), `brownfield-prd-phase2.md` (Phase 2) |
| What's the architecture? | `_bmad-output/planning-artifacts/architecture.md` and `architecture-phase2/` |
| What's the UX spec? | `_bmad-output/planning-artifacts/front-end-spec.md` + `front-end-spec/` |
| What stories were built? | `_bmad-output/implementation-artifacts/stories/` (23 files) |
| Where do environments get validated? | `apps/web/src/lib/env-validation.ts` |
| How is HubSpot wired? | `apps/web/src/lib/hubspot/` (api.ts, contacts.ts, deals.ts, …) |
| How are leads scored/routed? | `apps/web/src/lib/lead-routing/` (scoring.ts, routing-engine.ts) |
| Where's gallery management documented? | `docs/gallery-management.md` |
| Recent update logs? | `docs/Updates2426.md`, `docs/Updates31726.md`, `Updates/Updates 10-23.md` (root-level) |
