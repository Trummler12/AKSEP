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

---

# Task Docs: Sanitize videos.csv for push protection

## Mode & Score
Mode: no-plan, Score: 3 (factors: >2 files, add new file)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/sanitize_youtube_csv.py: redacts secret-like query params (e.g., `AWSAccessKeyId`, `Signature`) in YouTube CSV files.
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/videos.csv: redacted AWSAccessKeyId/Signature query parameters.

## Checks & Results
- Not run (manual push attempt blocked; sanitize script executed).

## Manual Verification (if no tests)
- [ ] Re-run `rg -n "\\b(AKIA|ASIA)[0-9A-Z]{16}\\b" .../videos.csv` to confirm none remain.

## Follow-ups / Risks
- If GitHub blocks on other secret detectors, extend the sanitizer patterns.

---

# Task Docs: Auto-sanitize after video_query

## Mode & Score
Mode: no-plan, Score: 3 (factors: cross-file coupling, no tests)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: run sanitize_youtube_csv.py after finishing channel processing.

## Checks & Results
- Not run (will be exercised during the next full video_query run).

## Manual Verification (if no tests)
- [ ] Run `video_query.py` and confirm sanitize step runs at the end.

## Follow-ups / Risks
- None noted.

---

# Task Docs: Expanded resource flow planning

## Mode & Score
Mode: plan-gate, Score: 4 (factors: >2 files, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/docs/Data_Flow/Data_Flow.md: expanded `##### More Detailed Data Flow Description` with prep/update/final phases, course flag reconciliation, and sanitize step.
- AKSEP/TASK_PLAN.md: status updates for plan execution.

## Checks & Results
- Not run (docs-only planning update).

## Manual Verification (if no tests)
- [ ] Re-read detailed flow section to confirm it mirrors the expanded prompt and keeps compact minimal.

## Follow-ups / Risks
- If any prep/update steps are later deemed too heavy, simplify the detailed flow before coding.

---

# Task Docs: Video query Phase 2 (prep helpers + tests)

## Mode & Score
Mode: plan-gate, Score: 6 (factors: >2 files, cross-file coupling, no tests cover area, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/prep.py: helper functions for prep ordering, pruning, course flag reconciliation, and t_source ordering.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/__init__.py: helper package marker.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: prep phase added, configurable `--data-root`, updated update-phase logic (placeholder rows, block replacement for videos, playlist removal), and data-root-aware sanitization/t_source update.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/testing/test_prep_helpers.py: unit tests for prep helpers.
- AKSEP/TASK_PLAN.md: step completion + @codex sweep entries.

## Checks & Results
- test: `python -m unittest discover -s Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/testing -p "test_*.py"` => OK
- manual: `video_query.py --data-root .../testing/data --channel-limit 1 --video-page-limit 1 --playlist-page-limit 1` => OK (prep logs + CSV write)
- manual: `video_query.py --data-root .../testing/data --prep-only` => OK (t_source rows preserved; no API)

## Manual Verification (if no tests)
- [ ] Run `video_query.py --data-root .../testing/data` and confirm prep logs show expected removals/reorders.

## Follow-ups / Risks
- Prep phase currently skips reordering empty `t_source_OLD.csv` and `audiotracks.csv`; verify behavior is acceptable if files are empty.

---

# Task Docs: Prep t_source retention toggle

## Mode & Score
Mode: plan-gate, Score: 6 (factors: >2 files, cross-file coupling, no tests cover area, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/prep.py: `reorder_t_source(..., keep_unmatched=...)` keeps unknown refs at the bottom.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: adds `--prep-clean-source` (default false) and `--prep-only`, wiring the t_source retention toggle.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/testing/test_prep_helpers.py: added keep-unmatched test case.

## Checks & Results
- test: `python -m unittest discover -s Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/testing -p "test_*.py"` => OK
- manual: `video_query.py --data-root .../testing/data --prep-only` => OK (t_source rows preserved)
- manual: `video_query.py --data-root .../testing/data --channel-limit 1 --video-page-limit 1 --playlist-page-limit 1` => OK

## Manual Verification (if no tests)
- [ ] Spot-check `testing/data/t_source_OLD.csv` to confirm unmatched entries are retained and moved to bottom.

## Follow-ups / Risks
- Deletion of tracked `__pycache__/audiotrack_query.cpython-314.pyc` remains staged; decide whether to keep or restore.

---

# Task Docs: Tighten sanitizer patterns

## Mode & Score
Mode: no-plan, Score: 1 (factors: single-file script)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/sanitize_youtube_csv.py: tighten AWSAccessKeyId/Signature regexes and sanitize line-by-line to preserve line breaks.

## Checks & Results
- Sanitizer re-run after restore (no tests).

## Manual Verification (if no tests)
- [ ] Confirm entries around the previously affected lines keep their line breaks.

## Follow-ups / Risks
- If push protection flags new patterns, extend the sanitizer.

---

# Task Docs: video_query per-channel update logging

## Mode & Score
Mode: plan-gate, Score: 4 (factors: >2 files, cross-file coupling)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: track per-channel changes and print a concise summary only when updates occur.
- AKSEP/TASK_PLAN.md: step completion tracking and @codex sweep notes.

## Checks & Results
- manual: `video_query.py --data-root .../testing/data --channel-limit 1 --video-page-limit 1 --playlist-page-limit 1` => OK (summary printed when changes occurred)

## Manual Verification (if no tests)
- [ ] Run `video_query.py --data-root .../testing/data --channel-limit 1` and confirm no output when nothing changes.

## Follow-ups / Risks
- If any update type is missing from summaries, add it to the change counters.

---

# Task Docs: Colored update summaries for video_query

## Mode & Score
Mode: no-plan, Score: 1 (factors: single file change)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: add ANSI-colored summaries for update counts with `--no-color` opt-out and NO_COLOR support.

## Checks & Results
- Not run (color output not validated in terminal).

## Manual Verification (if no tests)
- [ ] Run `video_query.py --data-root .../testing/data --channel-limit 1` and confirm colored summary output.

## Follow-ups / Risks
- Some terminals may not render ANSI colors; use `--no-color` or `NO_COLOR=1`.

---

# Task Docs: video_query data-root guard + prep colors

## Mode & Score
Mode: plan-gate, Score: 5 (factors: >2 files, cross-file coupling, no tests cover area)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: validate `--data-root` (must exist and contain `_YouTube_Channels.csv`) to avoid writing CSVs in unintended locations.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: add colored prep-phase markers for `removed`, `reordered`, and `course_flags_updated`.
- AKSEP/TASK_PLAN.md: step completion tracking and @codex sweep notes.

## Checks & Results
- manual: `video_query.py --data-root .../testing/data --prep-only` => OK (prep logs emitted; no run error)

## Manual Verification (if no tests)
- [ ] Run `video_query.py --data-root .../testing/data --prep-only` in an interactive terminal to confirm colored prep markers.

## Follow-ups / Risks
- Data-root guard will refuse fresh empty directories; create the CSV set before running with a new location.

---

# Task Docs: video_query update summary accuracy

## Mode & Score
Mode: plan-gate, Score: 4 (factors: >2 files, cross-file coupling)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: fix localization change detection to avoid inflating update counts; include per-channel totals in summary.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: normalize playlist `item_count` to string so unchanged playlists are not reprocessed.
- AKSEP/TASK_PLAN.md: step completion tracking and @codex sweep notes.

## Checks & Results
- manual: `video_query.py --data-root .../testing/data --channel-limit 1 --video-page-limit 1 --playlist-page-limit 1` => OK (no unexpected playlist updates)

## Manual Verification (if no tests)
- [ ] Run a single-channel update and confirm summary counts align with actual changes.

## Follow-ups / Risks
- If other fields still cause false playlist changes, compare the per-field diffs and normalize types.

---

# Task Docs: Pre-fill channel_id in _YouTube_Channels.csv

## Mode & Score
Mode: plan-gate, Score: 4 (factors: >2 files, cross-file coupling)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: add a pre-prep step to backfill missing or mismatched `channel_id` entries in `_YouTube_Channels.csv` using low-quota `channels.list` calls (`forHandle` / `forUsername`) and existing `channels.csv` matches.
- AKSEP/TASK_PLAN.md: step completion tracking and @codex sweep notes.

## Checks & Results
- manual: `video_query.py --data-root .../testing/data --prep-only` => OK (backfill summary printed; prep completes)

## Manual Verification (if no tests)
- [ ] Confirm `_YouTube_Channels.csv` gained channel_id values after prep-only run.

## Follow-ups / Risks
- If `forUsername` yields incorrect IDs for legacy custom URLs, consider disabling that path.

---

# Task Docs: video_query CLI quick reference

## Mode & Score
Mode: no-plan, Score: 1 (factors: single file, doc comment)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: added a short CLI argument reference block with the base command.

## Checks & Results
- Not run (docs-only change).

## Manual Verification (if no tests)
- [ ] Skim the top of `video_query.py` to confirm all supported flags are listed.

## Follow-ups / Risks
- Keep the list in sync if new flags are added.

---

# Task Docs: video_query safe CSV write fallback

## Mode & Score
Mode: no-plan, Score: 1 (factors: single file change)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: write CSVs via temp file fallback on Windows `Errno 22` to avoid invalid-argument write failures.

## Checks & Results
- manual: `video_query.py` run aborted by user (no full completion).

## Manual Verification (if no tests)
- [ ] Run `video_query.py` without args and confirm no `Errno 22` on CSV writes.

## Follow-ups / Risks
- If the error persists, check for external file locks (e.g., CSV open in another editor).

---

# Task Docs: Restructure YouTube channels taxonomy

## Mode & Score
Mode: no-plan, Score: 2 (factors: estimated diff >50 LOC, no tests cover data file)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/Educational YouTube Channels (Responses) - Approved Channels.csv: rebuilt H1/H2/H3 structure, added placeholder subtopics for uncovered disciplines, and reassigned channels using public channel descriptions.

## Checks & Results
- Not run (data-only edit).

## Manual Verification (if no tests)
- [ ] Open the CSV and confirm each channel is under the intended H2/H3 and the Primary Topic order matches the rules.

## Follow-ups / Risks
- AGENTS.md reality check: missing map paths (projects/AKSEP, projects/AKSEP-ALT, projects/schoolsystem_DB, docs/index.html).

---

# Task Docs: Recheck channel placements

## Mode & Score
Mode: no-plan, Score: 1 (factors: single file, no tests cover data file)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/Educational YouTube Channels (Responses) - Approved Channels.csv: adjusted placements for broad channels (umbrella vs primary vs subtopic), moved Daedalus Community to broad CS, moved Emergent Garden to Algorithms/Simulation, moved Atlas Pro + Henry the PaleoGuy under Natural Sciences umbrella, and shifted Jackson Crawford to Historical Linguistics.

## Checks & Results
- Not run (data-only edit).

## Manual Verification (if no tests)
- [ ] Spot-check the moved channels and confirm they align with the breadth rules for umbrella/primary/subtopic.
