# Task Docs: TranscriptHQ Discord response (discovery)

## Mode & Score
Mode: plan-gate, Score: 6 (factors: touches >2 files, cross-file coupling, no tests cover changed area, estimated diff >50 LOC)

## Discovery-20260103c
- Discord reply confirms: request flag `native_only` (true for native captions only); response fields `language`, `isNative`, `isGenerated`, `error`, `status`, `transcript`.
- `language` returns `whisper` when Whisper was used; `isGenerated` is null for Whisper; `isNative` false for Whisper, true for YouTube captions.
- Full response schema is an object keyed by video_id (per Discord example).

# Task Docs: TranscriptHQ Discord insights (discovery)

## Mode & Score
Mode: plan-gate, Score: 6 (factors: touches >2 files, cross-file coupling, no tests cover changed area, estimated diff >50 LOC)

## Discovery-20260103b
- Discord convo added under `## Discord Coversation with TranscriptsHQ Dev` (line ~602) in `resources/docs/Data_Flow/YouTube_Data_API/Video_Transcripts.md`.
- Key points: use `skip_metadata: true` for fast job creation; no hard batch max, recommended 100-200 per job; business tier allows 5 concurrent jobs and 500 req/min; Whisper auto-transcribes when no captions; shorts often have no spoken content.

# Task Docs: TranscriptHQ evaluation + test-phase transcript ingestion (planning)

## Mode & Score
Mode: plan-gate, Score: 6 (factors: touches >2 files, cross-file coupling, no tests cover changed area, adds >1 new file)

## Discovery-20260103
- Local files: `resources/scripts/transcript_query.py` is empty; `resources/scripts/youtube_transcripts/` missing; `resources/csv/youtube/videos_transcripts.csv` header has transcript as last column.
- CSV schema: `resources/csv/youtube/videos.csv` contains duration/default language fields; `resources/csv/youtube/playlistItems.csv` includes `video_id` for playlist whitelist checks.
- Docs baseline: Evaluation section starts around line ~601 in `resources/docs/Data_Flow/YouTube_Data_API/Video_Transcripts.md` and currently lists legacy providers.
- Web research: TranscriptHQ quickstart docs via https://r.jina.ai/http://transcripthq.io/docs (API endpoint `https://api.transcripthq.io/v1/transcripts`, header `X-API-Key`, async job + poll, batch supported, optional `noise_reduction`, `target_language`, `word_timestamps`).
- Reality check: AGENTS.md map entries are missing in this repo scope (M293-HTML, AKSEP, etc.); not modified.

# Task Docs: Transcript fallback fixes + provider verification

## Mode & Score
Mode: plan-gate, Score: 4 (factors: touches >2 files, cross-file coupling, no tests cover changed area, estimated diff >50 LOC)

## Changes
- resources/scripts/transcript_query.py: enforced strict 2D traversal (no re-call per video), added error_type logging, and reset output when input is exhausted; ASR now has an optional final stage when configured.
- resources/scripts/youtube_transcripts/common.py: added blocking-result helper.
- resources/scripts/youtube_transcripts/provider_asr.py: added optional external ASR fallback (config via `TRANSCRIPT_ASR_COMMAND`).
- resources/scripts/youtube_transcripts/provider_youtube_transcript_api.py: added language-prefix matching and default transcript fallback; hardened imports for varying exception availability.
- resources/scripts/youtube_transcripts/provider_yt_dlp.py: added language-prefix matching for subtitles.
- resources/docs/Data_Flow/YouTube_Data_API/Video_Transcripts.md: updated evaluation with default transcript selection behavior, provider notes, and ASR fallback placement.

## Checks & Results
- Provider test (youtube-transcript-api, 3 safe IDs) => `rate_limited` / blocking for all three (error `rate_limited_or_blocked`).
- Provider test (yt-dlp, 3 safe IDs) => `rate_limited` / blocking for all three (HTTP 429).
- Provider test (asr) => `error` / `asr_command_not_configured` (expected without env config).
- transcript_query.py traversal test:
  - `--limit 3 --no-wait` timed out in the harness but logged primary-blocked -> stage2 progression.
  - `--limit 1 --no-wait` completed; logs show stage1 blocked -> stage2 blocked -> error row appended.

## Manual Verification
- [ ] Run `python resources/scripts/transcript_query.py --limit 1 --log-level INFO` and verify stage transition logs.
- [ ] If rate limits clear, run `python resources/scripts/transcript_query.py --limit 10` and verify rows append to `resources/csv/youtube/videos_transcripts.csv`.

## Follow-ups / Risks
- Unofficial endpoints may break or trigger IP blocks; consider proxy support if volume increases.
- Reality check: AGENTS.md map entries (M293-HTML, AKSEP, etc.) not present in this sub-repo; assumed expected for scoped folder.

# Task Docs: CSV transcript column order fix

## Mode & Score
Mode: no-plan, Score: 1 (factors: estimated diff >50 LOC)

## Changes
- resources/csv/youtube/videos_transcripts.csv: moved status/error fields before transcript to match header order.

## Checks & Results
- Not run (data-only change).

## Manual Verification
- [ ] Open `resources/csv/youtube/videos_transcripts.csv` and confirm status/error appear before transcript in each row.
- [ ] Spot-check a few rows to ensure transcript text is intact.

# Task Docs: TranscriptHQ evaluation + test-phase transcript ingestion

## Mode & Score
Mode: plan-gate, Score: 6 (factors: touches >2 files, cross-file coupling, no tests cover changed area, adds >1 new file)

## Changes
- resources/docs/Data_Flow/YouTube_Data_API/Video_Transcripts.md: replaced Evaluation with TranscriptHQ-focused findings and sources.
- resources/scripts/youtube_transcripts/__init__.py: added package marker for helper modules.
- resources/scripts/youtube_transcripts/transcripthq_client.py: added stdlib client for TranscriptHQ job creation and polling.
- resources/scripts/youtube_transcripts/csv_utils.py: added CSV helpers for duration parsing and transcript row appends.
- resources/scripts/transcript_query.py: implemented batch/limit/filter logic and TranscriptHQ ingestion flow.

## Checks & Results
- Not run (manual verification listed below).

## Manual Verification
- [ ] Run `python resources/scripts/transcript_query.py --batch-size 1 --max-total-batch-size 3 --video-ids <id1>,<id2>` and confirm rows append to `resources/csv/youtube/videos_transcripts.csv` with transcript last.

## Follow-ups / Risks
- TranscriptHQ docs do not state batch limits or full error taxonomy; adjust polling/backoff and error mapping after first test runs.
- Sources: https://transcripthq.io/docs, https://developers.google.com/youtube/v3/docs/captions/download
# Task Docs: TranscriptHQ test defaults + missing transcript handling note

## Mode & Score
Mode: no-plan, Score: 1 (factors: single-file change, no tests cover changed area)

## Changes
- resources/scripts/transcript_query.py: set default `--max-total-batch-size` to 1 for early test runs (batch size per API call remains 100).
- resources/scripts/transcript_query.py: moved user-adjustable defaults to top-level constants per @codex note.
- resources/scripts/transcript_query.py: normalize transcript newlines to spaces before CSV write.
- resources/scripts/youtube_transcripts/transcripthq_client.py: treat socket timeouts as TranscriptHQ errors.
- resources/scripts/transcript_query.py: add `--skip-metadata` flag (default true) and pass option to TranscriptHQ.
- resources/docs/Data_Flow/YouTube_Data_API/Video_Transcripts.md: added Discord-derived actionable notes (skip_metadata, batch size guidance, tier limits, Whisper fallback).

## Checks & Results
- Ran `python resources/scripts/transcript_query.py --batch-size 1 --max-total-batch-size 1` => success, appended 1 transcript with newline-free content.
- Ran `python resources/scripts/transcript_query.py --batch-size 1 --max-total-batch-size 2 --video-ids i2ZDbHKIW_E,Kzfbj99KN7A` => success, both returned status ok with non-empty transcripts.
- Ran `python resources/scripts/transcript_query.py --batch-size 1 --max-total-batch-size 5 --video-ids DG7k-Ur2k-A,1hVzrQOE5zI,9MXi8CWaIAw,UsTDooRU2G0,QePcvRX2q90` => success, all returned status ok with non-empty transcripts.
- Not rerun after adding `skip_metadata` (manual verification listed below).

## Manual Verification
- [ ] Run `python resources/scripts/transcript_query.py --video-ids 8E0xpctNfxs --batch-size 1` and confirm a row is written with `status=missing` and empty transcript.
- [ ] Run `python resources/scripts/transcript_query.py --batch-size 1 --max-total-batch-size 1` and confirm faster job creation with `--skip-metadata` default.

## Follow-ups / Risks
- Confirm TranscriptHQ language selection behavior (default vs fallback) after initial test runs.

# Task Docs: Native captions only + Whisper gating

## Mode & Score
Mode: plan-gate, Score: 6 (factors: touches >2 files, cross-file coupling, no tests cover changed area, estimated diff >50 LOC)

## Changes
- resources/scripts/transcript_query.py: added `--native-captions-only` (default true) and `--whisper-min-duration` gating; Whisper mode enforces min duration and sorts by duration.
- resources/scripts/transcript_query.py: populate `language_code`, `is_generated`, `is_translatable` when present; set `is_generated=whisper` if response indicates Whisper.
- resources/docs/Data_Flow/YouTube_Data_API/Video_Transcripts.md: clarified native captions vs Whisper fallback guidance.
- resources/csv/youtube/videos_transcripts.csv: removed Shorts rows added during prior Whisper-backed tests.

## Checks & Results
- Ran `python resources/scripts/transcript_query.py --batch-size 1 --max-total-batch-size 3 --video-ids i2ZDbHKIW_E,DG7k-Ur2k-A,UsTDooRU2G0` with native captions only default => API still returned status ok with non-empty transcripts; no `is_generated` flag returned.

## Manual Verification
- [ ] Confirm the correct TranscriptHQ flag name for “native captions only” and update if needed.
- [ ] Rerun a short test to verify `status=missing` when no native captions exist.



## Checks & Results (latest)
- Ran python resources/scripts/transcript_query.py --batch-size 1 --max-total-batch-size 1 --dump-response temp_transcripthq_response.json => response includes is_generated and is_native (snake_case).

## Checks & Results (latest run)
- Ran python resources/scripts/transcript_query.py --batch-size 1 --max-total-batch-size 1 => is_generated populated (true) with language en and is_translatable=true.
- Ran python resources/scripts/transcript_query.py --batch-size 1 --max-total-batch-size 1 => is_generated populated (false) with language en and is_translatable=true.
- Ran python resources/scripts/transcript_query.py --batch-size 1 --max-total-batch-size 3 => three rows appended with populated fields (is_generated true/false).

# Task Docs: AKSEP migration (discovery)

## Mode & Score
Mode: plan-gate, Score: 6 (factors: touches >2 files, cross-file coupling, no tests cover changed area, adds >1 new file)

## Discovery-20260103d
- Target paths exist under ..\AKSEP\Schoolsystem2\backend\src\main\resources\scripts\YouTube_Data\ and CSVs under ..\AKSEP\Schoolsystem2\backend\src\main\resources\csv\youtube\.
- AKSEP backend .env exists at ..\AKSEP\Schoolsystem2\backend\.env.


# Task Docs: AKSEP migration (implementation)

## Mode & Score
Mode: plan-gate, Score: 6 (factors: touches >2 files, cross-file coupling, no tests cover changed area, adds >1 new file)

## Changes
- ..\AKSEP\Schoolsystem2\backend\src\main\resources\scripts\YouTube_Data\transcript_query.py: migrated TranscriptHQ script and updated defaults for AKSEP CSV paths; env discovery searches backend/resources roots.
- ..\AKSEP\Schoolsystem2\backend\src\main\resources\scripts\YouTube_Data\youtube_transcripts\__: migrated helper modules and added temp response log file.

## Checks & Results
- Not run (migration only).

## Prompt override / deviations
- Followed user instruction to keep plan-gate in Video-Transcripts/TASK_PLAN.md while migrating files into AKSEP paths.

## Checks & Results (AKSEP tests)
- Ran `python ..\\AKSEP\\Schoolsystem2\\backend\\src\\main\\resources\\scripts\\YouTube_Data\\transcript_query.py --max-total-batch-size 1` => row appended with language_code=en, is_generated=false, is_translatable=true, status=ok.
- Ran `python ..\\AKSEP\\Schoolsystem2\\backend\\src\\main\\resources\\scripts\\YouTube_Data\\transcript_query.py --max-total-batch-size 3` => three rows appended with populated fields (language_code=en, is_generated=false, is_translatable=true, status=ok).
- Verified CSV header order is `video_id,duration,language_code,is_generated,is_translatable,status,error,transcript` and latest rows align with that order.
