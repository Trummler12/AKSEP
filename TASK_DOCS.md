# Task Docs: AKSEP workspace + Schoolsystem2 interpreter

## Mode & Score
Mode: no-plan, Score: 3 (factors: >2 files touched, adds >1 new file)

## Changes
- AKSEP/AKSEP.code-workspace: add AKSEP workspace file with AKSEP + Schoolsystem2 folders (SHA n/a)
- AKSEP/Schoolsystem2/.vscode/settings.json: set Python interpreter for Schoolsystem2 .venv (SHA n/a)

## Checks & Results
- Not run (config-only change).

## Manual Verification (if no tests)
- [ ] Open `AKSEP/AKSEP.code-workspace` in VSCode and select a Python file under `Schoolsystem2`; confirm the Run button uses `Schoolsystem2\\.venv`.
- [ ] Open a Python file outside `Schoolsystem2` and confirm the interpreter does not auto-switch.

## Follow-ups / Risks
- AGENTS.md map mismatch: missing projects/AKSEP, projects/AKSEP-ALT, projects/schoolsystem_DB, docs/index.html.
