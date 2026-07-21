# Story 10.1: New design tokens across the site

Status: done

## Story

As a visitor,
I want the site rendered in the new visual palette,
so that every page immediately feels like the redesigned brand.

## Acceptance Criteria

1. **Given** the site loads any page, **when** styles apply, **then** all 12 tokens from the redesign UX spec (§Visual Design Foundation) are defined as CSS custom properties in `globals.css` and mapped into the Tailwind/shadcn theme config.
2. **And** no component references raw hex values (existing raw hexes in `tailwind.config.ts` — `text-secondary: #a1a1aa`, `surface: #18181b` — are re-pointed at the new tokens; components keep compiling).
3. **And** `--text-3` (`#5D7288`) on `--panel` (`#10161D`) is verified ≥ 4.5:1 contrast; if it fails, the token value is bumped (lighten `--text-3`) and the change recorded in Dev Notes.
4. **And** the Lighthouse accessibility CI gate remains green (`.github/workflows/accessibility.yml`).
5. **And** `npx next build` passes locally (no DB needed).

## Tasks / Subtasks

- [ ] Task 1: Define the redesign token layer in `src/app/globals.css` (AC: 1)
  - [ ] Replace the `.dark` block's values with the redesign palette (site is hard-pinned to dark via `<html className="dark ...">` in `src/app/(frontend)/layout.tsx:88` — the `.dark` block is the live theme; leave the `:root` light block present but do not invest in it)
  - [ ] Add the 12 redesign tokens as first-class custom properties (see Token Table below) alongside the shadcn HSL slots
  - [ ] Map shadcn slots onto redesign values: `--background`→`#0B0F14`, `--card`/`--popover`→`#10161D`, `--foreground`/`--card-foreground`→`#E6EDF3`, `--muted-foreground`→`#94A6B8`, `--border`/`--input`→`#1E2937`, `--primary`→`#14B8A6` with `--primary-foreground`→`#04201D` (**note: dark text on teal now, was white**), `--primary-hover`→`#2DD4BF` (**hover now lightens, v1 darkened**), `--ring`→`#2DD4BF`, `--accent`→`#0F766E`
  - [ ] Keep `--destructive` (error red) unchanged; keep `--radius: 0.5rem`
- [ ] Task 2: Update `tailwind.config.ts` theme mapping (AC: 1, 2)
  - [ ] Add named color entries: `panel`, `panel-2`, `border-soft`, `text-2`, `text-3`, `teal` (DEFAULT `#2DD4BF` via var), `teal.dim`, `teal.deep`, `teal.ink` — all as `var(--…)` references, no raw hexes
  - [ ] Re-point `'text-secondary'` → `var(--text-2)` and `surface` → `var(--panel)` so ~16 existing components restyle without edits
  - [ ] Add `borderRadius.xl: '12px'` (panel radius) and `borderRadius.chip: '4px'` per spec radii
- [ ] Task 3: Contrast verification (AC: 3)
  - [ ] Compute contrast ratios: `--text` on `--bg`, `--text-2` on `--panel`, `--text-3` on `--bg` and on `--panel`, `#04201D` on `--teal-dim`
  - [ ] If `--text-3` on `--panel` < 4.5:1, lighten `--text-3` until it passes and note the final hex
- [ ] Task 4: Sanity-check hardcoded teal utilities (AC: 2, 4)
  - [ ] Grep for `teal-400|teal-600|teal-700|teal-800` Tailwind utilities in `src/components/` — these reference Tailwind's default teal scale and still compile; do NOT restyle components in this story (later stories own that), but confirm none break visually against the new darker ground (spot-check hero buttons + nav)
- [ ] Task 5: Verify build and CI (AC: 4, 5)
  - [ ] `npx next build` passes; `pnpm lint` and `pnpm format` clean
  - [ ] Confirm Lighthouse accessibility workflow passes on the PR

## Dev Notes

### Token Table (source of truth — UX spec §Visual Design Foundation)

| Custom property | Hex | Purpose |
|---|---|---|
| `--bg` | `#0B0F14` | Page ground (blue-biased near-black) |
| `--panel` | `#10161D` | Card/panel surfaces |
| `--panel-2` | `#141C25` | Raised surfaces (thumbnails, hover fills) |
| `--border` | `#1E2937` | Default panel borders |
| `--border-soft` | `#182230` | Hairlines/section rules |
| `--text` | `#E6EDF3` | Primary text |
| `--text-2` | `#94A6B8` | Secondary text |
| `--text-3` | `#5D7288` | Tertiary/meta (mono labels) — subject to AC-3 contrast check |
| `--teal` | `#2DD4BF` | Bright accent (labels, links, active) |
| `--teal-dim` | `#14B8A6` | Primary button fill, tag text |
| `--teal-deep` | `#0F766E` | Hover borders, subdued accent |
| `--teal-ink` | `#042F2E` | Accent-tinted fills |

Decide the CSS format deliberately: shadcn slots currently use space-separated HSL consumed as `hsl(var(--x))`. Either convert redesign hexes to that HSL format for the shadcn slots, or move the Tailwind mapping to direct `var(--x)` values with hex tokens. **Do not mix formats within one slot** — `hsl(var(--x))` with a hex value silently produces invalid color. Recommended: keep shadcn slots HSL-formatted; define the 12 redesign tokens as plain hex properties for the new named colors.

### Architecture patterns and constraints

- Tailwind **v3.4** (`tailwind.config.ts`, `darkMode: ['class']`) — this is NOT Tailwind v4; tokens go in the config's `theme.extend.colors`, not `@theme` CSS.
- Fonts already correct: Inter + JetBrains Mono via `next/font/google` with `--font-inter` / `--font-jetbrains-mono` variables (`src/app/(frontend)/layout.tsx`). No font work in this story.
- Dark mode is pinned: `<html className="dark …">`. No theme toggle exists; do not add one.
- The Payload admin panel (`src/app/(payload)`) has its own styling — verify `globals.css` changes don't leak into admin (check how admin imports styles before shipping).
- NFR-R6: zero Payload/schema changes. NFR-R9: don't touch security headers/CSP.
- Scope discipline: this story is tokens + config only. Components visibly re-tint through inherited tokens; deliberate component restyling belongs to stories 10.2–10.8. Resist fixing layout while in here.

### Source tree components to touch

- `src/app/globals.css` — token definitions (primary change)
- `tailwind.config.ts` — theme mapping (secondary change)
- Nothing else should need edits; ~16 components consume `text-secondary`/`surface`/shadcn slots and re-tint automatically

### Testing standards summary

- No unit test framework exists (per CLAUDE.md). Verification = `npx next build` + `pnpm lint` + Lighthouse CI on PR + visual spot-check via `pnpm dev` (needs `DATABASE_URL`).
- Contrast math is the one hard check: document computed ratios in the completion notes.

### Project Structure Notes

- Conventions per CLAUDE.md: `@/` imports, Prettier 100-char/single-quote, Tailwind classes auto-sorted by prettier-plugin-tailwindcss.
- v1's teal-700/teal-800 accessibility rule is superseded by the new system for *fills* (`--teal-dim` fill + dark text `#04201D` passes AA at 8:1+); the old rule still holds for teal *text* on dark grounds below 14px — bright teal text is mono-treatment only per NFR-R8.

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification-redesign.md#Visual Design Foundation] — token table, semantic rules, radii
- [Source: _bmad-output/planning-artifacts/epics-redesign.md#Story 10.1] — story + ACs
- [Source: _bmad-output/planning-artifacts/redesign-mockup-approved.html] — visual source of truth (`:root` block, lines 1–20)
- [Source: src/app/globals.css] — current shadcn HSL slots to remap
- [Source: tailwind.config.ts] — current theme mapping incl. raw hexes to eliminate
- [Source: src/app/(frontend)/layout.tsx:88] — dark-pinned html + font variables

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
