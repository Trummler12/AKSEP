import { describe, expect, it } from 'vitest'
import { computeOverflow, type OverflowComputationItem } from '../src/hooks/useOverflowNav'

describe('computeOverflow', () => {
  const baseItems: OverflowComputationItem[] = [
    { key: 'begriffe', width: 120, isPinned: false },
    { key: 'programm', width: 160, isPinned: false },
    { key: 'ueber-uns', width: 130, isPinned: false },
    { key: 'aktuelles', width: 140, isPinned: false },
    { key: 'mitmachen', width: 150, isPinned: true },
  ]

  it('keeps all items visible when space is sufficient', () => {
    const result = computeOverflow(baseItems, 900, 60)
    expect(result.visibleKeys).toEqual(baseItems.map((item) => item.key))
    expect(result.overflowKeys).toEqual([])
  })

  it('moves items from right to left when space is limited', () => {
    const result = computeOverflow(baseItems, 420, 60)
    expect(result.visibleKeys).toEqual(['begriffe', 'mitmachen'])
    expect(result.overflowKeys).toEqual(['programm', 'ueber-uns', 'aktuelles'])
  })

  it('overflows pinned items last', () => {
    const result = computeOverflow(baseItems, 320, 60)
    expect(result.overflowKeys).not.toContain('mitmachen')
    expect(result.visibleKeys).toContain('mitmachen')
  })
})
