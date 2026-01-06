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

# Task Docs: Tighten sanitizer double-redaction guard

## Mode & Score
Mode: no-plan, Score: 1 (factors: single file)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/sanitize_youtube_csv.py: avoid re-redacting already redacted values and stop Signature replacement at `&`/whitespace.

## Checks & Results
- Not run (pattern change only).

## Manual Verification (if no tests)
- [ ] Re-run `sanitize_youtube_csv.py` on a sample CSV and confirm `Signature=REDACTED` stays unchanged.

## Follow-ups / Risks
- If signatures contain spaces (unexpected), adjust the delimiter class.

---

# Task Docs: Stable ordering for localizations

## Mode & Score
Mode: no-plan, Score: 1 (factors: single file)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: order `channels_local`, `videos_local`, and `playlists_local` rows using channel/video/playlist order instead of lexicographic IDs.

## Checks & Results
- Not run (ordering logic change only).

## Manual Verification (if no tests)
- [ ] Run `video_query.py` and confirm new local rows remain in channel/playlist/video order after prep.

## Follow-ups / Risks
- None noted.

---

# Task Docs: MyOnlineTrainingHub ordering regression test

## Mode & Score
Mode: plan-gate, Score: 6 (factors: >2 files, cross-file coupling, no tests cover area, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/_YouTube_Channels.csv: temporarily removed and re-added the MyOnlineTrainingHub entry for the regression test.
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/channels.csv: updated after re-adding the channel.
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/videos.csv: updated after re-adding the channel; sanitizer redacted one Signature occurrence.
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/videos_local.csv: updated for the re-added channel’s localizations.
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/playlists.csv: updated for the re-added channel’s playlists.
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/playlistItems.csv: updated for the re-added channel’s playlist items.
- AKSEP/TASK_PLAN.md: step completion tracking and @codex sweep notes.

## Checks & Results
- manual: `video_query.py --prep-only` => OK (prep removed the channel’s rows)
- manual: `video_query.py` => OK (full run completed; updates applied)

## Manual Verification (if no tests)
- [ ] Spot-check `channels_local.csv`, `videos_local.csv`, and `playlists_local.csv` ordering after the re-add.

## Follow-ups / Risks
- Git reported LF→CRLF warnings for some CSVs; consider normalizing line endings if needed.

---

# Task Docs: Document video_query quota profile

## Mode & Score
Mode: no-plan, Score: 1 (factors: docs-only)

## Changes
- AKSEP/Schoolsystem2/docs/Data_Flow/YouTube_Data_Quota.md: added a section summarizing current `video_query.py` quota cost drivers and scaling.

## Checks & Results
- Not run (docs-only update).

## Manual Verification (if no tests)
- [ ] Review the new section for alignment with the current script call pattern.

## Follow-ups / Risks
- If `video_query.py` adds/removes endpoints, update the cost summary.

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

---

# Task Docs: Transcript query parity review

## Mode & Score
Mode: plan-gate, Score: 6 (factors: >2 files, cross-file coupling, no tests cover area, estimated diff >50 LOC)

## Changes
- No code changes; reviewed current TranscriptHQ implementation against the original plan.

## Checks & Results
- Not run (analysis only).

## Manual Verification (if no tests)
- [ ] Decide whether to adjust defaults (batch size / max total batch size) based on the gap analysis.

## Follow-ups / Risks
- Default DEFAULT_BATCH_SIZE=100 differs from early test expectation of batch size 1; consider whether to make test defaults smaller or keep scale defaults.

---

# Task Docs: Transcript whitelist default + ordering

## Mode & Score
Mode: plan-gate, Score: 6 (factors: >2 files, cross-file coupling, no tests cover area, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/transcript_query.py: add DEFAULT_WHITELIST_VIDEOS_IN_PLAYLISTS=true with BooleanOptionalAction flag; write transcripts in videos.csv order via ordered upsert.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/youtube_transcripts/csv_utils.py: add ordered upsert utilities for transcript rows.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/prep.py: add videos_transcripts ordering helper.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: order videos_transcripts in prep and ignore extra fields during CSV writes.

## Checks & Results
- transcript_query: python .../transcript_query.py --max-total-batch-size 1 --batch-size 1 --video-ids i2ZDbHKIW_E => OK (playlist whitelist loaded; warned ID not found in videos.csv).
- prep-only: python .../video_query.py --prep-only => OK (videos_transcripts prep runs).

## Manual Verification (if no tests)
- [ ] Run transcript_query with a known video_id from videos.csv to confirm ordered upsert.

## Follow-ups / Risks
- Prep removed many audiotracks rows; verify if expected before committing data changes.

---

# Task Docs: Preserve videos_transcripts headers in prep

## Mode & Score
Mode: plan-gate, Score: 6 (factors: >2 files, cross-file coupling, no tests cover area, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: use the on-disk videos_transcripts.csv header when reordering; warn if it differs from defaults; error if required header missing.

## Checks & Results
- prep-only: python .../video_query.py --prep-only => OK (warning emitted when header differs from defaults).

## Manual Verification (if no tests)
- [ ] Confirm videos_transcripts.csv keeps all columns after prep.

## Follow-ups / Risks
- If the header mismatch warning is expected, update CSV_HEADERS to match the new column set.

---

# Task Docs: Support single-video ingestion

## Mode & Score
Mode: plan-gate, Score: 6 (factors: >2 files, cross-file coupling, no tests cover area, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/_YouTube_Videos.csv: sorted by published date and normalized names with release year before language.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: add _YouTube_Videos.csv ingestion after channel processing; append new video/channel rows at end; include localizations and channel placeholders.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: extend prep to keep channels referenced in videos.csv even if not in _YouTube_Channels.csv.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/prep.py: include channels from videos.csv when building channel order in prep.

## Checks & Results
- prep-only: python .../video_query.py --prep-only => OK.

## Manual Verification (if no tests)
- [ ] Run video_query end-to-end to confirm single-video rows append to bottom and channel placeholders are filled by final channel refresh.

## Follow-ups / Risks
- Single-video ingestion still uses API calls even if channel already in _YouTube_Channels.csv (video metadata is fetched before filtering).

---

# Task Docs: Single-video channel IDs + video_query refactor

## Mode & Score
Mode: plan-gate, Score: 6 (factors: >2 files, cross-file coupling, no tests cover area, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: refactored into a small orchestrator; added early `_YouTube_Videos.csv` channel_id prefetch/cache, extended channel order, and kept single-video ingestion after channel processing.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/channel_processing.py: extracted channel loop; delegates playlist work; preserves update summaries.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/playlist_processing.py: new helper for playlist + playlistItems fetching and writes.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/single_video.py: resolves single-video channel_id values and caches video responses for reuse.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/prep_phase.py: prep ordering now accepts single-video channel IDs; keeps t_source update call.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/{constants.py,csv_io.py,env_utils.py,http_utils.py,normalize.py,utils.py,summary.py,sanitizer.py,course.py}: new helper modules to keep each file <= 500 LOC.

## Checks & Results
- prep-only: `python .../video_query.py --data-root .../testing/data --prep-only` => OK (chunk fb1c7d)
- limited: `python .../video_query.py --data-root .../testing/data --channel-limit 1 --video-page-limit 1 --playlist-page-limit 1` => OK (chunk 7c726f)

## Manual Verification (if no tests)
- [ ] Confirm `_YouTube_Videos.csv` channel_id values are filled in the main CSV set (testing data did not include this file).
- [ ] Confirm channels from `_YouTube_Videos.csv` appear after source channels in `channels.csv` ordering.
- [ ] Confirm single-video ingestion appends videos/localizations at the bottom when `_YouTube_Videos.csv` contains IDs not in `videos.csv`.

## Follow-ups / Risks
- If playlist localizations are written twice (playlist helper + channel loop), consider removing the redundant write for clarity.

---

# Task Docs: Move video_query defaults back to root

## Mode & Score
Mode: plan-gate, Score: 6 (factors: >2 files, cross-file coupling, no tests cover area, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py: restored API/ANSI/CSV header defaults at top-level; wired config setters and passed `CSV_HEADERS` into prep/CSV init.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/http_utils.py: added `set_api_base` and local API base default.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/summary.py: added `set_ansi_colors` and local ANSI defaults.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/csv_io.py: `ensure_csvs` now accepts `csv_headers`.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/prep_phase.py: added `set_prep_colors`, accepts `csv_headers`, removed constants import.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query_helpers/constants.py: removed (no longer needed).

## Checks & Results
- prep-only: `python .../video_query.py --prep-only` => OK (chunk d2eb18)
- full run: `python .../video_query.py` => OK (chunk 4dbd64)

## Manual Verification (if no tests)
- [ ] Review any large CSV diffs to confirm only expected channel/video updates are present.

## Follow-ups / Risks
- None noted.

---

# Task Docs: Transcript query debug stats

## Mode & Score
Mode: no-plan, Score: 1 (factors: single-file change)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/transcript_query.py: expanded playlist whitelist and duration debug output with unique counts, in-videos totals, and eligibility stats.

## Checks & Results
- Not run (logging-only change).

## Manual Verification (if no tests)
- [ ] Run `transcript_query.py` and confirm the new INFO lines show unique playlist IDs, in-videos counts, duration buckets, and eligible totals.

## Follow-ups / Risks
- None noted.

---

# Task Docs: Transcript debug test runs

## Mode & Score
Mode: no-plan, Score: 1 (factors: single-file logging tests)

## Changes
- No code changes beyond DEFAULT_MIN_DURATION toggles for test runs (restored to 10m).

## Checks & Results
- transcript_query @ 3m: INFO counts logged (chunk 2c6724); batch submission started; run interrupted.
- transcript_query @ 30m: INFO counts logged (chunk eb74f2); batch submission started; run interrupted.
- transcript_query @ 10m: INFO counts logged (chunk 7afeb5); batch submission started; run interrupted.

## Manual Verification (if no tests)
- [ ] Optional: run `transcript_query.py` with `--max-total-batch-size 1` to avoid long polls while inspecting logs.

## Follow-ups / Risks
- Interrupts were manual to avoid long TranscriptHQ polling; no data validation performed beyond log output.

---

# Task Docs: TranscriptHQ skip-metadata check + error pruning

## Mode & Score
Mode: no-plan, Score: 1 (factors: single-file change)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/transcript_query.py: set DEFAULT_MAX_TOTAL_BATCH_SIZE back to 5, add startup log for skip_metadata/native_only, and prune `transcripthq_error` rows before selecting candidates.

## Checks & Results
- Not run (logic-only change).

## Manual Verification (if no tests)
- [ ] Run `transcript_query.py` and confirm the startup log prints skip_metadata/native_only, and that transcripthq_error rows are removed before counting existing transcripts.

## Follow-ups / Risks
- If batch-level TranscriptHQ errors persist, the API may be rejecting the entire job (HTTP error), which still maps to `transcripthq_error` for all videos.

---

# Task Docs: Remove TranscriptHQ timeouts

## Mode & Score
Mode: no-plan, Score: 3 (factors: cross-file coupling, no tests cover area)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/youtube_transcripts/transcripthq_client.py: allow no timeout for API calls and disable wait timeout when unset/zero.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/transcript_query.py: set DEFAULT_POLL_TIMEOUT=0 (no timeout by default).

## Checks & Results
- Not run (behavior change only).

## Manual Verification (if no tests)
- [ ] Run `transcript_query.py` and confirm polling continues without timing out.

## Follow-ups / Risks
- If the API hangs indefinitely, consider reintroducing a large timeout or manual interrupt handling.

---

# Task Docs: TranscriptHQ polling modes + batch timing

## Mode & Score
Mode: plan-gate, Score: 6 (factors: >2 files, cross-file coupling, no tests cover area, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/youtube_transcripts/transcripthq_client.py: added per-video polling (`wait_for_job_by_videos`) and helpers to evaluate terminal per-video statuses.
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/transcript_query.py: added `DEFAULT_POLLING_MODE` + `--polling-mode`, batch elapsed-time logging, per-batch status summary, and passed polling mode into the request flow.
- AKSEP/Schoolsystem2/docs/Data_Flow/YouTube_Data_API/Video_Transcripts.md: noted summary counter issue and per-video polling recommendation.

## Checks & Results
- Not run (behavior change only).

## Manual Verification (if no tests)
- [ ] Run a small batch with `--polling-mode video_results` and confirm completion without relying on summary status.
- [ ] Run a small batch with `--polling-mode job_status` to verify legacy path still works.

## Follow-ups / Risks
- If TranscriptHQ changes response schema, update terminal status mapping in `wait_for_job_by_videos`.

---

# Task Docs: Sort video transcripts by topic complexity

## Mode & Score
Mode: no-plan, Score: 1 (factors: single file, estimated diff >50 LOC)

## Changes
- AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/testing/data/videos_transcripts.csv: reordered rows by estimated reading-grade complexity (Flesch-Kincaid heuristic on transcript text).

## Checks & Results
- Not run (data reorder only).

## Manual Verification (if no tests)
- [ ] Spot-check the first and last 5 rows to confirm simpler topics appear near the top and more technical topics near the bottom.

## Follow-ups / Risks
- Reality check: AGENTS.md map entries missing at repo root: projects/AKSEP, projects/AKSEP-ALT, projects/schoolsystem_DB, docs/index.html.
