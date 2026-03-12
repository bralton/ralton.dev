/**
 * Slug Generation Utilities
 *
 * Shared hook factory for generating URL-friendly slugs from source fields.
 * Used by Posts, Categories, and Tags collections.
 */

import type { FieldHook } from 'payload'

/**
 * Creates a field hook that generates a URL-friendly slug from a source field.
 * If a slug is already provided, it will be used as-is.
 *
 * @param sourceField - The field to generate the slug from ('title' or 'name')
 * @returns A Payload field hook for slug generation
 */
export function createSlugHook(sourceField: 'title' | 'name'): FieldHook {
  return ({ value, data, originalDoc }) => {
    // If slug is manually provided, use it
    if (value) return value

    // Generate from source field
    const source = data?.[sourceField] || originalDoc?.[sourceField]
    if (!source) return value

    return source
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}
