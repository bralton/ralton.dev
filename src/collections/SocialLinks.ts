import type { CollectionConfig } from 'payload'

export const SocialLinks: CollectionConfig = {
  slug: 'social-links',
  admin: {
    useAsTitle: 'platform',
    description: 'Social media profile links',
    defaultColumns: ['platform', 'url', 'isVisible'],
  },
  access: {
    read: () => true, // Public
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        { label: 'GitHub', value: 'github' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Twitter/X', value: 'twitter' },
        { label: 'Email', value: 'email' },
      ],
      admin: {
        description: 'Social media platform',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Full URL to profile (or mailto: for email)',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this link on the site',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers first)',
      },
    },
  ],
}
