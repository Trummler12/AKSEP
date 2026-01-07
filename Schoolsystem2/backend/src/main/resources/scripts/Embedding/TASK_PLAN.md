# Task Plan: [AKSEP] Tag removal script

## Mode & Score
Mode: plan-gate, Score: 4 (classifier: reasons touches >2 files, no tests cover area, estimated diff >50 LOC)

## Task Scope Paths
- Embedding/**
- Embedding/TASK_PLAN.md
- Embedding/TASK_DOCS.md

## Resume Chat
```bash
codex resume 019b9916-da3c-7d83-92b4-90b5bdfe92f9
```

## Scope (verbatim)
Viele Dank, das hat das Problem tatsächlich behoben!
Bitte erstelle nun in Schoolsystem2\backend\src\main\resources\scripts\Embedding\testing ein Script, mit welchem wir aus Schoolsystem2\backend\src\main\resources\scripts\Embedding\testing\data\t_tag_PLANNING.txt gezielt Einträge entfernen (per ID *oder* per name, beides soll über ein und dasselbe Argument möglich sein und korrekt interpretiert werden entweder als Int oder als String) und automatisch die Indizes aller Einträge *nach* dem Gelöschten entsprechend aktualisieren lassen können[1]; Das Argument soll auch Arrays erlauben (in deren am einfachsten anzugebenden Form); Wenn man das Script alternativ über den "Run"-Button ausführen möchte, so soll es hierfür ganz oben im Script entsprechende Nutzerdefinierbare Arrays geben, die *additiv* zu (optionalen) Argumenten zur Aktualisierung der Tag-Liste verwendet werden sollen. Das *Hinzufügen* von Tags wollen wir vorerst mal manuell handhaben; [1]Ich denke, am einfachsten können wir das Aktualisieren der Indizes handhaben, indem wir das Script am Ende einfach von oben nach unten ALLE tagID's durchgehen und durch deren korrekten Index ersetzen lassen.
PS: Bitte eröffne in Schoolsystem2\backend\src\main\resources\scripts\Embedding drin ein Plan-Gate für diesen Scope (Embedding-Scripte); Wir wollen die Planungs-Dateien deshalb explizit dort drin erstellen, da der Bereich ausserhalb dieses Ordners Aufgabengebiet *anderer* Agenten sein soll
**Scope-Hash**: `31086ED90347F71CB8436018AD80B07A0AA66C51`

## Discovery
- Problem Statement: Create a script to remove tags from `Embedding/testing/data/t_tag_PLANNING.txt` by ID or name (same argument), support arrays, and reindex tagID sequentially after deletions; include run-button arrays additive to CLI args.
- Context & Constraints: CSV file with header `tagID,name,synonyms` under `Embedding/testing/data/`; script lives in `Embedding/testing/`.
- Existing Signals: `Embedding/testing/data/t_tag_PLANNING.txt` has numeric tagIDs and quoted names/synonyms; current scripts are simple CLI-less Python files.
- Unknowns & Questions: None.
- Options:
  - A) `--remove` accepts multiple values; each value can be comma-separated; numeric tokens map to IDs, others to names. Pros: easy CLI; Cons: light parsing.
  - B) `--remove` accepts JSON array string. Pros: explicit types; Cons: less user-friendly.
- Developer Interactions Scan: `rg` control-path scan failed because `.vscode`/`*.code-workspace` missing; fallback `git grep` found `YouTube_Data/youtube_transcripts/TASK_DOCS.md:104` containing `@codex` (outside scope).
- Reality Check: Project map paths missing at repo root: `projects/AKSEP`, `projects/AKSEP-ALT`, `projects/schoolsystem_DB`, `docs/index.html`.
Status: READY

## Planning
- Decision: Implement `Embedding/testing/tag_remove.py` using `argparse` with a single `--remove` argument supporting multiple values and comma-splitting; parse tokens as int IDs or string names; merge CLI targets with top-of-file arrays for run-button usage; rewrite CSV with updated sequential `tagID`.
- Impact on Scope/Steps/Checks/Risks: No config changes; in-place CSV rewrite; add manual verification checklist.
- Acceptance Criteria:
  - Removing by ID deletes matching row(s) and reindexes tagIDs from top to bottom.
  - Removing by name (case-insensitive) deletes matching rows and reindexes.
  - `--remove` accepts arrays via repeated args or comma-separated values.
  - Top-of-file arrays are additive to CLI args.
- Test Strategy: Manual CLI runs against a copied CSV or known small subset.
- Risks & preliminary Rollback: Risk of removing wrong rows if name matches are ambiguous; rollback by restoring CSV from VCS or backup.
Status: READY FOR APPROVAL

## Pre-Approval Checklist
- [ ] Discovery: Status = READY
- [ ] Planning: Status = READY
- [ ] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [ ] Developer Interactions section exists
- [ ] Checks & Pass Criteria present & consistent
- [ ] Mode & Score filled (plan-gate, score = 4)
- [ ] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed)

## Implementation Steps (paths & anchors)
0) **Plan Sync:** reload `Embedding/TASK_PLAN.md`; scan **Developer Interactions** and apply the **Priority & Preemption Rules** (process regular queue before Step 1).
1) `Embedding/testing/tag_remove.py`: add top-level arrays for run-button removals; implement CLI argument parsing for IDs/names with comma-splitting; merge targets.
2) `Embedding/testing/tag_remove.py`: implement CSV load/filter/write with sequential tagID rewrite; add summary output.
3) `Embedding/testing/tag_remove.py`: add usage/help text and examples for arrays and mixed ID/name removal.
4) Final **@codex Sweep**: scan all touched/new files plus Control Paths for `@codex` comments; update **Developer Interactions** and resolve.

## Developer Interactions
- [x] TASK_PLAN.md:43 - @codex mention in plan template; policy text only.
- [x] TASK_PLAN.md:56 - @codex mention in plan template; policy text only.
- [x] AGENTS.md:42 - @codex mention in policy; no action required.
- [x] AGENTS.md:116 - @codex mention in policy; no action required.
- [x] AGENTS.md:130 - @codex mention in policy; no action required.
- [x] AGENTS.md:155 - @codex mention in policy; no action required.
- [x] AGENTS.md:211 - @codex mention in policy; no action required.
- [x] AGENTS.md:223 - @codex mention in policy; no action required.
- [x] AGENTS.md:225 - @codex mention in policy; no action required.
- [x] AGENTS.md:229 - @codex mention in policy; no action required.
- [x] AGENTS.md:231 - @codex mention in policy; no action required.
- [x] AGENTS.md:236 - @codex mention in policy; no action required.
- [x] AGENTS.md:324 - @codex mention in policy; no action required.
- [x] AGENTS.md:327 - @codex mention in policy; no action required.
- [x] AGENTS.md:331 - @codex mention in policy; no action required.
- [x] AGENTS.md:481 - @codex mention in policy; no action required.
- [x] AGENTS.md:483 - @codex mention in policy; no action required.
- [x] AGENTS.md:484 - @codex mention in policy; no action required.
- [x] AGENTS.md:487 - @codex mention in policy; no action required.
- [x] AGENTS.md:494 - @codex mention in policy; no action required.
- [x] AGENTS.md:496 - @codex mention in policy; no action required.
- [x] AGENTS.md:498 - @codex mention in policy; no action required.
- [x] AGENTS.md:502 - @codex mention in policy; no action required.
- [x] AGENTS.md:504 - @codex mention in policy; no action required.
- [x] AGENTS.md:507 - @codex mention in policy; no action required.
- [x] AGENTS.md:509 - @codex mention in policy; no action required.
- [x] AGENTS.md:510 - @codex mention in policy; no action required.
- [x] Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/youtube_transcripts/TASK_DOCS.md:104 - @codex mention in docs; outside scope.
- [x] Schoolsystem2/docs/Data_Flow/Object_Processing/TASK_PLAN.md:32 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/docs/Data_Flow/Object_Processing/TASK_PLAN.md:61 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/docs/Data_Flow/Object_Processing/TASK_PLAN.md:73 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/docs/Data_Flow/Object_Processing/TASK_PLAN.md:75 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/docs/Data_Flow/Object_Processing/TASK_PLAN.md:79 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/docs/Data_Flow/Object_Processing/TASK_PLAN.md:81 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/docs/Data_Flow/Object_Processing/TASK_PLAN.md:88 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/backend/src/main/resources/scripts/Embedding/TASK_PLAN.md:25 - @codex mention in plan text; no action required.
- [x] Schoolsystem2/backend/src/main/resources/scripts/Embedding/TASK_PLAN.md:44 - @codex mention in plan checklist; no action required.
- [x] Schoolsystem2/backend/src/main/resources/scripts/Embedding/TASK_PLAN.md:55 - @codex mention in plan step; no action required.
- [x] Schoolsystem2/backend/src/main/resources/csv/topics/TASK_PLAN.md:76 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/backend/src/main/resources/csv/topics/TASK_PLAN.md:92 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/backend/src/main/resources/csv/topics/TASK_PLAN.md:95 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/backend/src/main/resources/csv/topics/TASK_PLAN.md:96 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/backend/src/main/resources/csv/topics/TASK_PLAN.md:97 - @codex mention in plan; outside scope.
- [x] Schoolsystem2/backend/src/main/resources/csv/topics/TASK_DOCS.md:7 - @codex mention in docs; outside scope.

## Checks & Pass Criteria
- Manual Verification:
  - [ ] Run script with ID and name removals; tag IDs are reindexed sequentially.
  - [ ] Run script with arrays and Run-button arrays; removals are additive and correct.

## Risks / Rollback
- Risk: Incorrect tagID reindexing could misalign downstream references.
- Rollback: revert commit(s) touching `Embedding/testing/<new-script>.py`.
