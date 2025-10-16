import { describe, it, expect } from 'vitest'
import { generateAliases, applyRedirect } from '../../modules/content-aliases'

describe('content-aliases', () => {
  it('creates english alias from german slug', () => {
    const doc: any = { _path: '/programm/ag-gesundheit/thema', aliases: [] }
    generateAliases(doc)
    expect(doc.aliases).toContain('/en/programm/ag-gesundheit/thema')
  })

  it('redirects legacy DE slug to EN slug keeping query/hash', () => {
    const doc: any = { _path: '/programm/ag-gesundheit/ernaehrung', path: { en: 'dietary' }, aliases: [] }
    generateAliases(doc)
    const url = applyRedirect('/en/programm/ag-gesundheit/ernaehrung?x=1#kap', doc.redirect!)
    expect(url).toBe('/en/programm/ag-gesundheit/dietary?x=1#kap')
  })
})
