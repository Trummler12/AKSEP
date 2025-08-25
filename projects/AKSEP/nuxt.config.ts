import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/i18n', '@pinia/nuxt'],
  i18n: {
    locales: [
      { code: 'de', file: 'de.json' },
      { code: 'en', file: 'en.json' }
    ],
    defaultLocale: 'de',
    langDir: 'src/locales',
    vueI18n: './i18n.config.ts'
  }
})
