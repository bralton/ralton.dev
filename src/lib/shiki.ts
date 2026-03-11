/**
 * Shiki Syntax Highlighter Configuration
 *
 * Provides build-time syntax highlighting for code blocks using Shiki.
 * Uses a singleton pattern to avoid recreating the highlighter instance.
 *
 * Features:
 * - Build-time rendering (no client-side JS for highlighting)
 * - github-dark theme matching site aesthetic
 * - Support for common programming languages
 */

import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki'

// Promise-based singleton to prevent race conditions during concurrent requests
let highlighterPromise: Promise<Highlighter> | null = null

/**
 * Supported languages for syntax highlighting.
 * These are dynamically loaded when needed.
 */
const SUPPORTED_LANGUAGES: BundledLanguage[] = [
  'typescript',
  'javascript',
  'bash',
  'json',
  'css',
  'html',
  'tsx',
  'jsx',
  'python',
  'rust',
  'go',
  'yaml',
  'markdown',
  'text',
]

/**
 * Returns a singleton Shiki highlighter instance.
 * The highlighter is expensive to create, so we cache it.
 * Uses a Promise-based singleton pattern to prevent race conditions
 * when multiple requests hit this function simultaneously.
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: SUPPORTED_LANGUAGES,
    })
  }
  return highlighterPromise
}

/**
 * Highlights code using Shiki and returns HTML with inline styles.
 *
 * @param code - The source code to highlight
 * @param lang - Programming language (defaults to 'text' if unsupported)
 * @returns HTML string with syntax highlighting applied via inline styles
 */
export async function highlightCode(code: string, lang: string): Promise<string> {
  const h = await getHighlighter()

  // Validate language is supported, fallback to 'text' for plain formatting
  const supportedLang = SUPPORTED_LANGUAGES.includes(lang as BundledLanguage)
    ? (lang as BundledLanguage)
    : 'text'

  return h.codeToHtml(code, {
    lang: supportedLang,
    theme: 'github-dark',
  })
}
