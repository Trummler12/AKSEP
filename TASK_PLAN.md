# Task Plan: [AKSEP] TranscriptHQ polling modes + timing logs

## Mode & Score
Mode: plan-gate, Score: 6 (classifier: reasons touches >2 files, cross-file coupling, no tests cover changed area, estimated diff >50 LOC)

## Task Scope Paths
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/transcript_query.py
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/youtube_transcripts/transcripthq_client.py
- AKSEP/Schoolsystem2/docs/Data_Flow/YouTube_Data_API/Video_Transcripts.md
- AKSEP/TASK_PLAN.md
- AKSEP/TASK_DOCS.md

## Scope (verbatim)
Es gibt paar Probleme auf Seiten der API. Ich habe hierzu unsere Konversation in AKSEP\Schoolsystem2\docs\Data_Flow\YouTube_Data_API\Video_Transcripts.md ergänzt; Siehe vor allem die letzte Nachricht von Heyo als Hinweis darauf, was da momentan am schieflaufen ist.
Meine Idee ist nun, dass wir eine Umsetzung implementieren auf Basis seines Vorschlags, dass wir statt nach Job status/summary zu checken, dass wir anstelle dessen den Approach verwenden, den er vorgeschlagen ist, wobei ich dies gerne über eine nutzerdefinierbare Variable definieren möchte, welchen Approach wir bei einem Run verwenden wollen (den alten ODER den neuen; Jedoch mit sinnvollerer Benennung als "neu" vs. "alt"), damit wir zum Debuggen, sobald der Dev das Problem seitens API als "sollte gefixt sein" erklärt, wieder zur alten Strategie zurückgehen können.
was ich zudem ebenfalls gerne hinzufügen möchte, ist eine Terminal Response für die Zeit, die der letzte Batch gebraucht hat, bis eine Response erhalten wurde. Dies sollte uns ebenfalls wichtige Informationen geben können. Gerne möchte ich dem Terminal Debug Output so viele Informationen hinzufügen, die uns für weiteres Debugging sowohl seitens unseres Skripts als auch auf Seiten der API dienlich sein könnten.
**Scope-Hash**: `3aab28f189446c701d2b2670fa4256dc94a7bdd6ace3eae02e65ac4a3847325a`

## Discovery
- Problem Statement: Implement selectable polling strategy (summary/status vs per-video results) and add batch duration logging; expose a user-configurable toggle.
- Context & Constraints: TranscriptHQ currently has a summary counter bug; recommended approach is to poll per-video data instead of relying on job summary status. Need ability to switch back once fixed.
- Existing Signals: `transcript_query.py` always calls `transcripthq_client.wait_for_job` which returns job response; no timing metrics per batch; `transcripthq_client.py` polls by job status field.
- Unknowns & Questions (U1…Un) — Status: answered | deferred
  - U1: API endpoints for per-video polling (e.g., `/v1/transcripts/{job_id}/result` vs job summary). Status: deferred (confirm from docs/conversation).
  - U2: Which response fields signal completion for per-video results. Status: deferred.
Status: READY

## Planning
- Decision: Add a polling mode enum (e.g., `job_status` vs `video_results`) with a CLI flag and defaults at top; extend TranscriptHQ client to support both and log batch elapsed time; update debug logging with mode and batch timings.
- Impact on Scope/Steps/Checks/Risks: Update transcript_query and transcripthq_client; add docs note if needed; run a short test batch if possible.
- Acceptance Criteria:
  - User can choose polling mode via CLI and defaults.
  - Batch logs include elapsed time from submission to response.
  - Per-video polling path avoids reliance on summary/status.
- Test Strategy:
  - Run a small batch (1–5 videos) in each mode and confirm logs and response handling.
- Risks & preliminary Rollback: New polling path may mis-handle completion; rollback via `git revert <sha>`.
Status: READY FOR APPROVAL

## Pre-Approval Checklist
- [ ] Discovery: Status = READY
- [ ] Planning: Status = READY
- [ ] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [ ] Developer Interactions section exists
- [ ] Checks & Pass Criteria present & consistent
- [ ] Mode & Score filled (plan-gate, score = 6)
- [ ] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed)

## Implementation Steps (paths & anchors)
0) [x] **Plan Sync:** reload `TASK_PLAN.md`; scan **Developer Interactions** and apply **Priority & Preemption Rules**.
1) [x] `AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/youtube_transcripts/transcripthq_client.py`: add per-video result polling method and support both modes.
2) [x] `AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/transcript_query.py`: add default/CLI flag for polling mode; wire to client; measure and log batch elapsed time; enhance debug output.
3) [x] `AKSEP/Schoolsystem2/docs/Data_Flow/YouTube_Data_API/Video_Transcripts.md`: note the two polling modes and when to use each.
4) [ ] Tests: run a small batch in each mode (1–5 videos) if API available.
5) [x] Update `AKSEP/TASK_DOCS.md` with changes and test results.
6) [x] Final **@codex Sweep**: scan touched/new files plus control paths for `@codex` markers and resolve.

## Developer Interactions
- [ ] <path:line> — <short note>

## Checks & Pass Criteria
- Manual Verification:
  - [ ] Batch elapsed time is logged per submission.
  - [ ] Polling mode toggle switches behavior (job status vs per-video results).

## Risks / Rollback
- Risk: Per-video polling may not return complete results if API endpoint differs.
- Rollback: `git revert <sha>`

