# Branch Protection Rules Configuration

> **Status:** Ready to Enable
>
> These rules are documented and ready but cannot be enforced on private repositories with GitHub Free tier.
> Enable these rules when:
>
> - The repository becomes public, OR
> - The GitHub plan is upgraded to Team/Enterprise

## Recommended Settings for `main` Branch

| Setting                      | Value                                              | Rationale                      |
| ---------------------------- | -------------------------------------------------- | ------------------------------ |
| Require pull request reviews | 1 reviewer                                         | Code quality gate              |
| Dismiss stale PR approvals   | Yes                                                | Prevent bypass via new commits |
| Require status checks        | Yes                                                | Automated quality gates        |
| Status checks required       | `Lighthouse Accessibility Audit`, `Playwright E2E` | Comprehensive coverage         |
| Require branches up to date  | Yes                                                | Prevent merge conflicts        |
| Do not allow bypassing       | Yes                                                | Consistent enforcement         |
| Require linear history       | Optional                                           | Cleaner git history            |

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

| Check Name                       | Workflow File                         | Required                |
| -------------------------------- | ------------------------------------- | ----------------------- |
| `Lighthouse Accessibility Audit` | `.github/workflows/accessibility.yml` | Yes                     |
| `Playwright E2E`                 | `.github/workflows/e2e.yml`           | Yes (when implemented)  |
| `Send Discord Notification`      | `.github/workflows/pr-discord.yml`    | No (informational only) |

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
