# Story 8.3: Add Branch Protection Rules Configuration

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **branch protection rules documented and ready**,
So that **they can be enabled when the repo goes public or on a paid GitHub plan**.

## Acceptance Criteria

1. **Given** the project documentation
   **When** I document branch protection settings
   **Then** recommended rules are specified in README or docs

2. **Given** recommended branch protection for `main`
   **When** documenting the configuration
   **Then** it specifies: require PR reviews (1 reviewer)
   **And** require status checks to pass (Lighthouse CI, E2E tests when available)
   **And** require branches to be up to date before merging
   **And** do not allow bypassing the above settings

3. **Given** the repository is currently private on free tier
   **When** branch protection is not yet enforceable
   **Then** the documentation notes this as "ready to enable"
   **And** provides step-by-step GitHub UI instructions

## Tasks / Subtasks

- [x] Task 1: Create branch protection documentation file (AC: #1, #2, #3)
  - [x] Create `docs/branch-protection.md` documentation file
  - [x] Document recommended settings for `main` branch with rationale
  - [x] Specify: require PR reviews (1 reviewer minimum)
  - [x] Specify: dismiss stale PR approvals when new commits pushed
  - [x] Specify: require status checks to pass before merging
  - [x] List required status checks: `Lighthouse Accessibility Audit`, `Playwright E2E` (when available)
  - [x] Specify: require branches to be up to date before merging
  - [x] Specify: do not allow bypassing the above settings
  - [x] Add note explaining linear history as optional

- [x] Task 2: Add step-by-step GitHub UI instructions (AC: #3)
  - [x] Document navigation path: Settings > Branches > Add rule
  - [x] Document branch name pattern: `main`
  - [x] Provide checkbox-by-checkbox instructions
  - [x] Include screenshots descriptions or emoji checkboxes for clarity
  - [x] Document how to add required status checks

- [x] Task 3: Add "ready to enable" context (AC: #3)
  - [x] Add header section explaining current limitation (private repo, free tier)
  - [x] Explain when these rules can be enabled (repo public OR paid plan)
  - [x] Link to GitHub documentation on branch protection requirements

- [x] Task 4: Create docs directory if needed
  - [x] Create `docs/` directory at project root if it doesn't exist
  - [x] Verify file location follows project conventions

## Dev Notes

### Implementation Specification

**File to create:** `docs/branch-protection.md`

**Note:** This is DOCUMENTATION ONLY. Branch protection rules cannot be enforced on private repositories with free GitHub tier. The documentation prepares the configuration for when the repository goes public or the GitHub plan is upgraded.

**Complete documentation content from design document:**

```markdown
# Branch Protection Rules Configuration

> **Status:** Ready to Enable
>
> These rules are documented and ready but cannot be enforced on private repositories with GitHub Free tier.
> Enable these rules when:
> - The repository becomes public, OR
> - The GitHub plan is upgraded to Team/Enterprise

## Recommended Settings for `main` Branch

| Setting | Value | Rationale |
|---------|-------|-----------|
| Require pull request reviews | 1 reviewer | Code quality gate |
| Dismiss stale PR approvals | Yes | Prevent bypass via new commits |
| Require status checks | Yes | Automated quality gates |
| Status checks required | `Lighthouse Accessibility Audit`, `Playwright E2E` | Comprehensive coverage |
| Require branches up to date | Yes | Prevent merge conflicts |
| Do not allow bypassing | Yes | Consistent enforcement |
| Require linear history | Optional | Cleaner git history |

## Step-by-Step GitHub UI Instructions

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository on GitHub
2. Click **Settings** (gear icon in the top menu)
3. In the left sidebar, click **Branches**
4. Click **Add rule** or **Add branch protection rule**

### Step 2: Configure Branch Name Pattern

1. In "Branch name pattern" field, enter: `main`

### Step 3: Enable Required Settings

Enable the following checkboxes:

- [x] **Require a pull request before merging**
  - [x] Require approvals: `1`
  - [x] Dismiss stale pull request approvals when new commits are pushed

- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Add status checks (search and select):
    - `Lighthouse Accessibility Audit` (from accessibility.yml workflow)
    - `Playwright E2E` (from e2e.yml workflow, when available)

- [x] **Do not allow bypassing the above settings**

### Step 4: Optional Settings

Consider enabling these based on your workflow:

- [ ] **Require linear history** - Enforces squash or rebase merges for cleaner history
- [ ] **Require signed commits** - If GPG signing is set up
- [ ] **Include administrators** - Even admins must follow rules

### Step 5: Save

Click **Create** or **Save changes** to apply the rule.

## Status Checks Reference

| Check Name | Workflow File | Required |
|------------|---------------|----------|
| `Lighthouse Accessibility Audit` | `.github/workflows/accessibility.yml` | Yes |
| `Playwright E2E` | `.github/workflows/e2e.yml` | Yes (when implemented) |
| `Send Discord Notification` | `.github/workflows/pr-discord.yml` | No (informational only) |

## Why These Settings?

### Require PR Reviews (1 reviewer)
- Ensures at least one person reviews code changes
- For solo developers, consider using a "rubber duck" review or self-review after a delay

### Dismiss Stale Approvals
- If new commits are pushed after approval, re-review is required
- Prevents sneaking in changes after approval

### Require Status Checks
- Lighthouse CI ensures accessibility standards are maintained
- E2E tests catch regressions in critical user paths
- Automated gates reduce human error

### Require Up-to-Date Branches
- Ensures PRs are tested against latest main
- Prevents merge conflicts and integration issues

### No Bypassing
- Even repository owners must follow the rules
- Maintains consistent quality standards

## References

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Managing Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule)
```

### Key Implementation Details

**Why documentation-only approach:**
- Branch protection is a GitHub repository setting, not a code file
- Cannot be configured via code/API on free tier private repos
- Documentation provides immediate value for when rules can be enabled

**Status check names:**
- `Lighthouse Accessibility Audit` - exact job name from `.github/workflows/accessibility.yml`
- `Playwright E2E` - expected job name from Story 8.6 E2E workflow (not yet implemented)
- Names must match exactly as they appear in GitHub PR checks

**Documentation location choice:**
- `docs/branch-protection.md` - dedicated documentation file
- Could alternatively be added to README.md (Story 8.7 will handle that integration)
- Standalone file allows detailed instructions without cluttering README

### Dev Standards

See [CLAUDE.md](../../../../../CLAUDE.md) for accessibility patterns, naming conventions, and project structure.

**Key Standards for This Story:**
- This is a documentation file, not application code
- Use Markdown best practices (proper headings, tables, lists)
- No code execution or testing required
- Focus on clarity and actionable instructions

### Project Structure Notes

**Documentation location:** `docs/branch-protection.md`
- Creates new `docs/` directory if it doesn't exist
- Follows common convention for project documentation
- Story 8.7 (README) may reference or include this content

**Alternative location (if preferred):**
- Could be placed directly in README.md under a "Branch Protection" section
- Story 8.7 handles README creation, so standalone file prevents conflicts

### Architecture Compliance

This story implements NFR12 from the epic file - CI/DevOps operational excellence through documentation.

**Integration with CI/CD:**
- Documents which status checks should be required
- References existing workflow (`accessibility.yml`)
- References planned workflow (`e2e.yml` from Story 8.6)

### Previous Story Intelligence

**From Story 8.1 (Discord PR Notifications):**
- GitHub workflow job name: `Send Discord Notification` in `notify` job
- This check is informational only, not required for merge

**From Story 8.2 (Dependabot):**
- Dependabot PRs will also be subject to branch protection rules
- Ensures even automated PRs pass quality gates

**From existing CI (accessibility.yml):**
- Job name: `Lighthouse Accessibility Audit`
- This is the exact name to use in required status checks

**From Design Document Section 4.2:**
- Provides complete documentation template
- Specifies recommended settings table
- Includes step-by-step instructions format

### Git Intelligence

**Recent commits:**
```
e180d5c ci(discord): add PR notification workflow
9b0ff85 fix(nav): skip link only shows on keyboard focus, not auto-focus
```

**Commit conventions observed:**
- `docs(...)`: Documentation changes
- Clear, descriptive commit messages

**Suggested commit message for this story:**
```
docs(security): add branch protection rules documentation

Document recommended branch protection settings for main branch,
ready to enable when repo goes public or GitHub plan upgrades.
```

### Risk Assessment

**Risk Level:** Very Low

**Rationale:**
- No application code changes
- No configuration changes (documentation only)
- Cannot break existing functionality
- Purely additive documentation

**Dependencies satisfied:**
- Story 8.1 (Discord) - DONE (provides workflow name for docs)
- Story 8.2 (Dependabot) - DONE (provides context for automation)
- Story 8.6 (Playwright) - NOT YET (document as "when available")

### Integration with Other Stories

**Story 8.6 (Playwright E2E):**
- This documentation references `Playwright E2E` as a required status check
- Actual workflow will be created in Story 8.6
- Document with "when available" note

**Story 8.7 (Project Documentation):**
- README may reference or link to this documentation
- Or include branch protection section directly
- Current story creates standalone file to avoid conflicts

### Verification Checklist

1. Create `docs/` directory if it doesn't exist
2. Create `docs/branch-protection.md` with complete documentation
3. Verify Markdown renders correctly (preview in VS Code or GitHub)
4. Verify table formatting is correct
5. Verify step-by-step instructions are clear and complete
6. Run `pnpm lint` to ensure no linting issues
7. No application testing required (documentation only)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-8-ci-devops-security-documentation.md#Story 8.3]
- [Source: _bmad-output/planning-artifacts/epic-8-design-document.md#Section 4]
- [Source: .github/workflows/accessibility.yml - job name reference]
- [Source: .github/workflows/pr-discord.yml - Story 8.1 job name reference]
- [Source: CLAUDE.md - dev standards]
- [Reference: GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Reference: Managing Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A - Documentation-only story with no code execution issues.

### Completion Notes List

- Created `docs/` directory at project root (did not exist previously)
- Created comprehensive branch protection documentation in `docs/branch-protection.md`
- Documentation includes:
  - Header explaining "ready to enable" status with free tier limitations
  - Recommended settings table with rationale for each setting
  - Step-by-step GitHub UI instructions (Settings > Branches > Add rule)
  - Checkbox-by-checkbox configuration guide
  - Status checks reference table listing required and optional checks
  - Detailed rationale section explaining why each setting is recommended
  - Links to official GitHub documentation
- No application code changes required - purely documentation story
- Linting not applicable to Markdown documentation files

### File List

- docs/branch-protection.md (NEW)

### Change Log

- 2026-03-11: Created branch protection rules documentation (Story 8.3)
