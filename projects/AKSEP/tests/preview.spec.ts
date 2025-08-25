import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('..', import.meta.url))
})

describe('preview', () => {
  it('renders index page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('<div')
  })
})
