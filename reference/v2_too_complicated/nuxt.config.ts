import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'src/',
  modules: ['@nuxt/content', '@nuxtjs/i18n', '@pinia/nuxt'],
  nitro: {
    compatibilityDate: '2025-08-25'
  },
  i18n: {
    locales: [
      { code: 'de', file: 'de.json' },
      { code: 'en', file: 'en.json' }
    ],
    defaultLocale: 'de',
    langDir: 'locales',
    vueI18n: './i18n.config.ts'
  }
})
