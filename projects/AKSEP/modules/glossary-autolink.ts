import { defineNuxtModule } from 'nuxt/kit'
import type { ParsedContent } from '@nuxt/content'

export interface Term { slug: string, term: string }

/**
 * Autolink the first occurrence of glossary terms.
 */
export function autolink (content: string, terms: Term[], enabled = true): string {
  if (!enabled) { return content }
  const lines = content.split('\n')
  const remaining = new Map(terms.map(t => [t.slug, t.term]))
  let inCode = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed.startsWith('```')) {
      inCode = !inCode
      continue
    }
    if (inCode || trimmed.startsWith('#')) { continue }
    for (const [slug, term] of Array.from(remaining.entries())) {
      const re = new RegExp(`\\b${term}\\b`)
      if (re.test(line)) {
        lines[i] = line.replace(re, `<TermHint term="${slug}">${term}</TermHint>`)
        remaining.delete(slug)
      }
    }
  }
  return lines.join('\n')
}

export default defineNuxtModule({
  setup (_, nuxt) {
    // @ts-expect-error content hook
    nuxt.hook('content:file:afterParse', (file: ParsedContent & { autolink?: boolean, terms?: Record<string, string> }) => {
      const enabled = file.autolink !== false
      const terms = (Object.entries(file.terms || {}) as [string, string][]).map(([slug, term]) => ({ slug, term }))
      if (typeof file.body === 'string') {
        // @ts-expect-error body is mutated string
        file.body = autolink(file.body, terms, enabled)
      }
    })
  }
})
