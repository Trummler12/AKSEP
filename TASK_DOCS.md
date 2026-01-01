# Task Docs: Resource-related data flow review

## Mode & Score
Mode: plan-gate, Score: 4 (factors: >2 files, cross-file coupling, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/docs/Data_Flow/Data_Flow.md: align resource-related compact and detailed flows; clarify `_YouTube_Courses.txt`, add explicit audio-tracks step, and collapse duplicate transcript sections.
- AKSEP/TASK_PLAN.md: discovery/planning updates and step completion tracking.

## Checks & Results
- Not run (docs-only review).

## Manual Verification (if no tests)
- [ ] Re-read compact vs detailed flows to ensure no required step was removed.

## Follow-ups / Risks
- Removing duplicate sections could hide a nuance; call out any missing dependency if spotted later.

---

# Task Docs: Compact vs Detailed Resource Flow balance

## Mode & Score
Mode: no-plan, Score: 1 (factors: single file, docs-only)

## Changes
- AKSEP/Schoolsystem2/docs/Data_Flow/Data_Flow.md: moved detailed `video_to_source.py` steps from compact to detailed flow to keep compact minimal.

## Checks & Results
- Not run (docs-only update).

## Manual Verification (if no tests)
- [ ] Re-scan both resource flow sections for consistent step order and completeness.

## Follow-ups / Risks
- None noted.

---

# Task Docs: Build t_source_PLANNING from audiotracks

## Mode & Score
Mode: no-plan, Score: 1 (factors: single-file script, no tests)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/t_source_planning_update.py: rebuilds `t_source_PLANNING.csv` from `t_source_OLD.csv` with `dubbed` and `ai_dubbed` derived from `audiotracks.csv`.

## Checks & Results
- Not run (manual script execution not requested).

## Manual Verification (if no tests)
- [ ] Run `python AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/t_source_planning_update.py` and confirm `t_source_PLANNING.csv` includes `dubbed` and `ai_dubbed`.

## Follow-ups / Risks
- None noted.

---

# Task Docs: Move sa_resource to last column

## Mode & Score
Mode: no-plan, Score: 1 (factors: single-file script, docs-only outputs)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/t_source_planning_update.py: outputs `sa_resource` as the final column.
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/t_source_PLANNING.csv: regenerated with new column order.

## Checks & Results
- Not run (script executed to regenerate output).

## Manual Verification (if no tests)
- [ ] Confirm `t_source_PLANNING.csv` header ends with `sa_resource`.

## Follow-ups / Risks
- None noted.
