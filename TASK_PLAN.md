# Task Plan: [AKSEP] prefill channel_id in _YouTube_Channels

## Mode & Score
Mode: plan-gate, Score: 4 (classifier: reasons touches >2 files, cross-file coupling)

## Task Scope Paths
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/**
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/_YouTube_Channels.csv
- AKSEP/TASK_PLAN.md
- AKSEP/TASK_DOCS.md

## Scope (verbatim)
Und was ich mir auch überlegt habe: wir haben ja in AKSEP\Schoolsystem2\backend\src\main\resources\csv\youtube\_YouTube_Channels.csv unsere initiale Sammlung aller YouTube-Kanäle, die wir abarbeiten lassen wollen;
Aber ist es nun nicht so, dass wenn wir provisorisch Einträge erstellen, nur mit Kanalnamen und Custom-URL, dass es dann gar nicht möglich ist, die Daten der Channels und was hinter den Channels liegt, Quota-günstig ziehen zu können? Weil Quota-günstig wäre es ja, wenn wir die Daten auf Basis der Channel-IDs uns ziehen wollen. Und Queries über Search kostet ja ungemein viel mehr als Suchen über die IDs. Dies ist zwar nur eine Vermutung, aber falls es tatsächlich so ist, dass wenn ein Channel neu ist und wir in unserer Channels.csv dann keine Channel-ID vorliegen haben, sondern nur Custom-URL und Name, dann wäre dies vermutlich nicht allzu intelligent für das weitere *möglichst quota-effiziente* Vorgehen.
Und an dieser Stelle kam mir folgende Gedanke: Wir könnten den Beginn der Vorbereitungsphase erweitern damit, dass für jeden Channel-Datensatz in unserer AKSEP\Schoolsystem2\backend\src\main\resources\csv\youtube\_YouTube_Channels.csv geschaut wird:
1. Prüfe:
  a) ist eine channel_id angegeben?
  b) Stimmt die channel_id mit der channel_id in der channels.csv überein?
2. Falls a oder spätestens b falsch ist: Merke dir diesen Eintrag; Gehe zum nächsten Eintrag.
3. Alle noch nicht mit einer gültigen channel_id versehenen Einträge werden per API-Call mit einer entsprechenden channel_id versehen (Suche bitte nach der Quota-günstigsten Möglichkeit, dies zu bewerkstelligen)
4. (bestehende Vorbereitungsphase)
5. (Update-Phase, in welcher nun auch eine gültige channel_id in den provisorischen Datensätzen unserer channels.csv landen)
**Scope-Hash**: `6f3f1e2b8c6a4d6b9cc8f0b2f5f4a73a1b3fbcaf30eaa41d1828a0a43b8b63b7`

## Discovery
- Problem Statement: Ensure _YouTube_Channels.csv entries have valid channel_id to avoid expensive search calls; fill missing/invalid IDs early.
- Context & Constraints: Prefer quota-cheap API calls (channels.list by forHandle/handle or username) over search.list.
- Existing Signals: video_query currently resolves handles on-the-fly per channel; prep phase does not validate or backfill _YouTube_Channels.csv.
- Unknowns & Questions (U1…Un) — Status: answered | deferred
  - U1: Best low-quota API path for resolving channel_id from handle/custom URL? Status: deferred.
Status: READY

## Planning
- Decision: Add a prep step to resolve missing/invalid channel_id in _YouTube_Channels.csv using cheapest available API (channels.list with forHandle where possible) and update the CSV before the existing prep phase.
- Acceptance Criteria:
  - Missing/invalid channel_id values are filled when possible.
  - No search.list usage is introduced.
- Test Strategy: Run prep-only on testing data and confirm _YouTube_Channels.csv gains channel_id where missing.
- Risks & preliminary Rollback: If handle resolution fails, entries remain unchanged; rollback by restoring CSV from backup.
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
0) [x] **Plan Sync:** reload `TASK_PLAN.md`; scan **Developer Interactions** and apply the **Priority & Preemption Rules**.
1) [x] `AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py`: add a pre-prep step that validates/backfills channel_id in `_YouTube_Channels.csv` using quota-cheap API calls (no search.list).
2) [x] `AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py`: update logging to note how many channel_ids were backfilled.
3) [x] Run `video_query.py --data-root .../testing/data --prep-only` and confirm channel_id backfill behavior.
4) [x] Update `AKSEP/TASK_DOCS.md` with changes and results.
5) [x] Final **@codex Sweep**: scan touched/new files plus control paths for `@codex` markers and resolve.

## Developer Interactions
- [x] AGENTS.md:42 - @codex mentions are policy text; no action required.
- [x] AKSEP/TASK_PLAN.md:41 - @codex mention in checklist; no action required.
- [x] AKSEP/TASK_DOCS.md:148 - @codex mention in changelog; no action required.

## Checks & Pass Criteria
- Manual Verification:
  - [x] Missing channel_id values are filled when possible.

## Risks / Rollback
- Risk: Incorrect ID resolution from ambiguous handles.
- Rollback: `git revert <sha>`

