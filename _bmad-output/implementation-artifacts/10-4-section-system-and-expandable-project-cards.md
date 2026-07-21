# Story 10.4: Section system and expandable project cards

Status: done

## Story
As a visitor, I want projects presented as scannable, expandable cards under a consistent section header, so that I can skim or go deep on my terms.

## Acceptance Criteria (epics-redesign.md FR-R2, FR-R3, FR-R9, FR-R10)
1. ~/projects uses shared Section + SectionHeader (rhythm owned solely by Section; h2 semantics).
2. Cards 2-up (1-up <900px): thumbnail (Media image or generated-SVG fallback), title, StatusBadge, one-sentence summary, tags, github link, collapsed <details> write-up.
3. Whole-card click toggles (links/summary excluded, text-selection safe); <summary> keyboard-operable; +/- glyph flip.

## Dev Notes / decisions
- No `status` field exists on Projects (NFR-R6) -> StatusBadge derives from title convention: /(abandoned|archived|deprecated)/i in a parenthesized suffix => "archived" (suffix stripped for display); otherwise "active".
- Summary = plain text of first Lexical paragraph (~180 char cap); full description renders via RichText inside <details>.
- Expander is native <details>; toggle is instant (no height animation) - satisfies reduced-motion by default; ~200ms transition noted as acceptable deviation.
- SVG fallback thumbnail is deterministic per card index, aria-hidden, token colors via currentColor classes.

## Dev Agent Record
- Files: src/components/Section.tsx (new), src/components/SectionHeader.tsx (new), src/components/ProjectsSection.tsx (rewrite), src/components/ProjectCard.tsx (rewrite), src/components/StatusBadge.tsx (new)
