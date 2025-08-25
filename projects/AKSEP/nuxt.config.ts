import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/i18n'],
  srcDir: 'src',
  nitro: {
    compatibilityDate: '2025-08-25'
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: ['de', 'en'],
    defaultLocale: 'de'
  }
})
