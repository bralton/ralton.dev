# Story 11.1: Blog index in the new visual identity

Status: done

## Story
As a reader, I want the blog index to match the redesigned site, so that browsing posts feels like the same product as the homepage.

## Acceptance Criteria (epics-redesign.md FR-R16 index half)
1. /blog uses new tokens, condensed nav, ~/writing-style header, PostCards consistent with homepage; pagination restyled to tokens, behavior unchanged.
2. <900px single column, >=44px targets.

## Dev Notes
- Header is an h1 styled like SectionHeader (mono ~/writing + rule + RSS meta) - index page keeps h1 semantics.
- Empty state reworded neutral/mono (site never apologizes); invalid-page state on tokens.
- Pagination zinc utilities -> panel/border tokens.
- Category/tag archive pages intentionally out of scope (FR-R16 covers index + posts); they inherit tokens via shared utilities.

## Dev Agent Record
- Files: src/app/(frontend)/blog/page.tsx, src/components/Pagination.tsx
