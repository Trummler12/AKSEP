# Supporting Scripts README

This directory is NOT important for the overall functionality of the submitted project;  
It contains some **supporting Scripts** dedicated to **manipulating csv data** in order to have a more proper basis to work with

## Scripts Overview

- `weight_dist_bruteforce.py`: brute-forces parameter combinations to find natural tag weighting distributions.
- `branches_to_tags.ps1`: applies that weight formula to build `AKSEP/Schoolsystem2/backend/src/main/resources/csv/ct_topic_tags.csv`.

## Prerequisites
// Python & local .venv
- [Python](https://www.python.org/downloads/) 3.10+ installed
- local .venv environment:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```
