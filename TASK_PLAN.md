# Task Plan: CSS Architecture Compliance Rules

## Mode & Score
Mode: plan-gate, Score: 4 (classifier: >2 files touched, cross-file coupling)

## Task Scope Paths
- AKSEP-NEU/src/styles/**
- AKSEP-NEU/src/components/**
- AKSEP-NEU/src/content/**
- TASK_PLAN.md
- TASK_DOCS.md

## Scope (verbatim)
Okay, dann lass uns für die styles- und components-Architektur folgende Regeln festhalten:
- AKSEP-NEU\src\styles\globals.css bildet die Basis, indem dort die Farbpalette und andere Variablen/Konstanten definiert werden, die über das ganze Projekt hinweg gültig sind;
- AKSEP-NEU\src\styles\themes.css importiert von ./globals.css und definiert auf Basis der der in ./globals.css definierten Variablen die Themes (vorerst reicht .dark);
- Alle AKSEP-NEU\src\styles\<Gruppe>\.shared.css importieren von `../themes.css` und NUR von `../themes.css`;
- Alle anderen AKSEP-NEU\src\styles\<Gruppe>\*.css importieren von `./.shared.css` und NUR von `./.shared.css`;
- Alle AKSEP-NEU\src\styles\<Gruppe>\..\.shared.css importieren von `../.shared.css` und NUR von `../.shared.css`;
- Alle anderen AKSEP-NEU\src\styles\<Gruppe>\..\*.css importieren von `./.shared.css` und NUR von `./.shared.css`;
Und letztere beiden Regeln gelten symmetrisch für alle Levels darunter.

Sobald ^dies überall gewährleistet ist, gilt für AKSEP-NEU\src\components\..\*.tsx, AKSEP-NEU\src\content\..\*.tsx folgende Regeln:
- Jede Komponente und jede andere .tsx, die sich an Style-Definitionen bedient, importiert die Styles einzig und allein aus der ihr zugewiesenen styles/../*.css; Im Falle der AKSEP-NEU\src\components\content-sections\start.tsx importiert diese von AKSEP-NEU\src\styles\components\content-sections\start.css, im Falle der AKSEP-NEU\src\components\content-sections\start\akronym.tsx wird von AKSEP-NEU\src\styles\components\content-sections\start\akronym.css importiert - nicht mehr und nicht weniger.
- Imports, die über den Root des /src/-Folders gehen sind mittels eines `@/<path-from-src-root>` zu vereinfachen (siehe AKSEP-NEU\src\components\content-sections und AKSEP-NEU\src\components\shared, wo dies bereits umgesetzt wurde)
- Komponenten werden von ganz unten (höchste Modularisierung) nach oben eingesammelt; AKSEP-NEU\src\components\content-sections\start.tsx packt die in AKSEP-NEU\src\components\content-sections\start definierten Unterkomponenten zusammen und gibt dieses Paket dann an AKSEP-NEU\src\content\start.tsx weiter, wo man je nach Bedarf dann noch temporäre Elemente einfügen kann, die dann oberhalb der Hero-Sektion eingeblendet werden (z.B. im Falle eines wichtigen Hinweises)

Bitte erarbeite einen detaillierten Plan, in welchem du systematisch gewährleistest, dass diese Regeln strikt eingehalten werden.

Anschliessend gilt es, die AKSEP-NEU\src\styles\.STYLES.md und AKSEP-NEU\src\components\.COMPONENTS.md entsprechend zu aktualisieren, damit diese strikten Regeln klar und unmissverständlich kommuniziert werden.
Wobei nach wie vor gilt, dass AKSEP-NEU\src\components\ui und deren dazugehörige AKSEP-NEU\src\styles\components\ui\.figma-ui-components.css eine Ausnahme bildet und von den beschriebenen Regeln ausdrücklich befreit sind.

**Scope-Hash**: `b5ad5bccb173514b5c263f35fd41715c0ab292e1889174f13b0ff2e082779806`

## Discovery
- Problem Statement: Enforce the new hierarchical CSS import rules and align component/content imports while updating the architecture docs so future changes keep the structure intact.
- Context & Constraints:
	- `globals.css` → `themes.css` already drives the design tokens; `@` alias exists for root-relative imports.
	- `components/ui/**` with their `.figma-ui-components.css` bundle remain exempt from the new rules.
	- Existing build succeeds; adjustments must not break current styling.
- Existing Signals:
	- `themes.css` imports `./globals.css`; every `src/styles/<group>/.shared.css` imports only `../themes.css` (confirmed via `Select-String '^@import'`).
	- Nested `.shared.css` files (e.g., `components/content-sections/.shared.css`, `components/navigation/.shared.css`, `components/shared/.shared.css`) consistently import exactly their parent `.shared.css`.
	- Leaf CSS files (`*.css` beside `.shared.css`) import only `./.shared.css`; no extra `@import` statements detected.
	- All non-exempt `.tsx` files that do import CSS use the `@/styles/...` alias; no relative `../styles` paths remain.
	- Gaps: `components/content-sections.tsx`, `components/page-shell.tsx`, and `components/footer.tsx` currently miss CSS imports; `content` pages reference the correct `styles/content/*.css` assets.
	- Navigation subcomponents (`NavigationItem`, `OverflowNavigation`) still rely on the shared `navigation.css`; need a policy decision whether to keep or split.
- Unknowns & Questions:
	- Do the navigation subcomponents require their own CSS files, or may they intentionally share `navigation.css` under the new rules?
	- Should purely re-exporting files (e.g., `components/navigation.tsx`, `components/shared.tsx`) carry CSS imports, or can imports live only in the concrete implementations?
- Options:
	- A) Split any shared CSS (navigation group) into component-specific files to follow the strict rule literally.
	- B) Maintain shared CSS for tightly coupled subcomponents but document the exception (risk: deviates from strict wording).
	- C) Add automated lint check (custom script) to flag future violations after refactoring.
- Evidence links:
	- `Select-String '^@import'` scan across `src/styles` (PowerShell command) shows current import hierarchy.
	- `Select-String 'import .+\.css'` scan across `src/**/*.tsx` confirms which components import styles and highlights missing ones.
Status: READY

## Planning
- Decision: Adopt strict one-to-one CSS↔component mapping (Option A) and add an automated validator (Option C) so the new rules stay enforceable. Navigation CSS will be split into component-specific files living beside the subgroup hierarchy.
- Impact on Scope/Steps/Checks/Risks:
	- Requires migrating the existing monolithic `navigation.css` into targeted files under `styles/components/navigation/` and updating imports in `Navigation`, `NavigationItem`, and `OverflowNavigation`.
	- Add missing CSS imports to orchestrator components (`content-sections.tsx`, `page-shell.tsx`, `footer.tsx`) and ensure their CSS files exist and follow the `.shared.css` chain.
	- Introduce a Node-based validation script (run via `npm run lint:styles`) that checks CSS import hierarchy and component/content CSS imports (with an allowlist for `components/ui/**`, `App.tsx`, etc.).
	- Refresh `.STYLES.md` and `.COMPONENTS.md` to describe the enforced rules, navigation restructure, and validation workflow.
- Acceptance Criteria:
	1. Every `.shared.css` imports only its parent target (`../themes.css` for level 1, `../.shared.css` otherwise).
	2. Every non-exempt `.css` file under `styles/**` imports exactly `./.shared.css` and nothing else.
	3. Every non-exempt `.tsx` component/content file imports exactly one `@/styles/...` file that matches its folder hierarchy; navigational components use their new per-component CSS assets.
	4. Validation script fails on violations and passes on clean tree; `npm run build` succeeds.
	5. `.STYLES.md` and `.COMPONENTS.md` clearly document the rules, exceptions, and validator usage.
- Test Strategy:
	- Run the new `npm run lint:styles` script (implemented this task) to verify structure.
	- Run `npm run build` to ensure Vite bundling succeeds post-refactor.
	- Spot-check navigation and start page in dev server for visual regressions (manual QA checklist in docs).
- Risks & preliminary Rollback:
	- CSS split may miss selectors, causing regressions → keep old `navigation.css` content in git history for quick reversion (`git checkout -- <file>` during dev or `git revert` after commit).
	- Validator false positives (e.g., intentionally shared CSS) → maintain small allowlist and document rationale; adjust script if needed.
	- Added script increases CI time slightly → script will scan only `src/` and should finish fast (<1s) to limit impact.
- Links: *(none yet — will add if we publish validator docs or scripts)*
- Step Granularity: Implementation steps below are atomic per file/folder so reviewers can trace deltas easily.
Status: READY

## Pre-Approval Checklist
- [ ] Discovery: Status = READY
- [ ] Planning: Status = READY
- [ ] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [ ] Developer Interactions section exists
- [ ] Checks & Pass Criteria present & consistent
- [ ] Mode & Score filled (plan-gate, score = 4)
- [ ] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed)

## Implementation Steps (paths & anchors)
> Notes:
> - No research/plan meta-tasks here; Discovery/Planning above must be complete before approval.
> - If Discovery/Planning changed understanding, **synchronize and (re)split** these steps into small **atomic** edits (per file + anchor/range) **before** requesting approval.

**Priority & Preemption Rules (global order)**
- Global order: **Priority @codex** (tagged `URGENT|IMPORTANT|NOTFALL|SEV1` or safety/secret/security) **> finish current atomic step** **> regular @codex** **> start next step**.
- Immediate preemption only if a priority item arrives or it impacts the current step's paths/anchors.
- Regular @codex: process after finishing the current step but before starting the next.
- Final sweep ensures no residual @codex guidance remains.

[ ] 0) **Plan Sync:** Reload `TASK_PLAN.md`; scan **Developer Interactions**; process outstanding @codex items.
[x] 1) `src/components/footer.tsx`: add `@/styles/components/footer.css` import at top; ensure no duplicate imports.
[x] 2) `src/components/page-shell.tsx`: add `@/styles/components/page-shell.css` import and adjust lint ordering if needed.
[x] 3) `src/components/content-sections.tsx`: add `@/styles/components/content-sections.css` import so orchestrator follows rule.
[x] 4) `src/styles/components/navigation/nav-shell.css`: populate existing stub with header/layout/mobile selectors migrated from legacy `navigation.css`; keep `@import './.shared.css';` at top.
[x] 5) `src/components/navigation/Navigation.tsx`: point stylesheet import to `@/styles/components/navigation/nav-shell.css`; update related comments if necessary.
[x] 6) `src/styles/components/navigation/nav-item.css`: move navigation item + dropdown selectors into this file (with shared import header).
[x] 7) Rename `src/components/navigation/NavigationItem.tsx` → `src/components/navigation/NavItem.tsx`; update export/import graph and swap CSS import to `@/styles/components/navigation/nav-item.css`.
[x] 8) `src/styles/components/navigation/nav-overflow.css`: move overflow menu selectors here (with shared import header).
[x] 9) Rename `src/components/navigation/OverflowNavigation.tsx` → `src/components/navigation/NavOverflow.tsx`; update exports/imports and CSS import to `@/styles/components/navigation/nav-overflow.css`.
[x] 10) `src/styles/components/navigation/nav-button.css`, `nav-group.css`, `nav-dropdown.css`, `nav-logo.css`, `nav-overflow-collector.css`, `sidebar.css`: ensure selectors align with new structure; remove duplicates from deleted legacy file.
[x] 11) `src/styles/components/navigation.css`: delete or reduce to comment stub once selectors migrated; ensure no duplicate definitions remain (top-level file retains navigation-wide notes only).
[x] 12) `scripts/validate-style-architecture.mjs`: add Node script that validates CSS hierarchy and component/content imports with documented allowlist (`components/ui` exempt).
[x] 13) `package.json`: add `"lint:styles": "node scripts/validate-style-architecture.mjs"` (or similar) in scripts block.
[ ] 14) `src/styles/.STYLES.md`: update sections to outline the strict rules, navigation restructure, and validator usage.
[ ] 15) `src/components/.COMPONENTS.md`: document new import expectations, navigation updates, and tie-in to `.STYLES.md`.
[ ] 16) `docs/DEVELOPER.md`: add guidance on running the validator locally and in CI expectations.
[ ] 17) `TASK_DOCS.md`: log work summary, validator command, and manual QA checklist.
[ ] 18) Run `npm run lint:styles` then `npm run build`; capture outcomes for summary.
N) Final **@codex Sweep**: scan all touched/new files plus Control Paths for `@codex`; resolve queue; confirm compliance with rules.

## Developer Interactions
- [ ] @CODEX HINWEIS: Manche .tsx-Files brauchen keine style-Imports, da deren Funktionalität teilweise etwas anderes abbildet als etwas, das irgendwelche Style-Definitionen benötigen würde; Falls ich gesagt haben sollte "jede \*.tsx hat immer nur exakt einen einzigen \*.css- Import", dann muss ich dies korrigieren zu "jede \*.tsx hat immer _maximal_ exakt einen einzigen \*.css-Import"
- [ ] @CODEX INFO: Navigation-Unterkomponenten sollen im Komponenten-Ordner sowie bei den Styles das Schema `nav-*` verwenden; Top-Level `navigation.tsx` und `navigation.css` bleiben unverändert.
- [ ] // @CODEX ERGÄNZUNG: In AKSEP-NEU\src\styles\components\navigation hab' ich den Platzhalter-Files jeweils einen Kommentar hinzugefügt "/* Placeholder for future rfactoring for nav-bar-Subcomponents */"

## Checks & Pass Criteria
- `npm run lint:styles` (new validator) ⇒ exits 0 with no violations.
- `npm run build` ⇒ completes successfully (Vite bundling passes).
- Manual QA: verify navigation bar, dropdowns, and overflow menu render correctly in dev server (desktop + narrow width snapshot).
- Documentation diff reviewed to ensure `.STYLES.md` and `.COMPONENTS.md` capture rules & validator instructions.

## Risks / Rollback
- Navigation CSS split could miss selectors → fallback: restore previous `styles/components/navigation.css` from git and re-apply with finer diff.
- Validator allowlist may omit legitimate exceptions → adjust script configuration or mark additional files, rerun until clean.
- Added script might slow CI slightly → measure runtime and, if needed, restrict scan scope or cache file list.
