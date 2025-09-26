/// <reference path="./.nuxt/nuxt.d.ts" />
/// <reference types="nuxt" />
/// <reference types="@nuxt/content" />
/// <reference types="@nuxtjs/i18n" />

import type { ModuleHooks } from '@nuxt/content'

declare module '@nuxt/schema' {
  interface NuxtHooks extends ModuleHooks {}
}
