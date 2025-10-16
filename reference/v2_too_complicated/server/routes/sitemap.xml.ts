import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const docs = await serverQueryContent(event).find()
  const urls = docs.map(doc => `<url><loc>${doc._path}</loc></url>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
})
