# Task Docs: Tag redundancy demo excluded pairs

## Mode & Score
Mode: no-plan, Score: 1 (factors: single file change)

## Changes
- Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/tag_redundancy_demo.py: added EXCLUDED_TOP_PAIRS to omit known pairs from the top similar list.

## Checks & Results
- Not run (small output filter change).

## Manual Verification (if no tests)
- [ ] Run `python Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_redundancy_demo.py` and confirm excluded pairs are omitted.

## Follow-ups / Risks
- Script uses heuristics; optimality is not guaranteed but should be strong for <=50 tags.
