# Story 10.8: Five-section consolidation and component retirement

Status: done

## Story
As a visitor, I want one coherent five-section homepage, so that the old sparse layout is fully gone.

## Acceptance Criteria (epics-redesign.md FR-R8, FR-R15, FR-R19)
1. Homepage renders exactly hero + ~/projects + ~/experience + ~/writing + ~/contact + footer, in order.
2. AboutSection, SkillsSection, EducationSection, GitHubGraph (and their orphaned cards ExperienceCard, EducationCard) deleted from the codebase.
3. Every section self-suppresses on empty data (verified per component).
4. Desktop scroll <= ~4 viewports (structural: 5 compact sections vs v1's 9 full-padded bands).
5. Compile + typecheck pass; Lighthouse CI on PR.

## Dev Notes
- Section order per UX spec (projects before experience before writing).
- Skills/About/Education/GitHub data still fully rendered - re-homed into hero chips, proof panel, experience sidebar (nothing lost, NFR-R6 untouched).
- nav anchor /#writing matches Section id="writing" (was latest-posts).

## Dev Agent Record
- Files: src/app/(frontend)/page.tsx; deleted: AboutSection.tsx, SkillsSection.tsx, EducationSection.tsx, GitHubGraph.tsx, ExperienceCard.tsx, EducationCard.tsx
