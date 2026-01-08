# Task Docs: Tag redundancy demo enhancements

## Mode & Score
Mode: no-plan, Score: 1 (factors: single file, config-only change)

## Changes
- Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/tag_redundancy_demo.py: added configurable output settings, deduped redundancy groups, and printed loneliest tags.

## Checks & Results
- Pre-change: `Schoolsystem2\backend\.venv\Scripts\python.exe ...\tag_redundancy_demo.py` => success.
- Post-change: `Schoolsystem2\backend\.venv\Scripts\python.exe ...\tag_redundancy_demo.py` => success.
- Note: `python ...\tag_redundancy_demo.py` failed before changes due to missing `numpy` on system Python.

## Manual Verification (if no tests)
- [x] Ran the script before and after the change using the backend venv.

## Follow-ups / Risks
- None.
