# Task Plan: [AKSEP] video_query data-root guard + prep colors

## Mode & Score
Mode: plan-gate, Score: 5 (classifier: reasons touches >2 files, cross-file coupling, no tests cover area)

## Task Scope Paths
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/**
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/testing/data/**
- AKSEP/TASK_PLAN.md
- AKSEP/TASK_DOCS.md

## Scope (verbatim)
Nachdem ich `python AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py --data-root AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/testing/data --channel-limit 1` ausgeführt habe, wurden im Root von AKSEP\Schoolsystem2 Jeweils eine Kopie jeder CSV-Datei im Scope erstellt, warum auch immer. Bitte investigiere, was hierzu geführt haben könnte, und korrigiere dies im Skript, damit nicht mehr irgendwo, wo es nicht passieren sollte, Kopien der CSV-Dateien erstellt werden.
Die farbliche Hervorhebung der verschiedenen Response-Typen dagegen funktioniert soweit einwandfrei! Jedoch würde ich mir wünschen, dass auch die Prep-Phase farbliche Markierungen erhalten würde:
- `removed=n` mit n>0 => rot
- `reordered=yes` => gelb
- `course_flags_updated=n` mti n>0 => gelb
mehr braucht es jedoch nicht
**Scope-Hash**: `bfe8d319a343a32fbc22dddc3f7bd0cbbdcb9287b5b1a8664a52d49f0a458c32`

## Discovery
- Problem Statement: `video_query.py` created CSV copies in an unexpected location; add guardrails and ensure prep logs use color cues for removed/reordered/course flag updates.
- Context & Constraints: Only write under the intended data-root; avoid writing if data-root is invalid.
- Existing Signals: Running with `--data-root` should target test data; `backend/src/main/csv/youtube` appears populated after run.
- Unknowns & Questions (U1…Un) — Status: answered | deferred
  - U1: Is the unexpected location caused by a wrong `--data-root` path? Status: deferred.
Status: READY

## Planning
- Decision: Resolve data-root safely and refuse to run when a provided data-root path does not exist or lacks expected CSV markers; colorize prep logs for removed/reordered/course flag updates.
- Acceptance Criteria:
  - Script exits early with a clear error if `--data-root` points to a non-existent or malformed directory.
  - Prep logs show red `removed` when >0, yellow `reordered=yes`, yellow `course_flags_updated` when >0.
- Test Strategy: Run `video_query.py --data-root .../testing/data --prep-only` and verify colored prep output; confirm no new CSVs are created outside the data-root.
- Risks & preliminary Rollback: Stricter data-root validation could block intended new locations; rollback by removing the guard.
Status: READY

## Pre-Approval Checklist
- [ ] Discovery: Status = READY
- [ ] Planning: Status = READY
- [ ] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [ ] Developer Interactions section exists
- [ ] Checks & Pass Criteria present & consistent
- [ ] Mode & Score filled (plan-gate, score = 5)
- [ ] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed)

## Implementation Steps (paths & anchors)
0) [x] **Plan Sync:** reload `TASK_PLAN.md`; scan **Developer Interactions** and apply the **Priority & Preemption Rules**.
1) [x] `AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py`: add data-root validation/guard to avoid writing to unintended paths.
2) [x] `AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py`: add colorized prep logging for removed/reordered/course flags.
3) [x] Run `video_query.py --data-root .../testing/data --prep-only` and confirm output colors and no stray CSVs.
4) [x] Update `AKSEP/TASK_DOCS.md` with changes and test results.
5) [x] Final **@codex Sweep**: scan touched/new files plus control paths for `@codex` markers and resolve.

## Developer Interactions
- [x] AGENTS.md:42 - @codex mentions are policy text; no action required.
- [x] AKSEP/TASK_PLAN.md:41 - @codex mention in checklist; no action required.
- [x] AKSEP/TASK_DOCS.md:148 - @codex mention in changelog; no action required.

## Checks & Pass Criteria
- Manual Verification:
  - [x] `video_query.py --data-root .../testing/data --prep-only` completes with prep logs (colors require TTY).
  - [x] No CSVs created outside the data-root.

## Risks / Rollback
- Risk: Data-root guard blocks valid new paths.
- Rollback: `git revert <sha>`

