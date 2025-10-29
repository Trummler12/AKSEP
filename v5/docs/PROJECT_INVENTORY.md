# AKSEP-Website Project Inventory

**Date:** 2025-10-28  
**Repository:** AKSEP-Website (Vite + React 19 + TypeScript + Playwright)  
**Status:** All build checks passing ✅

---

## 1. Repository Inventory

### Core Files & Stubs

| Path | Type | Status | Notes |
|------|------|--------|-------|
| `src/App.tsx` | Stub | Empty placeholder | Router/PageShell to be inserted |
| `src/main.tsx` | Working | ✅ | BrowserRouter setup with React.StrictMode |
| `src/setupTests.ts` | Working | ✅ | `@testing-library/jest-dom` imported |
| `src/components/page-shell.tsx` | Stub | Empty | Layout wrapper (header/footer) |
| `src/components/footer.tsx` | Stub | Empty | Footer component |
| `src/components/navigation.tsx` | Working | ✅ | Named export: `Navigation` from `./navigation/Navigation` |
| `src/components/navigation/Navigation.tsx` | Stub | Empty | Main nav component (returns `null`) |
| `src/components/navigation/NavigationItem.tsx` | Stub | Empty | Individual nav item component |
| `src/components/navigation/OverflowNavigation.tsx` | Stub | Empty | Overflow menu for mobile |
| `src/components/routing/Router.tsx` | Stub | Empty | Route definitions |

### Data Files (Complete ✅)

| Path | Status | Items | Purpose |
|------|--------|-------|---------|
| `src/data/navigation.ts` | ✅ | 7 main items + 35 sub-items | Navigation structure with dropdowns |
| `src/data/footer.ts` | ✅ | Contact, social, legal links | Footer configuration |
| `src/data/startpage.ts` | ✅ | News (3), highlights (4), sections | Homepage content |
| `src/data/routes.ts` | ✅ | 37 route definitions | SEO metadata, route registry |

### UI Primitives (50 files, all empty)

**Location:** `src/components/ui/*.tsx`

Primitives available but not yet implemented:
- **Layout & Structure:** accordion, alert, alert-dialog, aspect-ratio, breadcrumb, card, carousel, collapsible, drawer, pagination, resizable, scroll-area, sheet, sidebar, skeleton, table, tabs
- **Input & Forms:** button, checkbox, input, input-otp, label, radio-group, select, switch, textarea, toggle, toggle-group
- **Menus & Navigation:** command, context-menu, dropdown-menu, menubar, navigation-menu, popover
- **Feedback & Info:** badge, chart, hover-card, progress, slider, sonner (toast), tooltip
- **Icon:** icon (custom icon system)
- **Utilities:** form, utils

### Styles Directory

**Existing CSS files (mostly empty):**

```
src/styles/
  ├── globals.css           ✅ Design tokens (colors, typography, spacing)
  ├── themes.css            ✅ Dark theme CSS variables
  ├── components/
  │   ├── shared.css        (empty)
  │   ├── navigation.css    (empty)
  │   ├── hero.css          (empty)
  │   ├── footer.css        (empty)
  │   └── content-sections.css (empty)
  └── pages/
      ├── homepage.css      (empty)
      └── standard.css      (empty)
```

### Types

**Location:** `src/types/navigation.ts`

```typescript
LinkItem: { label, href, external?, icon? }
SocialLink: { label, href, icon?, iconName? }
NavChild: { label, href, key? }
NavChildGroup: { label?, items: NavChild[], key?, showTopBorder? }
NavItem: { label, href?, groups?, cta?, align?: 'left'|'right', key?, displayInPrimary? }
FooterConfig: { contactInfo, socialLinks, participationLinks, legalLinks, copyright }
RouteConfig: { title, description? }
StartPageContent: { newsItems, programHighlights, aksepDescription, informationPolitics, programSection, newsSection, participationSection }
```

### Root Configs

| File | Status | Notes |
|------|--------|-------|
| `package.json` | ✅ | React 19.1.1, React Router 7.9.4, Playwright, Vitest |
| `vite.config.ts` | ✅ | `vitest/config`, react plugin, jsdom environment |
| `playwright.config.ts` | ✅ | Chrome only, baseURL: `http://localhost:5173`, webServer: build + preview |
| `tsconfig.json` | ✅ | Refs `tsconfig.app.json` and `tsconfig.node.json` |
| `tsconfig.app.json` | ✅ | `strict: true`, `verbatimModuleSyntax: true`, `noUnusedLocals: true` |
| `eslint.config.js` | ✅ | TypeScript ESLint + React Hooks + React Refresh |
| `.gitignore` | ✅ | Node, dist, env files ignored |

---

## 2. Routing Map

### Route Structure (37 routes)

**Root redirect:** ❌ **NOT IMPLEMENTED** — `/` should redirect to `/start` (or render start page directly)

| Path | Component | Type | Layout | Status |
|------|-----------|------|--------|--------|
| `/start` | `src/content/start.tsx` | Content | PageShell | Stub |
| `/` | — | Redirect | — | **MISSING** |
| **Begriffe (Definitions)** | | | | |
| `/begriffe` | Placeholder | List | PageShell | Stub |
| `/begriffe/warum-begriffklaerungen-wichtig-sind` | Placeholder | Article | PageShell | Stub |
| `/begriffe/rechts-vs-links` | Placeholder | Article | PageShell | Stub |
| `/begriffe/radikal` | Placeholder | Article | PageShell | Stub |
| `/begriffe/paedophil-vs-paedokriminell` | Placeholder | Article | PageShell | Stub |
| `/begriffe/faschismus` | Placeholder | Article | PageShell | Stub |
| `/begriffe/weitere` | Placeholder | List | PageShell | Stub |
| **Program (14 working groups + preamble)** | | | | |
| `/programm` | Placeholder | List | PageShell | Stub |
| `/praeambel` | Placeholder | Article | PageShell | Stub |
| `/programm/{regierung,innere-sicherheit,...}` | (14x) Placeholder | Article | PageShell | Stub |
| **About & Organization** | | | | |
| `/ueber-uns` | Placeholder | List | PageShell | Stub |
| `/satzung` | Placeholder | Article | PageShell | Stub |
| `/projekte` | Placeholder | List | PageShell | Stub |
| `/partner-projekte` | Placeholder | List | PageShell | Stub |
| `/finanzen-transparenz` | Placeholder | Article | PageShell | Stub |
| **Current / News** | | | | |
| `/termine` | Placeholder | List | PageShell | Stub |
| `/presse` | Placeholder | List | PageShell | Stub |
| **Participation** | | | | |
| `/mitglied-werden` | Placeholder | Form | PageShell | Stub |
| `/mitmachen` | Placeholder | Article | PageShell | Stub |
| `/unterstuetzen` | Placeholder | Article | PageShell | Stub |
| `/kontakt` | Placeholder | Form | PageShell | Stub |
| **Legal** | | | | |
| `/impressum` | Placeholder | Article | PageShell | Stub |
| `/datenschutz` | Placeholder | Article | PageShell | Stub |

**Key gaps:**
- ❌ Root `/` redirect/handler missing
- ❌ `Router.tsx` is empty (should configure React Router)
- ❌ All content pages use placeholder component (empty)

---

## 3. Navigation Data Model vs. UI

### Navigation Items (7 Primary + 2 Hidden)

**Primary items** (displayed in header):
1. **Begriffe** → `/begriffe` | Groups: intro, wichtige (4 items), weitere | Dropdown
2. **Programm** → `/programm` | Groups: preamble, ags (14 items) | Dropdown
3. **Über uns** → `/ueber-uns` | Groups: org (4 items) | Dropdown
4. **Aktuelles** → `/termine` | Groups: updates (2 items) | Dropdown
5. **Mitmachen** → `/mitmachen` | Groups: options (4 items) | Dropdown

**Hidden items** (footer/legal):
6. **Datenschutz** → `/datenschutz` | `displayInPrimary: false`
7. **Impressum** → `/impressum` | `displayInPrimary: false`

### Navigation Features (TODO)

| Feature | Implemented | Notes |
|---------|-------------|-------|
| Desktop dropdown hover | ❌ | Sub-items should appear on hover with border separators (`showTopBorder`) |
| Overflow (mobile/narrow) | ❌ | `OverflowNavigation` stub empty |
| Keyboard navigation | ❌ | Tab order, Esc to close, arrow keys for menu traversal |
| ARIA roles | ❌ | `role="navigation"`, `role="menuitem"`, `aria-expanded`, `aria-haspopup` missing |
| Focus management | ❌ | Focus trap on open menu; restore on close |
| Pinned CTAs | ❌ | Items with `align: 'right'` should stick to right edge (currently none configured, but structure allows) |
| Active state | ❌ | Current page highlighting in nav |
| Smooth transitions | ❌ | `prefers-reduced-motion` respect needed |

---

## 4. Screenshots → Feature Mapping

### Goal Images

**goal/start0.png** — Homepage Hero & Main Sections
- [ ] **Hero Section** (large banner with AKSEP branding)
- [ ] **3 Pillars/Badges** (Aktivistisch · Klimafreundlich · Sozialdemokratisch)
- [ ] **"Unser Programm" CTA** (call-to-action button)
- [ ] **Program Highlights Card Grid** (4 cards: Bildungsreform, Klimapolitik, Sozialpolitik, Europa & Migration)
- [ ] **News Section** (3 news item cards with date, title, description)
- [ ] **"Gemeinsam für AKSEPtanz" CTA Strip** (participation section with text + CTA)
- [ ] **Footer** (contact, social, legal links, copyright)

**Implementation ownership:**
- Hero + pillars → `src/components/` (new) + `src/styles/components/hero.css`
- Highlights grid → `src/content/start.tsx` (use `programHighlights` from `startpage.ts`)
- News cards → `src/content/start.tsx` (use `newsItems` from `startpage.ts`)
- CTA strips → `src/content/start.tsx`
- Footer → `src/components/footer.tsx` (use `footerConfig` from `footer.ts`)

---

**goal/navbar1.png – navbar5.png** — Navigation Bar Variations

- [ ] **navbar1.png** — Desktop nav (5 items, no overflow)
- [ ] **navbar2.png** — Hover state on "Begriffe" (dropdown opens with 3 groups)
- [ ] **navbar3.png** — Hover state on "Programm" (large dropdown with 14+ items, scrollable?)
- [ ] **navbar4a.png** — Narrow viewport (overflow menu icon visible)
- [ ] **navbar4b.png** — Overflow menu open (stacked items, mobile-friendly)
- [ ] **navbar5.png** — Footer links highlight / hover state

Implementation ownership:
- Nav bar structure → `src/components/navigation/Navigation.tsx`
- Dropdown behavior → `src/components/navigation/NavigationItem.tsx`
- Overflow logic → `src/components/navigation/OverflowNavigation.tsx`
- Styles → `src/styles/components/navigation.css`
- Data source → `src/data/navigation.ts` (already complete)

---

**goal/sidebar.png** — Mobile Drawer Navigation

- [ ] **Drawer/Sheet** component wrapper
- [ ] **Grouped navigation** (Begriffe, Programm, Über uns, etc., as collapsible sections)
- [ ] **Smooth open/close animations**
- [ ] **Keyboard accessibility** (Esc to close, focus trap)
- [ ] **Touch-friendly spacing & hit targets**

Implementation ownership:
- Drawer shell → `src/components/ui/sheet.tsx` (or `drawer.tsx`)
- Navigation mapping → `src/components/navigation/OverflowNavigation.tsx`
- Styles → `src/styles/components/shared.css` (drawer + responsive)

---

**goal/placeholder_page.png** — Content Page Template

- [ ] **Centered content area** (generous whitespace)
- [ ] **Breadcrumb navigation** (optional)
- [ ] **Page title**
- [ ] **Body text / content**
- [ ] **Sidebar or full-width** option

Implementation ownership:
- Layout → `src/components/page-shell.tsx`
- Placeholder → `src/content/page-placeholder.tsx`
- Styles → `src/styles/pages/standard.css`

---

## 5. Styles & Tokens

### Color Palette (from `globals.css` + `themes.css`)

**Named Colors (CSS Variables):**
```css
--true-lavender: #7E65B9    /* Primary accent */
--horizon: #5A8FA8          /* Secondary (blue) */
--mint: #3EB694             /* Accent (green) */
--bg-darkest: #322A45
--bg-darker: #423A51
--white: #ffffff
--destructive: #d4183d      /* Error/danger */
--light-gray: #f8f9fa
--medium-gray: #e9ecef
--dark-gray: #495057
```

**Dark Theme Semantic Mappings (active):**
```css
--background: #423A51 (bg-darker)
--foreground: #ffffff
--primary: #7E65B9
--secondary: #5A8FA8
--accent: #3EB694
--border: #5A8FA8
--card: #423A51
--destructive: #d4183d
/* Alpha variants: --primary-20, --primary-90, --secondary-20, --accent-20, --muted-40, --border-60 */
```

**Bright Theme (commented out, future):**
```css
--background: #f8f9fa (light-gray)
--foreground: #495057 (dark-gray)
```

### Typography Scale

```css
--font-size: 16px (base)
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 1.875rem (30px)
```

**Font weights:**
```css
--font-weight-normal: 400
--font-weight-medium: 500
```

### Spacing & Layout

```css
--radius: 0.625rem (10px, border-radius default)
```

*Note:* No explicit spacing scale (gaps, padding vars) defined. Recommend adding: `--space-1, --space-2, --space-3, --space-4, --space-6, --space-8` following Tailwind/Pico conventions.

### Breakpoints

**Not explicitly defined in CSS.** Recommend:
```css
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
```

### Existing CSS Files

| File | Status | Purpose |
|------|--------|---------|
| `src/styles/globals.css` | ✅ Populated | CSS variables, design tokens |
| `src/styles/themes.css` | ✅ Populated | Dark theme mappings + alpha variants |
| `src/styles/components/shared.css` | Empty | Utility classes, shared patterns |
| `src/styles/components/navigation.css` | Empty | Nav bar, dropdowns, overflow menu |
| `src/styles/components/hero.css` | Empty | Hero section styles |
| `src/styles/components/footer.css` | Empty | Footer layout + styling |
| `src/styles/components/content-sections.css` | Empty | Content grid, typography patterns |
| `src/styles/pages/homepage.css` | Empty | Homepage-specific layouts |
| `src/styles/pages/standard.css` | Empty | Generic page template styles |

### Class Naming Convention

**Current:** None enforced (no existing classes to audit). **Recommendation:** BEM-lite (no nesting):
```css
/* Good */
.nav { }
.nav__item { }
.nav__item--active { }
.nav__dropdown { }

.footer { }
.footer__section { }
.footer__link { }
```

**Utilities:** Consider Tailwind-style if adding new utilities (e.g., `.text-xs`, `.rounded-md`, `.gap-4`).

---

## 6. UI Primitives Readiness

### Summary: 50 primitives available, all empty

**Key primitives for immediate use:**

| Primitive | File | Status | Needed For | Notes |
|-----------|------|--------|-----------|-------|
| button | `ui/button.tsx` | Empty | Nav CTAs, hero CTA, form submit | Essential |
| card | `ui/card.tsx` | Empty | News cards, highlight cards, content containers | Essential |
| sheet / drawer | `ui/sheet.tsx` | Empty | Mobile nav overflow drawer | Essential |
| navigation-menu | `ui/navigation-menu.tsx` | Empty | Desktop dropdown nav (Radix-based?) | Essential |
| dropdown-menu | `ui/dropdown-menu.tsx` | Empty | Overflow menu items | High priority |
| icon | `ui/icon.tsx` | Empty | AKSEP icon system (Lightbulb, Heart, etc.) | High priority |
| link | N/A (use `<a>` + React Router `<Link>`) | N/A | All hrefs | Built-in |
| popover | `ui/popover.tsx` | Empty | Tooltips, info boxes (optional) | Low priority |
| accordion | `ui/accordion.tsx` | Empty | FAQ, collapsible sections (future) | Low priority |
| form | `ui/form.tsx` | Empty | Contact, signup forms | Medium priority |
| input / textarea | `ui/input.tsx`, `ui/textarea.tsx` | Empty | Form fields | Medium priority |
| checkbox / radio-group | `ui/checkbox.tsx`, `ui/radio-group.tsx` | Empty | Form inputs | Medium priority |
| select | `ui/select.tsx` | Empty | Dropdowns (if needed) | Low priority |
| pagination | `ui/pagination.tsx` | Empty | News list pagination | Low priority |

### Compilation Status

All primitives are syntactically valid **empty TSX files**. They compile without error but export nothing (no default, no named exports). Importing from them will fail at runtime unless implemented. **Action:** Implement component bodies with `export default` or named exports as needed.

### Styling Approach

**Current:** No inline styles in empty files. **Plan:**
- Primitives should accept `className` prop for customization
- Core styles defined in `src/styles/components/*.css`
- Use CSS variables from `themes.css` (e.g., `var(--primary)`, `var(--border)`)
- Consider Tailwind/Pico CSS for rapid iteration, or pure CSS modules

---

## 7. Build & Test Baseline ✅

### All Checks Passing

**npm run lint**
```
✅ 0 errors, 0 warnings
```

**npm test**
```
✅ 1 test file (smoke.test.ts)
✅ 1 passing test
✅ Duration: 3.23s
```

**npm run build**
```
✅ tsc -b: TypeScript compiles
✅ vite build: 40 modules transformed, 225 KB JS
✅ Duration: 1.97s
```

**npm run preview**
```
✅ Server started on port 5173
✅ Serves dist/ (production build)
```

**npm run test:e2e**
```
⚠️ No e2e tests implemented yet
Config ready: Playwright configured for Chrome
BaseURL: http://localhost:5173
```

### Scripts Summary

| Script | Command | Status |
|--------|---------|--------|
| `dev` | `vite` | ✅ Start dev server |
| `build` | `tsc -b && vite build` | ✅ Type-check + build |
| `preview` | `vite preview --strictPort` | ✅ Preview production build |
| `lint` | `eslint .` | ✅ 0 errors |
| `test` | `vitest --environment jsdom --run` | ✅ 1 passing |
| `test:watch` | `vitest --environment jsdom` | ✅ Watch mode available |
| `test:e2e` | `playwright test` | ⚠️ No tests (directory `/e2e/` missing) |
| `e2e:headed` | `playwright test --headed` | ⚠️ Same as above |

---

## 8. A11y & i18n Expectations

### Language

**Current:** All content in **German** (de-DE). No i18n framework implemented.

**Data samples:**
- Nav labels: "Begriffe", "Programm", "Über uns", "Aktuelles", "Mitmachen"
- Footer copy: "© 2024 die Aktivistische Klimafreundliche Sozialdemokratische Europa-Partei (AKSEP)."
- Page titles & descriptions: German only

**Recommendation:** If internationalization becomes a requirement, integrate `react-i18next` or `next-intl` (if migrating to Next.js). For now, **German-only is acceptable.**

### Accessibility (WCAG 2.1 AA target)

**Current gaps:**

| Feature | Implemented | Priority | Notes |
|---------|-------------|----------|-------|
| Semantic HTML | ❌ Partial | **Must** | Stubs use `null` or empty divs; need `<nav>`, `<footer>`, `<main>`, `<section>`, `<article>` |
| ARIA roles | ❌ | **High** | Menu dropdowns need `role="menu"`, items `role="menuitem"`, buttons `role="button"` |
| Keyboard nav | ❌ | **High** | Tab, Enter, Esc, arrow keys for menu traversal |
| Focus indicators | ❌ | **High** | Visible focus rings on interactive elements |
| Focus trap | ❌ | **High** | Lock focus inside open menus; restore on close |
| Color contrast | ❌ Verify | **Medium** | LADC ratios: true-lavender (#7E65B9) on dark (#423A51) needs verification |
| Alt text | ❌ | **High** | All images (`iconName` fields, hero image) need `alt=""` or semantic labels |
| Skip links | ❌ | **Medium** | "Skip to main content" link |
| Form labels | ❌ | **High** | Contact/signup forms must have `<label>` + `htmlFor` |
| Error messages | ❌ | **High** | Form validation with ARIA `aria-invalid`, `aria-describedby` |
| Reduced motion | ❌ Partial | **Medium** | CSS transitions should respect `prefers-reduced-motion` |

**Quick accessibility audit checklist (for Codex):**
- [ ] All interactive elements are keyboard-accessible
- [ ] Focus visible & logical tab order
- [ ] Dropdowns: Esc closes, arrows navigate, Enter selects
- [ ] Images: `alt=""` (decorative) or descriptive
- [ ] Headings: `<h1>` once per page, logical hierarchy
- [ ] Buttons: Not just styled `<div>`; use `<button>` or `role="button"` with `tabIndex="0"`
- [ ] Links: Distinguish from regular text (underline, color, or icon)
- [ ] Mobile: Touch targets ≥ 44x44px (WCAG guideline)
- [ ] Color contrast: ≥ 4.5:1 for normal text (AA)

---

## 9. Non-Functional Requirements

### Performance Guidelines

**Targets (estimated):**
- **First Contentful Paint:** < 1.5s (LCP < 2.5s)
- **Time to Interactive:** < 3s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

**Optimizations to implement:**
- [ ] Code splitting (React Router lazy loading for routes)
- [ ] Image optimization (hero image: WebP + srcset)
- [ ] CSS-in-JS or critical CSS extraction
- [ ] Debounce resize/scroll listeners in nav/dropdown
- [ ] Pre-calculate nav widths to avoid reflow (overflow detection)
- [ ] Respect `prefers-reduced-motion` (skip animations)
- [ ] Lazy-load below-fold content (news cards, etc.)

### Browser Support

**Recommended target (absent explicit constraint):**
- **Desktop:** Chrome, Firefox, Safari (latest 2 major versions)
- **Mobile:** iOS Safari (last 2), Chrome Android (last 2)
- **Minimum:** ES2022 (no IE11 support needed)

**Current tooling supports:** ES2022 target (Vite, esbuild)

### Motion & Animation

**Default:** No motion defined yet. **Recommendations:**
- Dropdown open/close: 200–300ms (fade + slide)
- Mobile drawer: 250ms (slide-in from left/right)
- Hover effects on buttons/links: 150ms
- Respect `prefers-reduced-motion`: remove/disable animations

---

## 10. Open Questions & Defaults

### Uncertainties (for Codex to resolve)

1. **Icon system:** Data uses `iconName: 'Lightbulb' | 'Globe' | 'Heart' | 'Users' | ...` but no icon library imported (no Lucide, Heroicons, etc.). 
   - **Action:** Choose icon source (Lucide React recommended) and implement `src/components/ui/icon.tsx`.

2. **Root route (`/`):** `routes.ts` defines `/start` but not `/`. Should `/` redirect to `/start`, or should the homepage render at `/`?
   - **Action:** Implement root redirect in `Router.tsx`.

3. **Overflow detection:** Nav dropdowns (Programm has 14+ items, Begriffe has 7). How to handle vertical overflow on small screens?
   - **Action:** Implement scrollable dropdown or mobile overflow menu (already exists: `OverflowNavigation`).

4. **Breadcrumb:** Goal images suggest breadcrumbs on content pages. Should these be auto-generated from route path?
   - **Action:** Implement optional breadcrumb component + CSS.

5. **Form validation:** Contact/signup forms (e.g., `/mitglied-werden`, `/kontakt`) not yet defined. Should these use a form library (React Hook Form, Formik)?
   - **Action:** Choose form library & implement form components.

6. **CMS/Headless backend:** All content currently hardcoded in `src/data/`. Should routes dynamically fetch from a backend?
   - **Action:** For now, keep data static. Document migration path if CMS integration needed.

### Safe Defaults Codex Can Choose

- **Z-index scale:** `.modal: 50`, `.dropdown: 30`, `.tooltip: 20`, `.sticky: 10`
- **Motion durations:** 
  - Fast: 150ms (hover, transitions)
  - Normal: 250ms (menus, modals)
  - Slow: 400ms (entrance animations)
- **Grid gaps:** Use `--space-2` (8px) for card gaps, `--space-4` (16px) for sections
- **Breakpoint order:** mobile-first (`min-width`) approach
- **Typography:** Default body font from system (no custom fonts imported yet)

---

## Summary for Codex

### Immediate Implementation Priority

**Phase 1 (Foundation):**
1. Implement `src/components/routing/Router.tsx` (React Router setup + root redirect)
2. Implement `src/components/page-shell.tsx` (layout with nav + footer)
3. Implement `src/components/footer.tsx` (footer layout using `footer.ts` data)

**Phase 2 (Navigation):**
4. Implement `src/components/navigation/Navigation.tsx` (main nav bar)
5. Implement `src/components/navigation/NavigationItem.tsx` (nav item with dropdown)
6. Implement `src/components/navigation/OverflowNavigation.tsx` (mobile drawer)
7. Implement `src/components/ui/icon.tsx` (icon system)

**Phase 3 (Homepage):**
8. Implement `src/content/start.tsx` (hero + sections using `startpage.ts` data)
9. Implement `src/content/page-placeholder.tsx` (generic page template)

**Phase 4 (Polish):**
10. Add CSS to all `src/styles/**` files
11. Implement remaining UI primitives as needed
12. Add E2E tests

### Data & Type Consistency

All data layers (`navigation.ts`, `footer.ts`, `startpage.ts`, `routes.ts`) are **complete and consistent** ✅. No type/data edits needed; focus on UI implementation.

### Build Status

✅ **All scripts passing:** lint, test, build, preview  
✅ **No breaking errors or warnings**  
✅ **Ready for feature development**

