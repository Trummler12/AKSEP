import { defineEventHandler, type H3Event } from 'h3'
import { serverQueryContent } from '#content/server'
import type { ParsedContent } from '@nuxt/content'

export default defineEventHandler(async (event: H3Event) => {
  const docs = await serverQueryContent(event).find()
  const urls = docs.map((doc: ParsedContent) => `<url><loc>${doc._path}</loc></url>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
})
