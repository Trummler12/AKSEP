# Root AGENTS.md - School Monorepo

These rules apply to this repository and all subfolders unless a nested `AGENTS.md` overrides them. Nested files win on conflict (closest to the work takes precedence).

---

## 0) Task Modes & Gatekeeping
There are **two** ways to run a task. Default is **No-Plan Mode** for small/low-risk edits; switch to **Plan-Gate Mode** only when the risk/size threshold is met.

### 0.1 Scope/Risk classifier (decide the mode first)
Compute a score at the start of every task; **require Plan-Gate** if `score ≥ 4`, **optional** if `score ∈ {2,3}`, **forbid** plan if `score ≤ 1`.
Add points for each that applies:
1) Touches >2 files => +2
2) Cross-file coupling (edit function used by other files/exports/routes) => +2
3) Build/config/CI/lockfile changes (`package.json`, lockfiles, tsconfig, workflows) => +3
4) Introduces dependency or changes package manager => +3
5) DB/schema/migration/data model or i18n routing/aliases => +2
6) Security/auth/permissions/crypto/cookies => +3
7) No tests cover the changed area => +1
8) Generated paths or code generation affected => +2
9) Estimated diff >50 LOC **or** adds >1 new file => +1
10) User explicitly said "no plan for this" => -2 (sticky; see below)

### 0.2 No-Plan Mode (default; small/low-risk)
Proceed directly with code changes. At the end, create **`TASK_DOCS.md`** documenting *what changed and why*, the checks run, and the commit SHA(s). Do **not** create `TASK_PLAN.md`.

### 0.3 Plan-Gate Mode (medium/high-risk)
**Before coding**, produce `TASK_PLAN.md` at repo root, obtain approval, then implement.  
**Planning write-scope:** Until approval, you may create/update only `TASK_PLAN.md` and `TASK_DOCS.md` (docs-only; no code/config changes).  
After implementation, add/update **`TASK_DOCS.md`** summarizing the final delta.

**Planning bootstrap (mandatory)**
1) Immediately create a **plan skeleton**:
   - `## Scope (verbatim)` = full user prompt (entire content, incl. code blocks).
   - empty `## Discovery`, `## Planning`, `## Implementation Steps`, `## Developer Interactions`, `## Checks & Pass Criteria`, `## Risks / Rollback`.
   - add **`## Mode & Score`** with the classifier result, e.g. `Mode: plan-gate, Score: 4 (reasons: …)`.
2) Do **read-only discovery** and record findings **inside `## Discovery`**; link details in `TASK_DOCS.md`. No code/config edits.
3) Update `## Planning` and **(re)split** `## Implementation Steps` into **atomic** edits (per file + anchor) as understanding evolves.

**Pre-approval checklist (must be true)**
- `Discovery` **and** `Planning` show `Status: READY` (not DRAFT).
- Steps are **atomic** with paths/anchors; `N) Final @codex Sweep` present.
- `## Developer Interactions` exists (may be empty).
- `## Checks & Pass Criteria` present and consistent with Planning.
- `## Mode & Score` present with the current classifier output.
- Within **Task Scope Paths** (see “Task Scope Isolation”), `git status --porcelain -- <paths…>` shows only docs-only changes (`TASK_PLAN.md` / `TASK_DOCS.md` / optional `zzMeta-Infos/test-log.txt`).  
  Changes **outside** Task Scope Paths (e.g., other modules you are editing manually) may exist and **must not** be modified or stashed by the agent; at most, mention them in the summary.

**Approval format (unchanged)**
- `APPROVE PLAN: <plan-sha1> (TTL 7 days)` — may appear at the very beginning or very end.
- `APPROVE PLAN WITH CHANGES: <plan-sha1> - <short note>` — same positioning.

**Rules**
- Do **not** request approval while `Discovery` or `Planning` is `DRAFT`.
- If non-doc files under **Task Scope Paths** changed during planning, **revert or stash them pathspec-limited** (never repo-wide), log it in `TASK_DOCS.md` under “Prompt override / deviations”, and return to planning.

#### Task Scope Isolation (monorepo safety)
- Derive **Task Scope Paths** from the user prompt & Project Map (e.g., `M294-Frontend/**`) plus `TASK_PLAN.md` and `TASK_DOCS.md`. List them in the plan (see template).
- All Git operations (**status, add, checkout/restore, stash, commit**) must be **pathspec-limited** to Task Scope Paths.  
  Examples:  
  - `git status --porcelain -- M294-Frontend/ TASK_PLAN.md TASK_DOCS.md`  
  - `git add -- M294-Frontend/ TASK_PLAN.md TASK_DOCS.md`  
  - `git stash push -m "TASK:<id> scope" -- M294-Frontend/`
- **Never** run destructive commands at repo root (`git reset --hard`, `git clean -fdx`, `git stash --all`).  
- Work on a **feature branch** (`git switch -c <task-branch>`); stage/commit only paths within scope.  
- If outside-scope changes exist (other modules you are editing), **leave them untouched**; if they would conflict with the task, pause and ask.

### 0.4 Sticky No-Plan & Escalation
If the user said *"no plan for this"*, you **must not** create `TASK_PLAN.md` unless you first post:
`REQUEST ESCALATION TO PLAN (score=<n>): <2-3 bullets why>`
and receive one of:
- `OK ESCALATE` => switch to Plan-Gate; or
- `STAY NO-PLAN` => remain in No-Plan.
If scope grows later, recompute the score and repeat the handshake.

> Overrides: A task may override this protocol **only** if it contains the exact phrase `OVERRIDE PROTOCOL` **and** the approver repeats it in the approval message.

### 0.5 Reality Checks & Policy Conflicts (Self-Healing)
**Purpose:** Keep this AGENTS.md aligned with repo reality, and surface conflicts with task prompts.

**A) Repository reality check (objective facts)**
At the start of each task:
1) Validate key paths listed under "Project Map & Guardrails" still exist.
2) If a listed item was **renamed/moved/retired** but the new path is obvious (e.g., same tree shows `M347-Docker/` instead of `m347-project-Trummler12/` or in case a Directory is said to be a Submodule even though it isn't), you may:
   - make a **docs-only** commit updating AGENTS.md (label the PR `AGENTS-UPDATE`),
   - add one line in `TASK_DOCS.md` citing the change.
Allowed **objective** fixes: path renames/moves, removing dead entries, updating tool/library names/commands to match package scripts; minor grammar.
Disallowed without approval: adding new policies, changing gate thresholds, changing roles/responsibilities.

**B) Policy change handshake (subjective rules)**
If you want to change a **rule** (e.g., "always use tool X"), first post:
`REQUEST POLICY CHANGE: <one-liner> => <proposed AGENTS.md diff summary>`
Proceed only after: `OK UPDATE POLICY`. Then raise a small PR touching AGENTS.md (label `AGENTS-UPDATE`).

**C) Prompt vs. AGENTS.md precedence (per-task)**
For a single task, **the user prompt takes precedence** over AGENTS.md when they conflict.
Actions:
1) Follow the prompt for this task **unless** it violates Security/Safety.
2) Note the deviation in `TASK_DOCS.md` under **"Prompt override"**.
3) Ask once: "Shall I incorporate this into AGENTS.md?"  
   - If `YES` => do **B)**;  
   - If `NO` => keep it a one-off.

**D) Detection triggers (when to ask)**
Ask/flag when the prompt contains absolutes ("always", "never", "must") that clash with: write-scope rules, plan gates, PR gates, or security rails; or when a path in the prompt conflicts with the Project Map.

### 0.6 Model Selection
- **Plan-Gate tasks** or classifier **Score ≥ 4** → use **gpt-5-codex high**.
- **No-Plan tasks** (Score ≤ 1) → default **gpt-5-codex medium**.
- Escalate to **high** if the plan draft exceeds ~2500 tokens, touches security/auth/crypto, or requires multi-file reasoning even when Score = 3.

### 0.7 Policy Size & Layout (token budget)
**Why:** Very long policies degrade rule-following and increase latency/cost. Keep a compact CORE the agent always reads, push details to appendices.

**Budgets (heuristics)**
- **CORE (must read): ≤ ~2 500 tokens** (~10 k chars). Contains: modes/gates (0.x), Plan bootstrap & pre-approval checklist, Task Scope Isolation, @codex priority rules, scans (baseline + control paths), and the plan template header+Steps.
- **APPENDIX (nice to have): ≤ ~6 000 tokens** (~24 k chars). Rationale, extended examples, hotfix path, long project map.
- **Total soft cap:** ≤ ~8 500 tokens (~34 k chars). If exceeded → run **Compaction** below.

**Compaction (when to trim)**
Trim when any is true:
1) AGENTS.md > ~34 k chars **or** the agent ignores sections/contradicts rules.
2) Plan drafts frequently exceed ~2 500 tokens before approval.
3) You notice rising “policy drift” (old rules reappear, synonyms instead of canonical tags).

**Compaction steps (order)**
1) **Front-load CORE:** Move essential, machine-parsable rules to the top; push narratives/FAQ to the bottom.
2) **Eliminate redundancy:** Keep **exactly one** canonical location for:
   - Mode/Gates & bootstrap,
   - @codex policy + Final Sweep,
   - Task Scope Isolation,
   - Template (**one** version).
3) **Make it machine-readable:** Where possible, put constants (priority tags, control paths, scan commands) into compact bullet or JSON blocks; avoid synonyms, use canonical tokens.
4) **Modularize the template:** Keep the plan template short; link long examples in `TASK_DOCS.md`.
5) **Quick-start TL;DR (≤ 500 tokens):** Mini-checklist at the very top (Modes → Bootstrap → READY Gate → Steps Priority → Final Sweep). The agent must read this first.

**Measuring**
- Approx tokens ≈ chars / 4. At ~32 k characters you’re roughly at ~8 k tokens.
- If CORE > 2 500 tokens: prioritize trimming sections 0.x, 9) Developer Interventions, and the template.

**Agent obligations**
- Always read CORE fully; consult the APPENDIX only when needed.
- If `AGENTS.md` exceeds the soft cap: note `POLICY LARGE` in the task summary and prefer CORE sections by heading IDs during retrieval.

### Suggested Tasks (Ask-mode) - Fidelity & Chunking
When composing "Suggested Task" prompts in Ask-mode:
- **Verbatim prompt into Plan:** Paste the **entire user prompt** under `## Scope (verbatim)` (Plan-Gate). No compression/summarization; preserve formatting and code blocks.
- **Prompt Echo Guard:** Compute `sha256` of the original prompt and write it as **Scope-Hash** into the plan. Before requesting approval, recompute and verify the hash; if mismatch, repaste the full prompt.
- **Plan bootstrap (Plan-Gate):** At the very start, create the `TASK_PLAN.md` skeleton (Scope verbatim, empty Discovery/Planning/Steps/Developer Interactions/Checks/Risks, and Mode & Score). Do all discovery/planning **inside the plan**; no code/config edits before approval.
- **Task Scope Paths:** Derive the exact pathspecs from the prompt & Project Map and write them into `## Task Scope Paths`. Use these pathspecs for all Git operations (`status/add/commit/stash`) and for pre-approval checks.
- **File-specific steps** only; no "e.g." or generic summaries when specifics exist.
- **Chunking policy**: split into Task (1/n), (2/n), ... when the plan exceeds ~3000 tokens or ~4 editor pages, **or** when any must-include marker would be truncated.
- **Must-include markers**: text in backticks (`paths`, `ids`, `classes`), quoted file paths, XML/HTML/JSON fragments, CSS selectors, and angle-bracket placeholders like `<Version>`.
- **Write-scope:** If in **Plan-Gate Mode**, before approval you may create/update **only** `TASK_PLAN.md` **and** `TASK_DOCS.md` (docs-only; no code/config changes). If in **No-Plan Mode**, do **not** create `TASK_PLAN.md`; commit code normally and produce `TASK_DOCS.md` at the end.
- **Plan reload & URGENT:** At the **start and end of each step**, reload `TASK_PLAN.md` and scan **Developer Interactions**. High-priority = tagged (case-insensitive) `URGENT`, `IMPORTANT`, `NOTFALL`, `SEV1`, or safety/secrets/security. Apply the **Priority & Preemption Rules**: handle **priority @codex** immediately (safe boundary), then **after finishing the current step** process **regular @codex** **before** starting the next step.
- **Title format**: `[\<Project\>] <scope> (<k>/<n>)` - e.g., `[ListPuzzle] Android permissions fix (1/3)`.

#### Emergency HOTFIX path (opt-in)
For Sev1 production breakages affecting builds or critical UI:
- Allow a single minimal commit + PR labeled `HOTFIX`, referencing the issue.
- Include a short manual verification checklist in the PR.
- Within 24h, add a retrospective `TASK_PLAN.md` covering the change and any follow-ups.
**Sev1 definition & guardrails**
- Sev1 = red CI on `main`, production build broken, security incident, or data-loss bug.
- Scope cap: ≤20 changed LOC in ≤1 file (except version bump); keep the diff minimal.
- Commit title: `HOTFIX: <one-liner> (fixes #<id>)`.
- Require one maintainer acknowledgment (`ACK HOTFIX`) in PR comments before merge.
- Open a follow-up issue labeled `POSTMORTEM` within 24-48h (root cause + tests).

### TASK_PLAN.md - Minimal Template (copy/paste)
```md
# Task Plan: <title>

## Mode & Score
Mode: plan-gate, Score: <n> (classifier: reasons <…>)

## Task Scope Paths
<list precise pathspecs the task is allowed to touch (usually: a common ancestor folder of all touched project files (usually the project folder) + specific root files), e.g.>
- M323-Haskell/**, M320-Objekt/**, M294-Frontend/LB2/** or similar (path from Repo root, one path per bullet)
- TASK_PLAN.md
- TASK_DOCS.md

## Scope (verbatim)
<paste the **full original user prompt** verbatim — entire content, including code blocks/JSON; no paraphrasing or omissions>
**Scope-Hash**: `<sha256 of the entire original prompt>`

## Discovery
*(Use only what applies; omit bullets that are not relevant.)*
- Problem Statement (verbatim or short restatement)
- Context & Constraints (runtime, CI, security, tooling)
- Existing Signals (files, tests, logs, similar code)
- Unknowns & Questions (U1…Un) — Status: answered | deferred
- Options (A/B/…): brief pros/cons + risk notes
- Evidence links (if any): see `TASK_DOCS.md#discovery-<YYYYMMDD>`
Status: DRAFT | READY

## Planning
*(Use only what applies; omit bullets that are not relevant.)*
- Decision (chosen option) + Rationale (ADR-mini)
- Impact on Scope/Steps/Checks/Risks (synchronize below)
- Acceptance Criteria (verifiable)
- Test Strategy (which suites/manual)
- Risks & preliminary Rollback
- Links (if any): `TASK_DOCS.md#planning-<YYYYMMDD>`
- Step Granularity: If steps are coarse, **split** them into **atomic** edits (ideally per file + anchor/range). Merge/split as needed so each step is testable/reviewable.
Status: DRAFT | READY FOR APPROVAL

## Pre-Approval Checklist
- [ ] Discovery: Status = READY
- [ ] Planning: Status = READY
- [ ] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [ ] Developer Interactions section exists
- [ ] Checks & Pass Criteria present & consistent
- [ ] Mode & Score filled (plan-gate, score = <n>)
- [ ] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed)

## Implementation Steps (paths & anchors)
> Notes:
> - No research/plan meta-tasks here — Discovery/Planning above must be complete before approval.
> - If Discovery/Planning changed understanding, **synchronize and (re)split** these steps into small **atomic** edits (per file + anchor/range) **before** requesting approval.

**Priority & Preemption Rules (global order)**
- Global order: **Priority @codex** (tagged `URGENT|IMPORTANT|NOTFALL|SEV1` or safety/secret/security) **> finish current atomic step** **> regular @codex** **> start next step**.
- **Immediate preemption (may interrupt the current step)** only if:
  1) the @codex item has a priority tag (see above), **or**
  2) it directly impacts the **current step’s paths/anchors**, **or**
  3) it concerns safety/secrets/security.
  When interrupting, switch at a **safe boundary** (e.g., after the current edit/test/run completes) to avoid corrupting state.
- **Regular @codex**: after finishing the current step, but **before** starting the next, process the queue in **Developer Interactions** (FIFO; bump items that touch the next step's files).
- If a non-priority item arrives **mid-step** and does not impact the current step, **enqueue** it; you will handle it **after** finishing the step and **before** the next step.
- The **Final @codex Sweep** is a safety net **after all steps**.

0) **Plan Sync:** reload `TASK_PLAN.md`; scan **Developer Interactions** and apply the **Priority & Preemption Rules** *(process the regular queue now before Step 1)*.
1) <path/to/file>: <anchor or Lxx-Lyy> => change ...
2) ...
N) Final **@codex Sweep**: scan all **touched/new files** **plus Control Paths** for `@codex` comments (see policy “Developer Interventions” for commands); append items to **Developer Interactions**; resolve until none remain.

## Developer Interactions
- [ ] <path:line> — <short note>  *(start empty; populate during dev; see policy "Developer Interventions")*
- [ ] ...

## Checks & Pass Criteria
- lint: <cmd> => passes
- test: <cmd> => all green (or Manual Verification below)
- build: <cmd> => succeeds
- Manual Verification (if no tests):
  - [ ] Step A ...
  - [ ] Step B ...

## Risks / Rollback
- Risk: ...
- Rollback: git revert <sha>
```

#### Lite-Plan (for very small changes)
Use this instead of the full template:
```md
Title: <one-liner>
Files: <a/b.js, c/d.css>
Approach: <1-2 sentences>
Checks: <lint/test/build or manual A,B>
Done: <measurable pass criterion>
```
Only if: ≤2 files, ≤50 LOC, no API/schema/build changes, no generated paths.

### TASK_DOCS.md - Post-hoc Summary (copy/paste)
```md
# Task Docs: <title>

## Mode & Score
Mode: <no-plan|plan-gate>, Score: <n> (factors: <bullet1>, <bullet2>, ...)

## Changes
- <file>: <summary> (SHA <short>)
- ...

## Checks & Results
- lint/test/build => <short outcome>

## Manual Verification (if no tests)
- [ ] Step A ...
- [ ] Step B ...

## Follow-ups / Risks
- ...
```

---

## 1) Project Map & Guardrails

- **`docs/`** - static site. You may edit content and add pages, **but do not modify**:
  - `docs/projects/` (generated) - contains a `.generated` marker file. PRs touching this path fail CI.
  - `docs/changelog/index.html` (generated) - auto-built; PRs editing this file fail CI.
  Coordinate if any subfolder is auto-synced.  
- **`..BRZeugs/`** - Folder for Random things related to where I'm working at.
- **`AKSEP/`** - submodule for Projects related to our Political Group; follow its local rules in `AKSEP/AGENTS.md`.
- **`berichtstool/`** - (For now the only) Serious Project I'm working on as part of a larger Team.
- **`M122-Auto/`** - legacy Folder for a finished Module focusing on Automation (PowerShell).
- **`M162-SQL/`** - SQL projects (MySQL, SQLite); use `qwtel.sqlite-viewer` extensions.
  - **`M162-SQL/Schoolsystem/`** - school DB project.
- **`M293-HTML/`** - Eleventy-based HTML/CSS/JS starter (see README).
- **`M294-Frontend/`** - ÜK Module for Frontend Development (React, TS, Node);
- **`M319a-Java/`** - Collection of smaller Java projects;
- **`M319b-Python/`** - several small Python projects.
- **`M320-Objekt`** - Exercise-Projects for Object-Oriented Programming (Java); 'global' docs are under `docs/`, local docs under `<project>/docs/`, sources in `<project>/src/main/java/<project>/`.
- **`M322-Schnittstellen/`** - Module for API interfaces.
- **`M323-Haskell-COPY/`** - Copy of the Submodule `M323-Haskell/`, used for Haskell-based Exercises.
- **`M335-MicroRush-COPY/`** - Copy of the Submodule `M335-MicroRush/`, related to a legacy project we've done in the course of a recent ÜK.
- **`M346-Cloud/`** - Module for Cloud Computing (Node, TS, Docker, Azure).
- **`M347-Docker/`** - Copy of a legacy external module repo on Docker.
- **`M450-Testing/`** - Module related to Testing Applications.
- **`zProjektZeugs/ListPuzzle/`** - Node project; built/tested via npm.
- Small demos: QR Code Generator at `M293-HTML/src/.KI-Tests/QR-Code/index.html`; toTxt Converter at `M293-HTML/src/.KI-Tests/toTxt/index.html`.  
  *CI note*: demo folders are **non-blocking** for the monorepo CI; failures there do not block merges (label PRs touching them with `docs-demo`).

**Repo safety rails**
- Stay within the repo sandbox.
- External package registries allowed during setup: `registry.npmjs.org`, `pypi.org`.
- Never prompt for or expose secrets.
- No live API tokens in CI or local tests; prefer mocks/fixtures.

---

## 2) Conventions (defaults; nested rules may override)

- **Indentation**: 2 spaces (no tabs).  
- **Indentation - exceptions**: Python follows PEP 8 (4 spaces); keep the subproject's existing style.
- **Naming**: kebab-case for files; PascalCase for classes/components.  
- **Exceptions**: Python modules/functions use `snake_case`; keep existing naming per subproject.
- **JS/TS**: prefer `async/await`; JSDoc on exported functions.  
- **Language**: use English for new text; if mixed, migrate to English gradually.
- **TypeScript**: enable `strict` in `tsconfig`; avoid `any`; JSDoc on public exports.
- **Python (only when touched)**: follow the existing style in that subproject; **do not add** new linters/formatters unless a nested `AGENTS.md` requires them.

---

## 3) Setup & Pre-checks (auto-detect per folder)

Before touching code in a given folder, attempt baseline checks. If a command is absent, skip it and record why.  
During the **planning phase**, skip any commands that could modify tracked files (e.g., package installs, formatters). Use read-only discovery (read configs, list files). Propose the needed commands inside `TASK_PLAN.md` instead.

**Interventions baseline (first-time scan)**
Before planning/coding, scan Control Paths for `@codex` and initialize `## Developer Interactions` with findings.
Prefer:
```bash
  rg -n --hidden -S -g '!**/{node_modules,dist,build,.git}/**' '@codex' .vscode *.code-workspace
```
Fallbacks:
```bash
  git grep -n -I -e '@codex'
```
(Windows PS5: `chcp 65001` or use `git grep` to avoid mojibake.)

**Optional: quick map reality check (non-fatal)**
```bash
# echo missing map entries (no failure)
for p in M293-HTML zProjektZeugs/ListPuzzle M319b-Python M122-Auto M162-SQL/Schoolsystem M347-Docker AKSEP; do
  [ -e "$p" ] || echo "AGENTS.md map mismatch: missing $p"
done
```

**Node/JS/TS** (if `package.json` present):
```bash
# choose a manager by lockfile
if [ -f pnpm-lock.yaml ]; then PM=pnpm;
elif [ -f package-lock.json ]; then PM=npm;
elif [ -f yarn.lock ]; then PM=yarn;
else PM=npm; fi

# enable package managers (if available)
command -v corepack >/dev/null 2>&1 && corepack enable || :
# node version (optional)
[ -f .nvmrc ] && command -v nvm >/dev/null 2>&1 && nvm use || :
# install (CI-friendly) — in planning phase, do not create/modify lockfiles
if [ "$PM" = "pnpm" ]; then
  pnpm install --frozen-lockfile
elif [ "$PM" = "yarn" ]; then
  yarn install --immutable
elif [ -f package-lock.json ]; then
  npm ci
else
  echo "SKIP install: planning phase and no lockfile present (would create package-lock.json)"
fi

# scripts
$PM run lint || :
$PM test || :                # no Jest-specific flags by default
# Type-check only when TS is configured
[ -f tsconfig.json ] && ( $PM run -s typecheck || $PM exec tsc --noEmit || $PM run -s tsc --noEmit ) || :
```

**Python** (if `pyproject.toml` or `requirements.txt` present):
```bash
# Python projects (anywhere in the repo)
[ -f requirements.txt ] && pip install -r requirements.txt || :
# If a test suite is already configured, you may run it:
[ -d tests ] && pytest -q || :
```

**Eleventy sites** (Eleventy config detected or per project README):
```bash
$PM run build || :
$PM run serve || :
```

Record failures with actionable notes in the task summary.

**Testing expectations (all languages):**
- If a test suite exists in the touched project, keep it **green** and update tests for changed behavior.
- If **no** test suite exists, add a short **Manual Verification** checklist to `TASK_PLAN.md` (Plan-Gate) **or** `TASK_DOCS.md` (No-Plan) with exact steps the reviewer can run.
- Mark tests that require network with `@net` (or `it.network(...)`); CI skips them unless explicitly enabled.

(Optional) Append lint/test output with timestamps to `zzMeta-Infos/test-log.txt` to aid troubleshooting on shared machines.

---

## 4) Per-Change Loop (small, shippable steps)

For each change:
1. Implement exactly one feature or bugfix.
2. Run lint, tests, and type checks (where available).
3. Fix until green; if blocked, note the failure + hypothesis in the summary.
4. Only then begin the next change.

---

## 5) Final Verification (per task)

Run a full pass in the touched project(s):
```bash
# Use the same package manager selected in Setup (npm/pnpm/yarn):
$PM run lint || :
$PM test || :
$PM run build || :

# Python projects (anywhere in the repo)
[ -d tests ] && pytest -q || :
```

Optional manual spot-check for web projects:
```bash
$PM run serve || $PM run preview || $PM run start
```

**Merge gate:** For code changes, do **not** merge if linters/tests fail. (This gate does not apply to the plan-only **or** docs-only commit.)  
If coverage metrics exist, they **must not decrease** vs `main` (soft gate; explain exceptions).

---

## 6) Git Hygiene & PRs

* **Before each task**: ensure you are on a **feature branch** for this task.
  * `git fetch`
  * Prefer `git rebase origin/main` or `git merge --no-ff origin/main` on the feature branch.  
    **Do not** run `git reset --hard` at repo root when uncommitted changes exist **anywhere**. If updates are required, limit staging/commits to **Task Scope Paths** with pathspecs.
* **Commits**: small, topical; title optionally prefixed with a project tag (e.g., `LP: add levels`).
* **PR title**: `[<Project>]: <short description>`; avoid special chars (expand umlauts: `ä->ae`, etc.).
* **PR description** must include:
  * Summary & rationale
  * What changed (bullet points)
  * Tests run + results
  * Risks & rollback plan
  * Screenshots / clips if UI

* **Add these checkboxes (PR checklist):**
- [ ] AGENTS.md changed? If yes: PR labeled `AGENTS-UPDATE` and reason: <objective fix | approved policy change>
- [ ] Ran Reality Check (map paths validated) or noted mismatches in `TASK_DOCS.md`
- [ ] Mode: no-plan / plan-gate  |  Score: <n> (classifier applied)
- [ ] `TASK_DOCS.md` added/updated for this task
- [ ] Lockfile unchanged (or rationale if changed)
- [ ] No live network calls in tests/build (offline by default)
- [ ] No changes under generated paths (`docs/projects/**`, `docs/changelog/index.html`)
- [ ] Changed LOC ≤ ~200 (or rationale)
- [ ] Coverage (if measured) not decreased vs `main`

- Commit only after required checks succeed (or with an explicit, justified exception). **Exceptions:** the *planning* commit that adds/updates `TASK_PLAN.md` (Plan-Gate) **or** the *documentation* commit that adds/updates `TASK_DOCS.md` (No-Plan) may bypass checks.
- Keep diffs small; avoid mass reformatting unless the task is explicitly a formatting task.
- Aim for ≤ ~200 changed LOC per PR (soft limit). If more, split or justify.
- Respect the existing package manager/lockfile; **don't** switch managers or generate a new lockfile unless explicitly asked.
- When build steps create files or directories that should not be committed (e.g., `node_modules/`, `dist/`, `.cache/`, `.turbo/`), add them to `.gitignore` if they are not already listed.
- Keep package manager lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) **committed** and do not regenerate them unless explicitly asked.

---

## 7) Proposing Restructures (opt-in)

For significant restructures, propose first:
* Write `ARCHITECTURE-PROPOSAL-<brief>.md` (alias accepted: `ARCHITEKTURVORSCHLAG-<brief>.md`) with an ASCII tree of the suggested layout and rationale.
* Reference it in the task summary under `ARCHITEKTURVORSCHLAG: <path>`.
* Trivial/obvious refactors may be done directly if justified in the PR.

---

## 8) Change Recommendations (attach to PR/task)

* **Where**: exact path + line numbers (or 1-2 lines of context).
* **Why**: concise, single-sentence rationale.
* **How**: a minimal diff; for snippets ≤10 lines, embed inline.
* Use relative paths so deployed projects resolve correctly.

---


### 9) Developer Interventions (@codex markers)
- Applies to any agent editing this repository.
- Treat any comment containing @codex (case-insensitive) as a live developer instruction, even when it appears after code, inside block comments, or uses the wrong comment delimiter (//, #, /* */, <!-- -->, --, etc.). If the delimiter does not match the file's language, rewrite the developer line to the idiomatic comment style before replying (keep the original text intact).
- Never delete, rewrite, or move lines containing @codex or @developer unless the human explicitly asks you to do so.

**Mandatory in `TASK_PLAN.md`:**
- Always include a top-level section **`## Developer Interactions`** (initially empty). Developers may add lines like `@codex see <path[:line]>`.  
- Priority tags (case-insensitive): `URGENT`, `IMPORTANT`, `NOTFALL`, `SEV1`. **Normalization:** map common synonyms like `WICHTIG` / `DRINGEND` to `URGENT` before parsing.

**Plan reload duty**
- At the **start and end of each Implementation Step**, reload `TASK_PLAN.md` and scan **Developer Interactions**.

**Priority & Preemption Rules (global order)**
- Global order: **Priority @codex** (tagged `URGENT|IMPORTANT|NOTFALL|SEV1` or safety/secret/security) **> finish current atomic step** **> regular @codex** **> start next step**.
- **Immediate preemption (may interrupt the current step)** only if the item is priority (see above) **or** directly impacts the **current step’s paths/anchors**; when interrupting, switch at a **safe boundary**.
- **Regular @codex**: after finishing the current step, but **before** starting the next, process the queue in **Developer Interactions** (FIFO; bump items that touch the next step’s files).
- If a non-priority item arrives **mid-step** and does not impact the current step, **enqueue** it for the post-step window.
- The **Final @codex Sweep** is a safety net after all steps.

**Reply style & lifecycle**
- On first encounter within code, add an inline reply on the next line using the same comment style: `@developer <TAG>: <message>` (preferred tags: ANSWER, ACK, PLAN, BLOCKED, DONE). Match the indentation of the marker.
- When replying to @codex comments, do not duplicate existing lines of code; add the reply line separately and close the thread with `@developer RESOLVED: <short status>` as soon as there's no more need for the Developer to respond.
- **Final sweep (mandatory):** After completing the planned work:
  1) Search all **touched/new files** **plus Control Paths** for `@codex`.
     Control Paths (always include): `.vscode/**`, `*.code-workspace`, repo-root `*.md` (incl. `AGENTS.md`, `TASK_*.md`), `.editorconfig`, `dprint.json`.
     Prefer (cross-platform):
       - `rg -n --hidden -S -g '!**/{node_modules,dist,build,.git}/**' '@codex' . .vscode *.code-workspace`
       Fallbacks:
       - `git grep -n -I -e '@codex'` (working tree), or
       - PowerShell 7+: `Get-ChildItem -Recurse -File | Select-String -SimpleMatch '@codex'`
         PowerShell 5: run `chcp 65001` first or use `git grep`.
  2) List each location under `## Developer Interactions` in `TASK_PLAN.md` (format: `[ ] <path:line> - <short note>`).
  3) Process the list; mark `[x]` when done. If awaiting a developer reply, add a reminder at the bottom; on revisit without reply, you may mark `[x]` and note pending response in the session summary.
  4) Repeat until no markers remain.


## 10) Citations (for reviewers)

* File refs: `F:<path>†L<start>(-L<end>)?`
* Terminal/test output: use chunk IDs.

## 11) Security & Safety

- Never commit secrets; use env vars; update `.env.example` when new vars are needed.
- Validate inputs; use parameterized queries for DB access; avoid insecure crypto/hash choices.
- Tests are **offline by default**; avoid live network calls unless a nested `AGENTS.md` explicitly opts in.
- No live API tokens in CI; use mocks/dummy keys and record/replay where needed.

## 12) Performance & Reliability

- Avoid quadratic work on large inputs where feasible; prefer streaming/iterators.
- For transient operations, use retry with exponential backoff when appropriate.

## 13) Never Do

- Do not disable linters/tests to "make it pass".
- Do not weaken types or remove error handling to reduce diff size.
