# How Codex Will Use These Inventory Files

## Overview

Two complementary documents have been generated to give Codex complete context for implementing the AKSEP-Website without clarifying back-and-forth:

### A) `/docs/PROJECT_INVENTORY.md` (Human-Readable Reference)

A comprehensive **markdown report** with 10 sections covering:
1. **Repository inventory** — stub components, configs, design tokens
2. **Routing map** — all 37 routes with implementation status
3. **Navigation data model** — 7 primary + 2 secondary nav items + UI gaps
4. **Screenshots → features** — mapping of goal/*.png to concrete tasks
5. **Design tokens** — colors, typography, spacing, breakpoints
6. **UI primitives** — 50 available components, compilation status, priority list
7. **Build baseline** — all npm scripts passing ✅
8. **A11y & i18n** — German-only, WCAG 2.1 AA target, known gaps
9. **Non-functional requirements** — performance targets, browser support, motion guidelines
10. **Open questions** — icon library, root route, form library, CMS integration

**Codex usage:**
- Reference before starting each component implementation
- Extract exact data shapes, paths, and component relationships
- Copy feature checklists for testing
- Follow "Implementation ownership" tables to know which files own each feature

---

### B) `/docs/PROJECT_MANIFEST.json` (Machine-Readable Manifest)

A **structured JSON** file containing:
- **routes:** All paths with component mappings and implementation status
- **navigation:** Primary/secondary items, feature flags (dropdown, keyboard nav, ARIA, etc.)
- **footer:** Data sources and section counts
- **content:** Start page sections and placeholder component status
- **css:** Design tokens (colors, typography), existing CSS files, recommendations
- **uiPrimitives:** Inventory of all 50 components with priority levels
- **build:** npm scripts and tooling stack
- **a11y:** Language (German), WCAG target, implemented features (all false), recommendations
- **performance:** FCP/LCP/TTI/CLS targets, optimization checklist
- **openQuestions:** Icon library, root route, overflow handling, form library, CMS
- **safeDefaults:** Z-index scale, motion durations, spacing, breakpoint strategy
- **immediateImplementationPriority:** 4 phases of work

**Codex usage:**
- Parse `navigation.features` flags to see what's NOT yet built
- Check `uiPrimitives.keyPrimitives` for high-priority components
- Reference `openQuestions` to make informed design decisions
- Use `safeDefaults` for z-index, motion, spacing without bikeshedding
- Query `a11y.implemented` to track A11y progress (mark as true when done)

---

## How to Navigate & Use

### Starting a Task (e.g., "Implement Navigation Component")

1. **Open PROJECT_INVENTORY.md**
2. Go to **Section 3: Navigation Data Model vs. UI**
3. Read the current state, feature matrix (all ❌), and gaps
4. Check **Section 4: Screenshots → Feature Mapping (navbar1.png–navbar5.png)**
5. Extract the feature list: desktop dropdown, hover states, overflow, keyboard nav, ARIA
6. Check **Section 6: UI Primitives Readiness** → `navigation-menu`, `dropdown-menu` table
7. Review **Section 5: Styles & Tokens** for CSS variables to use
8. Follow "Implementation ownership" notes to determine which files to create/modify

### Checking "What's Missing?"

1. **Open PROJECT_MANIFEST.json**
2. Search for `"implemented": false` to find incomplete areas
3. Review `a11y.implemented` flags — all currently `false` (can be checked off as work progresses)
4. Check `navigation.features` object — all flags `false` (these are the gaps to fill)

### Making Design Decisions

1. **Icon library:** Open PROJECT_MANIFEST.json → `openQuestions[0]` → recommendation: "Use Lucide React"
2. **Z-index for dropdown:** `safeDefaults.zIndexScale.dropdown` = 30
3. **Motion duration for menu open:** `safeDefaults.motionDurations.normal` = "250ms"
4. **Spacing between cards:** `safeDefaults.spacing.cardGap` = "var(--space-2, 8px)"

### Tracking Progress

1. **After implementing Navigation.tsx:**
   - Update PROJECT_MANIFEST.json: `navigation.features.desktopDropdown: true`
   - Update `navigation.components.Navigation: "implemented"`

2. **After CSS is complete:**
   - Update `css.files.components` and `css.files.pages` with ✅ markers
   - Update `css.recommendations` to reflect what was done

3. **After adding A11y:**
   - Flip all relevant flags in `a11y.implemented` from `false` to `true`

---

## Key Data Relationships

### Navigation (from inventory + manifest)

**Data:** `src/data/navigation.ts` → 7 primary items

```
Begriffe (3 groups, 7 items total)
  ├─ Intro (1 item)
  ├─ Wichtige (4 items, showTopBorder: true)
  └─ Weitere (1 item, showTopBorder: true)

Programm (2 groups, 15 items total)
  ├─ Preamble (1 item)
  └─ AGs (14 items, showTopBorder: true)

... (3 more, similar structure)
```

**UI Components:** `src/components/navigation/`
- `Navigation.tsx` — main bar (render 5 items horizontally)
- `NavigationItem.tsx` — individual item with dropdown trigger
- `OverflowNavigation.tsx` — mobile drawer (render all, collapsible groups)

**Styles:** `src/styles/components/navigation.css` (currently empty)

---

### Routes (from manifest)

**All 37 routes follow this pattern:**
- Data: `src/data/routes.ts` (title, description metadata)
- Component: `src/content/page-placeholder.tsx` (stub, returns empty)
- Layout: `src/components/page-shell.tsx` (stub, returns empty)

**Codex must:**
1. Implement `Router.tsx` (React Router `<Routes>` with lazy loading)
2. Implement `page-shell.tsx` (wrap with `<Navigation> <main> {children} <Footer>`)
3. Implement `page-placeholder.tsx` (generic article/list template)
4. Populate specific content pages as needed

---

### Styles (from inventory)

**Available tokens:** `src/styles/globals.css` + `src/styles/themes.css`
```css
--true-lavender: #7E65B9 (primary)
--horizon: #5A8FA8 (secondary)
--mint: #3EB694 (accent)
--bg-darker: #423A51 (background)
--white: #ffffff
--text-xs through --text-3xl (typography scale)
```

**Empty CSS files waiting for implementation:**
- `src/styles/components/navigation.css` — dropdowns, overflow, hover states
- `src/styles/components/hero.css` — homepage hero section
- `src/styles/components/footer.css` — footer layout
- `src/styles/components/shared.css` — utility classes
- `src/styles/pages/homepage.css` — homepage grid, sections
- `src/styles/pages/standard.css` — generic page template

---

## Immediate Next Steps for Codex

1. **Read PROJECT_INVENTORY.md sections 1–3** to understand data structure & component stubs
2. **Parse PROJECT_MANIFEST.json** for complete route list, navigation items, and feature flags
3. **Start Phase 1:** Implement `Router.tsx`, `page-shell.tsx`, `footer.tsx` (use data from `src/data/footer.ts`)
4. **When complete, update PROJECT_MANIFEST.json** to mark those as `implemented: true`
5. **Move to Phase 2:** Nav components, using the feature matrix from PROJECT_INVENTORY.md section 3
6. **Reference safeDefaults & tokens** from PROJECT_MANIFEST.json for design decisions

---

## Files Generated

- **`/docs/PROJECT_INVENTORY.md`** (10 sections, ~650 lines) — full human-readable guide
- **`/docs/PROJECT_MANIFEST.json`** (machine-readable, ~400 lines) — structured data for queries and progress tracking

Both files are committed and ready for Codex to consume.

---

**Created:** 2025-10-28  
**Status:** ✅ All build checks passing; ready for feature implementation
