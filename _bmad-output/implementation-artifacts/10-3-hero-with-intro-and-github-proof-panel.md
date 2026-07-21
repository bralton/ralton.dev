# Story 10.3: Hero with intro and GitHub proof panel

Status: done

## Story
As a network visitor, I want Ben's identity, pitch, and live activity in the first viewport, so that I understand who he is and that he's active without scrolling.

## Acceptance Criteria (epics-redesign.md FR-R5, FR-R6, FR-R7)
1. Two-column hero (1.15fr/1fr) fits first viewport at 1440x900: avatar, $ whoami, name, role, pitch, up to 6 chips, CTAs | ProofPanel (graph + 3 stats). Server-rendered, zero CLS.
2. GitHubData missing/stale -> graph hidden, stats remain, no error.
3. <900px: intro stacks above panel; graph shows trailing weeks at legible size.

## Dev Notes / data mapping (NFR-R6: existing fields only)
- name/headline/tagline/ctaButtons <- Hero global. Pitch = tagline.
- Avatar <- About global photo. Chips <- About highlights (first 6).
- Graph <- GithubDatum.contributionData (validated with v1 type guard), last 26 weeks; first 10 weeks `hidden sm:flex` for mobile trailing view.
- Stats: totalContributions; years = now - earliest visible Experience startDate ("N+"); cert = most recent Education institution + "certified" (hidden if none).
- Graph colors all token/palette classes (panel-2, teal-950, teal-deep, teal-dim, teal): no raw hexes.
- Graph aria-hidden with sr-only text alternative (NFR-R4).

## Dev Agent Record
- Files: src/components/HeroSection.tsx (rewrite), src/components/ProofPanel.tsx (new)
