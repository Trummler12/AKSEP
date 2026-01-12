# Task Plan: [AKSEP] Tag update ordering

## Mode & Score
Mode: plan-gate, Score: 2 (classifier: no tests cover area, estimated diff >50 LOC)

## Task Scope Paths
- Schoolsystem2/backend/src/main/resources/scripts/embedding/**
- Schoolsystem2/backend/src/main/resources/scripts/embedding/TASK_PLAN.md
- Schoolsystem2/backend/src/main/resources/scripts/embedding/TASK_DOCS.md

## Scope (verbatim)
Okay, sehr schön! Damit können wir definitiv arbeiten!
Ich hab' jedoch noch die Aufgabe für die `Topics mit geringster Uebereinstimmung zum n. best passenden Tag` entfernt, da diese Informationen mit der Ausgabe davor grösstenteils redundant ist. Zudem hab' ich noch hinzugefügt, dass sowohl die Namen der Tags als auch die der Topics stets in lowercase gelesen werden sollen.
Dann lass uns unsere Aufmerksamkeit nun unserer Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_remove.py widmen.
Wir haben bereits TAGS_TO_REMOVE, um aus Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\data\t_tag_PLANNING.txt all jene Tags zu entfernen, die mit Elementen dieser Liste übereinstimmen;
Analog dazu wollen wir natürlich auch eine TAGS_TO_ADD implementieren, welche Tags entsprechend *hinzufügt* (sofern noch nicht bereits vorhanden);
An dieser Stelle habe ich mir dann Gedanken gemacht, an welcher Stelle wir neue Tags hinzufügen wollen, denn es wäre halt schon sinnvoll, dass wir diese einer gewissen Reihenfolge entsprechend vorliegen haben. Und an dieser Stelle kam mir die Idee, dass wir eine BASE_TAG_ORDER definieren könnten, anhand derer wir die Tag-Einträge sortieren können.
Nun, wie genau soll dies umgesetzt werden? Dazu hatte ich mir folgende Strategie überlegt:
1. Lade aus Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\data\t_tag_PLANNING.txt alle Tags
2a. Wende TAGS_TO_REMOVE an
2b. Wende TAGS_TO_ADD an
3a. Für jeden Eintrag in BASE_TAG_ORDER:
  ADJUSTMENT_SCORE = [Embedding-Score zwischen diesem BASE_TAG_ORDER-Eintrag und desjenigen Tags unter den Tags mit der Höchsten Übereinstimmung, dessen Embedding-Score <0.98 (Ausschluss exakt gleichnamigr Tags)]
  Für jeden alten Embedding-Score zwischen den Tags und diesem BASE_TAG_ORDER-Eintrag: [Adjustierter Embedding-Score] = [Alter Embedding-Score]/ADJUSTMENT_SCORE
3b. Weise jeden Tag jeweils demjenigen BASE_TAG_ORDER-Eintrag zu mit dem höchsten adjustierten Embedding-Score
3c. Für jede Gruppe:
  Teile die Tags dieser Gruppe auf in 2 Untergruppen, je nachdem, ob ein Tag (nach adjustiertem Score) näher an der nächsten oder näher an der vorherigen Gruppe ist (gibt es nur 1 Nachbarn, so landen alle Tags in der Untergruppe dieses Nachbarn)
  Sortiere die Tags innerhalb dieser beiden Untergruppen nach [Embedding-Score mit der Nachbar-Gruppe]/[Embedding-Score mit DIESER Gruppe]
3d. Die finale Reihenfolge ergibt sich nun einfach, indem die Gruppen in der Reihenfolge der BASE_TAG_ORDER aneinandergehängt werden
4. Schreibe die sortierten Tags zurück in unsere Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\data\t_tag_PLANNING.txt

Bitte mach dir ausgiebig Gedanken darüber,
a) ob die von mir geschilderten (provisorischen) Ansätze soweit sinnvoll sind (passe an, wo Anpassungen sinnvoll sind) und
b) wie wir dies am besten umsetzen können
(Plan-Gate wie gehabt => Schoolsystem2\backend\src\main\resources\scripts\embedding\TASK_PLAN.md)
Sobald du mit deiner Planung zufrieden bist, darfst du gleich mit der Überarbeitung unserer Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_remove.py loslegen (wobei wir das File besser zu "tag_update.py" umbenennen sollten)
**Scope-Hash**: `05AFF94D8B8D927CE95831983B94C32370AB86C3C19F769380810C1699385823`

## Discovery
- Problem Statement: Add TAGS_TO_ADD and reorder tags by BASE_TAG_ORDER using embedding-based grouping, then write back to `t_tag_PLANNING.txt`; rename `tag_remove.py` to `tag_update.py`.
- Context & Constraints: Script currently removes tags by ID/name and reindexes; data file has `tagID,name,synonyms` columns; updates happen in-place; run-button arrays exist.
- Existing Signals: `tag_remove.py` defines TAGS_TO_REMOVE, TAGS_TO_ADD (empty), BASE_TAG_ORDER, and reindexing logic; no current embedding usage.
- Unknowns & Questions (U1): Should we preserve original tag casing in the CSV output, or normalize to lowercase as part of this script? (User mentioned lowercase in another script.) Status: deferred.
- Options:
  - A) Implement embedding ordering with fallbacks (adjustment score min 1.0) and keep tag casing as stored; only compare casefolded names. Pros: minimal data changes; Cons: casing mismatches across sources persist.
  - B) Normalize tag names to lowercase at load and write; base order also lowercased for embeddings. Pros: consistent matching/embeddings; Cons: mutates CSV casing.
Status: READY

## Planning
- Decision: Use the user-described ordering algorithm with safeguards: compute embeddings once, derive adjustment score using best match <0.98 or fallback 1.0, and keep assignment/ordering within BASE_TAG_ORDER. Keep names in CSV unchanged (casefold for matching) unless you confirm we should lower-case on write (U1).
- Impact on Scope/Steps/Checks/Risks: Rename script file, add TAGS_TO_ADD support, and embed ordering; update CLI help to reflect add/sort behavior; manual test runs before/after.
- Acceptance Criteria:
  - TAGS_TO_ADD inserts new tag rows when not already present by case-insensitive name.
  - Tags are grouped/ordered by BASE_TAG_ORDER using adjusted similarity and neighbor-ratio sorting.
  - CSV is rewritten with reindexed tagID and preserved headers.
  - Script file is renamed to `tag_update.py` and runs end-to-end.
- Test Strategy: Run script before and after via `python ...\tag_remove.py`/`tag_update.py` using the same data file; check console output and updated CSV ordering.
- Risks & preliminary Rollback: Embedding model mismatch or ordering logic produces surprising results; rollback by restoring CSV from VCS or backup and revert script rename/changes.
- Step Granularity: Steps split per file/operation and include rename plus logic changes.
Status: READY FOR APPROVAL

## Pre-Approval Checklist
- [x] Discovery: Status = READY
- [x] Planning: Status = READY
- [x] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [x] Developer Interactions section exists
- [x] Checks & Pass Criteria present & consistent
- [x] Mode & Score filled (plan-gate, score = 2)
- [x] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed)

## Implementation Steps (paths & anchors)
0) **Plan Sync:** reload `Schoolsystem2/backend/src/main/resources/scripts/embedding/TASK_PLAN.md`; scan **Developer Interactions** and apply the **Priority & Preemption Rules** (process regular queue before Step 1).
1) `Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/tag_remove.py`: rename to `tag_update.py` and update module doc/CLI text to reflect add+sort behavior.
2) `Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/tag_update.py`: implement TAGS_TO_ADD insertion (case-insensitive), keep synonyms empty for new tags unless specified.
3) `Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/tag_update.py`: add embedding-based ordering using BASE_TAG_ORDER (adjusted scores, assignment, neighbor split, and ratio-based sorting), with safety fallbacks for adjustment score.
4) `Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/tag_update.py`: update write flow to apply ordering, reindex, and print summary.
5) Final **@codex Sweep**: scan all touched/new files plus Control Paths for `@codex` comments; update **Developer Interactions** and resolve.

## Developer Interactions
- [x] Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/tag_update.py:14 - @codex note about no IDs in TAGS_TO_REMOVE; enforced and replied.

## Checks & Pass Criteria
- Manual Verification:
  - [ ] Run script before changes and capture baseline output.
  - [ ] Run updated `tag_update.py` and verify tags are added/removed and ordering changes as expected.

## Risks / Rollback
- Risk: Embedding-based ordering groups tags unexpectedly, altering CSV order.
- Rollback: restore `t_tag_PLANNING.txt` from VCS/backup and revert `tag_update.py` changes.
