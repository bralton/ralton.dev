import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'techStack', 'isVisible'],
    description: 'Portfolio projects displayed on your site',
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Project name or title',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'Detailed description of the project and your role',
      },
    },
    {
      name: 'techStack',
      type: 'array',
      admin: {
        description: 'Technologies used in this project',
      },
      fields: [
        {
          name: 'technology',
          type: 'text',
          required: true,
          admin: {
            description: 'Technology name (e.g., React, TypeScript, Node.js)',
          },
        },
      ],
    },
    {
      name: 'repoUrl',
      type: 'text',
      admin: {
        description: 'GitHub repository URL (optional)',
      },
    },
    {
      name: 'liveUrl',
      type: 'text',
      admin: {
        description: 'Live demo or deployed site URL (optional)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Project screenshot or thumbnail (16:9 aspect ratio recommended)',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Toggle to show/hide this project on the site',
      },
    },
  ],
}
