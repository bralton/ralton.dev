# Story 1.2: Configure Project Structure and Development Environment

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **the project structure organized per the Architecture specification**,
So that **all future development follows consistent patterns and locations**.

## Acceptance Criteria

1. **AC1: Folder Structure**
   - **Given** the initialized project
   - **When** I create the folder structure
   - **Then** `/app/(frontend)/` exists for public pages
   - **And** `/app/(payload)/` exists for Payload admin routes
   - **And** `/collections/` exists for Payload CMS collection definitions
   - **And** `/components/` exists for React components (flat structure)
   - **And** `/lib/` exists for utilities
   - **And** `/types/` exists for TypeScript types

2. **AC2: Development Tooling**
   - **Given** the project structure is created
   - **When** I configure development tooling
   - **Then** TypeScript strict mode is enabled
   - **And** ESLint is configured with Next.js recommended rules
   - **And** Prettier is configured for consistent formatting

3. **AC3: Environment Variables**
   - **Given** environment variables are needed
   - **When** I create `.env.example`
   - **Then** it contains all required variables: DATABASE_URL, PAYLOAD_SECRET, RESEND_API_KEY, GITHUB_TOKEN, AXIOM_TOKEN, CRON_SECRET
   - **And** `.env.local` is in `.gitignore`

4. **AC4: Local Development Database**
   - **Given** local development needs a database
   - **When** I configure Payload for local development
   - **Then** SQLite is used for local development
   - **And** the database file is gitignored
   - **And** `pnpm dev` starts the development server successfully

## Tasks / Subtasks

- [x] Task 1: Verify and complete folder structure (AC: #1)
  - [x] 1.1: Confirm `/app/(frontend)/` exists (created in Story 1.1)
  - [x] 1.2: Confirm `/app/(payload)/` exists (created in Story 1.1)
  - [x] 1.3: Confirm `/collections/` exists (created in Story 1.1)
  - [x] 1.4: Confirm `/components/` exists with flat structure
  - [x] 1.5: Confirm `/lib/` exists (created in Story 1.1)
  - [x] 1.6: Create `/types/` directory for TypeScript types
  - [x] 1.7: Create `/app/api/` directory structure for future API routes

- [x] Task 2: Configure TypeScript strict mode (AC: #2)
  - [x] 2.1: Verify `tsconfig.json` has `"strict": true`
  - [x] 2.2: Verify `"noImplicitAny": true` is set (covered by strict: true)
  - [x] 2.3: Verify `"strictNullChecks": true` is set (covered by strict: true)
  - [x] 2.4: Add any missing strict mode options (not needed - strict: true enables all)

- [x] Task 3: Configure ESLint with Next.js rules (AC: #2)
  - [x] 3.1: Verify `.eslintrc.json` or `eslint.config.mjs` exists
  - [x] 3.2: Ensure `next/core-web-vitals` or `next/typescript` extends are present
  - [x] 3.3: Run `pnpm lint` and verify no errors
  - [x] 3.4: Fix any existing linting issues

- [x] Task 4: Configure Prettier for formatting (AC: #2)
  - [x] 4.1: Install Prettier if not present (`pnpm add -D prettier`)
  - [x] 4.2: Create `.prettierrc` with project formatting rules
  - [x] 4.3: Create `.prettierignore` for files to skip
  - [x] 4.4: Add format scripts to `package.json`
  - [x] 4.5: Run Prettier on existing files to ensure consistency

- [x] Task 5: Complete environment variables setup (AC: #3)
  - [x] 5.1: Verify `.env.example` exists with all required variables
  - [x] 5.2: Add RESEND_API_KEY to `.env.example` if missing
  - [x] 5.3: Add GITHUB_TOKEN to `.env.example` if missing
  - [x] 5.4: Add AXIOM_TOKEN to `.env.example` if missing
  - [x] 5.5: Add CRON_SECRET to `.env.example` if missing
  - [x] 5.6: Verify `.env.local` and `.env` are in `.gitignore`

- [x] Task 6: Verify local development database (AC: #4)
  - [x] 6.1: Confirm SQLite is configured in `payload.config.ts`
  - [x] 6.2: Verify database file is gitignored (check for `*.db`, `data.db`)
  - [x] 6.3: Run `pnpm dev` and verify server starts successfully
  - [x] 6.4: Verify Payload admin is accessible at `/admin`

## Dev Notes

### Previous Story Intelligence (Story 1.1)

**What was created:**

- Payload CMS project initialized with blank template
- shadcn/ui configured with dark mode as default
- All 8 required shadcn components added
- Brand colors configured per UX specification
- Inter and JetBrains Mono fonts set up via next/font
- SQLite database adapter already configured
- `.env.example` already created with DATABASE_URL, PAYLOAD_SECRET

**Key files from Story 1.1:**

- `src/payload.config.ts` - Payload configuration with SQLite
- `src/app/globals.css` - Global styles with CSS variables
- `tailwind.config.ts` - Brand colors configured
- `components.json` - shadcn/ui configuration
- `.env.example` - Partial environment variables

**Issues resolved in Story 1.1:**

- Build OOM issue resolved by removing accidentally included temp_payload directory
- Added primary-hover CSS variable and button hover states
- Added text-secondary color utility
- Fixed toast auto-dismiss delay (1000s → 5s per UX spec)

### Architecture Compliance

**CRITICAL: Follow these exact patterns from Architecture document:**

**Project Structure (Target State):**

```
personal_website/
├── src/
│   ├── app/
│   │   ├── (frontend)/           # Public pages (route group) ✓ EXISTS
│   │   │   ├── page.tsx          # Home/portfolio page ✓ EXISTS
│   │   │   ├── privacy/          # Privacy policy (create later)
│   │   │   └── layout.tsx        # Frontend layout ✓ EXISTS
│   │   ├── (payload)/            # Payload admin routes ✓ EXISTS
│   │   ├── api/                  # API routes (CREATE)
│   │   │   ├── contact/          # Contact form endpoint (later)
│   │   │   └── cron/             # Vercel cron jobs (later)
│   │   │       └── github/       # Daily GitHub fetch (later)
│   │   ├── globals.css           # ✓ EXISTS
│   │   └── layout.tsx            # Root layout (if needed)
│   ├── collections/              # Payload CMS collections ✓ EXISTS
│   │   ├── Users.ts              # ✓ EXISTS
│   │   └── Media.ts              # ✓ EXISTS
│   ├── components/
│   │   └── ui/                   # shadcn components ✓ EXISTS
│   ├── lib/
│   │   └── utils.ts              # shadcn utils ✓ EXISTS
│   ├── types/                    # TypeScript types (CREATE)
│   └── hooks/                    # React hooks ✓ EXISTS
├── .env.example                  # Partial ✓ EXISTS
├── .prettierrc                   # (CREATE)
├── .prettierignore               # (CREATE)
└── tsconfig.json                 # ✓ EXISTS
```

**Naming Conventions (from Architecture):**
| Element | Convention | Example |
|---------|------------|---------|
| React components | PascalCase | `HeroSection.tsx`, `ProjectCard.tsx` |
| Utilities/helpers | camelCase | `formatDate.ts`, `fetchGitHubData.ts` |
| API routes | kebab-case folders | `/api/contact/route.ts` |
| Payload collections | camelCase | `collections/experiences.ts` |
| Types/interfaces | PascalCase with suffix | `Experience`, `ProjectCardProps` |

### TypeScript Configuration

**Required strict mode settings in `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**DO NOT modify** existing paths, module resolution, or Next.js-specific settings.

### Prettier Configuration

**Create `.prettierrc` with these settings:**

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Create `.prettierignore`:**

```
node_modules
.next
dist
build
pnpm-lock.yaml
*.db
.env*
```

**Add to `package.json` scripts:**

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

**Install dependencies:**

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

### Environment Variables (.env.example)

**Complete list (ensure ALL present):**

```
# Database
DATABASE_URL=file:./data.db

# Payload CMS
PAYLOAD_SECRET=your-secret-key-here

# Email Service (Resend)
RESEND_API_KEY=

# GitHub Integration
GITHUB_TOKEN=

# Observability (Axiom)
AXIOM_TOKEN=

# Cron Job Security
CRON_SECRET=
```

### Testing This Story

After completion, verify:

1. `pnpm dev` starts without errors
2. `pnpm lint` passes with no errors
3. `pnpm build` completes successfully
4. `pnpm format:check` shows all files formatted
5. `/types/` directory exists (can be empty for now)
6. `.env.example` contains all 6 required variables
7. TypeScript strict mode is enabled (verify in IDE)

### CRITICAL WARNINGS

**DO NOT:**

- Modify existing shadcn components in `components/ui/`
- Change database configuration (SQLite is intentional for local dev)
- Add unnecessary dependencies
- Create nested component folders (flat structure required)
- Modify brand colors (already correctly configured)
- Skip running `pnpm build` to verify everything works

**DO:**

- Verify existing files before creating duplicates
- Run all verification steps (lint, build, dev)
- Use exact Prettier and TypeScript configurations from this spec
- Ensure all environment variables are in `.env.example`
- Check `.gitignore` for proper file exclusions

### References

- [Source: architecture.md#Project Structure & Boundaries] - Directory structure
- [Source: architecture.md#Implementation Patterns & Consistency Rules] - Naming conventions
- [Source: architecture.md#Starter Template Evaluation] - Build tooling
- [Source: epic-1-project-foundation-infrastructure.md#Story 1.2] - Acceptance criteria
- [Source: 1-1-initialize-project-with-payload-and-shadcn.md] - Previous story learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- None required - implementation completed without issues

### Completion Notes List

- **Task 1**: Verified all existing directories from Story 1.1. Created `/src/types/` and `/src/app/api/` directories with `.gitkeep` files.
- **Task 2**: Confirmed `tsconfig.json` has `"strict": true` which enables all strict mode options (noImplicitAny, strictNullChecks, etc.). No additional options needed.
- **Task 3**: Created `eslint.config.mjs` with Next.js flat config format using `@eslint/eslintrc` compatibility layer. Fixed linting issue in `use-toast.ts` (unused `actionTypes` const). All lints pass.
- **Task 4**: Installed `prettier` and `prettier-plugin-tailwindcss`. Created `.prettierrc` and `.prettierignore`. Added `format` and `format:check` scripts to `package.json`. Ran Prettier on all source files. Added `_bmad` and `_bmad-output` to `.prettierignore` to avoid conflicts with BMAD framework files.
- **[Code Review Fix]**: Added `src/payload-types.ts` to `.prettierignore` (auto-generated file should not be formatted). Updated File List with complete documentation of all modified files.
- **Task 5**: Updated `.env.example` with all 6 required variables (DATABASE_URL, PAYLOAD_SECRET, RESEND_API_KEY, GITHUB_TOKEN, AXIOM_TOKEN, CRON_SECRET). Added `*.db` and `data.db` to `.gitignore`.
- **Task 6**: Verified SQLite is configured in `payload.config.ts`. Database file patterns gitignored. Dev server starts successfully with 200 response from `/` and `/admin`. Build completes successfully.

### Change Log

- 2026-03-07: Story 1.2 implementation complete - all acceptance criteria satisfied
- 2026-03-07: [Code Review] Fixed .prettierignore to exclude auto-generated payload-types.ts, updated File List documentation

### File List

**New files:**
- `src/types/.gitkeep`
- `src/app/api/.gitkeep`
- `eslint.config.mjs`
- `.prettierrc`
- `.prettierignore`

**Modified files:**
- `src/hooks/use-toast.ts` - Fixed unused variable lint error
- `package.json` - Added format scripts, prettier devDependencies, @eslint/eslintrc
- `pnpm-lock.yaml` - Updated from package.json dependency changes
- `.env.example` - Added all required environment variables
- `.gitignore` - Added database file patterns (*.db, data.db)
- `tsconfig.json` - Reformatted by Prettier (no functional changes)
- `src/payload-types.ts` - Regenerated by Payload (auto-generated file)
- `src/components/ui/badge.tsx` - Reformatted by Prettier
- `src/components/ui/button.tsx` - Reformatted by Prettier
- `src/components/ui/card.tsx` - Reformatted by Prettier
- `src/components/ui/input.tsx` - Reformatted by Prettier
- `src/components/ui/navigation-menu.tsx` - Reformatted by Prettier
- `src/components/ui/skeleton.tsx` - Reformatted by Prettier
- `src/components/ui/textarea.tsx` - Reformatted by Prettier
- `src/components/ui/toast.tsx` - Reformatted by Prettier
- `src/components/ui/toaster.tsx` - Reformatted by Prettier
- `src/app/(frontend)/page.tsx` - Reformatted by Prettier
- `src/app/(payload)/admin/importMap.js` - Reformatted by Prettier
