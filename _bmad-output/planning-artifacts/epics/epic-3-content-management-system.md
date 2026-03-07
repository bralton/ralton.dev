---
epic: 3
title: 'Content Management System'
status: backlog
storyCount: 6
stories: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6']
frs: ['FR16', 'FR17', 'FR18', 'FR19', 'FR20', 'FR21', 'FR22', 'FR23', 'FR24']
nfrs: ['NFR9', 'NFR12']
shardedFrom: epics.md
date: 2026-03-07
---

# Epic 3: Content Management System

Ben can manage all site content via Payload CMS admin panel. Add, edit, delete, and toggle visibility on any content without code changes.

## Story 3.1: Configure Admin Authentication

As an **admin**,
I want **to securely log into the Payload CMS admin panel**,
So that **only I can manage site content** (FR16).

**Acceptance Criteria:**

**Given** Payload CMS is installed
**When** I configure the admin authentication
**Then** Payload's built-in authentication is enabled (NFR9)
**And** admin panel is accessible at `/admin`
**And** the admin panel is not publicly linked from the main site

**Given** no admin user exists
**When** I first visit `/admin`
**Then** I can create the initial admin account
**And** the account requires email and password

**Given** an admin account exists
**When** I visit `/admin` without being logged in
**Then** I am redirected to the login page
**And** I can log in with email and password

**Given** I am logged in as admin
**When** my session expires
**Then** I am prompted to log in again
**And** session handling is secure

**Given** security requirements
**When** the admin panel is accessed
**Then** all traffic is over HTTPS (NFR8)
**And** no credentials are exposed in client-side code (NFR12)

## Story 3.2: Enable Content CRUD for All Collections

As an **admin**,
I want **to create, edit, and delete content entries**,
So that **I can manage my portfolio content** (FR17, FR18, FR19).

**Acceptance Criteria:**

**Given** I am logged into the admin panel
**When** I navigate to the Experiences collection
**Then** I can see a list of all experience entries
**And** I can create a new experience entry
**And** I can edit an existing experience entry
**And** I can delete an experience entry (FR17)

**Given** I am logged into the admin panel
**When** I navigate to the Education collection
**Then** I can see a list of all education entries
**And** I can create, edit, and delete education entries (FR18)

**Given** I am logged into the admin panel
**When** I navigate to the Projects collection
**Then** I can see a list of all project entries
**And** I can create, edit, and delete project entries (FR19)
**And** I can upload project images
**And** I can manage the techStack array field

**Given** I create or edit an entry
**When** I save the entry
**Then** changes are persisted to the database
**And** a success message confirms the save

**Given** I delete an entry
**When** I confirm the deletion
**Then** the entry is removed from the database
**And** the entry no longer appears on the frontend

## Story 3.3: Implement Visibility Toggles

As an **admin**,
I want **to toggle visibility on any content item**,
So that **I can curate what's displayed without deleting content** (FR20).

**Acceptance Criteria:**

**Given** I am editing an Experience entry
**When** I toggle the isVisible field to false
**Then** the entry is hidden from the public site
**And** the entry remains in the admin list (marked as hidden)

**Given** I am editing an Education entry
**When** I toggle the isVisible field
**Then** visibility changes are reflected on the frontend

**Given** I am editing a Project entry
**When** I toggle the isVisible field
**Then** the project appears or disappears from the public site

**Given** I am editing a Skill entry
**When** I toggle the isVisible field
**Then** the skill appears or disappears from the skills section

**Given** the isVisible field exists on collections
**When** viewing the admin list
**Then** hidden entries are visually distinguished (e.g., grayed out or icon indicator)

**Given** visibility is toggled
**When** the public site is visited
**Then** only isVisible=true entries are displayed
**And** the frontend query filters by isVisible

## Story 3.4: Enable Hero and About Editing

As an **admin**,
I want **to edit the hero section and about section content**,
So that **I can update my headline, tagline, and bio** (FR21, FR22).

**Acceptance Criteria:**

**Given** I am logged into the admin panel
**When** I navigate to the Hero global
**Then** I can edit the name, headline, and tagline fields (FR21)
**And** I can manage CTA buttons (add, edit, remove)
**And** changes save successfully

**Given** I am logged into the admin panel
**When** I navigate to the About global
**Then** I can edit the bio using a rich text editor (FR22)
**And** I can upload or change the profile photo
**And** I can manage the highlights array

**Given** I edit global content
**When** I save changes
**Then** the frontend reflects the updates
**And** static pages are revalidated

## Story 3.5: Enable Skills Management

As an **admin**,
I want **to manage the skills list**,
So that **I can add, update, or remove skills as my expertise evolves** (FR23).

**Acceptance Criteria:**

**Given** I am logged into the admin panel
**When** I navigate to the Skills collection
**Then** I can see all skills grouped or listed
**And** I can create a new skill with name and category
**And** I can edit existing skills
**And** I can delete skills

**Given** I add a new skill
**When** I specify a category
**Then** the skill is grouped with others in the same category on the frontend

**Given** I change a skill's category
**When** I save the change
**Then** the skill moves to the new category group on the frontend

## Story 3.6: Configure Content Revalidation and Preview

As an **admin**,
I want **to preview changes and see updates reflected on the site**,
So that **I can verify content before and after publishing** (FR24).

**Acceptance Criteria:**

**Given** I am editing content in the admin panel
**When** I want to preview changes
**Then** I can use Payload's draft/preview functionality
**And** I can see how the content will look on the frontend

**Given** I save content changes
**When** the save completes
**Then** on-demand revalidation triggers for affected pages
**And** the public site reflects the changes without full redeploy

**Given** Payload hooks are configured
**When** content is created, updated, or deleted
**Then** a revalidation request is sent to Next.js
**And** cached pages are refreshed

**Given** I want to verify changes
**When** I visit the public site after saving
**Then** my changes are visible
**And** the update is reflected within seconds (not requiring rebuild)

---
