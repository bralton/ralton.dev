# Story 10.2: Condensed navigation and new footer

Status: done

## Story
As a visitor, I want a minimal sticky nav and a quiet footer, so that wayfinding is effortless and the page starts and ends in the site's voice.

## Acceptance Criteria (epics-redesign.md FR-R4, FR-R18)
1. ≥900px: nav shows logo + mono wordmark (home/top) + Projects / Experience / Writing / `get in touch →` CTA; sticky 56px, blur backdrop.
2. <900px: only wordmark + CTA (no hamburger); targets ≥44px.
3. Footer: hairline rule, copyright, mono `uptime: excellent`.

## Dev Notes
- Custom breakpoint `desk: 900px` added to tailwind screens (NFR-R7).
- Smooth-scroll handler retained from v1 with reduced-motion respect; header offset reduced 112→72.
- Hamburger Sheet removed entirely; skip-to-content link retained (NFR-R1).
- SocialLinks stay in footer until story 10.7 moves them into ~/contact (no dead window where socials vanish).
- Privacy link retained (epic 7 legal requirement).
- /admin intentionally not linked (v1 security decision, NFR-R9).

## Dev Agent Record
- Files: src/components/Navigation.tsx, src/components/Footer.tsx, tailwind.config.ts (screens)
