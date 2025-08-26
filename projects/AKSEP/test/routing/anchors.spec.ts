import { describe, it, expect } from 'vitest'
import { chapterAnchor } from '../../src/utils/anchors'

describe('chapter anchors', () => {
  it('generates numeric anchor', () => {
    expect(chapterAnchor(1)).toBe('#1')
    expect(chapterAnchor(15)).toBe('#15')
  })
})
