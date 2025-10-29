import { describe, expect, it } from 'vitest'
import { calculateOverflow, type OverflowItem } from '../src/hooks/useOverflowNav'

describe('calculateOverflow', () => {
  const items: OverflowItem[] = [
    { key: 'begriffe', width: 120 },
    { key: 'programm', width: 140 },
    { key: 'ueber-uns', width: 130 },
    { key: 'aktuelles', width: 110 },
    { key: 'mitmachen', width: 135 },
  ]

  it('keeps all items visible when space is sufficient', () => {
    const result = calculateOverflow({ items, containerWidth: 900, overflowTriggerWidth: 60 })
    expect(result.visible).toEqual(items.map((item) => item.key))
    expect(result.overflow).toEqual([])
  })

  it('moves items from right to left into overflow', () => {
    const result = calculateOverflow({ items, containerWidth: 420, overflowTriggerWidth: 60 })
    expect(result.visible).toEqual(['begriffe', 'programm'])
    expect(result.overflow).toEqual(['ueber-uns', 'aktuelles', 'mitmachen'])
  })

  it('keeps pinned items visible until the end', () => {
    const pinnedItems: OverflowItem[] = items.map((item, index) => ({
      ...item,
      pinned: index === 0,
    }))
    const result = calculateOverflow({ items: pinnedItems, containerWidth: 260, overflowTriggerWidth: 60 })
    expect(result.visible).toEqual(['begriffe'])
    expect(result.overflow).not.toContain('begriffe')
  })
})
