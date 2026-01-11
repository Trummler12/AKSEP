# Task Docs: Tag redundancy demo topic/tag grouping output

## Mode & Score
Mode: no-plan, Score: 1 (factors: single file change)

## Changes
- Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/tag_redundancy_demo.py: added grouped topic/tag output for highest and lowest Nth-best matches, with tag clustering per topic.

## Checks & Results
- Pre-change: `python .\Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_redundancy_demo.py` => success.
- Post-change: `python .\Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_redundancy_demo.py` => success.

## Manual Verification (if no tests)
- [x] Ran the script before and after with system Python.

## Follow-ups / Risks
- Consider recreating `Schoolsystem2\backend\.venv` if you want venv-based runs.
