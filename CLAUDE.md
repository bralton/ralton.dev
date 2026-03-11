# CLAUDE.md

## Build Commands

| Command | Purpose | Notes |
|---------|---------|-------|
| `pnpm dev` | Start dev server | Requires `DATABASE_URL` |
| `pnpm build` | Production build | Runs `payload migrate && next build` — needs database |
| `npx next build` | Build without migrations | Use for local verification when no DB available |
| `pnpm lint` | Run ESLint | |
| `pnpm format` | Run Prettier | |
| `pnpm devsafe` | Dev with clean `.next` | Deletes `.next` before starting |
| `pnpm payload` | Raw Payload CLI | For migrations, seed, etc. |

**Local build note:** `pnpm build` hangs without a running database because `payload migrate` requires a connection. Use `npx next build` for local build verification.

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Public site pages and layout
│   ├── (payload)/           # Payload admin panel (/admin)
│   ├── api/
│   │   ├── contact/         # Contact form endpoint
│   │   ├── cron/            # github/, cleanup-contacts/
│   │   ├── preview/         # Draft preview mode
│   │   └── exit-preview/
│   ├── globals.css          # Tailwind base + CSS variables
│   └── sitemap.ts           # Dynamic sitemap generation
├── components/              # React components
│   └── ui/                  # shadcn/ui primitives
├── collections/             # Payload CMS collections (11)
├── lib/                     # Utilities (github, discord, email, logger, etc.)
│   └── validations/         # Zod schemas
├── hooks/                   # React hooks
├── admin/                   # Payload admin customizations
├── migrations/              # Payload DB migrations
├── payload.config.ts        # Payload CMS configuration
└── payload-types.ts         # Auto-generated types (do not edit)
```

Other top-level directories:
- `_bmad/` — Project management workflow templates
- `_bmad-output/` — Generated planning and implementation artifacts
- `.github/workflows/` — CI (Lighthouse, sitemap/robots.txt validation)
- `public/` — Static assets (og-image.png, robots.txt)
- `scripts/` — CI seed script

## Dev Standards

### Imports

Use `@/` path alias for all imports from `src/`:
```ts
import { cn } from '@/lib/utils'
import { HeroSection } from '@/components/HeroSection'
```

### File Naming

- Components: **PascalCase** (`HeroSection.tsx`, `ExperienceCard.tsx`)
- shadcn/ui: **lowercase** (`button.tsx`, `card.tsx`)
- Utilities/hooks: **camelCase** (`github.ts`, `use-toast.ts`)
- Collections: **PascalCase** (`Projects.ts`, `Hero.ts`)

### Formatting

- Prettier: 100 char width, single quotes, 2-space indent, es5 trailing commas
- Tailwind classes auto-sorted by `prettier-plugin-tailwindcss`

### Accessibility

- Use `teal-700` for primary accent, `teal-800` for hover (WCAG AA). Do NOT use `teal-600` (insufficient contrast).
- Semantic HTML: `<ul role="list">` with `<li>` wrappers for repeated elements. Add `aria-label` on lists.
- React keys: use unique IDs (`key={item.id}`), never array index.
- Focus states on all interactive elements: `focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 focus:ring-offset-background`

### Fonts

- Inter (sans-serif, primary), JetBrains Mono (monospace)

## Testing Status

**No unit/integration test framework is configured.** Playwright E2E tests are planned for Epic 8 (Story 8.5).

Current CI validation (`.github/workflows/accessibility.yml`):
- Lighthouse accessibility audit
- Sitemap XML structure validation
- robots.txt content validation
- Runs on PR and push to main

## Environment Variables

See `.env.example` for the full list. Key variables:
- `DATABASE_URL` — PostgreSQL (Neon)
- `PAYLOAD_SECRET` — Required for Payload CMS
- `NEXT_PUBLIC_SITE_URL` — Canonical URL (`https://ralton.dev`)
- `CRON_SECRET` — Authenticates cron job endpoints

## Key Patterns

- **Payload globals** (singletons): Hero, About, GitHubData
- **Payload collections**: Projects, Skills, Experiences, Education, ContactSubmissions, SocialLinks, Media, Users
- **Revalidation**: On-demand via `payloadHooks.ts` after collection changes
- **Notifications**: Non-blocking `Promise.allSettled()` for email + Discord
- **Security**: CSP headers, X-Frame-Options DENY, brute-force protection on admin (5 attempts / 10-min lockout)
