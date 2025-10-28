import { describe, expect, test } from 'vitest'

import { calculateOverflowKeys } from '../src/hooks/useOverflowNav'

const createWidths = (entries: Record<string, number>) => new Map(Object.entries(entries))

describe('calculateOverflowKeys', () => {
  const orderedKeys = ['begriffe', 'programm', 'cta']
  const pinnedKeys = ['cta']
  const gap = 16

  test('keeps items visible when total width is within available space', () => {
    const widths = createWidths({ begriffe: 100, programm: 110, cta: 90 })

    const result = calculateOverflowKeys({
      orderedKeys,
      pinnedKeys,
      itemWidths: widths,
      gap,
      availableWidth: 360
    })

    expect(result).toEqual([])
  })

  test('moves non-pinned items into overflow before pinned ones', () => {
    const widths = createWidths({ begriffe: 140, programm: 140, cta: 120 })

    const result = calculateOverflowKeys({
      orderedKeys,
      pinnedKeys,
      itemWidths: widths,
      gap,
      availableWidth: 272
    })

    expect(result).toEqual(['programm', 'begriffe'])
  })
})
