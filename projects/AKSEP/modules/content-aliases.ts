import { defineNuxtModule } from 'nuxt/kit'

export interface ContentDoc {
  _path: string
  path?: Record<string, string>
  aliases?: string[]
  redirect?: Record<string, string>
}

/**
 * Generate aliases and optional legacy redirect map for a content document.
 */
export function generateAliases (doc: ContentDoc): ContentDoc {
  const aliases = new Set(doc.aliases || [])
  const segments = doc._path.split('/')
  const slug = segments.pop() || ''
  const base = segments.join('/')
  const enSlug = doc.path?.en || slug
  const enAlias = `/en${base}/${enSlug}`
  aliases.add(enAlias)
  doc.aliases = Array.from(aliases)

  if (doc.path?.en && doc.path.en !== slug) {
    doc.redirect = { ...(doc.redirect || {}), [`/en${doc._path}`]: enAlias }
  }
  return doc
}

/**
 * Apply a redirect map to an URL while keeping query and hash.
 */
export function applyRedirect (url: string, map: Record<string, string>): string | undefined {
  const u = new URL(url, 'https://dummy')
  const target = map[u.pathname]
  if (target) {
    return `${target}${u.search}${u.hash}`
  }
}

export default defineNuxtModule({
  setup (_, nuxt) {
    // @ts-expect-error content hook
    nuxt.hook('content:file:beforeParse', (file: { _id: string, body: string } & Partial<ContentDoc>) => {
      generateAliases(file as ContentDoc)
    })
  }
})
