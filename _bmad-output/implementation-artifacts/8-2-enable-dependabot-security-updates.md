# Story 8.2: Enable Dependabot Security Updates

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **automated dependency security updates**,
So that **vulnerabilities are caught and patched automatically**.

## Acceptance Criteria

1. **Given** the GitHub repository
   **When** I create `.github/dependabot.yml`
   **Then** Dependabot is configured for npm package ecosystem

2. **Given** Dependabot configuration
   **When** setting update parameters
   **Then** security updates are enabled
   **And** PRs target the `main` branch
   **And** update schedule is set to weekly (Monday)
   **And** PR limit is configured to 5 to avoid overwhelming the repo

3. **Given** a security vulnerability is detected
   **When** Dependabot identifies a fix
   **Then** an automated PR is created to main
   **And** the PR includes vulnerability details and fix description

4. **Given** Dependabot PRs
   **When** they are created
   **Then** they trigger existing CI workflows (Lighthouse, E2E when added)
   **And** Discord notification is sent (via 8.1 workflow)

5. **Given** Dependabot configuration
   **When** configuring commit messages
   **Then** npm dependencies use `chore(deps)` prefix
   **And** GitHub Actions dependencies use `ci(deps)` prefix

6. **Given** Dependabot configuration
   **When** configuring labels
   **Then** npm PRs have `dependencies` and `automated` labels
   **And** GitHub Actions PRs have `ci` and `automated` labels

## Tasks / Subtasks

- [x] Task 1: Create Dependabot configuration file (AC: #1, #2, #5, #6)
  - [x] Create `.github/dependabot.yml`
  - [x] Configure npm package ecosystem with `/` directory
  - [x] Configure github-actions ecosystem with `/` directory
  - [x] Set weekly schedule on Monday at 09:00 America/New_York
  - [x] Set target branch to `main`
  - [x] Set open-pull-requests-limit to 5
  - [x] Configure npm commit prefix: `chore(deps)`
  - [x] Configure github-actions commit prefix: `ci(deps)`
  - [x] Add labels: `dependencies`, `automated` for npm
  - [x] Add labels: `ci`, `automated` for github-actions
  - [x] Add reviewer: `bralton`

- [x] Task 2: Verify configuration syntax (AC: #1)
  - [x] Validate YAML syntax is correct
  - [x] Verify file matches Dependabot v2 schema

- [x] Task 3: Verify integration with existing workflows (AC: #3, #4)
  - [x] Confirm Dependabot PRs will trigger `accessibility.yml` workflow
  - [x] Confirm Dependabot PRs will trigger `pr-discord.yml` workflow (Story 8.1)
  - [x] Document expected behavior in completion notes

## Dev Notes

### Implementation Specification

**File to create:** `.github/dependabot.yml`

**Complete configuration from design document:**

```yaml
version: 2
updates:
  # npm dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "America/New_York"
    target-branch: "main"
    open-pull-requests-limit: 5
    commit-message:
      prefix: "chore(deps)"
    labels:
      - "dependencies"
      - "automated"
    reviewers:
      - "bralton"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    commit-message:
      prefix: "ci(deps)"
    labels:
      - "ci"
      - "automated"
```

### Key Implementation Details

**Why two ecosystems:**
- `npm`: Monitors `package.json` and `pnpm-lock.yaml` for dependency updates
- `github-actions`: Monitors workflow files for action version updates (e.g., `actions/checkout@v4`)

**Why weekly on Monday:**
- Limits notification noise compared to daily updates
- Monday allows time to address any breaking changes during the work week
- Aligns with typical development schedules

**Why PR limit of 5:**
- Prevents overwhelming the repository with too many PRs at once
- Allows manageable review of dependency updates
- Prioritizes security updates over regular version bumps

**Conventional commit prefixes:**
- `chore(deps)`: For npm dependency updates (non-functional changes)
- `ci(deps)`: For GitHub Actions updates (CI configuration changes)
- Maintains consistency with existing commit conventions (see git log)

**Labels purpose:**
- `dependencies` / `ci`: Categorizes the type of update
- `automated`: Indicates automated PR for filtering/tracking
- Labels must exist in the repository or GitHub will create them automatically

### Dev Standards

See [CLAUDE.md](../../../../../CLAUDE.md) for accessibility patterns, naming conventions, and project structure.

**Key Standards for This Story:**
- This is a GitHub configuration file, not Next.js code
- File must be named exactly `dependabot.yml` (not `dependabot.yaml`)
- Must be in `.github/` directory at repository root
- Uses Dependabot version 2 configuration format

### Project Structure Notes

**Configuration location:** `.github/dependabot.yml`
- Follows GitHub's required naming convention
- Must be in `.github/` directory alongside workflows
- No subdirectory needed for this file

**Existing files in `.github/`:**
- `workflows/accessibility.yml` - Lighthouse CI workflow
- `workflows/pr-discord.yml` - Discord PR notifications (Story 8.1)

### Architecture Compliance

This story implements NFR12 from the epic file - CI/DevOps operational excellence.

**Integration with existing infrastructure:**
- Dependabot PRs trigger all existing GitHub workflows automatically
- Discord notifications (Story 8.1) will fire when Dependabot opens PRs
- Accessibility CI will run on all Dependabot PRs

**Security considerations:**
- Dependabot only updates to versions with security fixes or within version constraints
- Security updates are prioritized by GitHub's vulnerability database
- Does not require any secrets or API keys (built into GitHub)

### Previous Story Intelligence

**From Story 8.1 (Discord PR Notifications):**
- GitHub workflow files use `.yml` extension in this project
- YAML syntax validation is important before committing
- Simple, focused implementations work well
- `ci` prefix used for CI-related commits

**From existing CI (accessibility.yml):**
- Workflows trigger on `pull_request` to `main` branch
- Dependabot PRs will automatically be tested by existing CI

### Git Intelligence

**Recent commits:**
```
e180d5c ci(discord): add PR notification workflow
9b0ff85 fix(nav): skip link only shows on keyboard focus, not auto-focus
df1aad4 fix(nav): use absolute paths for nav links to work from any page
06fa964 fix(nav): logo links to root and uses correct focus ring color
b4df0de style(footer): add pipe delimiter between copyright and privacy link
```

**Commit conventions observed:**
- `ci(...)`: CI/DevOps changes
- `chore(...)`: Non-functional changes (dependency updates fit here)
- `fix(...)`: Bug fixes
- `style(...)`: Style changes

**Suggested commit message for this story:**
```
ci(deps): configure Dependabot for automated security updates

Enable weekly dependency updates for npm and GitHub Actions with
conventional commit prefixes and PR labeling.
```

### Risk Assessment

**Risk Level:** Very Low

**Rationale:**
- No application code changes
- No database interactions
- Standard GitHub feature configuration
- Well-documented Dependabot configuration format
- Worst case: Dependabot creates PRs that can be ignored/closed

**Potential Issues:**
- If labels don't exist in repository, GitHub creates them automatically (not an issue)
- Dependabot may create PRs immediately after configuration is merged (expected behavior)
- Some dependency updates may require manual intervention if they have breaking changes

### Integration with Other Stories

**Story 8.1 (Discord PR Notifications):**
- Dependabot PRs will trigger Discord notifications when opened
- This provides immediate visibility into security updates

**Story 8.3 (Branch Protection):**
- Once branch protection is enabled, Dependabot PRs will require:
  - Passing Lighthouse CI checks
  - Passing E2E tests (when added in Story 8.6)
- Documentation will reference Dependabot as part of CI workflow

**Story 8.6 (Playwright E2E):**
- Once E2E tests are added, Dependabot PRs will be tested automatically
- Helps catch breaking changes from dependency updates

**Story 8.7 (Documentation):**
- README will document Dependabot as part of CI/CD pipeline

### Testing Verification

**Verification checklist:**
1. Create the configuration file
2. Commit and push to main branch
3. Check GitHub repository Settings > Security > Code security and analysis
4. Verify Dependabot security updates shows as "Enabled"
5. Wait for scheduled run or manually trigger via GitHub UI
6. Verify any created PRs have correct labels and commit prefixes

**Manual trigger:**
- Go to repository Insights > Dependency graph > Dependabot
- Click "Check for updates" to trigger immediate scan

**Note:** Dependabot may not create any PRs immediately if all dependencies are up to date.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-8-ci-devops-security-documentation.md#Story 8.2]
- [Source: _bmad-output/planning-artifacts/epic-8-design-document.md#Section 3]
- [Source: .github/workflows/accessibility.yml - existing CI patterns]
- [Source: .github/workflows/pr-discord.yml - Story 8.1 implementation]
- [Source: CLAUDE.md - dev standards]
- [Reference: Dependabot Configuration Options](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [Reference: Dependabot Quickstart](https://docs.github.com/en/code-security/getting-started/dependabot-quickstart-guide)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None

### Completion Notes List

- Created `.github/dependabot.yml` with Dependabot v2 configuration
- Configured two package ecosystems:
  - **npm**: Weekly updates on Monday at 09:00 ET, targeting `main` branch, PR limit of 5, `chore(deps)` commit prefix, `dependencies` + `automated` labels, `bralton` as reviewer
  - **github-actions**: Weekly updates on Monday, `ci(deps)` commit prefix, `ci` + `automated` labels
- Validated YAML syntax using yaml-lint (passed)
- Verified configuration matches Dependabot v2 schema requirements
- Confirmed workflow integration:
  - `accessibility.yml` triggers on `pull_request` to `main` - Dependabot PRs will trigger Lighthouse CI
  - `pr-discord.yml` triggers on `pull_request` type `opened` - Dependabot PRs will send Discord notifications
- Implementation completed 2026-03-11

### Change Log

- 2026-03-11: Created `.github/dependabot.yml` with npm and github-actions ecosystems configured

### File List

- `.github/dependabot.yml` (created)
