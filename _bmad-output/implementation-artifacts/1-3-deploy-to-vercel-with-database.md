# Story 1.3: Deploy to Vercel with Database

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **the project deployed to Vercel with a production database**,
So that **I have a live environment for testing and the deployment pipeline is established**.

## Acceptance Criteria

1. **AC1: Vercel Project Connection**
   - **Given** the project is ready for deployment
   - **When** I connect the repository to Vercel
   - **Then** Vercel detects the Next.js framework
   - **And** build settings are automatically configured

2. **AC2: Production Database Setup**
   - **Given** the project needs a production database
   - **When** I provision Vercel Postgres
   - **Then** DATABASE_URL is automatically added to environment variables
   - **And** the database is accessible from the deployed application

3. **AC3: Environment Variables Configuration**
   - **Given** environment variables are required
   - **When** I configure all environment variables in Vercel
   - **Then** PAYLOAD_SECRET is set with a secure random value
   - **And** all other required variables have placeholder or real values
   - **And** variables are not exposed to the client

4. **AC4: Deployment Pipeline**
   - **Given** the deployment pipeline is configured
   - **When** I push to the main branch
   - **Then** Vercel automatically builds and deploys
   - **And** the deployment completes without errors
   - **And** the site is accessible via HTTPS (NFR8)
   - **And** static assets are served from CDN edge (NFR6)

5. **AC5: Production Verification**
   - **Given** the site is deployed
   - **When** I visit the production URL
   - **Then** the default Payload admin panel loads at `/admin`
   - **And** I can create the initial admin user

## Tasks / Subtasks

- [x] Task 1: Connect Repository to Vercel (AC: #1)
  - [x] 1.1: Create Vercel account or log in if existing
  - [x] 1.2: Import the GitHub repository into Vercel
  - [x] 1.3: Verify Next.js framework is auto-detected
  - [x] 1.4: Verify build settings are correct (no manual override needed)
  - [x] 1.5: Do NOT trigger first deployment yet (need database first)

- [x] Task 2: Provision Neon Postgres via Vercel (AC: #2)
  - [x] 2.1: Navigate to Vercel Storage and create Neon Postgres database
  - [x] 2.2: Name the database appropriately
  - [x] 2.3: Select region closest to primary user base
  - [x] 2.4: Connect the database to the project
  - [x] 2.5: Verify POSTGRES_* env vars are added to environment variables automatically

- [x] Task 3: Update Payload Configuration for Production (AC: #2)
  - [x] 3.1: Verify `payload.config.ts` uses `DATABASE_URL` environment variable
  - [x] 3.2: Ensure SQLite is only used when `DATABASE_URL` is `file:./data.db` (local dev)
  - [x] 3.3: Add Vercel Postgres adapter if needed (may require `@payloadcms/db-vercel-postgres`)
  - [x] 3.4: Verify database migrations will run on first deployment

- [x] Task 4: Configure Environment Variables in Vercel (AC: #3)
  - [x] 4.1: Generate secure PAYLOAD_SECRET (32+ character random string)
  - [x] 4.2: Add PAYLOAD_SECRET to Vercel environment variables
  - [x] 4.3: Add placeholder for RESEND_API_KEY (can be empty for now)
  - [x] 4.4: Add placeholder for GITHUB_TOKEN (can be empty for now)
  - [x] 4.5: Add placeholder for AXIOM_TOKEN (can be empty for now)
  - [x] 4.6: Add CRON_SECRET (generate secure random string)
  - [x] 4.7: Verify all variables are set for Production environment
  - [x] 4.8: Verify sensitive variables are NOT prefixed with NEXT_PUBLIC_

- [x] Task 5: Trigger Initial Deployment (AC: #4)
  - [x] 5.1: Push any pending changes to main branch
  - [x] 5.2: Monitor Vercel build logs for errors
  - [x] 5.3: If build fails, debug and fix issues
  - [x] 5.4: Verify deployment completes successfully
  - [x] 5.5: Note the production URL for verification (www.ralton.dev)

- [x] Task 6: Verify Production Deployment (AC: #5)
  - [x] 6.1: Visit production URL and verify site loads
  - [x] 6.2: Verify HTTPS is enforced (no http access)
  - [x] 6.3: Navigate to `/admin` and verify Payload admin loads
  - [x] 6.4: Create initial admin user account
  - [x] 6.5: Log in to admin panel and verify access
  - [x] 6.6: Verify database connection is working (admin panel functional)

## Dev Notes

### Previous Story Intelligence (Story 1.2)

**What was established:**
- Project structure complete with all required directories
- TypeScript strict mode enabled
- ESLint and Prettier configured
- `.env.example` contains all 6 required variables
- SQLite configured for local development
- `pnpm dev`, `pnpm build`, and `pnpm lint` all pass

**Key configuration files:**
- `src/payload.config.ts` - Payload configuration with SQLite adapter
- `tsconfig.json` - TypeScript strict mode enabled
- `package.json` - Build scripts ready
- `.env.example` - Template with all required variables

### Architecture Compliance

**CRITICAL: Follow exact deployment patterns from Architecture document:**

**Infrastructure Decisions (from architecture.md):**
- **Hosting:** Vercel (single project) - Next.js frontend + Payload CMS unified
- **Database:** Vercel Postgres (production) / SQLite (local development)
- **CI/CD:** Vercel Git integration - auto-deploy on push to main
- **Environment Variables:** DATABASE_URL, PAYLOAD_SECRET, RESEND_API_KEY, GITHUB_TOKEN, AXIOM_TOKEN

**NFR Requirements for Deployment:**
- NFR6: Static pages served from CDN edge (Vercel default)
- NFR8: All traffic served over HTTPS (Vercel enforced)
- NFR26: 99.9% uptime (Vercel-managed infrastructure)

### Vercel Postgres vs Neon

Architecture mentions both Vercel Postgres and Neon as options. Vercel Postgres is preferred because:
- Native integration with Vercel (single dashboard)
- Automatic environment variable injection
- No separate account required
- Simpler setup for single-project use case

### Payload Database Configuration

**Decision: Postgres Everywhere**

During implementation, the team decided to use Postgres for both local development and production. This simplifies the setup by:
- Using a single database adapter (`@payloadcms/db-postgres`)
- Avoiding migration compatibility issues between SQLite and Postgres
- Ensuring local development matches production exactly

**Implementation:**
```typescript
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  // ...
})
```

**Local Development Setup:**
Use a Neon free-tier database for local development, or run Postgres locally via Docker.

**Package Installed:**
```bash
pnpm add @payloadcms/db-postgres
```

### Environment Variables Setup

**Generate Secure PAYLOAD_SECRET:**
```bash
openssl rand -base64 32
# Or use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Vercel Environment Variable Configuration:**

| Variable | Value | Environments |
|----------|-------|--------------|
| DATABASE_URL | Auto-populated by Vercel Postgres | Production, Preview |
| PAYLOAD_SECRET | Generate secure 32+ char string | Production, Preview, Development |
| RESEND_API_KEY | (empty for now) | Production |
| GITHUB_TOKEN | (empty for now) | Production |
| AXIOM_TOKEN | (empty for now) | Production |
| CRON_SECRET | Generate secure random string | Production |

**IMPORTANT:**
- Variables without `NEXT_PUBLIC_` prefix are server-only (secure)
- Never expose secrets to client-side code

### Vercel Build Configuration

Vercel should auto-detect settings, but verify:
- **Framework Preset:** Next.js
- **Build Command:** `pnpm build` (or `npm run build`)
- **Output Directory:** `.next` (default)
- **Install Command:** `pnpm install` (or auto-detected)

### Deployment Verification Checklist

After deployment completes:

1. **Site loads:** Visit `https://<project>.vercel.app`
2. **HTTPS enforced:** HTTP redirects to HTTPS
3. **Admin access:** Visit `https://<project>.vercel.app/admin`
4. **Create admin:** Complete initial admin user setup
5. **Admin login:** Verify login works
6. **Database check:** Admin panel loads without errors (indicates DB connection)

### Potential Issues & Solutions

**Issue: Build fails with database adapter error**
- Solution: Ensure `@payloadcms/db-vercel-postgres` is installed and configured

**Issue: "Cannot connect to database" in production**
- Solution: Verify DATABASE_URL is set in Vercel environment variables
- Check Vercel Postgres is connected to the project

**Issue: PAYLOAD_SECRET mismatch**
- Solution: Ensure PAYLOAD_SECRET is set in Vercel (not just local .env)

**Issue: Build works but admin panel shows errors**
- Solution: Check Vercel function logs for specific error messages
- Verify all required environment variables are set

### Testing This Story

After deployment:
1. ✓ Production URL loads without errors
2. ✓ Site served over HTTPS
3. ✓ `/admin` loads Payload admin panel
4. ✓ Can create initial admin user
5. ✓ Can log in to admin panel
6. ✓ No database connection errors

### CRITICAL WARNINGS

**DO NOT:**
- Push deployment without PAYLOAD_SECRET set (will fail)
- Use weak/predictable values for secrets
- Expose environment variables to client (no NEXT_PUBLIC_ prefix for secrets)
- Delete SQLite local dev configuration (need both local and production)
- Skip admin user creation (required for content management)

**DO:**
- Generate cryptographically secure random strings for secrets
- Verify all environment variables before first deployment
- Test admin panel functionality after deployment
- Keep local SQLite configuration for development convenience
- Document the production URL after deployment

### References

- [Source: architecture.md#Infrastructure & Deployment] - Vercel, Postgres, environment variables
- [Source: architecture.md#Starter Template Evaluation] - Database configuration
- [Source: prd.md#Non-Functional Requirements] - NFR6 (CDN), NFR8 (HTTPS), NFR26 (uptime)
- [Source: epic-1-project-foundation-infrastructure.md#Story 1.3] - Acceptance criteria
- [Source: 1-2-configure-project-structure-and-development-environment.md] - Previous story context

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

### Completion Notes List

- **Task 1 Complete (2026-03-07):** Connected GitHub repo to Vercel, Next.js auto-detected.
- **Task 2 Complete (2026-03-07):** Provisioned Neon Postgres via Vercel Storage marketplace. POSTGRES_* env vars auto-injected.
- **Task 3 Complete (2026-03-07):** Configured conditional database adapters - SQLite for local development (`file:` URLs), Vercel Postgres for production. Installed `@payloadcms/db-vercel-postgres`. Build and lint pass.
- **Task 4 Complete (2026-03-07):** Added PAYLOAD_SECRET, CRON_SECRET, and placeholder env vars for all environments.
- **Task 5 Complete (2026-03-07):** Multiple iterations to fix database adapter issues. Final solution: Postgres everywhere (no SQLite split), proper migrations.
- **Task 6 Complete (2026-03-07):** Production verified at www.ralton.dev. Admin panel accessible, user creation and login working.

### Change Log

- 2026-03-07: Connected repo to Vercel, provisioned Neon Postgres, configured env vars
- 2026-03-07: Initial attempts with SQLite/Postgres split failed due to migration incompatibility
- 2026-03-07: Switched to Postgres-only approach with @payloadcms/db-postgres
- 2026-03-07: Added migrations, updated build script to run `payload migrate`
- 2026-03-07: Deployment successful, admin panel working
- 2026-03-07: [Code Review] Updated Dev Notes to reflect Postgres-everywhere decision, synced architecture.md
- 2026-03-07: [Code Review] Added PAYLOAD_SECRET validation to fail explicitly if missing

### File List

- `src/payload.config.ts` - Modified: Simplified to use postgresAdapter only
- `src/migrations/20260307_152231.ts` - Created: Initial Postgres schema migration
- `src/migrations/index.ts` - Created: Migration index
- `package.json` - Modified: Added @payloadcms/db-postgres, updated build script
- `pnpm-lock.yaml` - Modified: Updated dependencies
- `.env.example` - Modified: Updated DATABASE_URL to Postgres format

