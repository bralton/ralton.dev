# Story 10.7: Contact section with side-by-side blurb and form

Status: done

## Story
As a visitor, I want contact options and the form together in one compact band, so that reaching out takes one glance.

## Acceptance Criteria (epics-redesign.md FR-R14)
1. ~/contact: blurb + SocialLinks | restyled form in 1fr/1.2fr split; submission logic/validation/notifications unchanged.
2. Success: mono teal confirmation replaces the form; socials stay visible.
3. Validation errors: plain-language inline, Inter, semantic red.

## Dev Notes / decisions
- ContactForm: toast usage removed per UX pattern "no toasts on the production site"; success now replaces form with `message queued — I'll reply soon` (mono); errors render visibly inline (was toast + sr-only region; live region retained).
- name/email share a row >=640px; submit is start-aligned primary with mono `sending…` flight state.
- API endpoint, zod schema, rate limiting, notifications untouched (NFR-R6/R9).
- SocialLinks now rendered in ~/contact AND footer; footer keeps them (harmless duplication, both spec'd).

## Dev Agent Record
- Files: src/components/ContactSection.tsx (rewrite), src/components/ContactForm.tsx (restyle + success state)
