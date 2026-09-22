/**
 * Project status is derived from a title suffix such as "Foo (archived)" -
 * the Projects collection has no status field (NFR-R6).
 */

export type ProjectStatus = 'active' | 'archived'

const STATUS_SUFFIX = /\s*[-–—]?\s*\((abandoned|archived|deprecated)\)\s*/i

/** Split a stored title into its display title and derived status. */
export function parseProjectStatus(title: string): {
  displayTitle: string
  status: ProjectStatus
} {
  const match = title.match(STATUS_SUFFIX)
  if (match) {
    return { displayTitle: title.replace(match[0], ' ').trim(), status: 'archived' }
  }
  return { displayTitle: title, status: 'active' }
}
