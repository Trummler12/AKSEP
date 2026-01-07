# Task Docs: [AKSEP] Tag removal script

## Mode & Score
Mode: plan-gate, Score: 4 (factors: touches >2 files, no tests cover area, estimated diff >50 LOC)

## Changes
- Embedding/testing/tag_remove.py: new CLI script to remove tags by ID/name (arrays supported) and reindex tagID.

## Checks & Results
- Ran `python Embedding/testing/tag_remove.py` => success (removed 8 entries).

## Manual Verification (if no tests)
- [x] Run `python Embedding/testing/tag_remove.py` with RUN_REMOVE entries and confirm removals.

## Follow-ups / Risks
- Prompt override: stored plan/docs under `Embedding/` per user request (deviates from root plan location).
- Reality check: project map paths missing at repo root (`projects/AKSEP`, `projects/AKSEP-ALT`, `projects/schoolsystem_DB`, `docs/index.html`).
