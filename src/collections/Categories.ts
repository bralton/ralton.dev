import type { CollectionConfig } from 'payload'
import { revalidateBlogAfterChange, revalidateBlogAfterDelete } from '@/lib/payloadHooks'
import { createSlugHook } from '@/lib/slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    description: 'Blog post categories for organizing content',
  },
  defaultSort: 'name',
  hooks: {
    afterChange: [revalidateBlogAfterChange],
    afterDelete: [revalidateBlogAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Category name displayed on the site',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from name)',
      },
      hooks: {
        beforeValidate: [createSlugHook('name')],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description of the category',
      },
    },
  ],
}
