import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

await setup({ server: true })

describe('index page', () => {
  it('renders without Nuxt welcome', async () => {
    const html = await $fetch('/')
    expect(html).not.toContain('Welcome to Nuxt!')
  })
})
