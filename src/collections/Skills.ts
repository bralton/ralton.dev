import type { CollectionConfig } from 'payload'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'isVisible'],
    description: 'Technical skills displayed on your portfolio, grouped by category',
  },
  defaultSort: 'category',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Skill name (e.g., TypeScript, React, Docker)',
      },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: {
        description: 'Category for grouping (e.g., Languages, Frameworks, Tools, DevOps)',
      },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Toggle to show/hide this skill on the site',
      },
    },
  ],
}
