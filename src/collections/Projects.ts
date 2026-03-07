import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'techStack', 'isVisible'],
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'techStack',
      type: 'array',
      fields: [
        {
          name: 'technology',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'repoUrl',
      type: 'text',
      admin: {
        description: 'GitHub repository URL',
      },
    },
    {
      name: 'liveUrl',
      type: 'text',
      admin: {
        description: 'Live demo or deployed site URL',
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
