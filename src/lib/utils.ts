import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date range for display.
 * @param startDate - ISO date string for the start date
 * @param endDate - Optional ISO date string for the end date (null/undefined = "Present")
 * @returns Formatted string like "Jan 2024 - Present" or "Jan 2024 - Dec 2025"
 */
export function formatDateRange(startDate: string, endDate?: string | null): string {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : 'Present'

  return `${start} - ${end}`
}
