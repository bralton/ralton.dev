---
documentType: epics-index
project_name: personal_website
epicCount: 9
storyCount: 41
frCoverage: '54/54'
shardedFrom: epics.md
date: 2026-03-07
lastUpdated: 2026-03-11
status: in-progress
updateHistory:
  - date: '2026-03-11'
    changes: 'Added Epic 9: Blog Platform (FR39-54)'
---

# personal_website - Epic Breakdown

## Table of Contents

- [personal_website - Epic Breakdown](#table-of-contents)
  - [Overview](./overview.md)
  - [Requirements Inventory](./requirements-inventory.md)
    - [Functional Requirements](./requirements-inventory.md#functional-requirements)
    - [NonFunctional Requirements](./requirements-inventory.md#nonfunctional-requirements)
    - [Additional Requirements](./requirements-inventory.md#additional-requirements)
    - [FR Coverage Map](./requirements-inventory.md#fr-coverage-map)
  - [Epic List](./epic-list.md)
    - [Epic 1: Project Foundation & Infrastructure](./epic-list.md#epic-1-project-foundation-infrastructure)
    - [Epic 2: Core Portfolio Content](./epic-list.md#epic-2-core-portfolio-content)
    - [Epic 3: Content Management System](./epic-list.md#epic-3-content-management-system)
    - [Epic 4: GitHub Integration](./epic-list.md#epic-4-github-integration)
    - [Epic 5: Contact & Communication](./epic-list.md#epic-5-contact-communication)
    - [Epic 6: SEO & Discovery](./epic-list.md#epic-6-seo-discovery)
    - [Epic 7: Privacy & Legal Compliance](./epic-list.md#epic-7-privacy-legal-compliance)
    - [Epic 8: CI/DevOps, Security & Documentation](./epic-list.md#epic-8-cidevops-security-documentation)
    - [Epic 9: Blog Platform](./epic-list.md#epic-9-blog-platform)
  - [Epic 1: Project Foundation & Infrastructure](./epic-1-project-foundation-infrastructure.md)
    - [Story 1.1: Initialize Project with Payload and shadcn](./epic-1-project-foundation-infrastructure.md#story-11-initialize-project-with-payload-and-shadcn)
    - [Story 1.2: Configure Project Structure and Development Environment](./epic-1-project-foundation-infrastructure.md#story-12-configure-project-structure-and-development-environment)
    - [Story 1.3: Deploy to Vercel with Database](./epic-1-project-foundation-infrastructure.md#story-13-deploy-to-vercel-with-database)
    - [Story 1.4: Set Up Observability](./epic-1-project-foundation-infrastructure.md#story-14-set-up-observability)
  - [Epic 2: Core Portfolio Content](./epic-2-core-portfolio-content.md)
    - [Story 2.1: Create Hero Section with Payload Collection](./epic-2-core-portfolio-content.md#story-21-create-hero-section-with-payload-collection)
    - [Story 2.2: Create About Section with Payload Collection](./epic-2-core-portfolio-content.md#story-22-create-about-section-with-payload-collection)
    - [Story 2.3: Create Work Experience Section with Payload Collection](./epic-2-core-portfolio-content.md#story-23-create-work-experience-section-with-payload-collection)
    - [Story 2.4: Create Education Section with Payload Collection](./epic-2-core-portfolio-content.md#story-24-create-education-section-with-payload-collection)
    - [Story 2.5: Create Projects Section with Payload Collection](./epic-2-core-portfolio-content.md#story-25-create-projects-section-with-payload-collection)
    - [Story 2.6: Create Skills Section with Payload Collection](./epic-2-core-portfolio-content.md#story-26-create-skills-section-with-payload-collection)
    - [Story 2.7: Create Navigation and Page Layout](./epic-2-core-portfolio-content.md#story-27-create-navigation-and-page-layout)
  - [Epic 3: Content Management System](./epic-3-content-management-system.md)
    - [Story 3.1: Configure Admin Authentication](./epic-3-content-management-system.md#story-31-configure-admin-authentication)
    - [Story 3.2: Enable Content CRUD for All Collections](./epic-3-content-management-system.md#story-32-enable-content-crud-for-all-collections)
    - [Story 3.3: Implement Visibility Toggles](./epic-3-content-management-system.md#story-33-implement-visibility-toggles)
    - [Story 3.4: Enable Hero and About Editing](./epic-3-content-management-system.md#story-34-enable-hero-and-about-editing)
    - [Story 3.5: Enable Skills Management](./epic-3-content-management-system.md#story-35-enable-skills-management)
    - [Story 3.6: Configure Content Revalidation and Preview](./epic-3-content-management-system.md#story-36-configure-content-revalidation-and-preview)
  - [Epic 4: GitHub Integration](./epic-4-github-integration.md)
    - [Story 4.1: Create GitHub Data Collection and Cron Job](./epic-4-github-integration.md#story-41-create-github-data-collection-and-cron-job)
    - [Story 4.2: Create GitHub Commit Graph Component](./epic-4-github-integration.md#story-42-create-github-commit-graph-component)
    - [Story 4.3: Add GitHub Profile Link](./epic-4-github-integration.md#story-43-add-github-profile-link)
    - [Story 4.4: Implement Graceful Fallback for GitHub Data](./epic-4-github-integration.md#story-44-implement-graceful-fallback-for-github-data)
  - [Epic 5: Contact & Communication](./epic-5-contact-communication.md)
    - [Story 5.1: Create Contact Form with Validation](./epic-5-contact-communication.md#story-51-create-contact-form-with-validation)
    - [Story 5.2: Create Contact API Endpoint with Storage](./epic-5-contact-communication.md#story-52-create-contact-api-endpoint-with-storage)
    - [Story 5.3: Implement Rate Limiting for Contact Form](./epic-5-contact-communication.md#story-53-implement-rate-limiting-for-contact-form)
    - [Story 5.4: Integrate Email Notifications with Resend](./epic-5-contact-communication.md#story-54-integrate-email-notifications-with-resend)
    - [Story 5.5: Implement Auto-Delete for Contact Submissions](./epic-5-contact-communication.md#story-55-implement-auto-delete-for-contact-submissions)
    - [Story 5.6: Create Social Links Display](./epic-5-contact-communication.md#story-56-create-social-links-display)
  - [Epic 6: SEO & Discovery](./epic-6-seo-discovery.md)
    - [Story 6.1: Configure Meta Tags and Page Metadata](./epic-6-seo-discovery.md#story-61-configure-meta-tags-and-page-metadata)
    - [Story 6.2: Configure Open Graph Tags for Social Sharing](./epic-6-seo-discovery.md#story-62-configure-open-graph-tags-for-social-sharing)
    - [Story 6.3: Generate Sitemap](./epic-6-seo-discovery.md#story-63-generate-sitemap)
    - [Story 6.4: Add Structured Data (Person Schema)](./epic-6-seo-discovery.md#story-64-add-structured-data-person-schema)
    - [Story 6.5: Configure robots.txt](./epic-6-seo-discovery.md#story-65-configure-robotstxt)
  - [Epic 7: Privacy & Legal Compliance](./epic-7-privacy-legal-compliance.md)
    - [Story 7.1: Create Privacy Policy Page](./epic-7-privacy-legal-compliance.md#story-71-create-privacy-policy-page)
    - [Story 7.2: Document Data Collection Practices](./epic-7-privacy-legal-compliance.md#story-72-document-data-collection-practices)
  - [Epic 8: CI/DevOps, Security & Documentation](./epic-8-ci-devops-security-documentation.md)
  - [Epic 9: Blog Platform](./epic-9-blog-platform.md)
    - [Story 9.1: Create Blog Collections (Posts, Categories, Tags)](./epic-9-blog-platform.md#story-91-create-blog-collections-posts-categories-tags)
    - [Story 9.2: Create Blog Listing Page](./epic-9-blog-platform.md#story-92-create-blog-listing-page)
    - [Story 9.3: Create Blog Post Page with Syntax Highlighting](./epic-9-blog-platform.md#story-93-create-blog-post-page-with-syntax-highlighting)
    - [Story 9.4: Create Category and Tag Filtering](./epic-9-blog-platform.md#story-94-create-category-and-tag-filtering)
    - [Story 9.5: Add Blog Post SEO and Open Graph](./epic-9-blog-platform.md#story-95-add-blog-post-seo-and-open-graph)
    - [Story 9.6: Create RSS Feed](./epic-9-blog-platform.md#story-96-create-rss-feed)
    - [Story 9.7: Configure Blog Draft Preview](./epic-9-blog-platform.md#story-97-configure-blog-draft-preview)
