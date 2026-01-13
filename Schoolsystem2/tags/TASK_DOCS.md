# Task Docs: [AKSEP] Tagging pipeline v1 (1/1)

## Mode & Score
Mode: plan-gate, Score: 4 (factors: touches >2 files, adds new file, no tests cover doc changes)

## Changes
- Schoolsystem2/tags/TASK_PLAN.md: refreshed plan for v1 tagging pipeline (SHA pending)
- Schoolsystem2/tags/testing/data/t_tag_PLANNING.txt: simplified tags to avoid compounds; minimal synonyms; numeric tag IDs (SHA pending)
- Schoolsystem2/tags/testing/scripts/tag_assign_v1.py: numeric IDs + per-tag median across variants (SHA pending)
- Schoolsystem2/tags/testing/data/ct_topic_tags_PLANNING.csv.txt: generated topic-tag assignments (SHA pending)
- Schoolsystem2/tags/testing/scripts/eval_queries_v1.py: randomized query sampling with configurable size/seed; numeric tag IDs; per-tag median across variants (SHA pending)
- Schoolsystem2/tags/testing/logs/tag_eval_v1.txt: v1 evaluation log (SHA pending)
- Schoolsystem2/tags/Tag_Strategy.md: updated v1 evaluation notes and variant scoring (SHA pending)
- Schoolsystem2/tags/testing/tag_redundancy_demo.py: ignore synonyms when checking redundancy (SHA pending)

## Checks & Results
- Manual verification:
  - `Schoolsystem2\\.venv\\Scripts\\python.exe Schoolsystem2\\tags\\testing\\tag_redundancy_demo.py` (ran)
  - `Schoolsystem2\\.venv\\Scripts\\python.exe Schoolsystem2\\tags\\testing\\scripts\\tag_assign_v1.py` (ran)
  - `Schoolsystem2\\.venv\\Scripts\\python.exe Schoolsystem2\\tags\\testing\\scripts\\eval_queries_v1.py` (ran, with `QUERY_SAMPLE_SIZE=8`, `QUERY_SAMPLE_SEED=v2`)

## Follow-ups / Risks
- Prompt override / deviations: user confirmed existing baseline files under `Schoolsystem2/tags/` may remain during planning, so pre-approval git status is not clean.
- Follow-up: policy change requested to allow baseline files during plan-gate (resolved by user).
- Follow-up: v1 log shows good recall on most queries; health query improved after adding tags (bioinformatics/medical imaging/health informatics). Consider a v2 only if new domains show similar gaps.
