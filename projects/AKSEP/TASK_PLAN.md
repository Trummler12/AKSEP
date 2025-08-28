# Task Plan

1. Update `package.json`: add script `typecheck`, ensure `test` uses `vitest run`, add dev dependency `vue-tsc`.
2. Modify `nuxt.config.ts` to set Nitro `compatibilityDate` to "2025-08-26".
3. Replace `tsconfig.json` with standalone config: set `moduleResolution` to "bundler", include global `types` [node, nuxt, @nuxt/content, @nuxtjs/i18n], enable `skipLibCheck`, configure `include` paths.
4. Add new `nuxt.d.ts` containing reference types for Nuxt, @nuxt/content and @nuxtjs/i18n.
5. Fix TypeScript imports:
   - `src/app.config.ts`: import `defineAppConfig` from "nuxt/schema".
   - `src/plugins/variant-filter.client.ts`: import `defineNuxtPlugin` from "#app".
   - `server/routes/sitemap.xml.ts`: import `defineEventHandler` and type event parameter, keep `serverQueryContent`.
6. Refine module hooks to avoid `any`:
   - `modules/glossary-autolink.ts`: use `ParsedContent` instead of `any` for `content:file:afterParse`.
   - `modules/content-aliases.ts` and `modules/content-ensure.ts`: type `content:file:beforeParse` parameter without `any` and remove index signature `any`.
7. Install dependencies to pick up `vue-tsc`.
8. Run `npm run lint`, `npm run test`, `npm run typecheck`, and start `npm run dev` to verify no TypeScript errors and no Nitro warning.
