# Task Plan: Navigation modularization & sidebar split

## Mode & Score
Mode: plan-gate, Score: 6 (classifier: >2 files touched, cross-file coupling, new files/modules, estimated diff >50 LOC)

## Task Scope Paths
- src/components/navigation/**
- src/components/navigation.tsx
- src/components/navbar/**
- src/components/navbar.tsx
- src/components/sidebar/**
- src/components/sidebar.tsx
- src/components/page-shell.tsx
- src/components/footer.tsx
- src/components/header.tsx
- src/hooks/useNavigationState.ts
- src/hooks/useOverflowDetection.ts
- src/hooks/useNavigationController.ts
- src/data/navigation.ts
- src/types/navigation.ts
- src/styles/components/navigation/**
- src/styles/components/navbar/**
- src/styles/components/sidebar/**
- src/styles/components/page-shell/**
- TASK_PLAN.md
- TASK_DOCS.md

## Scope (verbatim)
Halte in /src/ Ausschau nach denjenigen .tsx- und .css-Files mit der höchsten Zeilenzahl bzw. File-Grösse (ausgenommenAKSEP\src\components\ui & AKSEP\src\styles\components\ui) und schau jeweils, ob Potential besteht für Modularisierung;
Beispiel:
Die Unterkomponenten in AKSEP\src\components\navigation kann man sehr gerne noch weiter aufteilen in NOCH kleinere Module wie das Nav-Logo (was in der NavBar ganz links ist mit Logo, "DIE AKSEP" und dem Redirect zu /start), die Nav-Gruppen ("Begriffe", "Programm", "Über uns", etc.), Nav-Dropdown (Welche on hover ausgeklappt wird; Vielleicht lohnt es sich, auch für die Nav-Dropdown-Items eigene Mini-Komponenten zu definieren? Bin mir jedoch unsicher, entscheide Du bitte), Nav-Button (Die momentan rechtsbündig als "Mitglied werden" und "Unterstützen" existieren), Nav-Overflow (die Logik des Aufsammelns von Navbar-Elementen, wenn der Platz nicht mehr ausreicht; Dies soll zudem bitte erweitert werden mit einer Möglichkeit, die primären Navbar-Elemente (Nav-Gruppen, Nav-Buttons) mit einer "priority" zu versehen, welche die Reihenfolge definiert, in welcher die Elemente eingesammelt werden (höchste Priority zuerst)), Nav-Overflow-Icon (Das Element mit den "...", welches die aufgesammelten Nav-Gruppen enthält), Sidebar-Icon (Das Element, mit welchem man die Sidebar öffnen kann), etc.
In AKSEP\src\styles\components\navigation hab' ich bereits versucht, eine solche Modularisierungs-Verfeinerung vorzubereiten; Bitte mach dir ausgiebig Gedanken darüber, wie die Modularisierungs-Aufteilungen am sinnvollsten aussehen könnten (auf Basis dessen, wie die Komponenten bis dato aufgebaut sind, v.a. aber auch mit Blick darauf, wie die Komponenten idealerweise aufgebaut sein *sollten*) und plane eine entsprechende Umstrukturierung (beachte dabei bitte, dass AKSEP\src\styles stets ein Abbild der Komponenten-Struktur sein soll)

Zudem wäre es sinnvoll, die "AKSEP\src\components\navigation.tsx" aufzusplitten in "AKSEP\src\components\navbar.tsx" und "AKSEP\src\components\sidebar.tsx" (mit jeweils ihrem eigenen Komponenten-Ordner (inkl. entsprechendem Abbild in AKSEP\src\styles)), um die Nav-Bar, welche als Header fungiert, sauber von der Sidebar trennen zu können; Dementsprechend verdient auch die Sidebar eine entsprechende Modularisierung (wobei es dort natürlich weniger Elemente zu beachten gibt; Ach, zudem gibt es bei der Sidebar noch so einige Bugs, so sollten die Gruppen eingeklappt starten, jedoch starten alle Elemente ausgeklappt ohne dass das Einklappen funktioniert)

## Discovery
Status: READY

### Largest files & current architecture
- `Navigation.tsx` (244 LOC) is the largest `.tsx` outside UI; it bundles header, overflow logic, and mobile sidebar in one component. `NavOverflow.tsx` (116 LOC) and `NavItem.tsx` (92 LOC) are also high. (`find … wc -l` analysis). [Chunk: `a94ce4†L1-L10`]
- The heaviest CSS files mirror navigation: `nav-shell.css` (227 LOC), `nav-item.css` (134 LOC), and `nav-overflow.css` (112 LOC). (`find … wc -l`). [Chunk: `c05c6f†L1-L10`]
- Navigation uses centralized data (`src/data/navigation.ts`) and hooks (`useNavigationState`, `useOverflowDetection`); both currently assume only primary nav items collapse from the end.
- Styles already have placeholder files (`nav-button.css`, `nav-group.css`, etc.) ready for finer-grained modules but still empty.

### Gaps & bugs
- Mobile sidebar sections attempt to collapse using the class `hidden`, but no global `.hidden` style exists (only in UI exceptions), so sections always render expanded. (`rg` search). [Chunk: `170937†L1-L1`]
- `useOverflowDetection` collapses items strictly from the end, ignoring desired priority control and unaware of action buttons.
- `Navigation.tsx` owns menu state and data selection, making reuse in other layouts (separate header/sidebar) difficult.
- Styles folder must mirror component hierarchy; with new `navbar/` and `sidebar/` modules the CSS tree must be re-homed accordingly.

### Opportunities
- Introduce explicit data for CTA buttons with priority metadata so overflow logic can consider them alongside nav groups.
- Build dedicated subcomponents: brand/logo, primary list, dropdown, action buttons, overflow collector, menu toggle, and sidebar sections/items.
- Provide shared controller (hook/context) so `Navbar` and `Sidebar` stay in sync while living in separate modules.

## Planning
Status: READY

### Approach
1. **Data & types** — Extend navigation types with `priority` metadata and new action/button types. Update navigation data to include actions and a helper that exposes a unified list of primary entries (items + actions) for rendering/overflow while keeping existing group definitions for content pages.
2. **State & hooks** — Expand `useNavigationState` to track `overflowEntries` (items/actions) and expose setters that accept the richer shape. Replace `useOverflowDetection` with a priority-aware version that measures all primary entries (items and actions) and collapses the highest-priority elements first while preserving on-screen order for the rest.
3. **Component modularization** — Replace `Navigation.tsx` with a `navbar` module (root + brand, primary list, dropdown item, action button, overflow menu, menu toggle) and a `sidebar` module (root + collapsible sections and links). Both consume the controller hook so they remain synchronized. Delete the legacy `navigation` folder.
4. **Styling restructure** — Move navigation CSS into `styles/components/navbar/**` and `styles/components/sidebar/**`, filling previously empty placeholders with selectors scoped to the new subcomponents and fixing the collapse bug with explicit `[data-open]` toggles.
5. **Integration** — Update `page-shell.tsx` to instantiate the shared controller, render `<Navbar />` and `<Sidebar />`, and drop the `navigation.tsx` intermediary. Ensure imports follow `@/` alias and documentation/test artifacts are updated.

### Acceptance criteria
- Header and sidebar render with identical behavior to today (dropdowns, overflow, CTA buttons) while using new modular components and styles.
- Overflow hides entries based on `priority` metadata (highest first) without reordering the visible remainder; hidden entries appear inside the overflow menu grouped logically (items vs actions) and preserve navigation.
- Sidebar sections start collapsed, expand/collapse reliably, and respect navigation state toggles.
- CSS tree mirrors component hierarchy (`styles/components/navbar/**`, `styles/components/sidebar/**`) with correct `.shared.css` import chains.
- Build passes (`npm run build`) and navigation interactions work in manual QA.

## Pre-Approval Checklist
- [x] Discovery: Status = READY
- [x] Planning: Status = READY
- [x] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [x] Developer Interactions section exists
- [x] Checks & Pass Criteria present & consistent
- [x] Mode & Score filled (plan-gate, score = 6)
- [x] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed)

## Implementation Steps (paths & anchors)
[x] 0) **Plan Sync:** Reload `TASK_PLAN.md`; scan **Developer Interactions**; process outstanding @codex items.
[x] 1) `src/types/navigation.ts`: add priority field to `NavItem`, define `NavAction`, `NavPrimaryEntry`, and `OverflowEntry` types; update `NavigationState` to track overflow entries.
[x] 2) `src/data/navigation.ts`: add `priority` metadata to nav items, introduce CTA action config, and export helpers (`getPrimaryNavEntries`, `getNavActions`).
[x] 3) `src/hooks/useNavigationState.ts`: update state shape and setter signatures to accommodate `OverflowEntry[]`.
[x] 4) `src/hooks/useOverflowDetection.ts`: refactor to accept primary entries, measure widths, and compute overflow based on priority order; expose ref registration helpers for both items and actions.
[x] 5) `src/hooks/useNavigationController.ts`: create new hook composing navigation data, state, overflow detection, and derived sets for navbar/sidebar consumption.
[x] 6) `src/components/navbar/Navbar.tsx`: implement root header component wiring brand, primary entries, actions, overflow trigger, and menu toggle using controller data.
[x] 7) `src/components/navbar/Brand.tsx`: render logo link + tooltip (imports scoped CSS).
[x] 8) `src/components/navbar/PrimaryList.tsx`: render primary entries, delegating to item/action subcomponents with overflow awareness and dropdown handling.
[x] 9) `src/components/navbar/PrimaryItem.tsx`: encapsulate dropdown/nav item behavior (former `NavItem` logic) with updated props.
[x] 10) `src/components/navbar/ActionButton.tsx`: render CTA buttons with overflow support.
[x] 11) `src/components/navbar/OverflowMenu.tsx`: render overflow dropdown consolidating hidden items/actions using new data shape.
[x] 12) `src/components/navbar/MenuToggle.tsx`: isolate mobile toggle button (hamburger / close icons).
[x] 13) `src/components/navbar/index.ts`: export the assembled navbar API.
[x] 14) `src/components/navbar.tsx`: top-level entry re-exporting default navbar component for consumers.
[x] 15) `src/components/sidebar/Sidebar.tsx`: implement sidebar root using controller state, rendering collapsible sections.
[x] 16) `src/components/sidebar/Section.tsx`: component for grouped links with collapse toggle + `[data-open]` attribute.
[x] 17) `src/components/sidebar/index.ts`: export sidebar components.
[x] 18) `src/components/sidebar.tsx`: top-level entry re-exporting default sidebar.
[x] 19) `src/components/page-shell.tsx`: replace `<Navigation />` with `<Navbar />` + `<Sidebar />`, using the controller hook to share state.
[x] 20) Remove legacy `src/components/navigation/**` and `src/components/navigation.tsx`.
[x] 21) `src/styles/components/navbar/.shared.css` & friends: populate new CSS modules (shell, brand, primary, dropdown, action, overflow, toggle) with migrated selectors from old navigation styles.
[x] 22) `src/styles/components/sidebar/.shared.css` & friends: author sidebar styling, ensuring collapsed sections respect `[data-open='false']`.
[x] 23) Delete superseded files under `src/styles/components/navigation/**`.
[x] 24) Update documentation/tests: adjust any references in `TASK_DOCS.md` (summary + QA) and ensure lint/build instructions include new controller.
[x] 25) Run `npm run build`; record outcomes.
N) Final **@codex Sweep**: scan all touched/new files plus Control Paths for `@codex`; resolve queue; confirm compliance with rules.

## Developer Interactions
(none yet)

## Checks & Pass Criteria
- `npm run build`
- Manual QA: desktop overflow collapse order, CTA appearance, sidebar toggle + section collapse.
- Documentation updated in `TASK_DOCS.md` with summary & test evidence.

## Risks / Rollback
- **CSS regression risk:** Keep old navigation CSS handy; if layout breaks, revert to previous commit and reapply with smaller slices.
- **Overflow logic bugs:** New priority algorithm might hide wrong entries; fallback is to restore previous `useOverflowDetection` implementation and iterate.
- **State sync issues:** If sidebar/menu toggle gets out of sync, validate controller hook invariants or temporarily co-locate state in navbar while debugging.
