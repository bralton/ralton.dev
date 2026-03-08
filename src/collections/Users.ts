import type { CollectionConfig } from 'payload'

/**
 * Users Collection - Admin Authentication
 *
 * This collection handles admin user authentication for Payload CMS.
 * The admin panel is accessible at /admin but is NOT publicly linked
 * from the main site for security purposes (NFR12).
 *
 * Security Features:
 * - Session-based authentication with 2-hour token expiration
 * - Brute-force protection: 5 max login attempts, 10-minute lockout
 * - HTTP-only cookies for session tokens (Payload default)
 * - CSRF protection enabled (Payload default)
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
  },
  auth: {
    tokenExpiration: 7200, // 2 hours in seconds (AC #4)
    verify: false, // No email verification for single-user admin
    maxLoginAttempts: 5, // Brute-force protection
    lockTime: 600 * 1000, // 10 minutes lockout in milliseconds
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Display Name',
      admin: {
        description: 'Name displayed in the admin panel',
      },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      defaultValue: 'admin',
      options: [
        { label: 'Admin', value: 'admin' },
      ],
      admin: {
        description: 'User role for future access control',
        readOnly: true, // Only one role for now
      },
    },
  ],
}
