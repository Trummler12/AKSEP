import { describe, it, expect } from 'vitest'
import { autolink } from '../../modules/glossary-autolink'

describe('glossary-autolink', () => {
  const term = { slug: 'term', term: 'Begriff' }

  it('links only first occurrence', () => {
    const out = autolink('Begriff und noch ein Begriff', [term])
    expect(out).toBe('<TermHint term="term">Begriff</TermHint> und noch ein Begriff')
  })

  it('skips headings and code blocks', () => {
    const input = '# Begriff\n```\nBegriff\n```\nBegriff'
    const out = autolink(input, [term])
    expect((out.match(/<TermHint/g) || []).length).toBe(1)
  })

  it('can be disabled via option', () => {
    const out = autolink('Begriff', [term], false)
    expect(out).toBe('Begriff')
  })
})
