import { describe, expect, it } from 'vitest'
import { calculateOverflow } from '../src/hooks/useOverflowNav'

describe('useOverflowNav overflow calculation', () => {
  it('keeps all items visible when widths fit inside the container', () => {
    const result = calculateOverflow({
      keys: ['a', 'b'],
      widths: new Map([
        ['a', 80],
        ['b', 90],
      ]),
      containerWidth: 220,
      overflowToggleWidth: 40,
      pinnedKeys: new Set(),
    })

    expect(result.visible).toEqual(['a', 'b'])
    expect(result.overflow).toEqual([])
  })

  it('moves items from right to left into the overflow list when space runs out', () => {
    const result = calculateOverflow({
      keys: ['a', 'b', 'c'],
      widths: new Map([
        ['a', 120],
        ['b', 120],
        ['c', 120],
      ]),
      containerWidth: 260,
      overflowToggleWidth: 40,
      pinnedKeys: new Set(),
    })

    expect(result.visible).toEqual(['a'])
    expect(result.overflow).toEqual(['b', 'c'])
  })

  it('keeps pinned items visible until all other items have overflowed', () => {
    const result = calculateOverflow({
      keys: ['inform', 'updates', 'cta'],
      widths: new Map([
        ['inform', 110],
        ['updates', 110],
        ['cta', 130],
      ]),
      containerWidth: 240,
      overflowToggleWidth: 40,
      pinnedKeys: new Set(['cta']),
    })

    expect(result.visible).toEqual(['cta'])
    expect(result.overflow).toEqual(['inform', 'updates'])
  })
})
