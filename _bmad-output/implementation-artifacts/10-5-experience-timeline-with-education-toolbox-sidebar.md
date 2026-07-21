# Story 10.5: Experience timeline with education & toolbox sidebar

Status: done

## Story
As a visitor, I want Ben's career, education, and skills in one dense view, so that his history is scannable without three separate sections.

## Acceptance Criteria (epics-redesign.md FR-R11, FR-R12)
1. ~/experience renders 1.5fr/1fr split: timeline (teal-ringed dots for null endDate, dots aligned to item headers) | education rows + categorized toolbox.
2. >4 roles: 4 most recent visible, rest in `+ earlier roles` <details>; <=4: no expander. Every visible CMS entry renders.

## Dev Notes / decisions
- Roles sorted -startDate; current = endDate null (existing fields only, NFR-R6).
- Dates formatted "Mon YYYY — Mon YYYY|present" in mono.
- Toolbox groups Skills by category with short mono label mapping (Cloud Platforms->cloud, DevOps->iac/ops, CI/CD->ci/cd, Languages & Frameworks->code, Databases->data, Soft Skills->people, Tools & Workflow->tools; unknown categories fall back to lowercase name) - all categories render, nothing dropped.
- Old EducationSection/SkillsSection remain on the page until story 10.8 consolidation (documented mid-epic duplication).
- Timeline dot absolutely positioned against the item header row (mockup alignment bug lesson).

## Dev Agent Record
- Files: src/components/ExperienceSection.tsx (rewrite)
