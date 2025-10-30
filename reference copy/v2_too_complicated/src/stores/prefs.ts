import { defineStore } from 'pinia'

/**
 * Pinia store for user preferences.
 * Manages theme and language selections.
 */
export const usePrefs = defineStore('prefs', {
  state: () => ({
    darkMode: false as boolean,
    locale: 'de' as string
  }),
  actions: {
    toggleDarkMode () {
      this.darkMode = !this.darkMode
    },
    setLocale (locale: string) {
      this.locale = locale
    }
  }
})
