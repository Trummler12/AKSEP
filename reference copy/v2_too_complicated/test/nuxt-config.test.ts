import { describe, it, expect } from 'vitest'
import config from '../nuxt.config'

describe('nuxt configuration', () => {
  it('uses src directory', () => {
    expect(config.srcDir).toBe('src/')
  })
})
