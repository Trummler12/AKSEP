# Task Docs: Component Naming Cleanup (Phase 4) + CSS-Architektur-Optimierung (Phase D)

**Phase 4 Completed**: 2025-01-16 | Build: ✅ SUCCESS (3.32s)
**Phase D Completed**: 2025-01-17 | Build: ✅ SUCCESS (4.50s)
**Phase E Completed**: 2025-01-17 | Build: ✅ SUCCESS (4.47s)

---

## Mode & Score
- **Mode**: plan-gate
- **Score**: 6 (factors: >2 files touched, cross-file coupling, new modules, >50 LOC)

---

## Scope Summary
Comprehensive naming cleanup across AKSEP-NEU start-sections components to eliminate redundant naming patterns and improve code readability. Addressed user feedback from @COPILOT comments in `bullet.tsx` requiring systematic refactoring of:
1. Component function names (remove "Section" suffix)
2. Component file names (lowercase, no redundancy)
3. CSS classNames (remove "content-" prefix where redundant)
4. Orchestrator imports and references

---

## Changes Made


### Phase F – Navigation modularisation & sidebar split (2025-01-18)
- Introduced a shared navigation controller hook that unifies state, overflow detection, and priority-aware collapsing for navbar actions/items.
- Replaced the monolithic navigation component with modular `navbar/` and `sidebar/` trees; each subcomponent (brand, primary list, dropdown, actions, overflow, toggle) now maps to its scoped stylesheet.
- Added CTA action metadata (priority + variant) and updated overflow detection so high-priority entries collapse first while preserving display order.
- Migrated styles into `styles/components/navbar/**` and `styles/components/sidebar/**`, mirroring the new component hierarchy and fixing the sidebar collapse bug with `[data-open]` toggles.
- Updated `page-shell` to render `<Navbar />` + `<Sidebar />`, ensuring both share navigation state via the new controller.

#### Phase F Checks
- `npm run build` → ✅ success (chunk `163626`).
- Manual QA: desktop overflow priorities (actions collapse first), mobile sidebar toggles & link navigation close the menu.

### Phase E – Style & Component Contract Enforcement (2025-01-17)
- Audited `src/styles/**` and confirmed every `.shared.css` and leaf CSS file imports only the permitted parent file; no structural changes were required.
- Normalised component/content imports to the `@/` alias so every `.tsx` references only its own CSS module and shared resources without `../` hops.
- Replaced verbose `.STYLES.md` and `.COMPONENTS.md` guides with concise rulebooks describing the enforced constraints.

#### Phase E Checks
- `npm run build` → ✅ success (4.47s)

### ✅ File Renames (4 files)
- `AkronymSection.tsx` → `akronym.tsx`
- `ProgrammSection.tsx` → `programm.tsx`
- `AktuellSection.tsx` → `aktuell.tsx`
- `MitmachenSection.tsx` → `mitmachen.tsx`

### ✅ Component Function Renames (4 components)
```tsx
// Old → New
const AkronymSection = () => {} → const Akronym = () => {}
const ProgrammSection = () => {} → const Programm = () => {}
const AktuellSection = () => {} → const Aktuell = () => {}
const MitmachenSection = () => {} → const Mitmachen = () => {}
```

### ✅ CSS ClassNames Cleanup

#### shared.css (Bullet-related, previously updated)
| Old | New |
|-----|-----|
| `.content-bullet-list` | `.bullet-list` |
| `.content-bullet-item` | `.bullet-item` |
| `.content-bullet-marker-*` | `.bullet-marker-*` |
| `.content-bullet-dot` | `.bullet-dot` |
| `.content-bullet-caption` | `.bullet-caption` |
| `.content-inline-link` | `.inline-link` |
| `.content-resource-stack` | `.bullet-resource-stack` |

#### programm.css (Program highlights)
| Old | New |
|-----|-----|
| `.content-program-grid` | `.program-grid` |
| `.content-card-icon-wrapper` | `.card-icon-wrapper` |
| `.content-card-icon-color` | `.card-icon-color` |
| `.content-card-title` | `.card-title` |
| `.content-card-description` | `.card-description` |
| `.content-program-cta` | `.program-cta` |

#### aktuell.css (News/updates)
| Old | New |
|-----|-----|
| `.content-news-grid` | `.news-grid` |
| `.content-news-card` | `.news-card` |
| `.content-news-meta` | `.news-meta` |
| `.content-news-icon` | `.news-icon` |
| `.content-news-title` | `.news-title` |
| `.content-news-cta` | `.news-cta` |

#### mitmachen.css (Participation/impact)
| Old | New |
|-----|-----|
| `.content-impact-grid` | `.impact-grid` |
| `.content-impact-card` | `.impact-card` |
| `.content-impact-icon-primary/secondary/accent` | `.impact-icon-primary/secondary/accent` |
| `.content-impact-description` | `.impact-description` |

### ✅ Orchestrator File Updates
**File**: `src/components/start-sections.tsx`

Updated all imports and component references:
```tsx
// Before
import AkronymSection from './start-sections/AkronymSection';
import ProgrammSection from './start-sections/ProgrammSection';
import AktuellSection from './start-sections/AktuellSection';
import MitmachenSection from './start-sections/MitmachenSection';

// Component calls
<AkronymSection />
<ProgrammSection />
<AktuellSection />
<MitmachenSection />

// After
import Akronym from './start-sections/akronym';
import Programm from './start-sections/programm';
import Aktuell from './start-sections/aktuell';
import Mitmachen from './start-sections/mitmachen';

// Component calls
<Akronym />
<Programm />
<Aktuell />
<Mitmachen />
```

### ✅ Component JSX Updates (3 files)
Updated all className references in:
- `src/components/start-sections/programm.tsx` - 6 classNames updated
- `src/components/start-sections/aktuell.tsx` - 4 classNames updated
- `src/components/start-sections/mitmachen.tsx` - 4 classNames updated

---

## Checks & Results

### Build Verification ✅
```
npm run build
✓ 1711 modules transformed.
build/index.html                        0.44 kB │ gzip:  0.29 kB
build/assets/Logo_AKSEP-he-ORGuy.png    5.97 kB
build/assets/index-CPiJlNqp.css        59.90 kB │ gzip: 10.16 kB
build/assets/index-GVQ_3AEo.js        299.29 kB │ gzip: 95.37 kB
✓ built in 3.32s
```

### Dev Server Verification ✅
```
npm run dev
VITE v6.3.5  ready in 289 ms
Local:   http://localhost:3001/
✅ Application renders without errors
```

### TypeScript Compilation ✅
- All imports resolve correctly
- No type errors affecting build
- Minor JSX type warnings (pre-existing, non-blocking)

---

## Files Modified

### CSS Files (3)
| File | Changes |
|------|---------|
| `src/styles/components/start-sections/programm.css` | 6 classNames renamed |
| `src/styles/components/start-sections/aktuell.css` | 6 classNames renamed |
| `src/styles/components/start-sections/mitmachen.css` | 5 classNames renamed |

### Component Files (5)
| File | Changes |
|------|---------|
| `src/components/start-sections.tsx` | Orchestrator: 8 import/reference updates |
| `src/components/start-sections/programm.tsx` | 6 className updates |
| `src/components/start-sections/aktuell.tsx` | 4 className updates |
| `src/components/start-sections/mitmachen.tsx` | 4 className updates |
| `src/components/start-sections/akronym.tsx` | 2 className updates (from Phase 3) |

### Shared Components (2)
| File | Changes |
|------|---------|
| `src/components/shared/bullet.tsx` | 4 className updates + @COPILOT comments removed |
| `src/components/shared/caption.tsx` | 1 className update |

---

## Naming Conventions Applied

### Component Files (Filesystem)
- **Pattern**: lowercase, no "Section" suffix
- **Example**: `akronym.tsx` (not `AkronymSection.tsx`)
- **Rationale**: Eliminates "Section/Section" redundancy in folder structure

### Component Functions (Code)
- **Pattern**: PascalCase, no "Section" suffix
- **Example**: `const Akronym = () => {...}` (not `AkronymSection`)
- **Rationale**: Clear, concise, matches file intent

### CSS ClassNames (Styling)
- **Grid/Container**: `<section>-grid` (e.g., `program-grid`, `news-grid`, `impact-grid`)
- **Card Components**: `card-*` (e.g., `card-title`, `card-description`, `card-icon-wrapper`)
- **Section-Specific**: `<section>-<role>` (e.g., `program-cta`, `news-cta`)
- **Shared Utilities**: `<concept>-*` (e.g., `bullet-*`, `inline-link`)
- **Rationale**: Removed redundant "content-" prefix; namespace is clear from context and CSS file location

---

## Impact Assessment

### Code Maintainability ⬆️
- **Before**: Redundant "Section" appearing in multiple contexts (filename, function name, CSS)
- **After**: Clear, single-use naming at each level
- **Result**: Easier to understand component hierarchy; less cognitive overhead

### Build Performance 📊
- **Build Time**: 3.32s (consistent with Phase 3: ~3.77s range)
- **Bundle Size**: No increase (same assets, improved organization)
- **Dev Server**: 289ms startup (fast, healthy)

### CSS Architecture 📐
- **Before**: Inconsistent "content-" prefix mixed with semantic names
- **After**: Clear semantic naming (program-grid, news-card, impact-description)
- **Result**: Easier to reason about CSS scope; better namespace organization

---

## Manual Verification

✅ **Visual Inspection** (localhost:3001)
- All 4 start-section components render correctly
- Styling applied as expected (no missing CSS)
- Responsive layout working (grid behavior intact)
- Hover states functional (news-card interactive feedback)
- Icon colors correct (impact section color variants)

✅ **Console Checks**
- No JavaScript errors
- No CSS warnings
- No broken imports or references

---

## Remaining Work / Follow-ups

### Phase 5 (Suggested - Not in Scope)
- [ ] Navigation components: `NavigationItem.tsx` → `nav-item.tsx` (similar pattern)
- [ ] Footer components: Review naming consistency
- [ ] Shared utility classes: Extend "inline-link", "bullet-*" patterns to other sections
- [ ] CSS utility file: Consider consolidating common patterns (card-*, icon-*, etc.)

### Known Limitations
- Some UI component classes remain prefixed (e.g., `content-card-interactive`, `content-section-plain`) - these are likely grid-level utilities; defer cleanup to separate UI refactor task

---

## Summary

**Objective**: ✅ COMPLETE

Successfully eliminated redundant naming patterns in AKSEP-NEU start-sections components. Applied systematic naming cleanup across:
- 4 component files renamed to lowercase
- 4 component functions renamed (removed "Section" suffix)
- 23 CSS classNames refactored (removed "content-" prefix)
- 1 orchestrator file updated with new imports

**Build Status**: ✅ Passes (3.32s)  
**Dev Server**: ✅ Running (0 errors)  
**Quality**: ✅ Improved maintainability, no regressions

---

## Next Steps (For User)
1. Stop the dev server when ready (`Ctrl+C` in terminal)
2. Review the changes at localhost:3001 if needed
3. Commit changes with message like:
   ```
   refactor: cleanup component naming in start-sections
   
   - Rename component files to lowercase (akronym.tsx, etc.)
   - Remove redundant "Section" suffix from component names
   - Clean up CSS classNames (remove "content-" prefix)
   - Update orchestrator imports and references
   
   All builds pass, dev server running without errors.
   ```
4. Proceed to Phase 5 (Navigation components) if desired
