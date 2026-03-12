/**
 * CodeBlock Component
 *
 * Server component that renders syntax-highlighted code blocks using Shiki.
 * Highlights code at build time to avoid client-side JavaScript and CLS.
 *
 * Features:
 * - Build-time syntax highlighting (no client JS)
 * - Language label badge in top-right corner
 * - Dark theme styling matching site aesthetic
 * - Accessible with aria-label for language identification
 */

import { highlightCode } from '@/lib/shiki'

interface CodeBlockProps {
  code: string
  language: string
}

/**
 * Maps common language identifiers to display-friendly names.
 */
const LANGUAGE_LABELS: Record<string, string> = {
  typescript: 'TypeScript',
  ts: 'TypeScript',
  javascript: 'JavaScript',
  js: 'JavaScript',
  tsx: 'TSX',
  jsx: 'JSX',
  bash: 'Bash',
  shell: 'Shell',
  sh: 'Shell',
  json: 'JSON',
  css: 'CSS',
  html: 'HTML',
  python: 'Python',
  py: 'Python',
  rust: 'Rust',
  go: 'Go',
  yaml: 'YAML',
  yml: 'YAML',
  markdown: 'Markdown',
  md: 'Markdown',
  text: 'Text',
  plaintext: 'Text',
}

export async function CodeBlock({ code, language }: CodeBlockProps) {
  const highlightedHtml = await highlightCode(code, language)
  const displayLanguage = LANGUAGE_LABELS[language] || language.toUpperCase()

  return (
    <div className="group relative my-6">
      {/* Language label badge */}
      <div
        className="absolute right-3 top-3 z-10 rounded bg-zinc-700/80 px-2 py-0.5 text-xs font-medium text-zinc-300"
        aria-hidden="true"
      >
        {displayLanguage}
      </div>

      {/* Code block container with accessible label and min-height for CLS prevention */}
      <div
        className="min-h-[3rem] overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed"
        aria-label={`${displayLanguage} code block`}
        role="region"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  )
}
