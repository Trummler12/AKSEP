# AGENTS.md — AKSEP (Nuxt 3 + @nuxt/content + @nuxtjs/i18n)

These rules apply to this AKSEP submodule (root). A nested `AGENTS.md` in a subfolder may override specifics (closest wins).

---

## 0) Task Modes & Gatekeeping
Default is **No-Plan Mode** for small/low-risk changes; **Plan-Gate Mode** only for clear risk threshold.

### 0.1 Scope/Risk classifier (decide before each task)
Calculate score; **Plan-Gate is mandatory** for `score ≥ 4`, **optional** for `{2,3}`, **forbidden** for `≤ 1`.
Add points for:
1) >2 files are changed → +2
2) Cross-file linking (edited function is used in other files/exports/routes) → +2
3) Build/Config/CI/Lockfile (`package.json`, lockfiles, tsconfig, workflows) → +3
4) New dependency or change of package manager → +3
5) DB/schema/migration/data model **or** i18n routing/aliases → +2
6) Security/Auth/Permissions/Crypto/Cookies → +3
7) No tests in the affected area → +1
8) Generated paths or code generation affected → +2
9) Diff >50 LOC **or** >1 new file → +1
10) User explicitly says "no plan for this" → -2 (**sticky**, see below)

### 0.2 No-Plan Mode (standard; small/low-risk)
Proceed directly with code changes. At the end, create or update **`TASK_DOCS.md`** (what/why changed, checks, commit SHA[s]). Do **not** create `TASK_PLAN.md`.

### 0.3 Plan-Gate Mode (medium/high risk)
**Before** coding, create `TASK_PLAN.md`, obtain approval, then implement. **After implementation**, create/update **`TASK_DOCS.md`** summarizing the final delta.
Approval (unchanged):
- `APPROVE PLAN: <plan-sha1> (TTL 7 days)` - Approval may appear at the very beginning or very end of the message.
- `APPROVE PLAN WITH CHANGES: <plan-sha1> - <short note>` - Same positioning flexibility applies.
Rules: SHA must be included; renew on divergence/TTL; small text tweaks via "WITH CHANGES".

### 0.4 Sticky No-Plan & Escalation
If the user has said **"no plan for this"** at the beginning, **no** `TASK_PLAN.md` should be created, except after a prior message:
`REQUEST ESCALATION TO PLAN (score=<n>): <2-3 bullets why>`
and approval via:
- `OK ESCALATE` → switch to Plan-Gate; or
- `STAY NO-PLAN` → stay No-Plan.
In case of scope growth, re-evaluate score and escalate again if necessary.

> Overrides: A task may override this protocol **only** if it contains the exact phrase `OVERRIDE PROTOCOL` **and** the approver repeats it in the approval message.

### Suggested Tasks (Ask-mode)
- **No compression**; keep “must-include markers” intact (quoted paths, code fragments, selectors, placeholders).
- **Chunking policy**: split into Task (1/n), (2/n), … when the plan exceeds ~3000 tokens or ~4 editor pages, **or** when any must-include marker would be truncated.
- **Write-scope:** In **Plan-Gate** you may **only** change `TASK_PLAN.md` until approval. In **No-Plan** **no** `TASK_PLAN.md` is created; commit code normally and add `TASK_DOCS.md` at the end.
- **Title**: `[<Project>] <scope> (<k>/<n>)`.

### TASK_PLAN.md — Minimal Template (copy/paste)
```md
# Task Plan: <title>
## Scope (verbatim)
<copy the request exactly, with file/folder names and flags>

## Steps (paths & anchors)
1) <path/to/file>: <anchor or Lxx-Lyy> → change …
2) …

## Checks & Pass Criteria
- lint: <cmd> → passes
- test: <cmd> → all green (or Manual Verification below)
- build: <cmd> → succeeds
- Manual Verification (if no tests):
  - [ ] Step A …
  - [ ] Step B …

## Risks / Rollback
- Risk: …
- Rollback: git revert <sha>
```

#### Lite-Plan (for very small changes)
Use instead of the full template **only if**: ≤2 files, ≤50 LOC, no API/schema/build changes, no generated paths.
```md
Title: <one-liner>
Files: <a/b.ts, c/d.vue>
Approach: <1–2 sentences>
Checks: <lint/test/build or manual A,B>
Done: <measurable pass criterion>
```

#### Emergency HOTFIX (Sev1 only)
* Single minimal commit + PR labeled `HOTFIX` + issue reference.
* Add a short manual verification checklist.
* Within 24h: retrospective `TASK_PLAN.md` with follow-ups.

### TASK_DOCS.md — Post-hoc Summary (copy/paste)
```md
# Task Docs: <title>

## Mode & Score
Mode: <no-plan|plan-gate>, Score: <n> (factors: <bullet1>, <bullet2>, …)

## Changes
- <file>: <summary> (SHA <short>)
- …

## Checks & Results
- lint/test/build → <short outcome>

## Manual Verification (if no tests)
- [ ] Step A …
- [ ] Step B …

## Follow-ups / Risks
- …
```

---

## 1) Project Map & Guardrails (AKSEP)

* **Nuxt app root** (this folder): `nuxt.config.ts`, `package.json`, `tsconfig.json`, `i18n.config.ts`.
* **Content**: `content/**` (Markdown/MDC + YAML).
  * `content/_globals.yml` (site-wide defaults), section-level `_dir.yml`, page-level front-matter (`_index.mdc`, chapter files).
* **App code**: if `srcDir` is configured → `src/**`; otherwise use root-level `components/**`, `pages/**`, `layouts/**`, `composables/**`, `stores/**`, `locales/**`.
* **Modules**: `modules/**` (content hooks: aliases, edited-from-git, autolink, validation).
* **Server routes**: `server/routes/**` (e.g., `sitemap.xml.ts`).
* **Public**: `public/**` (uploads, images, admin/Decap).
* **Scripts**: `scripts/**` (checks, generators, tree tools).
* **Docs**: `docs/**` (architecture, YAML conventions, trees).
* **CI/CD**: `.github/workflows/**` (ci.yml, deploy.yml).

**Generated / do not commit or edit manually**
* `.nuxt/`, `.output/`, `node_modules/` → Git-ignored.
* Any files under `public/uploads/**` are user content; treat as assets.
* Do not hand-edit generated content from build hooks; change the **source** instead.

**Repo safety rails**
* Stay within this submodule.
* Allowed registries in setup: `registry.npmjs.org`.
* Never prompt for or commit secrets.
* Keep lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`) **committed**; do not regenerate unless explicitly requested.

---

## 2) Conventions (Nuxt/Vue/Content)

* Indentation 2 spaces; TypeScript strict; avoid `any`.
* Filenames: kebab-case; Components: PascalCase.
* Vue SFCs: `<script setup lang="ts">`; composables in `composables/` (or `src/composables` if `srcDir` is used).
* Prefer `async/await`; JSDoc on exported utilities.
* Language: write new code/comments in **English** (UI text per i18n).
* CSS tokens: prefer CSS variables; global palette may reference `AKSEP/Values.txt` (color hexes).
* Content authoring:
  * Use `::variant{lang=..., simple=...}` blocks for DE/EN + “einfache Sprache”.
  * Titles/labels live in page front-matter (do **not** duplicate in `_dir.yml`).
  * IDs: `ag_id` (AG), `thema_id` (topic), `kapitel_id` (chapter) as integers.
  * Tags may be weighted per docs (string optionally followed by integer).

---

## 3) Setup & Pre-checks

**Before each task**
* Ensure `main` matches remote: `git fetch && git pull --ff-only` (or `git reset --hard origin/main` if intended divergence).
* During **planning**, skip mutating commands; propose them in `TASK_PLAN.md`.

**Node/JS/TS (auto-select PM by lockfile)**
```bash
# choose manager
if [ -f pnpm-lock.yaml ]; then PM=pnpm;
elif [ -f package-lock.json ]; then PM=npm;
elif [ -f yarn.lock ]; then PM=yarn;
else PM=npm; fi

# enable (if available)
command -v corepack >/dev/null 2>&1 && corepack enable || :
# node version (optional)
[ -f .nvmrc ] && command -v nvm >/dev/null 2>&1 && nvm use || :

# install (CI-friendly)
if [ "$PM" = "pnpm" ]; then pnpm install --frozen-lockfile;
elif [ "$PM" = "yarn" ]; then yarn install --immutable;
elif [ -f package-lock.json ]; then npm ci;
else npm install; fi

# scripts (skip if missing)
$PM run lint || :
$PM test || :
[ -f tsconfig.json ] && ( $PM run -s typecheck || $PM exec tsc --noEmit || $PM run -s tsc --noEmit ) || :
```

**Nuxt app**
```bash
# build / preview / dev (scripts provided by package.json)
$PM run build || :
$PM run preview || :
$PM run start || :  # production start
$PM run dev || :    # for local dev only
```

**Content pipeline helpers (run when relevant)**
```bash
# content checks/generators (present in scripts/):
node scripts/check-missing-variants.mjs || :
node scripts/generate-en-aliases.mjs || :
node scripts/build-chapters-toc.mjs || :
```

**Testing expectations**
* If a test suite exists, keep it **green** and update for changed behavior.
* If none exists, add a short **Manual Verification** checklist to `TASK_PLAN.md` (Plan-Gate) **or** `TASK_DOCS.md` (No-Plan).
* Tests are **offline by default** (no live network). Mark any networked tests with `@net` and skip in CI by default.

---

## 4) Per-Change Loop (small, shippable steps)

For each change:
1. Implement exactly one feature/bugfix.
2. Run lint / tests / type-check.
3. Fix until green; if blocked, note failure + hypothesis in the summary.
4. Only then begin the next change.

---

## 5) Final Verification (per task)

Run a full pass in the touched project:
```bash
# same PM as in setup
$PM run lint || :
$PM test || :
$PM run build || :

# optional: local preview
$PM run preview || :
```

**Merge gate:** Do **not** merge if linters/tests fail. (This gate does **not** apply to the **plan-only** or **docs-only** commit.)

---

## 6) Git Hygiene & PRs

* **Before each task**: `git fetch && git pull --ff-only` (or hard-reset if intended).
* Commits: small, topical; optional prefix `AKSEP: ` in title.
* **PR title**: `[AKSEP]: <short description>`; avoid special chars (expand umlauts).
* **PR description must include**: Summary; What changed (bullets); Tests run + results; Risks & rollback; Screenshots (UI).
* **PR checklist**:
* [ ] Mode: no-plan / plan-gate  |  Score: <n> (classifier applied)
* [ ] `TASK_DOCS.md` added/updated for this task
* [ ] Lockfile unchanged (or rationale if changed)
* [ ] No live network calls in tests/build
* [ ] No edits under generated paths (`.nuxt/**`, `.output/**`, `node_modules/**`)
* [ ] Changed LOC ≤ ~200 (or rationale)
* [ ] Coverage (if measured) not decreased vs `main`
* Keep diffs small; avoid mass reformatting unless the task is formatting.
* Respect existing package manager/lockfile; don’t switch unless asked.

---

## 7) Content rules (authoring & i18n)

* **YAML precedence**: `front-matter (.mdc)` ➜ closest `_dir.yml` ➜ parent `_dir.yml` ➜ `content/_globals.yml`.
* **Primary pages** live in `content/<page>/_index.mdc` (+ optional `_dir.yml`).
* **Glossary**: entries under `content/begriffe/_terms/*.mdc`, defaults in `_terms/_dir.yml` (e.g., `autolink: true`).
* **Program**:
  * AG level: `content/programm/ag-*/_index.mdc` + `_dir.yml` with `ag_id`.
  * Topic level: `content/programm/ag-*/<thema>/_index.mdc` + `_dir.yml` with `thema_id`.
  * Chapter files: `.../<thema>/{01,02,…,Q,Z}.mdc` with `kapitel_id` (H2 headings inside variants).
* **i18n paths**: DE without prefix, EN under `/en/...`. If `path.en` missing, fallback to DE slug.
* **Aliases/Redirects** are generated by the content alias module; don’t hand-craft redirects unless required.
* **Tags**: may be weighted (string optionally followed by integer ≥1). Invalid sequences are ignored by normalizer.

---

## 8) Change Recommendations (attach to PR/task)

* **Where**: exact path + line numbers (or 1–2 lines context).
* **Why**: concise one-liner.
* **How**: minimal diff; snippets ≤10 lines may be inline.
* Use relative paths so deployed builds resolve.

---

## 9) Communication & Reporting

* Respect nested `AGENTS.md`.
* Keep “where/why” notes compact.
* Report environment/setup errors with actionable next steps.

---

## 10) Security, Privacy, Reliability

* Never commit secrets; update `.env.example` when new env vars are required.
* Inputs validated; parameterized queries for any future server logic.
* No live API tokens in CI; use mocks/fixtures; record/replay if needed.
* Prefer streaming/iterators over quadratic work on large inputs.
* Transient ops: retries with backoff where appropriate.

---

## 11) Never Do

* Don’t disable lint/tests just to “make it pass”.
* Don’t weaken types or remove error handling to shrink diffs.
* Don’t edit generated artifacts; fix the source.
