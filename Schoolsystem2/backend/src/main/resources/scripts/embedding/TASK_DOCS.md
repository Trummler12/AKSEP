# Task Docs: Tag curation iteration

## Mode & Score
Mode: plan-gate, Score: 5 (factors: touches >2 files, cross-file coupling, no tests cover area)

## Changes
- Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/tag_redundancy_demo.py: added tag-assignment summaries and expanded EXCLUDED_TOP_PAIRS.
- Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/tag_update.py: updated TAGS_TO_REMOVE/TAGS_TO_ADD and appended logging to `data/tag_change_log.txt`.
- Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/data/t_tag_PLANNING.txt: removed 10 tags, added 6 tags, reordered and lowercased by script.
- Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/data/tag_change_log.txt: appended changes log.
- Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/data/tag_update_candidates.txt: added undecided candidates list.

## Checks & Results
- Pre-change: `python .\Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_redundancy_demo.py > %TEMP%\tag_redundancy_demo_pre.txt` => success.
- Apply update: `python .\Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_update.py` => success (Removed 10, added 6).
- Post-change: `python .\Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_redundancy_demo.py > %TEMP%\tag_redundancy_demo_after_update.txt` => failed (HF 502 downloading model).

## Manual Verification (if no tests)
- [ ] Re-run `python Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_redundancy_demo.py` once the embedding model download works and review output.

## Follow-ups / Risks
- HF model download 502 prevented post-change redundancy analysis; rerun needed to confirm improvements.
