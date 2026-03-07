# Story 1.1: Initialize Project with Payload and shadcn

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **a properly initialized project with Payload CMS and shadcn/ui configured**,
So that **I have the foundational codebase ready for building the portfolio site**.

## Acceptance Criteria

1. **AC1: Payload CMS Initialization**
   - **Given** no existing project in the repository
   - **When** I run the Payload blank template initialization command
   - **Then** a new Next.js project is created with Payload CMS integrated
   - **And** the project uses TypeScript by default

2. **AC2: shadcn/ui Configuration**
   - **Given** the Payload project is initialized
   - **When** I run shadcn/ui init with dark mode configuration
   - **Then** shadcn/ui is configured with CSS variables for theming
   - **And** Tailwind CSS is properly configured

3. **AC3: Required Components Added**
   - **Given** shadcn/ui is initialized
   - **When** I add the required components (button, card, input, textarea, toast, navigation-menu, badge, skeleton)
   - **Then** all components are available in `/components/ui/`
   - **And** components use the dark theme by default

4. **AC4: Theme Colors Configured**
   - **Given** Tailwind is configured
   - **When** I update the theme with brand colors
   - **Then** primary accent color is dark green (#0d9488)
   - **And** background color is near-black (#09090b)
   - **And** the color palette matches the UX specification

## Tasks / Subtasks

- [x] Task 1: Initialize Payload CMS project (AC: #1)
  - [x] 1.1: Run `pnpx create-payload-app@latest -t blank` to create the project
  - [x] 1.2: Verify Next.js App Router structure exists
  - [x] 1.3: Verify TypeScript is configured
  - [x] 1.4: Verify the project builds without errors (`pnpm build`)

- [x] Task 2: Initialize shadcn/ui (AC: #2)
  - [x] 2.1: Run `npx shadcn@latest init` inside the project directory
  - [x] 2.2: Select dark mode as default style
  - [x] 2.3: Configure CSS variables approach for theming
  - [x] 2.4: Verify Tailwind CSS is properly configured

- [x] Task 3: Add required shadcn components (AC: #3)
  - [x] 3.1: Run `npx shadcn@latest add button card input textarea toast navigation-menu badge skeleton`
  - [x] 3.2: Verify all components exist in `/components/ui/`
  - [x] 3.3: Verify components import correctly without errors

- [x] Task 4: Configure brand theme colors (AC: #4)
  - [x] 4.1: Update `tailwind.config.ts` with UX specification colors
  - [x] 4.2: Update CSS variables in `globals.css` for dark mode
  - [x] 4.3: Verify primary accent (#0d9488) is applied
  - [x] 4.4: Verify background (#09090b) is applied
  - [x] 4.5: Verify full color palette from UX spec is configured

## Dev Notes

### Architecture Compliance

**CRITICAL: Follow these exact commands from Architecture document:**

```bash
# 1. Create Payload app with blank template
pnpx create-payload-app@latest -t blank

# 2. Initialize shadcn/ui (run inside project directory)
npx shadcn@latest init

# 3. Add shadcn components as needed
npx shadcn@latest add button card input textarea toast navigation-menu badge skeleton
```

**Key Architecture Decisions:**
- **Starter Template:** Payload Blank Template + shadcn/ui (NOT Website Template - that's overkill)
- **Database:** SQLite for local development (Payload auto-configures)
- **Runtime:** Node.js via Vercel serverless functions
- **Styling:** Tailwind CSS with CSS variables for theming

### Project Structure Requirements

After initialization, the project structure should match this pattern:

```
personal_website/
├── app/
│   ├── (frontend)/      # Public pages (route group) - create if missing
│   ├── (payload)/       # Payload admin routes (auto-generated)
│   └── layout.tsx       # Root layout
├── collections/         # Payload CMS collections (created later)
├── components/
│   └── ui/              # shadcn components go here
├── lib/
│   └── utils.ts         # shadcn utils (cn function)
├── payload.config.ts    # Payload configuration
├── tailwind.config.ts   # Tailwind configuration
├── next.config.ts       # Next.js configuration
└── globals.css          # Global styles with CSS variables
```

### Color System (from UX Specification)

**Primary Palette - MUST USE THESE EXACT VALUES:**

| Role | Hex Code | Usage |
|------|----------|-------|
| Background | `#09090b` | Page background |
| Surface | `#18181b` | Cards, elevated elements |
| Border | `#27272a` | Dividers, card borders |
| Primary | `#0d9488` | Accent, CTAs, links |
| Primary Hover | `#14b8a6` | Hover states |
| Text Primary | `#fafafa` | Headings, important text |
| Text Secondary | `#a1a1aa` | Body text, descriptions |
| Text Muted | `#71717a` | Captions, metadata |

**Semantic Colors:**
| State | Hex Code |
|-------|----------|
| Success | `#22c55e` |
| Warning | `#f59e0b` |
| Error | `#ef4444` |

### shadcn/ui Configuration

When running `npx shadcn@latest init`, use these settings:
- **Style:** Default (dark mode will be configured manually)
- **Base color:** Slate (will be overridden with brand colors)
- **CSS variables:** Yes
- **Tailwind config:** `tailwind.config.ts`
- **Components location:** `@/components`
- **Utils location:** `@/lib/utils`

### Font Configuration

From UX Specification:
- **Primary font:** Inter (with system fonts fallback)
- **Monospace font:** JetBrains Mono (for code, tech badges)

Next.js handles font loading optimization automatically with `next/font`.

### Testing This Story

After completion, verify:
1. `pnpm dev` starts without errors
2. Visit `http://localhost:3000` - should see Payload welcome page
3. Visit `http://localhost:3000/admin` - should see Payload admin login
4. All shadcn components import without TypeScript errors
5. Theme colors are visible (background should be near-black)

### CRITICAL WARNINGS

**DO NOT:**
- Use the Payload Website Template (includes blog, search, redirects plugins we don't need)
- Install unnecessary dependencies
- Create complex folder hierarchies in components/ (flat structure required)
- Modify files in `components/ui/` directly (shadcn convention)
- Skip verifying the build works after initialization

**DO:**
- Follow the exact initialization commands from Architecture document
- Use the exact color hex values from UX specification
- Verify everything builds before marking complete
- Create the `(frontend)` route group for public pages

### References

- [Source: architecture.md#Starter Template Evaluation] - Initialization commands
- [Source: architecture.md#Project Structure & Boundaries] - Directory structure
- [Source: ux-design-specification.md#Visual Design Foundation] - Color palette
- [Source: ux-design-specification.md#Design System Foundation] - shadcn/ui configuration
- [Source: prd.md#Project Classification] - Tech stack confirmation
- [Source: epic-1-project-foundation-infrastructure.md#Story 1.1] - Acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Initial build OOM issue resolved by removing accidentally included temp_payload directory (103MB Payload monorepo clone was being type-checked)

### Completion Notes List

- Initialized Payload CMS project using blank template with SQLite database adapter
- Configured shadcn/ui with dark mode as default, CSS variables for theming
- Added all 8 required shadcn components (button, card, input, textarea, toast, navigation-menu, badge, skeleton)
- Configured brand colors per UX specification with full color palette
- Set up Inter and JetBrains Mono fonts via next/font
- All builds pass successfully

### File List

**New Files:**
- package.json - Project manifest with dependencies
- tsconfig.json - TypeScript configuration
- tailwind.config.ts - Tailwind CSS configuration with brand colors
- postcss.config.mjs - PostCSS configuration
- next.config.mjs - Next.js configuration with Payload integration
- components.json - shadcn/ui configuration
- .env - Environment variables (PAYLOAD_SECRET, DATABASE_URL)
- .env.example - Environment variable template for onboarding
- src/payload.config.ts - Payload CMS configuration with SQLite
- src/payload-types.ts - Generated Payload types
- src/lib/utils.ts - shadcn utility functions (cn)
- src/app/globals.css - Global styles with CSS variables
- src/app/(frontend)/layout.tsx - Frontend layout with fonts and dark mode
- src/app/(frontend)/page.tsx - Home page with Tailwind classes
- src/app/(payload)/layout.tsx - Payload admin layout
- src/app/(payload)/custom.scss - Payload admin custom styles
- src/app/(payload)/admin/[[...segments]]/page.tsx - Admin page
- src/app/(payload)/admin/[[...segments]]/not-found.tsx - Admin 404
- src/app/(payload)/admin/importMap.js - Payload import map
- src/app/(payload)/api/[...slug]/route.ts - API routes
- src/app/(payload)/api/graphql/route.ts - GraphQL endpoint
- src/app/(payload)/api/graphql-playground/route.ts - GraphQL playground
- src/collections/Users.ts - Users collection
- src/collections/Media.ts - Media collection
- src/components/ui/button.tsx - Button component
- src/components/ui/card.tsx - Card component
- src/components/ui/input.tsx - Input component
- src/components/ui/textarea.tsx - Textarea component
- src/components/ui/toast.tsx - Toast component
- src/components/ui/toaster.tsx - Toaster component
- src/components/ui/navigation-menu.tsx - Navigation menu component
- src/components/ui/badge.tsx - Badge component
- src/components/ui/skeleton.tsx - Skeleton component
- src/hooks/use-toast.ts - Toast hook

### Change Log

- 2026-03-07: Story 1.1 implemented - Payload CMS + shadcn/ui initialization complete
- 2026-03-07: Code review completed - Fixed 5 medium issues, 1 low issue:
  - Added .env.example template file
  - Added primary-hover CSS variable and updated button hover states
  - Added text-secondary color utility (#a1a1aa)
  - Removed boilerplate my-route endpoint
  - Fixed toast auto-dismiss delay (1000s → 5s per UX spec)
  - Updated architecture.md to include skeleton in shadcn command

