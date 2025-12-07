# Supporting Scripts README

This directory is NOT important for the overall functionality of the submitted project;  
It contains some **supporting Scripts** dedicated to **manipulating csv data** in order to have a more proper basis to work with

## Scripts Overview

- `weight_dist_bruteforce.py`: brute-forces parameter combinations to find natural tag weighting distributions.
- `branches_to_tags.ps1`: applies that weight formula to build `AKSEP/Schoolsystem2/backend/src/main/resources/csv/ct_topic_tags.csv`.
- `resource_tags_assignment.py`: sends resource title/description to OpenAI models to select relevant tags and writes `ct_resource_tags_PLANNING.csv.txt`.

## Prerequisites
// Python & local .venv
- [Python](https://www.python.org/downloads/) 3.10+ installed
- local .venv environment:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

For OpenAI access, place your API key in `backend/.env` as `OPENAI_API_KEY=<key>` (see `backend/.env.example`). The script also looks for `.env` in `backend/src/main/`, `backend/src/main/resources/`, or alongside the script. Default models: primary `gpt-4.1-mini` (1 call), secondary `gpt-4o-mini` (3 calls), tertiary disabled by default.

Rate limits & retries:
- Default per-model RPM: 30 (adjust via `--requests-per-minute`, `--secondary-requests-per-minute`, `--tertiary-requests-per-minute`). On rate limits, all involved models wait for the next window.
- Default retries: up to 5 attempts per resource (`--max-attempts`), waiting 5s between attempts (`--retry-delay`). Failures do not skip the resource; they retry until the max is reached.
- Rate-limit retries: capped (default 6) via `--max-rate-limit-retries` to avoid spinning forever on hard quotas; check the error and your quota if it trips.

Run help:
```powershell
python resource_tags_assignment.py --help
```

Dry-run sample (no API calls, writes sample rows):
```powershell
python resource_tags_assignment.py --dry-run --limit 2 --output ..\csv\ct_resource_tags_PLANNING.csv.txt
```

Live sample, capped at 10 resources to conserve quota (requires `OPENAI_API_KEY`):
```powershell
python resource_tags_assignment.py --limit 10 --output ..\csv\ct_resource_tags_PLANNING.csv.txt
```

Resume/offset:
- Use `--resume` to skip resourceIDs already present in the output CSV.
- Use `--start-row N` to begin at a specific 1-based row in `t_source.csv` (after filtering `sa_resource==1`), useful after manual interruptions.
- Use `--debug` for verbose payload/ID logging to stderr.

Multi-model merge:
- Default calls per resource: 1× `gpt-4.1-mini` (weight 5), 3× `gpt-4o-mini` (weight 1 each), tertiary disabled by default. Configure with `--repeats-a/b/c`; disable a model with an empty name or set repeats to 0.
- Merging: rank = sum((pos in list or len(list)) * weight) across all lists; sort ascending; top 5 become weights 5..1.
